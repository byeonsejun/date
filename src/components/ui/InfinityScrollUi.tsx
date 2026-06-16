// @ts-nocheck
import useLocationStore from '@/stores/useLocationStore';
import React, { useCallback, useEffect, useState } from 'react';
import { PuffLoader } from 'react-spinners';
import { getFilterInfoData } from '../SelectShowMapType';
import { wordConverter } from './RadarChart';

export default function InfinityScrollUi({ localTypeValue, genderData }) {
  const { culturalSpaceInfo, dodreamgilInfo, parkInfo } = useLocationStore();
  const [page, setPage] = useState(0);
  const [isAllLoading, setIsAllLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [bestVisitList, setBestVisitList] = useState(null);
  const [showVisitList, setShowVisitList] = useState(null);

  const handleObserver = useCallback((entries, observer) => {
    if (!bestVisitList || !showVisitList) return;
    if (bestVisitList.length <= showVisitList.length) {
      observer.disconnect();
      return;
    }
    const target = entries[0];
    if (target.isIntersecting && !isLoading) {
      const newReturnArray = beforeFilterAfterData(bestVisitList, showVisitList);
      setShowVisitList((prev) => [...prev, ...newReturnArray]);
      setPage((prev) => prev + 1);
    }
  }, [bestVisitList, isLoading, showVisitList]);

  useEffect(() => {
    const visitListUl = document.getElementById('visit_ul');
    if (!visitListUl) return;
    visitListUl.scrollTop = 0;
  }, [localTypeValue]);

  useEffect(() => {
    if (isAllLoading) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0 });
    const observerTarget = document.getElementById('observer');
    if (observerTarget) observer.observe(observerTarget);
    return () => {
      if (observer) observer.disconnect();
    };
  }, [isAllLoading, showVisitList, handleObserver]);

  useEffect(() => {
    if (!genderData) return;
    const currentData = getFilterInfoData('전체', localTypeValue, culturalSpaceInfo, parkInfo, dodreamgilInfo);
    const mergeDataResult = mergeNSortData(genderData);
    setShowVisitList(mergeDataResult);
    setBestVisitList(currentData);
    setIsAllLoading(false);
  }, [localTypeValue, culturalSpaceInfo, dodreamgilInfo, parkInfo, genderData]);

  return (
    <div className="grow flex flex-col items-center w-[272px]">
      <h2 className="mb-2">{localTypeValue} 방문순위 리스트</h2>
      <div className="w-full h-full  border rounded-lg	 border-[#ededed]">
        {isAllLoading ? (
          <div className="h-full relative">
            <PuffLoader
              color="#f986bd"
              loading={isAllLoading}
              size={50}
              cssOverride={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
            />
          </div>
        ) : (
          <div className="w-full h-full">
            <ul className="flex flex-col gap-1 h-[350px] overflow-y-scroll" id="visit_ul">
              {showVisitList &&
                showVisitList.map((item, idx) => (
                  <li className="flex items-center border-b px-2 py-2" key={`${item.title}-${idx}`}>
                    <span className="mr-1">{idx + 1}.</span>
                    <p className="w-full flex justify-between">
                      <span className="mr-1 line-clamp-1" title={item.title}>
                        {item.title}
                      </span>
                      <span className="line-clamp-1" title={item.type}>{`(${item.type})`}</span>
                    </p>
                  </li>
                ))}
              {isLoading && <p>Loading...</p>}
              <div id="observer" style={{ minHeight: '10px' }} />
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

const mergeNSortData = (data) => {
  const newArray = [];
  data.male.map((item) => {
    item.title = item.name;
    item.type = wordConverter(item.placeType);
    newArray.push(item);
  });
  data.female.map((item) => {
    item.title = item.name;
    item.type = wordConverter(item.placeType);
    newArray.push(item);
  });
  newArray.sort((a, b) => {
    const numA = parseInt(a.visit);
    const numB = parseInt(b.visit);
    return numB - numA;
  });
  return newArray;
};

const beforeFilterAfterData = (allData, currentData) => {
  const randomData = [];
  let resultNumber = 12;

  const newData = allData.filter((item) => {
    return !currentData.some((data) => data.title === item.title);
  });

  if (currentData.length + resultNumber > allData.length) {
    resultNumber = allData.length - currentData.length;
  }

  for (let i = 0; i < resultNumber; i++) {
    const randomIndex = Math.floor(Math.random() * newData.length);
    const randomItem = newData[randomIndex];
    randomData.push(randomItem);
  }
  return randomData;
};
