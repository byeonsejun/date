// @ts-nocheck
import JsonLd from '@/components/JsonLd';
import MainSection from '@/components/MainSection';
import { buildWebApplicationJsonLd } from '@/utils/seo';

// export const dynamic = 'force-dynamic';

export default async function HomePage() {
  return (
    <>
      <JsonLd data={buildWebApplicationJsonLd()} />
      <div className="w-full h-full">
        <MainSection />
      </div>
    </>
  );
}
