// @ts-nocheck
import { useCallback, useEffect, useRef, useState } from 'react';
import { getForecastWeather, getRealTimeWeather, getUserGeoInfo } from '@/service/weather';
import useLocationStore from '@/stores/useLocationStore';
import useWeatherStore from '@/stores/useWeatherStore';
import useUiStore from '@/stores/useUiStore';
import { useShallow } from 'zustand/react/shallow';

export default function useWeather() {
  const { allDistrictInfo, location, setLocation, myGeoInfo, setMyGeoInfo } = useLocationStore(
    useShallow((state) => ({
      allDistrictInfo: state.allDistrictInfo,
      location: state.location,
      setLocation: state.setLocation,
      myGeoInfo: state.myGeoInfo,
      setMyGeoInfo: state.setMyGeoInfo,
    }))
  );
  const { myLocalWeather, setMyLocalWeather, showWeather, setShowWeather } = useWeatherStore(
    useShallow((state) => ({
      myLocalWeather: state.myLocalWeather,
      setMyLocalWeather: state.setMyLocalWeather,
      showWeather: state.showWeather,
      setShowWeather: state.setShowWeather,
    }))
  );
  const showSeoulOnlyToast = useUiStore((state) => state.showSeoulOnlyToast);

  const firstFlagRef = useRef(0); // 첫 날씨호출 플래그
  const prevLocationRef = useRef(null); // 직전 location ('현재 위치' 재선택 감지용)
  const coldStartCheckedRef = useRef(false); // 콜드 스타트 자동 측정 1회 가드
  const [loading, setLoading] = useState(false); // api 호출 로딩

  const [selectWeather, setSelectWeather] = useState(0); // 오늘 내일 모레 글피 중 선택한 값 0 = 오늘

  // 동의한 사람에 한하여 최초 1번 내 지역 좌표값 받아와서 상태에 저장하는 함수
  const showCurrentWeather = useCallback(
    (c, f, lo, firstBol) => {
      setShowWeather({ today: c, forecast: f });
      firstBol && setLocation(lo);
      firstFlagRef.current = 1;
    },
    [setLocation, setShowWeather]
  );

  const getRealTimeLocation = useCallback(async (coords) => {
    setLoading(true);
    try {
      const todayWeather = await getRealTimeWeather(coords.latitude, coords.longitude);
      const futureWeather = await getForecastWeather(coords.latitude, coords.longitude);
      setMyLocalWeather({ today: todayWeather, forecast: futureWeather });
      showCurrentWeather(todayWeather, futureWeather, '현재 위치', true);
    } catch (error) {
      console.error('[useWeather] failed to load current location weather:', error);
    } finally {
      setLoading(false);
    }
  }, [setMyLocalWeather, showCurrentWeather]);
  // 전달받은 파라미터 이름 날씨값 받아오기 함수
  const getSelectLocation = useCallback(async (lo) => {
    setLoading(true);
    try {
      const [getLocationInfo] = allDistrictInfo.filter((item) => item.location === lo);
      if (!getLocationInfo) return;
      const todayWeather = await getRealTimeWeather(getLocationInfo.lat, getLocationInfo.lon);
      const futureWeather = await getForecastWeather(getLocationInfo.lat, getLocationInfo.lon);
      showCurrentWeather(todayWeather, futureWeather, lo);
    } catch (error) {
      console.error(`[useWeather] failed to load weather for ${lo}:`, error);
    } finally {
      setLoading(false);
    }
  }, [allDistrictInfo, showCurrentWeather]);

  // 초기 로드: 선택된 구(기본 중구) 날씨만 표시, 위치 권한 요청하지 않음
  useEffect(() => {
    if (allDistrictInfo.length === 0) return;
    if (firstFlagRef.current === 1) return;
    firstFlagRef.current = 1;
    getSelectLocation(location);
  }, [allDistrictInfo, getSelectLocation, location]);

  // 지역 변경 시: '현재 위치' (재)선택 시 항상 새로 측정
  useEffect(() => {
    if (firstFlagRef.current === 0) return;
    const reselectedCurrent = prevLocationRef.current !== location;
    prevLocationRef.current = location;
    if (location === '현재 위치') {
      // '현재 위치'를 (다시) 선택할 때마다 myGeoInfo 캐시 재사용 없이 항상 새 좌표를 측정한다.
      // 단, 측정 성공으로 myGeoInfo가 갱신돼 effect가 재실행되는 경우(location 불변)에는
      // 재측정하지 않아 무한 측정 루프를 방지한다.
      if (reselectedCurrent) {
        getUserGeoInfo(
          getRealTimeLocation,
          setMyGeoInfo,
          getSelectLocation,
          setLocation,
          showSeoulOnlyToast
        );
      }
    } else {
      getSelectLocation(location);
    }
  }, [
    location,
    myGeoInfo,
    myLocalWeather,
    getRealTimeLocation,
    getSelectLocation,
    setLocation,
    setMyGeoInfo,
    showCurrentWeather,
    showSeoulOnlyToast,
  ]);

  // 콜드 스타트: 이미 위치 권한이 granted인 경우에만 1회 자동 측정.
  // (RN '권한 있으면 자동' 정신을 웹 관례에 맞게 — prompt/denied면 자동 측정하지 않고 동의 모달 흐름 유지)
  useEffect(() => {
    if (coldStartCheckedRef.current) return;
    // permissions API 미지원(구형 브라우저 등)이면 조용히 스킵 → 기존 동의 모달 흐름만 유지
    if (typeof navigator === 'undefined' || !navigator.permissions?.query) return;
    coldStartCheckedRef.current = true;
    let cancelled = false;
    navigator.permissions
      .query({ name: 'geolocation' })
      .then((status) => {
        // granted일 때만 자동 측정. 측정 경로는 기존 setLocation('현재 위치') → effect → getUserGeoInfo 재사용
        // (prevLocationRef 가드가 중복 측정을 방지). prompt/denied면 권한 팝업을 띄우지 않는다.
        if (!cancelled && status.state === 'granted') {
          setLocation('현재 위치');
        }
      })
      .catch(() => {
        // permissions 조회 실패: 조용히 스킵
      });
    return () => {
      cancelled = true;
    };
  }, [setLocation]);

  return {
    showWeather,
    selectWeather,
    setSelectWeather,
    location,
    loading,
  };
}
