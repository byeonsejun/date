import Link from 'next/link';
import AccessTime from './AccessTime';

export default function Header() {
  return (
    <header className="w-full min-h-12 px-4 mb-4 font-bold flex justify-between items-center border-b border-[#ededed] text-[#f2f2f2] select_color_all">
      <Link href={`/`}>
        <h1 className="text-2xl">서울, 너와 함께</h1>
      </Link>
      {/* <nav className="flex gap-3">
        <Link href={`/`}>오늘의 데이트</Link>
        <Link href={`/`}>이달의 데이트</Link>
      </nav> */}
      <AccessTime />
    </header>
  );
}
