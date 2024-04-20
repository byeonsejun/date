'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import ModalPortal from './ui/ModalPortal';
import SurveyModal from './ui/SurveyModal';
import useLocationStore from '@/stores/LocationStore';

const navMenu = [
  { href: '/', name: '오늘의 데이트' },
  { href: '/statistics', name: '이달의 통계' },
];

export default function NavComponent({ locationInfo }) {
  const { setLocationInfo, surveyStep, setSurveyStep } = useLocationStore();
  const pathName = usePathname();
  const [currentUrl, setCurrentUrl] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [closeNum, setCloseNum] = useState(5);

  useEffect(() => {
    setCurrentUrl(pathName);
  }, [pathName]);

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
        {navMenu.map((item) => (
          <Link
            key={`${item.name}-nav`}
            href={item.href}
            className={currentUrl !== item.href ? 'opacity-50 hover:opacity-100' : ''}
          >
            {item.name}
          </Link>
        ))}
      </nav>
      {/* {openModal && (
        <ModalPortal>
          <SurveyModal onClose={() => setOpenModal(false)} closeNum={closeNum} />
        </ModalPortal>
      )} */}
    </div>
  );
}
