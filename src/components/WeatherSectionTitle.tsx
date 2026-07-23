'use client';

import { useTranslation } from 'react-i18next';

/**
 * Aside 날씨 섹션 제목. Aside를 서버 컴포넌트로 유지하기 위해 번역이 필요한 이 문구만
 * 작은 클라이언트 조각으로 분리한다(AppTitle 패턴).
 */
export default function WeatherSectionTitle() {
  const { t } = useTranslation();

  return <p className="mb-2 text-base">{t('home.weatherSectionTitle')}</p>;
}
