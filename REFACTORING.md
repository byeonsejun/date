# 🛠 포트폴리오 리팩토링 플랜

> "서울, 너와 함께" 프로젝트를 채용용 포트폴리오 수준으로 끌어올리기 위한 실행 체크리스트입니다.
> 위에서 아래로 순서대로 진행하면 효과가 가장 큽니다.
> 완료한 항목은 `[ ]` → `[x]` 로 체크해 주세요.

---

## 📅 진행 현황 한눈에 보기

| 단계 | 묶음 | 항목 수 | 예상 소요 |
|------|------|---------|-----------|
| Phase 0 | 🚨 치명적 위생 작업 | 5 | 30분 ~ 1시간 |
| Phase 1 | 🔥 코드 품질 & 보안 | 9 | 1 ~ 2일 |
| Phase 2 | ⚠️ UX / 성능 / 디테일 | 10 | 1 ~ 2일 |
| Phase 3 | 📚 README 강화 & 도구 | 6 | 반나절 ~ 1일 |

---

## Phase 0 — 🚨 즉시 고쳐야 할 치명적 문제

> 채용 담당자가 코드를 열었을 때 **첫인상에서 감점**되는 부분.
> 가장 적은 시간으로 가장 큰 효과를 얻을 수 있는 구간입니다.

### [x] 1. `src/\butil/` 폴더명에서 백스페이스(`\b`) 제어문자 제거
- 현재 상태: 폴더명 첫 글자가 `0x08` (백스페이스). 모든 import가 `@/\butil/util` 로 되어 있음.
- 작업:
  - [x] `src/\butil/` → `src/utils/` 로 rename
  - [x] 영향받는 파일 import 경로 일괄 치환:
    - `src/components/LocationConsentModal.jsx`
    - `src/components/Weather.jsx`
    - `src/components/RecommendFood.jsx`
    - `src/components/GoogleMapContainer.jsx`
    - `src/components/SelectFilter.jsx`
    - `src/components/SelectShowMapType.jsx`
    - `src/components/AccessTime.jsx`
    - `src/service/weather.js`
    - 기타 grep 결과 전부
  - [x] `npm run dev` 정상 동작 확인
  - [x] `npm run build` 통과 확인

### [x] 2. 영문 오탈자 일괄 수정
- [x] `fuaterWeather` → `futureWeather` (`hooks/useWeather.jsx`)
- [x] `couseName` → `courseName` (`GoogleMapContainer.jsx`, `SelectShowMapType.jsx`)
- [x] `phne` → `phone` (다수 컴포넌트, 데이터 매퍼)
- [x] `getRealTimeWeather` 사용처 변수명 통일

### [x] 3. `package.json` 의 프로젝트 이름 변경
- [x] `"name": "new-brand"` → `"name": "seoul-date-platform"` (또는 다른 식별 가능한 이름)
- [x] `description`, `author`, `repository`, `license` 필드 추가

### [x] 4. `.env.local` 추적 여부 확인 + 키 점검
- [x] `git ls-files` 로 `.env.local` 이 커밋되어 있는지 확인
- [x] 만약 추적 중이면: (현재는 `.env.local` 미추적 상태라 해당 없음)
  - [x] `git rm --cached .env.local` (해당 없음)
  - [x] OpenWeather / Google Maps API 키 **즉시 회전(rotate)** (해당 없음)
- [x] `.env.local.example` 파일 추가 (키 이름만, 값은 비워서)

### [x] 5. `.DS_Store` 파일 일괄 제거
- [x] `.DS_Store` 검색 결과 현재 워크스페이스에 파일 없음 (삭제 작업 불필요)
- [x] `git rm --cached "**/.DS_Store"` (추적 중인 경우)
- [x] `.gitignore` 에 이미 있으나 재확인

---

## Phase 1 — 🔥 코드 품질 & 보안 (포트폴리오 임팩트 직결)

### [x] 6. Next.js 13.5.6 → 14 LTS 또는 15 업그레이드
- [x] `npx @next/codemod@canary upgrade latest` 실행 (동등 효과로 수동 업그레이드 수행)
- [x] React 18 → 19 호환성 확인 (현재 라이브러리 호환성 이슈로 React 18.3 유지)
- [x] App Router breaking change 대응 (특히 `cookies()`, `headers()` async 변경)
- [x] `next.config.js` → `next.config.mjs` 마이그레이션
- [x] README 의 "Next.js 13" 표기 업데이트

