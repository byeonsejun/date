# ADR 0006: Search Exposure With Korean-Only Metadata

- Status: Accepted
- Date: 2026-11-26

## Context

ADR 0005 는 "이 앱은 SEO를 목표로 하지 않는다"를 전제로 메타데이터를 한국어로 고정했습니다.
이제는 검색 결과와 링크 미리보기에 이 앱이 어떻게 보이는지도 챙기기로 했습니다.

운영(`https://date-eight-navy.vercel.app`)을 확인한 결과는 이랬습니다.

- Lighthouse SEO(13.4.1, 모바일)는 `/` 가 이미 100이었습니다. 점수가 보지 않는 부분이 비어 있었습니다.
- `/robots.txt` · `/sitemap.xml` 은 404였습니다.
- canonical, 공유 카드(`og:image`), 구조화 데이터가 없었습니다.
- 메타 설명은 `서울에서 즐기는 데이트, 식사 그 모든 계획을 한 번에!` 였는데, 화면 어디에도 없는 문장이었습니다.
- `/statistics` 는 `redirect('/')` 만 하는 페이지입니다(운영도 307 → `/`).

## Decision

ADR 0005 의 "SEO를 목표로 하지 않는다"는 전제만 바꾸고, 결정 자체(메타 한국어 고정 · 클라이언트 i18n)는 유지합니다.

- 메타 · 구조화 데이터는 한국어로 고정합니다. 언어별 URL을 만들지 않고 hreflang 도 쓰지 않습니다.
- 노출 대상은 `/` 하나입니다. `/statistics` 는 redirect 라 사이트맵에 넣지 않습니다.
- 정본 주소는 상수 `SITE_URL` 하나이고, 미리보기 배포에서도 canonical 은 운영을 가리킵니다.
- 미리보기 배포는 통째로 막습니다(`robots: { index: false, follow: false }` 와 robots.txt `Disallow: /`). 판정은 `VERCEL_TARGET_ENV === 'preview'` 입니다. 이 Vercel 프로젝트에는 오래전에 등록된 사용자 변수 `VERCEL_ENV` 가 모든 환경에 걸려 있어 시스템 값을 가립니다. 첫 미리보기에서 `VERCEL_ENV` 로 판정했더니 `Disallow: /api/` 만 나오고 noindex 도 붙지 않았습니다. `VERCEL_ENV` 와 OR 로 묶으면 운영을 noindex 할 위험이 생기고, 브랜치명으로 대신하면 로컬 빌드에서 값이 없어 오판할 수 있어 `VERCEL_TARGET_ENV` 하나만 봅니다.
- 운영 robots.txt 는 `/api/` 만 막습니다. AI 검색 로봇은 따로 막지 않고, 같은 내용을 `llms.txt` 로도 둡니다.
- 구조화 데이터(WebApplication JSON-LD)와 메타 설명은 화면에 있는 문구와, 화면의 언어 토글에 있는 값(`ko`, `en`, `ja`, `zh`)으로 만듭니다.
- JSON-LD 는 서버 컴포넌트가 HTML 에 직접 넣습니다. 새 클라이언트 JS 는 없습니다.

## Rationale

- hreflang 을 제대로 하려면 언어마다 URL이 있어야 하는데, 지금 구조에서는 언어가 URL이 아니라 화면 안에서 바뀝니다. 라우팅을 바꾸는 일이라 이번 범위가 아닙니다. 어설프게 흉내 내면 잘못된 신호만 늘어납니다.
- 이미 100점인 점수를 올리는 작업이 아니라, 점수가 보지 않는 빈틈(없던 robots · 사이트맵, 공유 카드, 구조화 데이터, 화면에 없던 설명)을 채우는 작업입니다.
- 검색 결과에 보이는 설명은 실제 화면과 같아야 합니다. 그래서 설명은 한국어 화면에 실제로 나오는 문구(위치 동의 안내, `오늘 추천하는 데이트 장소입니다.`, `추천식당 리스트 Top 5`)를 이어 붙여 만들었고, 문구 사이를 잇는 말만 덧붙였습니다. `applicationCategory` · `operatingSystem` 은 화면에 있는 값이 아니라 앱을 분류하는 값입니다.
- 미리보기가 색인되면 같은 내용이 여러 주소로 퍼집니다. 미리보기는 전부 막고 정본은 운영 하나로 둡니다.

## Consequences

- 장점: 사이트맵 · robots · 공유 카드 · canonical · 구조화 데이터가 갖춰지고, 라우팅과 i18n 구조는 그대로입니다.
- 단점: 영어 · 일본어 · 중국어로 검색하는 사람에게도 메타는 한국어로 보입니다. 서울 한정 서비스라 감수합니다.
- 단점: 구글 리치 결과 테스트는 자동화할 수 없어 돌리지 않았습니다. schema.org 검증기로만 확인했습니다.
- 미리보기 확인(2026-11-26): `VERCEL_TARGET_ENV` 로 바꾼 뒤 새 미리보기에서 `/robots.txt` 는 `User-Agent: *` 와 `Disallow: /` 만 나오고 Sitemap 줄이 없었습니다. 홈 HTML 에는 `<meta name="robots" content="noindex, nofollow"/>` 가 있었고 canonical 은 운영 주소를 가리켰습니다.
- Vercel 도 미리보기 응답에 `x-robots-tag: noindex` 헤더를 따로 보냅니다(`vercel curl -sI` 로 확인). 이 앱의 설정과 별개로 한 겹 더 막혀 있는 셈입니다.
- 주의: 사용자 환경변수로 `VERCEL_TARGET_ENV` 를 등록하면 `VERCEL_ENV` 처럼 시스템 값을 다시 가립니다. 이 이름은 프로젝트 변수로 만들지 않습니다.
- schema.org 검증은 `<head>` 와 JSON-LD 만 잘라 넣은 문서로 돌렸습니다. 페이지 전체(약 4.6MB)가 검증기 크기 제한을 넘기 때문입니다.
- 재론 방지: 검색 노출을 넣었다고 ADR 0005 가 뒤집힌 것은 아닙니다. 다국어 검색 노출이 필요해지면 그때 URL 로케일 라우팅(next-intl)과 함께 다시 정합니다.
