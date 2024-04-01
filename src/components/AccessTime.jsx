'use client';

import React, { useCallback, useEffect, useState } from 'react';

export default function AccessTime() {
  const [currentTime, setCurrentTime] = useState(null);
  useEffect(() => {
    getCurrentTime();
  }, []);
  const getCurrentTime = useCallback((type) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    const hours = ('0' + today.getHours()).slice(-2);
    const minutes = ('0' + today.getMinutes()).slice(-2);
    let timeString = `${year} / ${month} / ${day}  ${hours}:${minutes}`;
    if (type) {
      const timeUnits = {
        year: year,
        month: month,
        day: day,
        hours: hours,
        minutes: minutes,
      };
      switch (type) {
        case 'year':
        case 'month':
        case 'day':
        case 'hours':
        case 'minutes':
          timeString = timeUnits[type];
          break;
        default:
          break;
      }
    }
    setCurrentTime(timeString);
  }, []);

  return <div>{currentTime && currentTime}</div>;
}
