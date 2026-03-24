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

  return (
    <div>
      <nav className="flex items-center gap-2">
        {navMenu.map((item, index) => (
          <React.Fragment key={`${item.name}-nav`}>
            <Link
              href={item.href}
              className={currentUrl !== item.href ? 'opacity-50 hover:opacity-100 text-black' : 'text-black'}
            >
              {item.name}
            </Link>
            {index < navMenu.length - 1 && (
              <span className="opacity-60 select-none text-black" aria-hidden="true">
                /
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
}
