// @ts-nocheck
import { findStorageItem, getRandomIndexItem } from '@/utils/util';
import useLocationStore from '@/stores/useLocationStore';
import useMapStore from '@/stores/useMapStore';
import React, { useCallback, useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

const selectType = [
  { name: '전체', class: 'select_color_all' },
  { name: '문화공간', class: 'select_color_moon' },
  { name: '공원', class: 'select_color_gong' },
  { name: '두드림길', class: 'select_color_do' },
];

export default function SelectShowMapType() {
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

  const getShowItem = useCallback((myLc, park, dodr, cult, type) => {
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
  }, [setShowPoint]);

  useEffect(() => {
    if (findStorageItem('locationAgree') && !myGeoInfo) return;
    if (location === '현재 위치' && !myGeoInfo?.gu) return;
    const mylocation = location === '현재 위치' ? myGeoInfo.gu.long_name : location;
    getShowItem(mylocation, parkInfo, dodreamgilInfo, culturalSpaceInfo, selectedType);
  }, [parkInfo, dodreamgilInfo, culturalSpaceInfo, myGeoInfo, location, selectedType, getShowItem]);

  return (
    <ul className="flex items-center justify-center gap-2 absolute z-10 top-2 left-2" role="tablist" aria-label="지도 타입 필터">
      {selectType.map((item) => (
        <li key={item.name} role="presentation">
          <button
            type="button"
            role="tab"
            aria-selected={selectedType === item.name}
            className={`${
              selectedType === item.name ? `${item.class} text-white` : 'bg-white hover:bg-slate-100'
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
      const [dodrimContent] = data.filter((item) => item.location.includes(myLc));
      filterData = dodrimContent.data.map((data) => {
        return {
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
        };
      });
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
      const [allDodrimContent] = data3.filter((item) => item.location.includes(myLc));
      const dodrimData = allDodrimContent.data.map((data) => {
        return {
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
        };
      });
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

      const [randomDodrimContent] = data3.filter((item) => item.location.includes(myLc));
      const randomDodrimResult = getRandomIndexItem(randomDodrimContent.data);
      const randomDodrimData = {
        type: '두드림길',
        lat: randomDodrimResult.latitude,
        lng: randomDodrimResult.longitude,
        title: randomDodrimResult.CPI_NAME,
        contentType: randomDodrimResult.COURSE_CATEGORY_NM,
        desc: randomDodrimResult.CONTENT ?? undefined,
        img: undefined,
        url: undefined,
        phone: undefined,
        address: undefined,
        inCharge: undefined,
        courseName: randomDodrimResult.COURSE_NAME ?? undefined,
        distance: randomDodrimResult.DISTANCE ?? undefined,
        leadTime: randomDodrimResult.LEAD_TIME ?? undefined,
        detailCourse: randomDodrimResult.DETAIL_COURSE ?? undefined,
        level: randomDodrimResult.COURSE_LEVEL ?? undefined,
      };
      filterData = [randomCultureData, randomParkData, randomDodrimData];
      break;
    default:
      break;
  }
  return filterData;
};
