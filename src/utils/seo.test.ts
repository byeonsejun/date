import { describe, expect, it } from 'vitest';

import { SUPPORTED_LANGUAGES } from '@/i18n/config';
import ko from '@/i18n/locales/ko.json';

import {
  buildLlmsTxt,
  buildRobots,
  buildRootMetadata,
  buildSitemap,
  buildWebApplicationJsonLd,
  isPreviewDeployment,
  OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  SUPPORTED_LANGUAGES_LD,
} from './seo';

describe('isPreviewDeployment', () => {
  it('VERCEL_TARGET_ENV 가 preview 일 때만 true', () => {
    expect(isPreviewDeployment({ VERCEL_TARGET_ENV: 'preview' })).toBe(true);
  });

  it('사용자 변수 VERCEL_ENV 가 시스템 값을 가려도 TARGET_ENV 로 판정한다', () => {
    expect(isPreviewDeployment({ VERCEL_ENV: 'production', VERCEL_TARGET_ENV: 'preview' })).toBe(
      true
    );
  });

  it('VERCEL_ENV 만 preview 인 경우는 false', () => {
    expect(isPreviewDeployment({ VERCEL_ENV: 'preview' })).toBe(false);
  });

  it.each(['production', 'development', '', 'staging'])(
    'VERCEL_TARGET_ENV 가 %j 이면 false',
    (value) => {
      expect(isPreviewDeployment({ VERCEL_TARGET_ENV: value })).toBe(false);
    }
  );

  it('값이 없으면 false', () => {
    expect(isPreviewDeployment({})).toBe(false);
  });
});

describe('buildRootMetadata', () => {
  it('운영 주소를 기준으로 한국어 메타를 만든다', () => {
    const meta = buildRootMetadata(false);

    expect(String(meta.metadataBase)).toBe('https://date-eight-navy.vercel.app/');
    expect(SITE_URL).toBe('https://date-eight-navy.vercel.app');
    expect(meta.title).toEqual({
      default: '서울, 너와 함께',
      template: '서울에서 즐기는 데이트의 모든 것 | %s',
    });
    expect(meta.description).toBe(SITE_DESCRIPTION);
    expect(meta.alternates?.canonical).toBe('/');
    expect(meta.robots).toBeUndefined();
    expect(meta.openGraph).toEqual({
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: '/',
      siteName: SITE_NAME,
      locale: 'ko_KR',
      type: 'website',
      images: [OG_IMAGE],
    });
    expect(meta.twitter).toEqual({
      card: 'summary_large_image',
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: [OG_IMAGE],
    });
  });

  it('미리보기 배포는 색인하지 않는다', () => {
    expect(buildRootMetadata(true).robots).toEqual({ index: false, follow: false });
  });

  it('미리보기에서도 canonical 은 운영을 가리킨다', () => {
    expect(buildRootMetadata(true).alternates?.canonical).toBe('/');
    expect(String(buildRootMetadata(true).metadataBase)).toBe(
      'https://date-eight-navy.vercel.app/'
    );
  });
});

describe('SITE_DESCRIPTION', () => {
  it('화면에 보이는 ko.json 문구로만 만들어졌다', () => {
    const screenTexts = [
      ko.location.consentMessage,
      ko.recommend.recommendDesc,
      ko.recommend.foodListTitle,
    ].join('\n');
    const phrases = [
      '현재 계신 곳을 중심으로 맞춤형 날씨와 데이트 장소를 추천해 드려요',
      '오늘 추천하는 데이트 장소',
      '추천식당 리스트 Top 5',
      '서울 지역 한정으로 제공됩니다',
    ];

    for (const phrase of phrases) {
      expect(screenTexts).toContain(phrase);
      expect(SITE_DESCRIPTION).toContain(phrase);
    }
  });
});

describe('SUPPORTED_LANGUAGES_LD', () => {
  it('i18n 설정의 지원 언어와 같다', () => {
    expect([...SUPPORTED_LANGUAGES_LD]).toEqual([...SUPPORTED_LANGUAGES]);
  });
});

describe('buildRobots', () => {
  it('운영은 /api/ 만 막고 사이트맵을 알린다', () => {
    expect(buildRobots(false)).toEqual({
      rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
      sitemap: 'https://date-eight-navy.vercel.app/sitemap.xml',
    });
  });

  it('미리보기는 전체를 막고 사이트맵을 알리지 않는다', () => {
    const robots = buildRobots(true);

    expect(robots).toEqual({ rules: [{ userAgent: '*', disallow: '/' }] });
    expect(robots).not.toHaveProperty('sitemap');
  });
});

describe('buildSitemap', () => {
  it('홈 주소 하나만 담는다 (/statistics 는 redirect 페이지)', () => {
    const sitemap = buildSitemap();

    expect(sitemap).toEqual([{ url: 'https://date-eight-navy.vercel.app/' }]);
    expect(JSON.stringify(sitemap)).not.toContain('statistics');
    expect(JSON.stringify(sitemap)).not.toContain('/api');
  });
});

describe('buildWebApplicationJsonLd', () => {
  it('화면에 보이는 값으로 WebApplication 을 만든다', () => {
    expect(buildWebApplicationJsonLd()).toEqual({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: '서울, 너와 함께',
      url: 'https://date-eight-navy.vercel.app/',
      description: SITE_DESCRIPTION,
      inLanguage: ['ko', 'en', 'ja', 'zh'],
      applicationCategory: 'TravelApplication',
      operatingSystem: 'Web',
    });
  });

  it('inLanguage 는 i18n 설정의 지원 언어와 같다', () => {
    expect(buildWebApplicationJsonLd().inLanguage).toEqual([...SUPPORTED_LANGUAGES]);
  });
});

describe('buildLlmsTxt', () => {
  const txt = buildLlmsTxt();

  it('제목과 요약 줄로 시작한다', () => {
    expect(txt.startsWith('# 서울, 너와 함께\n')).toBe(true);
    expect(txt).toMatch(/^> .+/m);
  });

  it('페이지 · 언어 · 데이터 · 만든 사람 정보를 담는다', () => {
    expect(txt).toContain('- [홈](https://date-eight-navy.vercel.app/)');
    expect(txt).toContain('한국어 · 영어 · 일본어 · 중국어(간체)');
    expect(txt).toContain('OpenWeather');
    expect(txt).toContain('Google');
    expect(txt).toContain('https://sejunb.com');
    expect(txt).toContain('https://github.com/byeonsejun/date');
  });

  it('공개 페이지가 아닌 /statistics 는 적지 않는다', () => {
    expect(txt).not.toContain('statistics');
  });
});
