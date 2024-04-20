'use client';

import React, { useState } from 'react';
import GoogleMapContainer from './GoogleMapContainer';

export default function Map() {
  const [showLoader, setShowLoader] = useState(true);
  return (
    <div className="grow w-full h-full border border-[#ededed]" id="map">
      {showLoader && (
        <div className="pre_loader_background">
          <div id="pre_loader">
            <div className="box">
              <div className="cube" />
            </div>
          </div>
        </div>
      )}
      <GoogleMapContainer setShowLoader={setShowLoader} />
    </div>
  );
}
