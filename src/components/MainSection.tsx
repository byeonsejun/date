// @ts-nocheck
import React from 'react';
import Aside from './Aside';
import Map from './Map';

export default function MainSection() {
  return (
    <div className="w-full h-auto lg:h-full flex flex-col lg:flex-row items-start lg:items-center px-2 lg:px-4 gap-3 lg:gap-0 pb-3 lg:pb-0">
      <Aside />
      <Map />
    </div>
  );
}
