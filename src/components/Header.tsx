// @ts-nocheck
import Link from 'next/link';
import { getAllLocationInfo } from '@/service/location';
import AccessTime from './AccessTime';
import NavComponent from './NavComponent';

export default async function Header() {
  const locationInfo = await getAllLocationInfo();

  return (
    <header className="relative z-20 w-full min-h-12 px-2 lg:px-4 py-2 mb-2 lg:mb-4 font-bold border-b border-[#ededed] text-gray-900 select_color_all">
      <div className="flex items-center justify-between gap-2">
        <Link href={`/`} className="text-gray-900 hover:text-gray-800 focus:outline-none focus:underline">
          <h1 className="text-xl lg:text-2xl">서울, 너와 함께</h1>
        </Link>
        <div className="flex items-center gap-4 lg:gap-6">
          <NavComponent locationInfo={locationInfo} />
          <div className="hidden lg:block text-xs lg:text-base text-black">
            <AccessTime />
          </div>
        </div>
      </div>
    </header>
  );
}
