import type { Metadata, MetadataRoute } from 'next';

/** 정본 주소. 미리보기 배포에서도 canonical 은 항상 운영을 가리킨다. */
export const SITE_URL = 'https://date-eight-navy.vercel.app';

export const SITE_NAME = '서울, 너와 함께';

/**
 * 화면에 보이는 한국어 문구(ko.json 의 위치 동의 안내 · 추천 안내 · 식당 목록 제목)로만 만든 설명.
 * 언어는 URL 이 아니라 화면 안에서 바뀌므로(ADR 0005) 메타는 한국어로 고정한다.
 */
export const SITE_DESCRIPTION =
  '현재 계신 곳을 중심으로 맞춤형 날씨와 데이트 장소를 추천해 드려요. 오늘 추천하는 데이트 장소와 추천식당 리스트 Top 5를 지도에서 함께 봅니다. 서울 지역 한정으로 제공됩니다.';

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

/** 프로젝트에 사용자 변수 VERCEL_ENV 가 있어 시스템 값을 가리므로 VERCEL_TARGET_ENV 로 판정한다. */
export function isPreviewDeployment(
  env: Record<string, string | undefined> = process.env
): boolean {
  return env.VERCEL_TARGET_ENV === 'preview';
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

export function buildRobots(preview: boolean): MetadataRoute.Robots {
  if (preview) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

/** /statistics 는 홈으로 redirect 하는 페이지라 넣지 않는다. */
export function buildSitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/` }];
}

export function buildWebApplicationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    description: SITE_DESCRIPTION,
    inLanguage: [...SUPPORTED_LANGUAGES_LD],
    applicationCategory: 'TravelApplication',
    operatingSystem: 'Web',
  };
}

export function buildLlmsTxt(): string {
  return `# ${SITE_NAME}

> 서울의 자치구를 고르거나 현재 위치를 쓰면, 그곳의 날씨와 데이트 장소(공원 · 문화공간 · 두드림길), 추천 식당을 지도 한 화면에서 보여 주는 웹 앱입니다. 서울 지역만 지원합니다.

## 페이지

- [홈](${SITE_URL}/)

## 언어

한국어 · 영어 · 일본어 · 중국어(간체). 화면 안 토글로 바뀌고 주소는 하나입니다.

## 데이터

- 날씨: OpenWeather
- 식당 · 지도: Google Maps · Places
- 장소 목록: 저장소 \`data/\` 의 JSON

## 만든 사람

- 변세준 · https://sejunb.com
- 저장소: https://github.com/byeonsejun/date

## 기술

Next.js App Router, React, Zustand, SWR, react-i18next, Google Maps.
`;
}
