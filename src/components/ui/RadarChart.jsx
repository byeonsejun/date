'use client';

import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { getRandomNumber } from '@/\butil/util';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale);
const options = {
  events: ['mousemove', 'mouseout'], // 'click' 이벤트 제거
  animation: {
    easing: 'easeOutBounce',
    duration: 2000, // 애니메이션 지속 시간 2초
  },
};

export default function RadarChart({
  ageType,
  chartData,
  localTypeValue,
  genderTypeValue,
  ageTypeValue,
  setCurrentRecommendNum,
  genderData,
}) {
  const [currentDetailData, setCurrentDetailData] = useState(null);
  const [currentShowLocal, setCurrentShowLocal] = useState('');
  const [currentShowType, setCurrentShowType] = useState('');
  const [currentGeoLocation, setCurrentGeoLocation] = useState(null);
  //
  const dataFilterDetail = (
    chartData,
    localTypeValue,
    genderTypeValue,
    ageTypeValue,
    randomArray,
    maxNum,
    genderData
  ) => {
    const filteredData = chartData.filter((item) => item.location === localTypeValue)[0].data;
    const genderFilter = genderTypeValue === '남성' ? filteredData.male : filteredData?.female;
    const [ageFilter] = genderFilter.filter((item) => item.age === Number(ageTypeValue));
    setCurrentShowLocal(ageFilter.title);
    setCurrentShowType(ageFilter.place);

    return resultData(genderData, ageFilter, randomArray, genderTypeValue, maxNum);
  };

  useEffect(() => {
    setCurrentGeoLocation(localTypeValue);
    if (currentGeoLocation !== localTypeValue) return;
    const randomArray = ageType.map(() => getRandomNumber(10, 50));
    const maxNum = Math.max(...randomArray) + getRandomNumber(10, 50);
    setCurrentRecommendNum(`${maxNum}`);
    setCurrentDetailData(
      dataFilterDetail(chartData, localTypeValue, genderTypeValue, ageTypeValue, randomArray, maxNum, genderData)
    );
  }, [chartData, localTypeValue, genderTypeValue, ageTypeValue, currentGeoLocation]);

  return (
    <div className="px-2 py-3 flex flex-col items-center gap-4 h-[384px]">
      <h3 className="break-keep">{`${localTypeValue} / ${genderTypeValue} / ${ageTypeValue}대가 가장 많이 방문한 장소입니다.`}</h3>
      {currentShowType && <p>{`${currentShowLocal} (${wordConverter(currentShowType)})`}</p>}
      {currentDetailData && <Radar data={currentDetailData} className="w-12" options={options} />}
    </div>
  );
}

const resultData = (genderData, ageFilter, randomArray, genderTypeValue, maxNum) => {
  if (genderData) {
    // 최초 한번 후 값이 들어옴
    const currentGender = ageFilter.gender === 'male' ? genderData.male : genderData.female;
    const [currentData] = currentGender.filter((item) => item.name === ageFilter.title);
    randomArray[ageFilter.age / 10 - 1] = currentData.visit;
    return {
      labels: ['10대', '20대', '30대', '40대', '50대', '60대 이상'],
      datasets: [
        {
          label: '방문 횟수',
          data: randomArray,
          backgroundColor: genderTypeValue === '남성' ? 'rgba(53, 162, 235, 0.5)' : 'rgba(255, 99, 132, 0.5)',
          borderColor: genderTypeValue === '남성' ? 'rgba(53, 162, 235, 0.5)' : 'rgba(255, 99, 132, 0.5)',
          borderWidth: 1,
        },
      ],
    };
  } else {
    randomArray[ageFilter.age / 10 - 1] = maxNum;
    return {
      labels: ['10대', '20대', '30대', '40대', '50대', '60대 이상'],
      datasets: [
        {
          label: '방문 횟수',
          data: randomArray,
          backgroundColor: genderTypeValue === '남성' ? 'rgba(53, 162, 235, 0.5)' : 'rgba(255, 99, 132, 0.5)',
          borderColor: genderTypeValue === '남성' ? 'rgba(53, 162, 235, 0.5)' : 'rgba(255, 99, 132, 0.5)',
          borderWidth: 1,
        },
      ],
    };
  }
};

export const wordConverter = (word) => {
  switch (word) {
    case '':
      return '';
    case 'cultural':
      return '문화공간';
    case 'park':
      return '공원';
    case 'dodream':
      return '두드림길';
    default:
      return 'cultural';
  }
};
