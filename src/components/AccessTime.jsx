'use client';

import React, { useEffect, useState } from 'react';
import { getCurrentTime } from '@/\butil/util';

export default function AccessTime() {
  const [currentTime, setCurrentTime] = useState(null);
  useEffect(() => {
    setCurrentTime(getCurrentTime());
  }, []);

  return <div>{currentTime && currentTime}</div>;
}
