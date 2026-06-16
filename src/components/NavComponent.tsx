// @ts-nocheck
'use client';

import { useEffect } from 'react';
import useLocationStore from '@/stores/useLocationStore';

export default function NavComponent({ locationInfo }) {
  const setLocationInfo = useLocationStore((state) => state.setLocationInfo);

  useEffect(() => {
    setLocationInfo(locationInfo);
  }, [locationInfo, setLocationInfo]);

  return null;
}
