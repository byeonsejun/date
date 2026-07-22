// @ts-nocheck
import { findStorageItem, getRandomIndexItem } from '@/utils/util';
import useLocationStore from '@/stores/useLocationStore';
import useMapStore from '@/stores/useMapStore';
import React, { useCallback, useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useTranslation } from 'react-i18next';

const selectType = [
  { name: '전체', class: 'select_color_all' },
  { name: '문화공간', class: 'select_color_moon' },
  { name: '공원', class: 'select_color_gong' },
  { name: '두드림길', class: 'select_color_do' },
];

export default function SelectShowMapType() {
  const { t } = useTranslation();
  const { location, myGeoInfo, parkInfo, dodreamgilInfo, culturalSpaceInfo } = useLocationStore(
    useShallow((state) => ({
      location: state.location,
      myGeoInfo: state.myGeoInfo,
      parkInfo: state.parkInfo,
      dodreamgilInfo: state.dodreamgilInfo,
      culturalSpaceInfo: state.culturalSpaceInfo,
    }))
  );
  const { setShowPoint, selectedType, setSelectedType } = useMapStore(
    useShallow((state) => ({
      setShowPoint: state.setShowPoint,
      selectedType: state.selectedType,
      setSelectedType: state.setSelectedType,
    }))
  );

  const getShowItem = useCallback(
    (myLc, park, dodr, cult, type) => {
      let currentInfo = [];
      switch (type) {
        case '전체':
          currentInfo = getFilterInfoData(type, myLc, cult, park, dodr);
          break;
        case '문화공간':
          currentInfo = getFilterInfoData(type, myLc, cult);
          break;
        case '공원':
          currentInfo = getFilterInfoData(type, myLc, park);
          break;
        case '두드림길':
          currentInfo = getFilterInfoData(type, myLc, dodr);
          break;
        default:
          break;
      }
      setShowPoint(currentInfo);
    },
    [setShowPoint]
  );

  useEffect(() => {
    if (findStorageItem('locationAgree') && !myGeoInfo) return;
    if (location === '현재 위치' && !myGeoInfo?.gu) return;
    const mylocation = location === '현재 위치' ? myGeoInfo.gu.long_name : location;
    getShowItem(mylocation, parkInfo, dodreamgilInfo, culturalSpaceInfo, selectedType);
  }, [parkInfo, dodreamgilInfo, culturalSpaceInfo, myGeoInfo, location, selectedType, getShowItem]);

  return (
    <ul
      className="flex items-center justify-center gap-2 absolute z-10 top-2 left-2"
      role="tablist"
      aria-label={t('map.typeFilterLabel')}
    >
      {selectType.map((item) => (
        <li key={item.name} role="presentation">
          <button
            type="button"
            role="tab"
            aria-selected={selectedType === item.name}
            className={`${
              selectedType === item.name
                ? `${item.class} text-white`
                : 'bg-white hover:bg-slate-100'
            } p-2 rounded-lg`}
            onClick={() => setSelectedType(item.name)}
          >
            {item.name}
          </button>
        </li>
      ))}
    </ul>
  );
}

/**
 * 두드림길 그룹의 `location`은 "종로구" 단일 또는 "강북구,도봉구,종로구"처럼 콤마로 여러
 * 구를 묶기도 한다. 과거 `const [x] = data.filter((i) => i.location.includes(myLc))`는 배열에서
 * 가장 먼저 매치되는 그룹 하나만 취해, 뒤에 있는 단일 구 전용 그룹이 통째로 누락됐다
 * (예: "종로구,중구"가 먼저 매치돼 "종로구" 전용 그룹 111건이 숨겨짐 → 종로구가 6건만 노출).
 *
 * 콤마 분리 후 정확 매칭되는 모든 그룹을 모으고, 여러 그룹에 겹치는 트레일 POI + 그룹 내부
 * 중복을 이름 + 좌표(toFixed(6)) 기준으로 dedupe한다. (RN 저장소 portfolio-rn cb541ad와 동일 로직)
 */
