# ADR 0005: Client-Side i18n — Korean Default and Korean-Only Metadata

- Status: Accepted
- Date: 2026-07-21

## Context

RN 앱(portfolio-rn)에서 완성한 한/영 i18n을 웹에 이식합니다. 웹은 클라이언트 중심 구조(zustand + swr)이고
자체 BFF를 겸하는 단일 배포라, URL 로케일 라우팅(next-intl) 대신 RN과 동일한 클라이언트 i18n
(react-i18next + zustand persist)을 선택했습니다. 이 방식에서는 서버가 사용자의 선택 언어를 알 수 없습니다
(URL에 로케일이 없고, 쿠키 기반 협상은 next-intl 스코프로 넘어감).

## Decision

`app/layout.tsx`의 `metadata`(탭 제목·OG description)는 **한국어로 고정**합니다. 언어 전환은 마운트 후
클라이언트에서만 일어나며, 화면 내 UI 텍스트만 번역됩니다.

또한 **최초 방문(localStorage에 저장값 없음)은 기본 'ko'로 시작**합니다. `navigator.language` 기반
브라우저 언어 감지는 사용하지 않습니다(초기 구현엔 있었으나 제거). 사용자가 토글로 언어를 바꾸면
그 선택만 persist로 기억합니다 — "기본 KO, 바꾸면 기억".

## Rationale

- 클라이언트 i18n에서는 서버 렌더 시점에 사용자 언어를 알 수 없어 metadata를 동적 번역할 수 없음
- 이 앱은 SEO를 목표로 하지 않는 개인 포트폴리오라 탭 제목 다국어의 이득이 적음
- 서버 컴포넌트 이점(Header 등)을 유지하기 위해 번역이 필요한 조각만 클라이언트로 분리(`AppTitle`)
- 브라우저 언어 자동 감지는 첫 로드 후 화면이 갑자기 영어로 바뀌는 UX가 어색하고, 주 사용자층이
  한국어라 기본 'ko'가 자연스러움. 언어 선택권은 명시적 토글로 제공

## Consequences

- 장점: RN과 동일 스택 재사용, 라우팅/미들웨어 재구성 없이 이식, 하이드레이션 안전(서버·첫 렌더는 항상 'ko')
- 단점: 브라우저 탭 제목/OG는 언어와 무관하게 한국어. `<html lang>`은 클라이언트에서 전환됨
- 재론 방지: "왜 탭 제목만 한국어인가?"는 위 결정에 따른 의도된 동작. SEO 다국어가 필요해지면 next-intl로 전환 검토
