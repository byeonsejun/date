'use client';

import React, { useEffect, useRef, useState } from 'react';
import { getCurrentTime } from '@/\butil/util';

export default function AccessTime() {
  const [currentTime, setCurrentTime] = useState(null);
  const timeoutIdRef = useRef(null);

  useEffect(() => {
    const updateDisplay = () => {
      setCurrentTime(getCurrentTime());
    };

    const scheduleNextMinute = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const ms = now.getMilliseconds();
      const msUntilNextMinute = (60 - seconds) * 1000 - ms;
      timeoutIdRef.current = setTimeout(() => {
        updateDisplay();
        timeoutIdRef.current = setInterval(updateDisplay, 60000);
      }, msUntilNextMinute);
    };

    updateDisplay();
    scheduleNextMinute();

    return () => {
      if (timeoutIdRef.current != null) {
        clearTimeout(timeoutIdRef.current);
        clearInterval(timeoutIdRef.current);
      }
    };
  }, []);

  return <div>{currentTime && currentTime}</div>;
}
