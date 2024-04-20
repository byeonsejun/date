import ChartComponent from '@/components/ChartComponent';
import { getChartData } from '@/service/chart';
import { localInfoData } from '@/service/location';

export const metadata = {
  title: '통계 그래프',
  description: '통계 그래프로 지역 최고의 방문지를 찾아보세요!',
};

export default async function StatisticsPage() {
  const chartData = await getChartData();
  const localGeoData = localInfoData.filter((item) => item.location !== '현재 위치');
  return (
    <div className="w-full h-full">
      <ChartComponent chartData={chartData} localInfoData={localGeoData} />
    </div>
  );
}
