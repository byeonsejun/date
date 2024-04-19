import RecommendPlace from './RecommendPlace';
import SelectFilter from './SelectFilter';
import Weather from './Weather';

export default function Aside() {
  return (
    <aside className="w-[288px] min-w-[288px] max-w-[288px] h-full px-2 py-3 flex flex-col border border-[#ededed] mr-4 ">
      <SelectFilter />
      <p className="mb-2 text-base">선택하신 지역의 날씨 정보입니다.</p>
      <Weather />
      <RecommendPlace />
    </aside>
  );
}
