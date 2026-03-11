'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import MapSkeleton from './MapSkeleton';

const GoogleMapContainer = dynamic(() => import('./GoogleMapContainer'), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

export default function Map() {
  return (
    <div className="grow w-full h-full min-h-[60vh] border border-[#ededed]" id="map">
      <GoogleMapContainer />
    </div>
  );
}
