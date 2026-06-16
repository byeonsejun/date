# ADR 0001: Why Zustand Over Redux

- Status: Accepted
- Date: 2026-06-01

## Context

이 프로젝트는 지도/마커/위치/날씨/추천 데이터가 빠르게 변하고, 다수 컴포넌트가 같은 상태를 공유합니다.  
초기 단계에서 Redux Toolkit을 도입할 수도 있었지만, 보일러플레이트와 학습/설정 비용이 상대적으로 큽니다.

## Decision

전역 상태 관리는 Zustand를 채택합니다.

## Rationale

- 지도 중심 인터랙션에서 필요한 얕은 상태 공유에 적합
- slice 없이도 빠르게 시작 가능해 MVP 속도 확보
- selector 기반 최적화로 불필요 렌더링 최소화 가능

## Consequences

- 장점: 구현 속도와 유지보수성이 좋아짐
- 단점: 대형 엔터프라이즈 표준(엄격한 액션/리듀서 규약) 대비 구조 강제력이 약함
- 보완: 도메인별 스토어 분리와 selector 규칙을 점진 도입
