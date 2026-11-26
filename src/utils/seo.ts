import type { Metadata } from 'next';

/** 정본 주소. 미리보기 배포에서도 canonical 은 항상 운영을 가리킨다. */
export const SITE_URL = 'https://date-eight-navy.vercel.app';

export const SITE_NAME = '서울, 너와 함께';

/**
 * 화면에 보이는 한국어 문구(ko.json 의 위치 동의 안내 · 추천 제목)로만 만든 설명.
 * 언어는 URL 이 아니라 화면 안에서 바뀌므로(ADR 0005) 메타는 한국어로 고정한다.
 */
export const SITE_DESCRIPTION =
  '현재 계신 곳을 중심으로 맞춤형 날씨와 데이트 장소를 추천해 드려요. 오늘 추천 데이트 장소와 추천식당 리스트 Top 5를 지도에서 함께 봅니다. 서울 지역 한정으로 제공됩니다.';

export const OG_IMAGE = {
  url: '/og.png',
  width: 1200,
  height: 630,
  alt: '서울, 너와 함께 지도 화면',
};

/**
 * 지원 언어(구조화 데이터용). i18n/config 를 import 하면 i18next 초기화가 따라와서
 * 값을 직접 적고, seo.test.ts 가 SUPPORTED_LANGUAGES 와 같은지 확인한다.
 */
export const SUPPORTED_LANGUAGES_LD = ['ko', 'en', 'ja', 'zh'] as const;

/** Vercel 미리보기 배포(VERCEL_ENV === 'preview')만 true. 로컬 · 운영은 색인 대상. */
export function isPreviewDeployment(vercelEnv: string | undefined): boolean {
  return vercelEnv === 'preview';
}

export function buildRootMetadata(preview: boolean): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_NAME,
      template: '서울에서 즐기는 데이트의 모든 것 | %s',
    },
    description: SITE_DESCRIPTION,
    alternates: { canonical: '/' },
    ...(preview ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: '/',
      siteName: SITE_NAME,
      locale: 'ko_KR',
      type: 'website',
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: [OG_IMAGE],
    },
  };
}
