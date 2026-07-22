// @ts-nocheck
'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';

/**
 * 지도 동적 로딩 중 LCP 선점 + CLS 방지용 스켈레톤 UI
 * priority Image가 LCP 요소를 선점 (구글 맵 타일보다 먼저 렌더링)
 */
export default function MapSkeleton() {
  const { t } = useTranslation();
  return (
    <div className="w-full h-full min-h-[60vh] rounded-lg bg-[#e8e8e8] flex items-center justify-center overflow-hidden relative">
      <Image
        src="/assets/image/lcp-placeholder.jpeg"
        alt={t('map.skeletonAlt')}
        fill
        sizes="100vw"
        priority
        className="object-contain"
      />
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#f986bd] border-t-transparent rounded-full animate-spin opacity-80" />
      </div>
    </div>
  );
}
