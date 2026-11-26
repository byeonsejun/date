import { buildLlmsTxt } from '@/utils/seo';

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
