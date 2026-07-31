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
  const language = useLanguageStore((state) => state.language);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    void useLanguageStore.persist.rehydrate();
  }, []);

  // 선택 언어를 <html lang>에 반영한다. 일본어일 때 common.css가 이 속성으로
  // 본문 폰트를 Noto Sans JP로 전환한다. (서버 초기값은 'ko', 전환은 마운트 후에만)
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
