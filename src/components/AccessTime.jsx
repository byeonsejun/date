'use client';
import React from 'react';
import { getCurrentTime } from '@/\butil/util';

export default function AccessTime() {
  return <div>{getCurrentTime()}</div>;
}
