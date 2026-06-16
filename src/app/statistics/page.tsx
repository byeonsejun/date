// @ts-nocheck
import { redirect } from 'next/navigation';

export const metadata = {
  title: '통계 그래프',
  description: '통계 그래프로 지역 최고의 방문지를 찾아보세요!',
};

export default async function StatisticsPage() {
  redirect('/');
}
