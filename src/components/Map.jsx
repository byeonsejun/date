import React from 'react';
import GoogleMapContainer from './GoogleMapContainer';

export default function Map() {
  return (
    <div className="grow w-full h-full border border-[#ededed]" id="map">
      <GoogleMapContainer />
    </div>
  );
}
