'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import i18n, { DEFAULT_LANGUAGE, type SupportedLanguage } from '@/i18n/config';

type LanguageState = {
  language: SupportedLanguage;
  setLanguage: (value: SupportedLanguage) => void;
};

/**
 * 사용자가 선택한 언어. RN(portfolio-rn) languageStore의 persist 패턴을 웹에 맞춰 이식.
 * - 저장소는 localStorage. skipHydration이라 I18nProvider가 마운트 후 수동 rehydrate한다.
 * - 초기값은 SSR과 일치하도록 DEFAULT_LANGUAGE. 저장값/브라우저 언어 반영은 클라이언트에서.
 * - setLanguage/onRehydrate에서 i18next 인스턴스와 <html lang>을 함께 동기화한다.
 */
const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: DEFAULT_LANGUAGE,
      setLanguage: (value) => {
        void i18n.changeLanguage(value);
        if (typeof document !== 'undefined') document.documentElement.lang = value;
        set({ language: value });
      },
    }),
    {
      name: 'language-store',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        // 저장값이 있으면 그 언어로 동기화(없으면 I18nProvider가 브라우저 언어 감지를 처리).
        if (state?.language) {
          void i18n.changeLanguage(state.language);
          if (typeof document !== 'undefined') document.documentElement.lang = state.language;
        }
      },
    }
  )
);

export default useLanguageStore;
