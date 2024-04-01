import { createStorageItem } from '@/\butil/util';
import CloseIcon from './ui/CloseIcon';

export default function TextInfoModal({ onClose }) {
  const alwayClose = () => {
    createStorageItem('googleMapTextModal', 'true');
    onClose();
  };
  return (
    <section className="absolute top-32 right-6 flex flex-col justify-center items-center w-[150px] h-[180px] z-0 bg-neutral-900/90">
      {/* <button className="absolute top-0 right-0 text-white m-1" onClick={() => onClose()}>
        <CloseIcon />
      </button> */}
      <div className="w-full h-full px-1 text-white leading-4 text-xs pt-2 flex flex-col gap-1">
        <p className="text-sm text-center">구글맵 사용법 가이드</p>
        <p>1. 3D 건물 보기: 구글맵을 일정 비율 이상 확대하면 건물이 3D로 보입니다.</p>
        <p>2. 시점 변경: 키보드의 Shift 키를 누른 상태에서 마우스를 클릭하고 움직이면 시점을 바꿀 수 있습니다.</p>
      </div>
      <div className="w-full flex text-xs border-t border-t-gray-400 text-white">
        <button
          className="h-6 flex items-center justify-center w-full border-r border-r-gray-400 hover:bg-black "
          onClick={() => alwayClose()}
        >
          다시 보지 않기
        </button>
        <button className="h-6 flex items-center justify-center w-full hover:bg-black" onClick={() => onClose()}>
          닫기
        </button>
      </div>
    </section>
  );
}
