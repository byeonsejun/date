'use client';

import { useEffect, useRef, useCallback } from 'react';
import useLocationStore from '@/stores/LocationStore';
import CloseIcon from './ui/CloseIcon';

const AUTO_DISMISS_MS = 5000;

export default function SeoulOnlyToast() {
  const visible = useLocationStore((s) => s.seoulOnlyToastVisible);
  const setSeoulOnlyToastVisible = useLocationStore((s) => s.setSeoulOnlyToastVisible);
  const timerRef = useRef(null);

  const close = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setSeoulOnlyToastVisible(false);
  }, [setSeoulOnlyToastVisible]);

  useEffect(() => {
    if (!visible) return;
    timerRef.current = setTimeout(close, AUTO_DISMISS_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, close]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-4 py-3 min-w-[280px] max-w-[90vw] rounded-lg bg-neutral-900/90 text-white text-sm shadow-lg border border-neutral-700"
      onMouseEnter={() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = null;
      }}
      onMouseLeave={() => {
        if (!timerRef.current) timerRef.current = setTimeout(close, AUTO_DISMISS_MS);
      }}
    >
      <p className="flex-1">서울 지역만 서비스되고 있습니다. 원하시는 지역을 선택해 주세요.</p>
      <button
        type="button"
        onClick={close}
        className="shrink-0 p-1 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="알림 닫기"
      >
        <CloseIcon />
      </button>
    </div>
  );
}
