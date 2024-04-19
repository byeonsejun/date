import React from 'react';
import Aside from './Aside';
import Map from './Map';

export default function MainSection() {
  return (
    <div className="w-full h-full flex items-center px-4">
      <Aside />
      <Map />
    </div>
  );
}
