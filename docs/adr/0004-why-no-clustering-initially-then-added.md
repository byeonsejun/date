# ADR 0004: Why Marker Clustering Was Added Later

- Status: Accepted
- Date: 2026-06-01

## Context

초기에는 기능 검증(MVP)에 집중해 개별 마커 렌더링으로 구현했습니다.  
운영/테스트 중 WebGL `CONTEXT_LOST`, 프레임 드랍 이슈가 관찰되었습니다.

## Decision

초기에는 클러스터링 없이 출시하고, 성능 병목이 확인된 뒤 `MarkerClustererF`를 도입합니다.

## Rationale

- 초기 개발 속도를 우선해 핵심 UX(위치/날씨/추천)를 먼저 검증
- 병목이 확인된 뒤 개선하면 변경 효과를 명확히 측정 가능
- 밀집 구간 마커를 묶어 렌더링 부담과 시각적 혼잡을 동시에 줄일 수 있음

## Consequences

- 장점: 성능 개선 효과가 사용자 체감과 지표 양쪽에서 확인됨
- 단점: 초기 구간에서 고밀도 영역 성능 저하를 일부 감수
- 보완: README 측정 지표/Lighthouse/CWV를 주기적으로 갱신
