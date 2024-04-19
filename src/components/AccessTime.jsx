'use client';

import React, { useEffect, useState } from 'react';
import { getCurrentTime } from '@/\butil/util';

export default function AccessTime() {
  const [currentTime, setCurrentTime] = useState(null);

  useEffect(() => {
    setCurrentTime(getCurrentTime());
    const intervalId = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 30000); // 30초마다 현재 시간 업데이트

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 setInterval 제거
  }, []);

  return <div>{currentTime && currentTime}</div>;
}
