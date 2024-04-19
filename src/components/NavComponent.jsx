'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ModalPortal from './ui/ModalPortal';
import SurveyModal from './ui/SurveyModal';
import useLocationStore from '@/stores/LocationStore';

export default function NavComponent({ locationInfo }) {
  const { setLocationInfo, surveyStep, setSurveyStep } = useLocationStore();

  const [openModal, setOpenModal] = useState(false);
  const [closeNum, setCloseNum] = useState(5);

  useEffect(() => {
    setLocationInfo(locationInfo);
  }, [locationInfo, setLocationInfo]);

  // useEffect(() => {
  //   setOpenModal(true);
  // }, []);
  // useEffect(() => {
  //   if (surveyStep !== 99) return;
  //   const closeNumInterval = setInterval(() => {
  //     setCloseNum((prev) => prev - 1);
  //   }, 1000);
  //   if (closeNum === 0) {
  //     clearInterval(closeNumInterval);
  //     setSurveyStep(100);
  //     setOpenModal(false);
  //   }
  //   return () => clearInterval(closeNumInterval);
  // }, [surveyStep, closeNum]);
  return (
    <div>
      <nav className="flex gap-3">
        <Link href={`/`}>오늘의 데이트</Link>
        <Link href={`/statistics`}>이달의 통계</Link>
      </nav>
      {/* {openModal && (
        <ModalPortal>
          <SurveyModal onClose={() => setOpenModal(false)} closeNum={closeNum} />
        </ModalPortal>
      )} */}
    </div>
  );
}
