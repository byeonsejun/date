import { createStorageItem } from '@/\butil/util';
import CloseIcon from './ui/CloseIcon';

export default function TextInfoModal({ onClose }) {
  const alwayClose = () => {
    createStorageItem('googleMapTextModal', 'true');
    onClose();
  };
  return (
    <section className="absolute top-32 right-6 flex flex-col justify-center items-center w-[150px] h-[165px] z-0 bg-neutral-900/90">
      {/* <button className="absolute top-0 right-0 text-white m-1" onClick={() => onClose()}>
        <CloseIcon />
      </button> */}
      <div className="w-full h-full px-1 text-white leading-4 text-xs pt-2">
        <p className="">안녕하세요</p>
        <p>
          구글맵의 간단 사용법 가이드입니다. 구글맵을 일정 비율 이상 확대하시면 건물이 3D로 보입니다. 키보드의 Shift
          키를 누르시고 마우스를 클릭하신 상태에서 움직이시면 시점을 바꾸실 수 있습니다.
        </p>
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
