'use client';

import { getCurrentTime } from '@/\butil/util';
import React, { useEffect, useState } from 'react';

export default function AccessTime() {
  const [currentTime, setCurrentTime] = useState(null);
  useEffect(() => {
    setCurrentTime(getCurrentTime());
  }, []);

  return <div>{currentTime && currentTime}</div>;
}
