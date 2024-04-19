import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getRandomNumber } from '@/\butil/util';

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
    duration: 2000, // 애니메이션 지속 시간 2초
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

  const dataFilterAll = (currentRecommendNum) => {
    const filteredData = chartData.filter((item) => item.location === localTypeValue)[0].data;
    const maleData = filteredData.male.map((item) => {
      return { name: item.title, placeType: item.place, visit: `${getRandomNumber(60, 100)}` };
    });
    const femaleData = filteredData.female.map((item) => {
      return { name: item.title, placeType: item.place, visit: `${getRandomNumber(60, 100)}` };
    });

    const genderFilter = genderTypeValue === '남성' ? filteredData.male : filteredData?.female;
    const [ageFilter] = genderFilter.filter((item) => item.age === Number(ageTypeValue));

    let currentIndexNum;
    if (genderTypeValue === '남성') {
      maleData.filter((item, indexNum) => {
        if (item.name === ageFilter.title) currentIndexNum = indexNum;
      });
      maleData[currentIndexNum].visit = currentRecommendNum;
    } else {
      femaleData.filter((item, indexNum) => {
        if (item.name === ageFilter.title) currentIndexNum = indexNum;
      });
      femaleData[currentIndexNum].visit = currentRecommendNum;
    }

    setGenderData({
      male: maleData,
      female: femaleData,
    });

    return {
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
    };
  };

  useEffect(() => {
    setCurrentAllData(dataFilterAll(currentRecommendNum));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localTypeValue]);

  return (
    <div id="bar_container" className="h-full min-h-[748px] py-3">
      <h3 className="text-center">{`${localTypeValue}의 성별, 나이대별 가장높은 방문율을 기록한 장소입니다.`}</h3>
      <div className="w-full h-full flex items-center">
        {currentAllData && <Bar options={options} data={currentAllData} width={1572} height={975} />}
      </div>
    </div>
  );
}
