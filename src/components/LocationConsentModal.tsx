// @ts-nocheck
'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createStorageItem, findStorageItem } from '@/utils/util';
import useLocationStore from '@/stores/useLocationStore';
import ModalPortal from './ui/ModalPortal';
import FocusTrap from 'focus-trap-react';

const STORAGE_KEY = 'locationConsentAsked';

export default function LocationConsentModal() {
  const { t } = useTranslation();
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
      <FocusTrap>
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div
            className="bg-white rounded-lg shadow-xl max-w-sm mx-4 p-6 flex flex-col gap-4"
            role="dialog"
            aria-modal="true"
            aria-label={t('location.consentDialogLabel')}
          >
            <p className="text-gray-900 text-center font-normal break-keep whitespace-pre-line">
              {t('location.consentMessage')}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDecline}
                className="flex-1 py-2.5 px-4 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 font-normal"
              >
                {t('location.decline')}
              </button>
              <button
                type="button"
                onClick={handleAgree}
                className="flex-1 py-2.5 px-4 rounded bg-[#f986bd] text-black hover:opacity-90 font-normal"
              >
                {t('location.agree')}
              </button>
            </div>
          </div>
        </div>
      </FocusTrap>
    </ModalPortal>
  );
}
