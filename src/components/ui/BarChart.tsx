// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getRandomNumber } from '@/utils/util';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const options = {
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: (context) => {
          const data = context.raw;
          const indexNum = context.dataIndex;
          const nameArr = context.dataset.nameArr;
          const gender = context.dataset.label === '남성들이 많이 찾은 장소' ? 1 : 2;
          if (gender === 1) {
            return `장소이름: ${nameArr[indexNum]}, 방문횟수: ${data}`;
          } else {
            return `장소이름: ${nameArr[indexNum]}, 방문횟수: ${data}`;
          }
        },
      },
    },
  },
  animation: {
    easing: 'easeOutBounce',
    duration: 2000,
  },
};

export default function BarChart({
  chartData,
  localTypeValue,
  genderTypeValue,
  ageTypeValue,
  currentRecommendNum,
  setGenderData,
}) {
  const [currentAllData, setCurrentAllData] = useState(null);

  const filteredData = useMemo(() => {
    const found = chartData.find((item) => item.location === localTypeValue);
    return found?.data;
  }, [chartData, localTypeValue]);

  // Base genderData should be stable for a selected location.
  const baseGenderData = useMemo(() => {
    if (!filteredData) return null;
    const maleData = filteredData.male.map((item) => ({
      name: item.title,
      placeType: item.place,
      visit: `${getRandomNumber(60, 100)}`,
    }));
    const femaleData = filteredData.female.map((item) => ({
      name: item.title,
      placeType: item.place,
      visit: `${getRandomNumber(60, 100)}`,
    }));
    return {
      male: maleData,
      female: femaleData,
    };
  }, [filteredData]);

  useEffect(() => {
    if (!baseGenderData) return;
    setGenderData(baseGenderData);
  }, [baseGenderData, setGenderData]);

  useEffect(() => {
    if (!filteredData || !baseGenderData) return;

    const maleData = baseGenderData.male.map((item) => ({ ...item }));
    const femaleData = baseGenderData.female.map((item) => ({ ...item }));

    const genderFilter = genderTypeValue === '남성' ? filteredData.male : filteredData.female;
    const ageFilter = genderFilter.find((item) => item.age === Number(ageTypeValue));
    if (!ageFilter) return;

    const targetValue = `${currentRecommendNum ?? ''}`;
    if (genderTypeValue === '남성') {
      const currentIndexNum = maleData.findIndex((item) => item.name === ageFilter.title);
      if (currentIndexNum >= 0) maleData[currentIndexNum].visit = targetValue;
    } else {
      const currentIndexNum = femaleData.findIndex((item) => item.name === ageFilter.title);
      if (currentIndexNum >= 0) femaleData[currentIndexNum].visit = targetValue;
    }

    setCurrentAllData({
      labels: ['10대', '20대', '30대', '40대', '50대', '60대 이상'],
      datasets: [
        {
          label: '남성들이 많이 찾은 장소',
          data: maleData.map((item) => item.visit),
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          nameArr: maleData.map((item) => item.name),
          geoType: maleData.map((item) => item.placeType),
        },
        {
          label: '여성들이 많이 찾은 장소',
          data: femaleData.map((item) => item.visit),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          nameArr: femaleData.map((item) => item.name),
          geoType: femaleData.map((item) => item.placeType),
        },
      ],
    });
  }, [ageTypeValue, baseGenderData, currentRecommendNum, filteredData, genderTypeValue]);

  return (
    <div id="bar_container" className="h-full min-h-[748px] py-3">
      <h3 className="text-center">{`${localTypeValue}의 성별, 나이대별 가장높은 방문율을 기록한 장소입니다.`}</h3>
      <div className="w-full h-full flex items-center">
        {currentAllData && <Bar options={options} data={currentAllData} width={1572} height={975} />}
      </div>
    </div>
  );
}