### [x] 7. JavaScript → TypeScript 마이그레이션 (점진적)
- [x] `tsconfig.json` 생성, `strict: true`
- [x] `jsconfig.json` 제거
- [x] 우선순위 순으로 변환:
  - [x] `src/stores/LocationStore.jsx` → `.ts` (전역 상태 타입이 가장 중요)
  - [x] `src/utils/util.js` → `.ts`
  - [x] `src/service/*.js` → `.ts`
  - [x] `src/hooks/*.jsx` → `.tsx`
  - [x] `src/components/*.jsx` → `.tsx`
  - [x] `src/app/api/**/route.js` → `.ts`
- [x] OpenWeather, Google Places 응답에 대한 타입 정의 (`src/types/`)
- [x] zod 도입해서 API 응답 런타임 검증 (선택)

### [x] 8. 테스트 코드 작성
- [x] vitest + @testing-library/react 설치
- [x] `npm run test` 스크립트 추가
- [x] 우선순위:
  - [x] `src/utils/util.ts` 의 순수 함수 (`getCurrentTime`, `get3Days`, `transLocation`, `getInteger`) → JS 기준 테스트 추가
  - [x] `src/stores/LocationStore.ts` 의 action (handleMarker, setShowWeather 등)
  - [x] `src/components/SelectShowMapType.tsx` 의 `getFilterInfoData` (비즈니스 로직 응축)
  - [x] `hooks/useWeather` 통합 테스트 (서비스 모듈 모킹 기반)

### [ ] 9. Zustand selector 패턴으로 리렌더 최적화
- [x] 전체 destructure 패턴을 selector 분리로 변경:
  - [x] `GoogleMapContainer.jsx`
  - [x] `Weather.jsx` → `useWeather` 훅 내부
  - [x] `RecommendPlace.jsx`
  - [x] `RecommendFood.jsx`
  - [x] `SelectFilter.jsx`
  - [x] `SelectShowMapType.jsx`
  - [x] `NavComponent.jsx`
- [x] `useShallow` 적용해야 하는 케이스 식별
- [ ] React DevTools Profiler 로 리렌더 횟수 Before/After 측정

### [x] 10. 단일 거대 store → 도메인 슬라이스 분리
- [x] `src/stores/useLocationStore.ts` (location, allDistrictInfo, myGeoInfo)
- [x] `src/stores/useWeatherStore.ts` (showWeather, myLocalWeather)
- [x] `src/stores/useMapStore.ts` (overMarker, selectedMarker, showPoint, selectedType)
- [x] `src/stores/useRecommendStore.ts` (recommendData, expansion)
- [x] `src/stores/useUiStore.ts` (toast, survey, modal)
- [x] 영향받는 컴포넌트 전부 import 교체

### [x] 11. 모듈 레벨 mutable state 제거
- [x] `RecommendFood.jsx` 의 `let recommendFlag = false;` 제거
  - [x] `useRef` 또는 store 상태로 이전
- [x] 다른 파일에도 비슷한 패턴 있는지 검색 (`^let `, `^var `)

### [x] 12. `console.warn` 모듈 레벨 패치 제거
- [x] `GoogleMapContainer.jsx` 의 console.warn 오버라이드 코드 제거
- [x] 대체 전략 결정: 경고 무시 로직 자체를 제거해 전역 부작용을 없애고, deprecated 경고는 개발 단계에서 그대로 확인하도록 유지
  - [x] `AdvancedMarkerElement` 로 마이그레이션 (정공법) → 후속 리팩토링 항목으로 유지
  - [x] 또는 README 트러블슈팅에 "왜 deprecated 경고를 의도적으로 무시하는지" 명시 → 해당 없음(무시 로직 제거)

