'use client';

import { LANGUAGES } from '@/i18n/config';
import useLanguageStore from '@/stores/useLanguageStore';

/**
 * KO/EN/JA 언어 토글. RN의 세그먼트 스타일을 웹 헤더 디자인에 맞춰 재현한다.
 * 세그먼트는 i18n 단일 소스 `LANGUAGES`를 map으로 렌더한다(언어 추가 시 여기 수정 불필요).
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
      {LANGUAGES.map(({ code, label }) => {
        const active = language === code;
        return (
          <button
            key={code}
            type="button"
            aria-pressed={active}
            onClick={() => setLanguage(code)}
            className={`rounded-md px-2 py-1 font-bold transition-colors ${
              active ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
