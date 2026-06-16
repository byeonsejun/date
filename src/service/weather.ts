// @ts-nocheck
import { createStorageItem, removeStorageItem } from '@/utils/util';
import { fromUnixTime } from 'date-fns';
import format from 'date-fns/format';

async function fetchJsonOrThrow(url) {
  const res = await fetch(url);
  const contentType = res.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  if (!res.ok) {
    if (isJson) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody?.message || `Request failed: ${res.status}`);
    }
    const text = await res.text();
    throw new Error(text?.slice(0, 120) || `Request failed: ${res.status}`);
  }
  if (!isJson) {
    const text = await res.text();
    throw new Error(text?.slice(0, 120) || 'Expected JSON response');
  }
  return res.json();
}

// 오늘의 날씨정보 받아오기
export const getRealTimeWeather = async (lat, lon) => {
  const type = 'weather';
  const todayWeather = await fetchJsonOrThrow(`/api/weather?type=${type}&lat=${lat}&lon=${lon}`);
  return todayWeather;
};

// 미래의 날씨정보 받아오기
export const getForecastWeather = async (lat, lon) => {
  const type = 'forecast';
  const getInfo = await fetchJsonOrThrow(`/api/weather?type=${type}&lat=${lat}&lon=${lon}`)
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

const DEFAULT_DISTRICT = '중구';

export const getUserGeoInfo = async (
  getRealTimeLocation,
  setMyGeoInfo,
  getSelectLocation,
  setLocation,
  onSeoulOnlyNotice
) => {
  removeStorageItem('outside');
  const options = { enableHighAccuracy: true, maximumAge: 0 };
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      let result = {};
      await fetch(`/api/location?lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
        .then((res) => res.json())
        .then((data) => {
          const areaFlag = data.plus_code.compound_code.split(' ')[2];
          // const areaFlag = '경기도';
          if (areaFlag !== '서울특별시') {
            onSeoulOnlyNotice?.();
            setLocation(DEFAULT_DISTRICT);
            getSelectLocation(DEFAULT_DISTRICT);
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
      setLocation(DEFAULT_DISTRICT);
      getSelectLocation(DEFAULT_DISTRICT);
      removeStorageItem('locationAgree');
    },
    options
  );
};
