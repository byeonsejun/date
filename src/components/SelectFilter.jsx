import React from 'react';
import BaseSelect from './ui/BaseSelect';
import { findStorageItem } from '@/\butil/util';
import useLocationStore from '@/stores/LocationStore';

export default function SelectFilter() {
  const { allDistrictInfo, setLocation, location } = useLocationStore();

  const handleSearch = (label) => (value) => {
    if (label === 'location' && value === '현재 위치' && findStorageItem('outside')) {
      alert('서울이 아닌 지역에서는 현재 위치를 사용하실 수 없습니다.');
      return;
    }
    if (label === 'location' && value === '현재 위치' && !findStorageItem('locationAgree')) {
      alert('위치정보 제공을 차단하셨습니다. 허용하신 후 이용해 주세요.');
      return;
    }
    label === 'location' && setLocation(value);
  };

  return (
    <div className="w-full flex flex-col gap-2 mb-4">
      <div className="flex items-center justify-between gap-6">
        <div className="w-full">
          <BaseSelect onChange={handleSearch('location')} selected={location}>
            {allDistrictInfo.map((item) => {
              return (
                <option key={item.location} value={item.location} lat={item.lat} lon={item.lon}>
                  {item.location}
                </option>
              );
            })}
          </BaseSelect>
        </div>
      </div>
    </div>
  );
}
