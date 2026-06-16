// @ts-nocheck
'use client';

import useLocationStore from '@/stores/useLocationStore';
import useMapStore from '@/stores/useMapStore';
import React, { useEffect, useState } from 'react';
import { getFilterInfoData } from './SelectShowMapType';
import { FaMapLocationDot } from 'react-icons/fa6';
import { findStorageItem } from '@/utils/util';
import { useShallow } from 'zustand/react/shallow';

const selectType = ['추천', '인기'];

export default function RecommendPlace() {
  const { location, culturalSpaceInfo, dodreamgilInfo, parkInfo, myGeoInfo } =
    useLocationStore(
      useShallow((state) => ({
        location: state.location,
        culturalSpaceInfo: state.culturalSpaceInfo,
        dodreamgilInfo: state.dodreamgilInfo,
        parkInfo: state.parkInfo,
        myGeoInfo: state.myGeoInfo,
      }))
    );
  const onClickRecommendMaker = useMapStore((state) => state.onClickRecommendMaker);
  const [selectedType, setSelectedType] = useState('추천');
  const [recommendContent, setRecommendContent] = useState(undefined);
  const [popularContent, setPopularContent] = useState(undefined);

  useEffect(() => {
    if (
      culturalSpaceInfo.length === 0 ||
      dodreamgilInfo.length === 0 ||
      parkInfo.length === 0 ||
      (findStorageItem('locationAgree') && !myGeoInfo)
    )
      return;
    if (location === '현재 위치' && !myGeoInfo?.gu) return;
    const mylocation = location === '현재 위치' ? myGeoInfo.gu.long_name : location;
    const type = '랜덤';
    const recommendItem = getFilterInfoData(type, mylocation, culturalSpaceInfo, parkInfo, dodreamgilInfo);
    const popularItem = getFilterInfoData(type, mylocation, culturalSpaceInfo, parkInfo, dodreamgilInfo);
    setRecommendContent(recommendItem);
    setPopularContent(popularItem);
  }, [location, culturalSpaceInfo, dodreamgilInfo, parkInfo, myGeoInfo]);

  return (
    <div className="border border-[#ededed] w-full h-[410px] overflow-hidden rounded-lg p-2 flex flex-col gap-2">
      <div className="flex">
        <ul className="flex gap-2" role="tablist" aria-label="추천/인기 선택">
          {selectType.map((type) => (
            <li key={type} role="presentation">
              <button
                type="button"
                role="tab"
                aria-selected={type === selectedType}
                className={`border border-[#ededed] rounded-lg p-2 ${
                  type === selectedType ? 'bg-[#f986bd] text-black' : 'hover:bg-slate-100'
                }`}
                onClick={() => setSelectedType(type)}
              >
                {type}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <p className="break-keep">
        {selectedType === '추천' ? '오늘 추천하는 데이트 장소입니다.' : '오늘 많은 방문자가 다녀간 데이트 장소입니다.'}
      </p>
      <div>
        <ul className="flex flex-col gap-2">
          {(selectedType === '추천' ? recommendContent : popularContent) &&
            (selectedType === '추천' ? recommendContent : popularContent).map((item) => {
              return (
                <li
                  key={`type-key-${item.type}`}
                  className="w-full h-20 flex border border-[#ededed] rounded-lg overflow-hidden"
                >
                  <div id={`type_${item.type}`} className="w-2 min-w-2 h-full" />
                  <div className="flex flex-col p-2 overflow-y-auto w-full scroll_min">
                    <p className="text-base flex justify-between">
                      <span>{item.title}</span>
                      <button
                        type="button"
                        className="text-black cursor-pointer"
                        onClick={() => onClickRecommendMaker(item.lat, item.type)}
                        aria-label={`${item.title} 위치로 지도 이동`}
                      >
                        <FaMapLocationDot />
                      </button>
                    </p>
                    <p className="text-xs">
                      {item.type} / {item.type === '두드림길' ? ` ${item.detailCourse} ` : item.phone}
                    </p>
                    {item.type !== '두드림길' && <p className="text-xs">{item.address}</p>}
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
