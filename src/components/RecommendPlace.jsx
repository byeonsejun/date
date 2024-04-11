import useLocationStore from '@/stores/LocationStore';
import React, { useEffect, useState } from 'react';
import { getFilterInfoData } from './SelectShowMapType';
import { FaMapLocationDot } from 'react-icons/fa6';
import { findStorageItem } from '@/\butil/util';

const selectType = ['추천', '인기'];

export default function RecommendPlace() {
  const { location, culturalSpaceInfo, dodreamgilInfo, parkInfo, myGeoInfo, onClickRecommendMaker } =
    useLocationStore();
  const [selectedType, setSelectedType] = useState('추천');
  const [showContent, setShowContent] = useState(undefined);

  const randomPick = (myLc, cult, park, dodr) => {
    const type = '랜덤';
    const randomItem = getFilterInfoData(type, myLc, cult, dodr, park);
    setShowContent(randomItem);
  };

  useEffect(() => {
    if (
      culturalSpaceInfo.length === 0 ||
      dodreamgilInfo === 0 ||
      parkInfo === 0 ||
      (findStorageItem('locationAgree') && !myGeoInfo)
    )
      return;
    const mylocation = location === '현재 위치' ? myGeoInfo.gu.long_name : location;
    randomPick(mylocation, culturalSpaceInfo, dodreamgilInfo, parkInfo);
  }, [location, culturalSpaceInfo, dodreamgilInfo, parkInfo, myGeoInfo, selectedType]);

  return (
    <div className="border border-[#ededed] w-full h-[410px] overflow-hidden rounded-lg p-2 flex flex-col gap-2">
      <div className="flex">
        <ul className="flex gap-2">
          {selectType.map((type) => (
            <li
              key={type}
              className={`border border-[#ededed] rounded-lg p-2 cursor-pointer ${
                type === selectedType ? 'bg-[#f986bd] text-white' : 'hover:bg-slate-100'
              }`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </li>
          ))}
        </ul>
      </div>
      <p className="break-keep">
        {selectedType === '추천' ? '오늘 추천하는 데이트 장소입니다.' : '오늘 많은 방문자가 다녀간 데이트 장소입니다.'}
      </p>
      <div>
        <ul className="flex flex-col gap-2">
          {showContent &&
            showContent.map((item) => {
              return (
                <li
                  key={`type-key-${item.type}`}
                  className="w-full h-20 flex border border-[#ededed] rounded-lg overflow-hidden"
                >
                  <div id={`type_${item.type}`} className="w-2 min-w-2 h-full" />
                  <div className="flex flex-col p-2 overflow-y-auto w-full scroll_min">
                    <p className="text-base flex justify-between">
                      <span>{item.title}</span>
                      <FaMapLocationDot
                        className="text-black cursor-pointer"
                        onClick={() => onClickRecommendMaker(item.lat, item.type)}
                      />
                    </p>
                    <p className="text-xs">
                      {item.type} / {item.type === '두드림길' ? ` ${item.detailCourse} ` : item.phne}
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
