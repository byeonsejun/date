'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { I18nextProvider } from 'react-i18next';

import i18n from '@/i18n/config';
import useLanguageStore from '@/stores/useLanguageStore';

/**
 * 클라이언트 i18n 부트스트랩. 앱 전체를 감싸 어디서든 t()가 동작하게 하고, 마운트 후
 * localStorage에 저장된 이전 선택 언어가 있으면 rehydrate로 반영한다.
 * 최초 방문(저장값 없음)은 브라우저 언어를 감지하지 않고 기본 'ko'로 시작한다(ADR 0005).
 * (서버·첫 렌더도 'ko'라 하이드레이션 미스매치가 없고, 전환은 마운트 후에만 발생.)
 */
export default function I18nProvider({ children }: { children: ReactNode }) {
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    void useLanguageStore.persist.rehydrate();
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