const collectDodreamgilRecords = (groups, myLc) => {
  const matched = groups.filter((group) =>
    group.location.split(',').some((name) => name.trim() === myLc)
  );
  const seen = new Set();
  const records = [];
  for (const group of matched) {
    for (const record of group.data) {
      const lat = Number(record.latitude);
      const lng = Number(record.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
      const dedupeKey = `${record.CPI_NAME}@${lat.toFixed(6)},${lng.toFixed(6)}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      records.push(record);
    }
  }
  return records;
};

/** 두드림길 원본 레코드 → 지도/추천 표시용 객체. (두드림길/전체/랜덤 3경로 공통) */
const mapDodreamgilRecord = (data) => ({
  type: '두드림길',
  lat: data.latitude,
  lng: data.longitude,
  title: data.CPI_NAME,
  contentType: data.COURSE_CATEGORY_NM,
  desc: data.CONTENT ?? undefined,
  img: undefined,
  url: undefined,
  phone: undefined,
  address: undefined,
  inCharge: undefined,
  courseName: data.COURSE_NAME ?? undefined,
  distance: data.DISTANCE ?? undefined,
  leadTime: data.LEAD_TIME ?? undefined,
  detailCourse: data.DETAIL_COURSE ?? undefined,
  level: data.COURSE_LEVEL ?? undefined,
});

export const getFilterInfoData = (type, myLc, data, data2, data3) => {
  let filterData = [];
  switch (type) {
    case '문화공간':
      const [cultureContent] = data.filter((item) => item.location === myLc);
      filterData = cultureContent.data.map((data) => {
        return {
          type: '문화공간',
          lat: data.X_COORD,
          lng: data.Y_COORD,
          title: data.FAC_NAME,
          contentType: data.SUBJCODE ?? undefined,
          desc: data.FAC_DESC ?? undefined,
          img: data.MAIN_IMG ?? undefined,
          url: data.HOMEPAGE ?? undefined,
          phone: data.PHNE ?? undefined,
          address: data.address ?? undefined,
          inCharge: undefined,
          distance: undefined,
          leadTime: undefined,
          detailCourse: undefined,
          level: undefined,
        };
      });
      break;
    case '공원':
      const [parkContent] = data.filter((item) => item.location === myLc);
      filterData = parkContent.data.map((data) => {
        return {
          type: '공원',
          lat: data.latitude,
          lng: data.longitude,
          title: data.p_park,
          contentType: '공원',
          desc: data.p_list_content ?? undefined,
          img: data.p_img ?? undefined,
          url: data.template_url ?? undefined,
          phone: data.p_admintel ?? undefined,
          address: data.p_addr ?? undefined,
          inCharge: data.p_name ?? undefined,
          distance: undefined,
          leadTime: undefined,
          detailCourse: undefined,
          level: undefined,
        };
      });
      break;
    case '두드림길':
      filterData = collectDodreamgilRecords(data, myLc).map(mapDodreamgilRecord);
      break;
    case '전체':
      const [allCultureContent] = data.filter((item) => item.location === myLc);
      const cultureData = allCultureContent.data.map((data) => {
        return {
          type: '문화공간',
          lat: data.X_COORD,
          lng: data.Y_COORD,
          title: data.FAC_NAME,
          contentType: data.SUBJCODE ?? undefined,
          desc: data.FAC_DESC ?? undefined,
          img: data.MAIN_IMG ?? undefined,
          url: data.HOMEPAGE ?? undefined,
          phone: data.PHNE ?? undefined,
          address: data.address ?? undefined,
          inCharge: undefined,
          distance: undefined,
          leadTime: undefined,
          detailCourse: undefined,
          level: undefined,
        };
      });
      const [allParkContent] = data2.filter((item) => item.location === myLc);
      const parkData = allParkContent.data.map((data) => {
        return {
          type: '공원',
          lat: data.latitude,
          lng: data.longitude,
          title: data.p_park,
          contentType: '공원',
          desc: data.p_list_content ?? undefined,
          img: data.p_img ?? undefined,
          url: data.template_url ?? undefined,
          phone: data.p_admintel ?? undefined,
          address: data.p_addr ?? undefined,
          inCharge: data.p_name ?? undefined,
          distance: undefined,
          leadTime: undefined,
          detailCourse: undefined,
          level: undefined,
        };
      });
      const dodrimData = collectDodreamgilRecords(data3, myLc).map(mapDodreamgilRecord);
      filterData = cultureData.concat(parkData, dodrimData);
      break;
    case '랜덤':
      const [randomCultureContent] = data.filter((item) => item.location === myLc);
      const randomCulResult = getRandomIndexItem(randomCultureContent.data);
      const randomCultureData = {
        type: '문화공간',
        lat: randomCulResult.X_COORD,
        lng: randomCulResult.Y_COORD,
        title: randomCulResult.FAC_NAME,
        contentType: randomCulResult.SUBJCODE ?? undefined,
        desc: randomCulResult.FAC_DESC ?? undefined,
        img: randomCulResult.MAIN_IMG ?? undefined,
        url: randomCulResult.HOMEPAGE ?? undefined,
        phone: randomCulResult.PHNE ?? undefined,
        address: randomCulResult.address ?? undefined,
        inCharge: undefined,
        distance: undefined,
        leadTime: undefined,
        detailCourse: undefined,
        level: undefined,
      };

      const [randomParkContent] = data2.filter((item) => item.location === myLc);
      const randomParkResult = getRandomIndexItem(randomParkContent.data);
      const randomParkData = {
        type: '공원',
        lat: randomParkResult.latitude,
        lng: randomParkResult.longitude,
        title: randomParkResult.p_park,
        contentType: '공원',
        desc: randomParkResult.p_list_content ?? undefined,
        img: randomParkResult.p_img ?? undefined,
        url: randomParkResult.template_url ?? undefined,
        phone: randomParkResult.p_admintel ?? undefined,
        address: randomParkResult.p_addr ?? undefined,
        inCharge: randomParkResult.p_name ?? undefined,
        distance: undefined,
        leadTime: undefined,
        detailCourse: undefined,
        level: undefined,
      };

      const randomDodrimResult = getRandomIndexItem(collectDodreamgilRecords(data3, myLc));
      const randomDodrimData = mapDodreamgilRecord(randomDodrimResult);
      filterData = [randomCultureData, randomParkData, randomDodrimData];
      break;
    default:
      break;
  }
  return filterData;
};
