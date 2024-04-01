import MainSection from '@/components/MainSection';
import { getAllLocationInfo } from '@/service/location';

// export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const locationInfo = await getAllLocationInfo();
  return (
    <div className="w-full h-full">
      <MainSection locationInfo={locationInfo} />
    </div>
  );
}
