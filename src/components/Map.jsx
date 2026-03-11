'use client';

import React from 'react';
import GoogleMapContainer from './GoogleMapContainer';

export default function Map() {
  return (
    <div className="grow w-full h-full min-h-[60vh] border border-[#ededed]" id="map">
      <GoogleMapContainer />
    </div>
  );
}
