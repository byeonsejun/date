import React, { useEffect, useState } from 'react';
import { getForecastWeather, getRealTimeWeather, getUserGeoInfo } from '@/service/weather';
import useLocationStore from '@/stores/LocationStore';

export default function useWeather() {
  const {
    allDistrictInfo,
    location,
    setLocation,
    myLocalWeather,
    setMyLocalWeather,
    showWeather,
    setShowWeather,
    setMyGeoInfo,
  } = useLocationStore();

  const [loading, setLoading] = useState(false); // api 호출 로딩

  const [firstFlag, setFirstFlag] = useState(0); // 첫 날씨호출 플래그
  const [selectWeather, setSelectWeather] = useState(0); // 오늘 내일 모레 글피 중 선택한 값 0 = 오늘

  // 동의한 사람에 한하여 최초 1번 내 지역 좌표값 받아와서 상태에 저장하는 함수
  const getRealTimeLocation = async (coords) => {
    setLoading(true);
    const todayWeather = await getRealTimeWeather(coords.latitude, coords.longitude);
    const fuaterWeather = await getForecastWeather(coords.latitude, coords.longitude);
    setMyLocalWeather({ today: todayWeather, forecast: fuaterWeather });
    showCurrentWeather(todayWeather, fuaterWeather, '현재 위치', true);
    setLoading(false);
  };
  // 전달받은 파라미터 이름 날씨값 받아오기 함수
  const getSelectLocation = async (lo) => {
    setLoading(true);
    const [getLocationInfo] = await allDistrictInfo.filter((item) => item.location === lo);
    const todayWeather = await getRealTimeWeather(getLocationInfo.lat, getLocationInfo.lat);
    const fuaterWeather = await getForecastWeather(getLocationInfo.lat, getLocationInfo.lat);
    showCurrentWeather(todayWeather, fuaterWeather, lo);
    setLoading(false);
  };
  // 현재날씨로 보여주기 함수
  const showCurrentWeather = (c, f, lo, firstBol) => {
    setShowWeather({ today: c, forecast: f });
    firstBol && setLocation(lo);
    setFirstFlag(1);
  };

  useEffect(() => {
    if (allDistrictInfo.length === 0) return;
    // 위치 정보 요청
    getUserGeoInfo(getRealTimeLocation, setMyGeoInfo, getSelectLocation, location, allDistrictInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDistrictInfo]);

  useEffect(() => {
    if (firstFlag === 0) return;
    location === '현재 위치'
      ? showCurrentWeather(myLocalWeather.today, myLocalWeather.forecast, '현재 위치')
      : getSelectLocation(location);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return {
    showWeather,
    selectWeather,
    setSelectWeather,
    location,
    loading,
  };
}
