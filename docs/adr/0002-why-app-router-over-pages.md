# ADR 0002: Why App Router Over Pages Router

- Status: Accepted
- Date: 2026-06-01

## Context

프로젝트는 서버/클라이언트 경계를 명확히 분리하고, API 라우트와 UI 구성을 일관되게 관리할 필요가 있습니다.

## Decision

Next.js App Router 기반으로 구현합니다.

## Rationale

- Server Component와 Client Component를 명시적으로 분리 가능
- `app/api/*` Route Handler로 BFF 패턴을 자연스럽게 구성 가능
- 레이아웃/중첩 라우팅 구조가 명확해 확장에 유리

## Consequences

- 장점: 데이터 패칭 책임 분리가 쉬워지고 아키텍처 가독성 향상
- 단점: Pages Router 경험자에게는 초기 적응 비용 존재
- 보완: README에 아키텍처/데이터 흐름 다이어그램 문서화
