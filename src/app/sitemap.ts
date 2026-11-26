import type { MetadataRoute } from 'next';

import { buildSitemap } from '@/utils/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap();
}
