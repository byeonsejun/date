'use client';

import React, { useEffect, useState } from 'react';
import { createStorageItem, findStorageItem } from '@/\butil/util';
import useLocationStore from '@/stores/LocationStore';
import ModalPortal from './ui/ModalPortal';

const STORAGE_KEY = 'locationConsentAsked';

export default function LocationConsentModal() {
  const setLocation = useLocationStore((s) => s.setLocation);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!findStorageItem(STORAGE_KEY)) setShow(true);
  }, []);

  const handleAgree = () => {
    createStorageItem(STORAGE_KEY, 'true');
    setLocation('현재 위치');
    setShow(false);
  };

  const handleDecline = () => {
    createStorageItem(STORAGE_KEY, 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg shadow-xl max-w-sm mx-4 p-6 flex flex-col gap-4">
          <p className="text-gray-900 text-center font-normal break-keep">
            서울, 너와 함께는 현재 계신 곳을 중심으로 맞춤형 날씨와 데이트 장소를 추천해 드려요! 📍
            <br />
            (본 서비스는 서울 지역 한정으로 제공됩니다.)
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDecline}
              className="flex-1 py-2.5 px-4 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 font-normal"
            >
              거부
            </button>
            <button
              type="button"
              onClick={handleAgree}
              className="flex-1 py-2.5 px-4 rounded bg-[#f986bd] text-black hover:opacity-90 font-normal"
            >
              동의
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
