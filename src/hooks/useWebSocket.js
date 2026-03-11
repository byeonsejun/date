'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * 메인 스레드 차단(TBT) 방지를 위해 메시지 핸들러를 스로틀링하는 WebSocket 훅.
 * - 수신 데이터는 throttleMs 간격으로만 상태 반영.
 * - setInterval/메시지 폭탄 시 렌더링 폭탄 방지.
 * @param {string} url - WebSocket URL
 * @param {object} options - { throttleMs: number, onMessage: (data) => void }
 * @returns { { lastMessage: any, readyState: number, send: (data) => void } }
 */
export function useWebSocket(url, options = {}) {
  const { throttleMs = 100, onMessage } = options;
  const [lastMessage, setLastMessage] = useState(null);
  const [readyState, setReadyState] = useState(
    typeof WebSocket !== 'undefined' ? WebSocket.CONNECTING : 0
  );
  const wsRef = useRef(null);
  const throttleTimerRef = useRef(null);
  const pendingDataRef = useRef(null);

  const flushPending = useCallback(() => {
    if (pendingDataRef.current === null) return;
    const data = pendingDataRef.current;
    pendingDataRef.current = null;
    setLastMessage(data);
    onMessage?.(data);
  }, [onMessage]);

  useEffect(() => {
    if (!url) return;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => setReadyState(1);
    ws.onclose = () => setReadyState(3);

    ws.onmessage = (event) => {
      let data = event.data;
      try {
        if (typeof data === 'string') data = JSON.parse(data);
      } catch (_) {}

      if (throttleMs <= 0) {
        setLastMessage(data);
        onMessage?.(data);
        return;
      }

      pendingDataRef.current = data;
      if (throttleTimerRef.current != null) return;
      throttleTimerRef.current = setTimeout(() => {
        throttleTimerRef.current = null;
        requestAnimationFrame(flushPending);
      }, throttleMs);
    };

    return () => {
      if (throttleTimerRef.current) clearTimeout(throttleTimerRef.current);
      throttleTimerRef.current = null;
      pendingDataRef.current = null;
      ws.close();
      wsRef.current = null;
    };
  }, [url, throttleMs, flushPending]);

  const send = useCallback((data) => {
    if (wsRef.current?.readyState === 1) {
      wsRef.current.send(typeof data === 'string' ? data : JSON.stringify(data));
    }
  }, []);

  return { lastMessage, readyState, send };
}
