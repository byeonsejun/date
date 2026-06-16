# ADR 0003: BFF Pattern for API Keys

- Status: Accepted
- Date: 2026-06-01

## Context

외부 API(OpenWeather, Google APIs)를 클라이언트에서 직접 호출하면 키 노출/호출 정책 관리가 어려워집니다.

## Decision

클라이언트는 외부 API를 직접 호출하지 않고, `/api/*` Route Handler(BFF)를 통해 호출합니다.

## Rationale

- 서버 전용 환경변수(`WEATHER_API_KEY`, `GOOGLE_MAPS_SERVER_KEY`)로 키 관리 가능
- 응답 포맷 정규화/오류 처리/캐시 정책을 서버에서 통합 가능
- 클라이언트는 도메인 로직 중심으로 단순화 가능

## Consequences

- 장점: 보안/운영 관점에서 키 관리와 장애 대응이 쉬워짐
- 단점: API 레이어 유지보수 비용이 소폭 증가
- 보완: Route Handler 단위로 책임을 분리하고, 측정 지표를 README에 지속 반영
