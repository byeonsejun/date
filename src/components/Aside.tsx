// @ts-nocheck
import RecommendPlace from './RecommendPlace';
import SelectFilter from './SelectFilter';
import Weather from './Weather';
import WeatherSectionTitle from './WeatherSectionTitle';

export default function Aside() {
  return (
    <aside className="w-full lg:w-[288px] lg:min-w-[288px] lg:max-w-[288px] h-auto lg:h-full px-2 py-3 flex flex-col border border-[#ededed] lg:mr-4 lg:overflow-y-auto lg:overflow-x-hidden lg:[&>*]:shrink-0 scroll_min">
      <SelectFilter />
      <WeatherSectionTitle />
      <Weather />
      <RecommendPlace />
    </aside>
  );
}
