'use client';

import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/i18n/config';
import useLanguageStore from '@/stores/useLanguageStore';

const LABELS: Record<SupportedLanguage, string> = { ko: 'KO', en: 'EN' };

/**
 * KO/EN 언어 토글. RN의 세그먼트 스타일을 웹 헤더 디자인에 맞춰 재현한다.
 */
export default function LanguageToggle() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center rounded-lg border border-gray-300 bg-white p-0.5 text-xs"
    >
      {SUPPORTED_LANGUAGES.map((lng) => {
        const active = language === lng;
        return (
          <button
            key={lng}
            type="button"
            aria-pressed={active}
            onClick={() => setLanguage(lng)}
            className={`rounded-md px-2 py-1 font-bold transition-colors ${
              active ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {LABELS[lng]}
          </button>
        );
      })}
    </div>
  );
}
