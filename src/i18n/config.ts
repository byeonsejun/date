import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ko from './locales/ko.json';

/**
 * 지원 언어. 새 언어(ja, zh 등) 추가 시 locales/xx.json 생성 후 아래 resources와
 * SUPPORTED_LANGUAGES에 등록한다. (RN 저장소 portfolio-rn의 i18n 구조와 동일 스택)
 */
export const SUPPORTED_LANGUAGES = ['ko', 'en'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'ko';

/**
 * SSR 안전을 위해 항상 DEFAULT_LANGUAGE로 초기화한다. 서버 HTML과 클라이언트 첫 렌더가
 * 모두 'ko'로 일치하고, 저장된 언어/브라우저 언어로의 전환은 마운트 후(I18nProvider)에 일어난다.
 */
if (!i18next.isInitialized) {
  void i18next.use(initReactI18next).init({
    resources: {
      ko: { translation: ko },
      en: { translation: en },
    },
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: [...SUPPORTED_LANGUAGES],
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

export default i18next;
