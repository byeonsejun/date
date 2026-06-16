import path from 'path';
import { readFile } from 'fs/promises';

export async function getChartData() {
  const chartData = readFile(path.join(process.cwd(), 'data', 'chartData.json'), 'utf-8');
  const chartJson = await chartData.then(JSON.parse);
  return chartJson;
}