### [x] 13. API 키 노출 문제 해결
- [x] 서버 전용 키 prefix 분리:
  - [x] `NEXT_PUBLIC_WEATHER_API_KEY` → `WEATHER_API_KEY` (서버 전용)
  - [x] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` 중 **서버 호출용** 키는 `GOOGLE_MAPS_SERVER_KEY` 로 분리
  - [x] 클라이언트 지도 SDK 키는 그대로 두되 Google Cloud Console 에서 **도메인 제한** 설정 (완료)
- [x] `src/app/api/weather/route.js` 수정
- [x] `src/app/api/location/route.js` 수정
- [x] `src/app/api/restaurants/route.js` 수정
- [x] `.env.local.example` 업데이트

### [x] 14. 식당 사진 base64 인코딩 제거 (성능 폭탄)
- [x] `src/app/api/restaurants/route.js` 에서 base64 변환 제거
- [x] Google Photo API URL 그대로 반환하도록 변경
- [x] `next.config.js` 의 `images.remotePatterns` 에 `maps.googleapis.com` 추가
- [x] `RecommendFood.jsx`, `GoogleMapContainer.jsx` 의 `<Image>` 가 정상 동작하는지 확인
- [x] Network 탭에서 응답 사이즈 Before/After 측정 (동등 방식으로 API payload 수치 측정 완료)

---

## Phase 2 — ⚠️ UX / 성능 / 디테일

### [x] 15. 모바일 반응형 (최소 태블릿 768px)
- [x] `common.css` 의 `body { min-width: 1280px; }` 제거 또는 분기
- [x] `MainSection` `flex` 가로 → 세로 전환 (md 미만)
- [x] `Aside` 가 모바일에서 위/아래로 펼쳐지도록 변경
- [x] `Header` 메뉴 햄버거 처리 (선택)
- [x] 주요 페이지를 iPhone 12 / iPad mini 뷰포트에서 캡처

### [x] 16. 접근성(a11y) 개선
- [x] `<li onClick>` 패턴에 keyboard handler 추가 또는 `<button>` 으로 교체:
  - [x] `Weather.jsx` 의 오늘/내일/모레/글피 탭
  - [x] `RecommendPlace.jsx` 의 추천/인기 토글
  - [x] `SelectShowMapType.jsx` 의 타입 필터
- [x] 의미 있는 `alt` 텍스트로 교체 (`alt="info img"` → `alt="{title} 대표 이미지"`)
- [x] 탭 UI 에 `role="tab"`, `aria-selected`, `aria-controls` 추가
- [x] 모달 포커스 트랩 구현 (`focus-trap-react` 또는 직접)
- [x] Lighthouse A11y 점수 측정 → README 에 Baseline 수치 반영

### [x] 17. `dangerouslySetInnerHTML` XSS 살균
- [x] `DOMPurify` 설치
- [x] `GoogleMapContainer.jsx` 의 `desc` 렌더링 부분에 적용
- [x] 다른 `dangerouslySetInnerHTML` 사용처 검색 후 동일 처리

### [x] 18. Footer 저작권 자동화
- [x] `Copyright ⓒ 2024 BYUNSEJUN.ALL` → `Copyright © {year} BYUN SEJUN. All Rights Reserved.`
- [x] `new Date().getFullYear()` 사용
- [x] 띄어쓰기/대소문자 정리

### [x] 19. API 라우트 GET/POST 정리
- [x] `/api/weather` → GET + 쿼리스트링 (`?type=...&lat=...&lon=...`)
- [x] `/api/location` → GET + 쿼리스트링
- [x] `/api/restaurants` → GET + 쿼리스트링
- [x] 클라이언트 fetch 코드도 함께 수정 (`service/weather.js`, `RecommendFood.jsx`)

### [x] 20. 정적 데이터 캐싱
- [x] `src/service/location.js` 의 `getAllLocationInfo` 에 캐싱 적용:
  - [x] 모듈 레벨 메모이제이션 (서버 인스턴스 단위)
  - [x] 또는 Next.js `unstable_cache` / `cache()` API (이번 단계에서는 모듈 메모이제이션 채택)
- [x] 데이터가 4MB 임을 README "성능 고민" 섹션에 명시

### [x] 21. 마커 클러스터링 도입
- [x] `@googlemaps/markerclusterer` 설치
- [x] `GoogleMapContainer.jsx` 의 `ShowPointMarkers`, `RecommendMarkers` 클러스터링 적용
- [x] 줌 레벨에 따라 클러스터 vs 개별 마커 전환
- [x] 트러블슈팅 4-3 (WebGL CONTEXT_LOST) 과 연결해서 README 보강

### [x] 22. 주석 처리된 죽은 코드 정리
- [x] `src/service/weather.js` 하단의 air_pollution 주석 코드 제거 (필요하면 별도 파일로 보관)
- [x] `src/service/location.js` 상단 import 주석 제거
- [x] `src/components/GoogleMapContainer.jsx` 의 `restriction` 옛 좌표 주석 제거
- [x] `eslint-disable-next-line` 주석 최소화 (가능하면 의존성 정확히 명시)

### [x] 23. 파일 확장자 일관성
- [x] `src/stores/LocationStore.jsx` → `.ts` (JSX 없음에도 .jsx 인 케이스)
- [x] `src/hooks/useWebSocket.js` → `.ts` (훅 미사용으로 파일 제거 완료)
- [x] `src/service/*.js` → `.ts` (Phase 1.7 과 통합)
- [x] App Router `route.js` → `route.ts`

### [x] 24. 미사용 코드/의존성 제거
- [x] `src/hooks/useWebSocket.js` 사용처 확인 → 미사용 시 삭제
- [x] `proj4` 사용처(`transLocation`) 추적 → 미사용 시 의존성 제거
- [x] `qrcode.react` 동적 import (InfoWindow 열릴 때만)
- [x] `npx depcheck` 또는 `npx knip` 으로 전체 점검

---

## Phase 3 — 📚 README 강화 & 도구

### [x] 25. 아키텍처 다이어그램 추가
- [x] README 상단 "프로젝트 소개" 다음에 Mermaid 다이어그램 삽입
  ```mermaid
  flowchart LR
    User -->|위치 동의| Browser
    Browser --> NextApp[Next.js App Router]
    NextApp -->|BFF| Route[/api/*]
    Route --> OpenWeather
    Route --> GoogleMaps
    NextApp --> Zustand
    Zustand --> Map[GoogleMap]
    Zustand --> Weather
    Zustand --> Recommend
  ```
- [x] 데이터 흐름도, 상태 변화 시퀀스 다이어그램 추가

### [x] 26. 측정 가능한 지표 추가 (트러블슈팅 강화)
- [x] Lighthouse 점수 측정 (Performance / A11y / Best Practices / SEO) Baseline 수집
- [x] Core Web Vitals (FCP, LCP, TBT, CLS) Baseline 수집
- [x] `@next/bundle-analyzer` 도입 → 번들 사이즈 Baseline 수집
- [x] DevTools Performance 로 마커 200개 기준 평균 FPS 측정
- [x] README 트러블슈팅 섹션의 추상적 문장을 **수치**로 교체

### [x] 27. ADR(Architecture Decision Records) 문서화
- [x] `docs/adr/` 폴더 생성
- [x] `0001-why-zustand-over-redux.md`
- [x] `0002-why-app-router-over-pages.md`
- [x] `0003-bff-pattern-for-api-keys.md`
- [x] `0004-why-no-clustering-initially-then-added.md`
- [x] README 에 ADR 인덱스 링크

### [x] 28. 데모 영상 / GIF 최적화
- [x] `docs/images/` 의 GIF 파일들 WebP 또는 mp4 로 변환
  - [x] `02-location-change.gif` (4.6MB)
  - [x] `05-restaurants-panel.gif` (4.0MB)
  - [x] `06-restaurants.gif` (3.3MB)
  - [x] `07-statistics-page.gif` (3.1MB)
- [x] 또는 YouTube unlisted 링크로 1분 데모 영상 제작 후 README 임베드 (이번 단계는 mp4 링크로 대체)

### [x] 29. 실행 환경 명시
- [x] `package.json` 에 `engines.node` 추가 (예: `>=18.17`)
- [x] `.nvmrc` 파일 추가
- [x] README 에 패키지 매니저 명시 (npm)
- [x] `engines.npm` 또는 `packageManager` 필드

### [x] 30. 코드 품질 도구 + CI
- [x] `.prettierrc` 추가 (기본 규칙)
- [x] `husky` + `lint-staged` 설치
  - [x] pre-commit: `prettier --write` + `eslint --fix`
- [x] `.github/workflows/ci.yml` 추가
  - [x] PR 마다 `npm run lint`, `npm run test`, `npm run build`
- [x] README 상단에 뱃지 추가:
  - [x] Build status
  - [x] Lighthouse score
  - [x] License
  - [x] Tech stack (Next.js, TypeScript)

---

## 🎯 권장 진행 순서 요약

1. **Phase 0 전부 (30분~1시간)** — 위생 작업, 효과 즉시
2. **#13, #14** (API 키 분리, base64 제거) — 보안/성능 어필
3. **#9, #10** (Zustand 최적화) — README 트러블슈팅 4-3 과 연결
4. **#7** (TypeScript) — 시간 가장 많이 들지만 효과 최대
5. **#26** (Lighthouse 측정 후 README 수치 반영) — 1시간이면 임팩트 큼
6. **#16** (접근성) — 점진적으로
7. **#6** (Next.js 업그레이드) — 마이그레이션 가이드 따라가면 됨
8. 나머지는 시간 여유에 따라

---

_Last updated: 2026-06-11_
