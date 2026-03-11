'use client';

/**
 * 지도 동적 로딩 중 LCP/CLS 방지용 스켈레톤 UI
 * 지도와 동일한 크기 유지, 부드러운 펄스 애니메이션
 */
export default function MapSkeleton() {
  return (
    <div
      className="w-full h-full min-h-[60vh] rounded-lg bg-[#e8e8e8] flex items-center justify-center overflow-hidden animate-map-pulse"
      aria-hidden="true"
    >
      <div className="w-full h-full flex items-center justify-center bg-[#e8e8e8]">
        <div className="w-12 h-12 border-4 border-[#f986bd] border-t-transparent rounded-full animate-spin opacity-70" />
      </div>
    </div>
  );
}
