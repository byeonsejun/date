import { createStorageItem, removeStorageItem } from '@/\butil/util';
import { fromUnixTime, differenceInDays } from 'date-fns';
import format from 'date-fns/format';

export const getRealTimeWeather = async (lat, lon) => {
  const pro = 'https';
  const type = 'weather';
  const todayWeather = await fetch('/api/weather', {
    method: 'POST',
    body: JSON.stringify({ pro, type, lat, lon }),
  }).then((res) => res.json());
  return todayWeather;
};

export const getForecastWeather = async (lat, lon) => {
  const pro = 'http';
  const type = 'forecast';
  const getInfo = await fetch('/api/weather', {
    method: 'POST',
    body: JSON.stringify({ pro, type, lat, lon }),
  })
    .then((res) => res.json())
    .then((data) => {
      data.list.map((item) => {
        const realTime = new Date();
        const itemDate = fromUnixTime(item.dt);
        const finishItemDate = fromUnixTime(item.dt);
        const formattedDate = format(itemDate, 'ha');
        finishItemDate.setHours(23, 59, 59);
        const diffInTime = finishItemDate.getTime() - realTime.getTime();
        const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

        item.date = itemDate;
        item.time = formattedDate;
        item.day_value = diffInDays;
        return item;
      });
      return data.list;
    });
  return getInfo;
};

export const getUserGeoInfo = async (getRealTimeLocation, setMyGeoInfo, getSelectLocation, location) => {
  removeStorageItem('outside');
  const options = { enableHighAccuracy: true, maximumAge: 0 };
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      let result = {};
      await fetch('/api/location', {
        method: 'POST',
        body: JSON.stringify({ lat: position.coords.latitude, lon: position.coords.longitude }),
      })
        .then((res) => res.json())
        .then((data) => {
          const areaFlag = data.plus_code.compound_code.split(' ')[2];
          // const areaFlag = '경기도';
          if (areaFlag !== '서울특별시') {
            alert('서울이 아닌 지역에서는 현재 위치를 사용하실 수 없습니다.');
            getSelectLocation(location);
            removeStorageItem('locationAgree');
            createStorageItem('outside', 'true');
            return;
          }

          getRealTimeLocation(position.coords);
          const filteredAddresses = data.results.filter((address) => {
            const sublocalityLevel2 = address.address_components.find((component) =>
              component.types.includes('sublocality_level_2')
            );
            return sublocalityLevel2 !== undefined;
          });

          filteredAddresses.map((address, idx) => {
            if (idx === filteredAddresses.length - 1) {
              const [gu] = address.address_components.filter((item) =>
                item.types.find((lo) => lo.includes('sublocality_level_1'))
              );
              const [dong] = address.address_components.filter((item) =>
                item.types.find((lo) => lo.includes('sublocality_level_2'))
              );
              result = {
                point: address.geometry.location,
                address: address,
                gu,
                dong,
              };
            }
          });
          setMyGeoInfo(result);
          createStorageItem('locationAgree', 'true');
        })
        .catch((err) => {
          alert('데이터요청에 실패하였습니다. 새로고침 버튼을 눌러주세요.');
          throw new Error(err);
        });
    },
    (error) => {
      // 오류 코드: error.code 1 (권한 거부), 2 (위치 정보 사용 불가능), 3 (타임아웃)
      getSelectLocation(location);
      removeStorageItem('locationAgree');
    },
    options
  );
};

// 미세먼지 임 !!!!!!!!!!!!!!! 현재내시간이 포함된 이후부터 90시간이후까지(3일 20시간) 1시간 단위로 보여줌
// main.aqi 가 미세먼지 농도지수  1 = 좋음, 2 = 보통, 3 = 보통, 4 = 나쁨, 5 = 매우 나쁨.
// export const getForecastWeather = async (lat, lon) => {
//   const getInfo = await fetch(
//     `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
//   ).then((res) => res.json());
//   return getInfo;
// };
