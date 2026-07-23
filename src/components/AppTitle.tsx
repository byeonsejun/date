'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

/**
 * Header 제목(앱 이름). Header를 서버 컴포넌트로 유지하기 위해, 번역이 필요한 h1만 작은
 * 클라이언트 조각으로 분리한다. (탭 제목 metadata는 서버가 사용자 언어를 알 수 없어 한국어 유지)
 */
export default function AppTitle() {
  const { t } = useTranslation();

  return (
    <Link href="/" className="text-gray-900 hover:text-gray-800 focus:outline-none focus:underline">
      <h1 className="text-xl lg:text-2xl">{t('common.appName')}</h1>
    </Link>
  );
}
