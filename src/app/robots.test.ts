import { afterEach, describe, expect, it, vi } from 'vitest';

import robots from './robots';

describe('robots', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('미리보기(TARGET_ENV=preview)는 VERCEL_ENV 가 production 으로 가려져도 전체를 막는다', () => {
    vi.stubEnv('VERCEL_TARGET_ENV', 'preview');
    vi.stubEnv('VERCEL_ENV', 'production');

    expect(robots()).toEqual({ rules: [{ userAgent: '*', disallow: '/' }] });
  });

  it('TARGET_ENV 가 없으면 운영 규칙을 돌려준다', () => {
    vi.stubEnv('VERCEL_TARGET_ENV', '');
    vi.stubEnv('VERCEL_ENV', 'preview');

    expect(robots()).toEqual({
      rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
      sitemap: 'https://date-eight-navy.vercel.app/sitemap.xml',
    });
  });
});
