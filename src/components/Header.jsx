import Link from 'next/link';
import { getAllLocationInfo } from '@/service/location';
import AccessTime from './AccessTime';
import NavComponent from './NavComponent';

export default async function Header() {
  const locationInfo = await getAllLocationInfo();

  return (
    <header className="w-full min-h-12 px-4 mb-4 font-bold flex justify-between items-center border-b border-[#ededed] text-[#f2f2f2] select_color_all">
      <Link href={`/`}>
        <h1 className="text-2xl">서울, 너와 함께</h1>
      </Link>
      <NavComponent locationInfo={locationInfo} />
      <AccessTime />
    </header>
  );
}
