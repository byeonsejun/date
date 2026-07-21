'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { I18nextProvider } from 'react-i18next';

import i18n, { detectBrowserLanguage } from '@/i18n/config';
import useLanguageStore from '@/stores/useLanguageStore';

/**
 * 클라이언트 i18n 부트스트랩. 앱 전체를 감싸 어디서든 t()가 동작하게 하고, 마운트 후
 * localStorage 저장값(rehydrate) 또는 최초 방문 시 브라우저 언어를 반영한다.
 * (서버·첫 렌더는 DEFAULT_LANGUAGE라 하이드레이션 미스매치가 없고, 전환은 마운트 후에만 발생.)
 */
export default function I18nProvider({ children }: { children: ReactNode }) {
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    const hasStored = localStorage.getItem('language-store') !== null;
    void useLanguageStore.persist.rehydrate();
    if (!hasStored) {
      useLanguageStore.getState().setLanguage(detectBrowserLanguage());
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
