'use client';

import React, { useEffect } from 'react';
import Aside from './Aside';
import Map from './Map';
import useLocationStore from '@/stores/LocationStore';

export default function MainSection({ locationInfo }) {
  const { setLocationInfo } = useLocationStore();

  useEffect(() => {
    setLocationInfo(locationInfo);
  }, [locationInfo, setLocationInfo]);

  return (
    <div className="w-full h-full flex items-center px-4">
      {/* <Aside />
      <Map /> */}
    </div>
  );
}
