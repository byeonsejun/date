'use client';

import React from 'react';
import GoogleMapContainer from './GoogleMapContainer';
import useLocationStore from '@/stores/LocationStore';

export default function Map() {
  const { showPreLoader } = useLocationStore();
  return (
    <div className="grow w-full h-full border border-[#ededed]" id="map">
      {showPreLoader && (
        <div className="pre_loader_background">
          <div id="pre_loader">
            <div className="box">
              <div className="cube" />
            </div>
          </div>
        </div>
      )}
      <GoogleMapContainer />
    </div>
  );
}
