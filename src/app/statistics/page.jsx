import ChartComponent from '@/components/ChartComponent';
import { getChartData } from '@/service/chart';
import { localInfoData } from '@/service/location';

export default async function StatisticsPage() {
  const chartData = await getChartData();
  const localGeoData = localInfoData.filter((item) => item.location !== '현재 위치');
  return (
    <div className="w-full h-full">
      <ChartComponent chartData={chartData} localInfoData={localGeoData} />
    </div>
  );
}
