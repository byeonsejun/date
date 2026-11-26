import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import JsonLd from './JsonLd';

describe('JsonLd', () => {
  it('application/ld+json 스크립트로 데이터를 넣는다', () => {
    const html = renderToStaticMarkup(
      <JsonLd data={{ '@type': 'WebApplication', name: '서울' }} />
    );

    expect(html.startsWith('<script type="application/ld+json">')).toBe(true);
    expect(html.endsWith('</script>')).toBe(true);
    expect(html).toContain('"name":"서울"');
  });

  it('데이터 안의 < 는 이스케이프해 스크립트를 일찍 닫지 못하게 한다', () => {
    const html = renderToStaticMarkup(
      <JsonLd data={{ name: '</script><script>alert(1)</script>' }} />
    );

    expect(html.match(/<\/script>/g)).toHaveLength(1);
    expect(html.endsWith('</script>')).toBe(true);
    expect(html).toContain('\\u003c/script>');
  });
});
