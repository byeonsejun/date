// @ts-nocheck
import i18n from '@/i18n/config';

/**
 * 값 겸용 문자열(카테고리·구 이름·POI 제목)의 표시 라벨 변환.
 *
 * 내부 저장값(한국어 정본)은 로직 비교·필터 키·데이터 타입으로 쓰이므로 그대로 두고,
 * 표시 시점에만 언어별 라벨로 바꾼다. (RN 저장소 portfolio-rn의
 * entities/map|location|poi/lib/label.ts 이식)
 *
 * `i18n.getFixedT(language)`로 요청 언어 고정 t를 얻어, React 훅 없이도
 * (예: 목록 map 콜백, 지도 마커 title prop) 호출 가능하다.
 */

/** 지도 카테고리 표시 라벨 ("전체"/"공원"/"문화공간"/"두드림길"). */
export const getCategoryLabel = (category, language) => {
  const t = i18n.getFixedT(language);
  switch (category) {
    case '전체':
      return t('map.category.all');
    case '공원':
      return t('map.category.park');
    case '문화공간':
      return t('map.category.culturalSpace');
    case '두드림길':
      return t('map.category.dodreamgil');
    default:
      return category;
  }
};

/**
 * 구 이름 표시 라벨.
 * 영어 모드에서만 `location_en`으로 치환하고, 값이 없으면 한국어로 폴백한다.
 * (내부 저장값 `district.location`은 그대로 유지)
 */
export const getDistrictLabel = (district, language) => {
  if (language === 'en' && district?.location_en) return district.location_en;
  return district?.location ?? '';
};

/**
 * POI 표시 title.
 * 영어 모드에서만 `titleEn`으로 치환하고, 값이 없으면 한국어 title로 폴백한다.
 * (내부 저장값 `title`은 그대로 유지)
 */
export const getPoiDisplayTitle = (poi, language) => {
  if (language === 'en' && poi?.titleEn) return poi.titleEn;
  return poi?.title ?? '';
};
