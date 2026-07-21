// @ts-nocheck
import { getAllLocationInfo } from '@/service/location';
import AccessTime from './AccessTime';
import AppTitle from './AppTitle';
import LanguageToggle from './LanguageToggle';
import NavComponent from './NavComponent';

export default async function Header() {
  const locationInfo = await getAllLocationInfo();

  return (
    <header className="relative z-20 w-full min-h-12 px-2 lg:px-4 py-2 mb-2 lg:mb-4 font-bold border-b border-[#ededed] text-gray-900 select_color_all">
      <div className="flex items-center justify-between gap-2">
        <AppTitle />
        <div className="flex items-center gap-4 lg:gap-6">
          <NavComponent locationInfo={locationInfo} />
          <LanguageToggle />
          <div className="hidden lg:block text-xs lg:text-base text-black">
            <AccessTime />
          </div>
        </div>
      </div>
    </header>
  );
}
