'use client';

import React, { useEffect, useState } from 'react';
import RadarChart from './ui/RadarChart';
import useLocationStore from '@/stores/LocationStore';
import BaseSelect from './ui/BaseSelect';
import BarChart from './ui/BarChart';
import InfinityScrollUi from './ui/InfinityScrollUi';

const genderType = ['남성', '여성'];
const ageType = [10, 20, 30, 40, 50, 60];

export default function ChartComponent({ chartData, localInfoData }) {
  const { userInfo } = useLocationStore(); // 질문에 답변했다면 이안에 오브젝트값이 있겠지 ~
  const [localTypeValue, setLocalTypeValue] = useState('중구'); // 공통
  const [genderTypeValue, setGenderTypeValue] = useState('남성'); // 공통
  const [ageTypeValue, setAgeTypeValue] = useState(20); // 공통
  const [currentRecommendNum, setCurrentRecommendNum] = useState(null); // 공통
  const [genderData, setGenderData] = useState(null); // 공통데이터 첫데이터 받고 그 구역은이걸로 고정!

  const handleFilter = (label) => (value) => {
    label === 'location' && setLocalTypeValue(value);
    label === 'gender' && setGenderTypeValue(value);
    label === 'age' && setAgeTypeValue(value);
  };

  return (
    <section className="w-full h-full flex flex-col">
      <div className="flex h-10 items-center pl-4">
        <div className="flex gap-2">
          <div>
            <BaseSelect onChange={handleFilter('location')} selected={localTypeValue}>
              {localInfoData.map((item) => {
                return (
                  <option key={item.location} value={item.location} lat={item.lat} lon={item.lon}>
                    {item.location}
                  </option>
                );
              })}
            </BaseSelect>
          </div>
          <div>
            <BaseSelect onChange={handleFilter('gender')} selected={genderTypeValue}>
              {genderType.map((item) => {
                return (
                  <option key={item} value={item}>
                    {item}
                  </option>
                );
              })}
            </BaseSelect>
          </div>
          <div>
            <BaseSelect onChange={handleFilter('age')} selected={ageTypeValue}>
              {ageType.map((item) => {
                return (
                  <option key={item} value={item}>
                    {item} 대 {item === 60 && '이상'}
                  </option>
                );
              })}
            </BaseSelect>
          </div>
        </div>
      </div>
      <div className="flex grow gap-2">
        <div className="px-4 py-3 flex flex-col">
          <RadarChart
            ageType={ageType}
            chartData={chartData}
            localTypeValue={localTypeValue}
            genderTypeValue={genderTypeValue}
            ageTypeValue={ageTypeValue}
            setCurrentRecommendNum={setCurrentRecommendNum}
            genderData={genderData}
          />
          <InfinityScrollUi localTypeValue={localTypeValue} genderData={genderData} />
        </div>
        <div className="flex flex-col grow">
          {currentRecommendNum && (
            <BarChart
              chartData={chartData}
              localTypeValue={localTypeValue}
              genderTypeValue={genderTypeValue}
              ageTypeValue={ageTypeValue}
              currentRecommendNum={currentRecommendNum}
              setGenderData={setGenderData}
            />
          )}
        </div>
      </div>
    </section>
  );
}
