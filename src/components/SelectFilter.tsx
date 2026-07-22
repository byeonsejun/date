// @ts-nocheck
'use client';

import BaseSelect from './ui/BaseSelect';
import { findStorageItem } from '@/utils/util';
import useLocationStore from '@/stores/useLocationStore';
import { useShallow } from 'zustand/react/shallow';
import { useTranslation } from 'react-i18next';

export default function SelectFilter() {
  const { t } = useTranslation();
  const { allDistrictInfo, setLocation, location } = useLocationStore(
    useShallow((state) => ({
      allDistrictInfo: state.allDistrictInfo,
      setLocation: state.setLocation,
      location: state.location,
    }))
  );

  const handleSearch = (label) => (value) => {
    // 위치 권한을 실제로 거부한 경우에만 안내 후 차단한다.
    // outside(서울 밖) 사용자는 권한은 허용했으나 locationAgree를 얻지 못하므로,
    // outside 플래그가 있으면 이 가드를 건너뛰어 항상 재측정 경로로 진입하게 한다.
    // (서울 밖 안내는 측정 전 차단이 아니라 측정 후 토스트(weather.ts)로 처리한다.)
    if (
      label === 'location' &&
      value === '현재 위치' &&
      !findStorageItem('locationAgree') &&
      !findStorageItem('outside')
    ) {
      alert(t('location.blockedAlert'));
      return;
    }
    label === 'location' && setLocation(value);
  };
  return (
    <div className="w-full flex flex-col gap-2 mb-4">
      <div className="flex items-center justify-between gap-6">
        <div className="w-full">
          <BaseSelect
            id="location-select"
            label={t('home.districtSelectLabel')}
            onChange={handleSearch('location')}
            selected={location}
          >
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
