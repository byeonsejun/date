import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import zh from './locales/zh.json';

/**
 * 지원 언어 단일 소스(코드 + 토글 표기 라벨). 새 언어(zh 등) 추가 시 이 배열에 한 항목만
 * 추가하면 SUPPORTED_LANGUAGES·SupportedLanguage 타입·LanguageToggle이 모두 자동 반영된다.
 * (별도로 locales/xx.json 생성 + 아래 resources 등록은 필요. RN portfolio-rn과 동일 스택)
 */
export const LANGUAGES = [
  { code: 'ko', label: 'KO' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: 'JA' },
  { code: 'zh', label: 'ZH' },
] as const;

export type SupportedLanguage = (typeof LANGUAGES)[number]['code'];

export const SUPPORTED_LANGUAGES = LANGUAGES.map((l) => l.code) as readonly SupportedLanguage[];

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
      ja: { translation: ja },
      zh: { translation: zh },
    },
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: [...SUPPORTED_LANGUAGES],
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

export default i18next;
