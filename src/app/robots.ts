import type { MetadataRoute } from 'next';

import { buildRobots, isPreviewDeployment } from '@/utils/seo';

export default function robots(): MetadataRoute.Robots {
  return buildRobots(isPreviewDeployment());
}
