# SPEC

이 문서는 현재 레포에 구축되어 있는 **인프라 · 배포 구성**의 사양을 기술한다.
애플리케이션 기능 사양(웹 페이지/도메인 로직)은 별도로 작성하며, 본 문서는
"어디에 무엇이 떠 있고, 어떤 환경변수와 URL이 어디에 등록되어 있는지"를 단일 출처로 정리한다.

---

## 1. 소스 코드

| 항목 | 값 |
| --- | --- |
| Git Host | GitHub |
| Repository | [`cds4242/gaggaun`](https://github.com/cds4242/gaggaun) |
| Visibility | public |
| Default branch | `main` |
| Next.js 앱 위치 | `web/` (모노레포 형태, 루트는 일반 워크스페이스) |

### .gitignore 정책

루트 `.gitignore`는 `node_modules/`, 빌드 산출물, 로그, `.env*`, 에디터/OS 파일,
Playwright 결과물(`.playwright-mcp/`, `playwright-report/`, `test-results/`)을 제외한다.

`web/` 하위는 Next.js의 자체 `.gitignore`가 추가로 `.env*`, `/node_modules`,
`.next/` 등을 제외한다. **시크릿이 들어있는 `.env.local` 류는 절대 커밋되지 않는다.**

---

## 2. 배포 (Vercel)

| 항목 | 값 |
| --- | --- |
| Vercel Team | `dsjh-projects` (Hobby) |
| Project | `gaggaun` |
| Source | GitHub `cds4242/gaggaun`, branch `main` |
| Root Directory | `web` |
| Framework Preset | Next.js (자동 감지) |
| Production URL | https://gaggaun.vercel.app |
| Preview URL 패턴 | `https://gaggaun-<hash>-dsjh-projects.vercel.app` |
| 자동 배포 | `main` 푸시 → Production, 그 외 브랜치 → Preview |

### 환경 변수 (Production + Preview)

| Key | 용도 | 노출 범위 |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 엔드포인트 | 클라이언트 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 공개(publishable) 키 | 클라이언트 |
| `SUPABASE_SERVICE_ROLE_KEY` | 서비스 롤 키 — 서버에서만 사용 | 서버 전용 |

값은 Vercel 대시보드에 보관하며, 본 문서에는 적지 않는다.
로컬 개발은 `web/.env.local`에 같은 키를 설정한다 (`web/.env.local.example` 참고).

---

## 3. 백엔드 / 인증 (Supabase)

| 항목 | 값 |
| --- | --- |
| Project | `cds4242's Project` |
| Project Ref | `paugjrpggyxmhurzurhm` |
| Region | (Supabase 대시보드 참조) |
| Plan | Free |

### Authentication → URL Configuration

| 항목 | 값 |
| --- | --- |
| Site URL | `https://gaggaun.vercel.app` |
| Redirect URLs | `https://gaggaun.vercel.app/**` |
|  | `https://gaggaun-*-dsjh-projects.vercel.app/**` (Preview 와일드카드) |
|  | `http://localhost:3000/**` (로컬 개발) |

- Site URL은 이메일 템플릿 및 fallback redirect에 사용된다.
- Redirect URLs는 OAuth/Magic Link 콜백 허용 목록이며, `**` 와일드카드로
  하위 경로 전부(`/auth/callback` 등)를 매칭한다.

---

## 4. 환경 매트릭스

| 환경 | URL | Supabase Site URL 매칭 | Auth 콜백 가능 |
| --- | --- | --- | --- |
| Production | https://gaggaun.vercel.app | ✓ Site URL | ✓ |
| Preview | https://gaggaun-*-dsjh-projects.vercel.app | ✓ Redirect URL 와일드카드 | ✓ |
| 로컬 | http://localhost:3000 | ✓ Redirect URL | ✓ |

---

## 5. 변경 시 체크리스트

이 사양을 변경할 때 잊지 말 것:

- **Vercel 프로젝트 이름/도메인을 바꿨다면** → Supabase Auth URL Configuration의
  Site URL과 Redirect URLs를 새 도메인으로 갱신.
- **새 Vercel 환경을 추가했다면** → 해당 환경의 콜백 URL을 Supabase Redirect URLs에 추가.
- **Supabase 서비스 롤 키를 rotate했다면** → Vercel 환경 변수 `SUPABASE_SERVICE_ROLE_KEY`도 즉시 갱신.
- **새 환경 변수를 추가했다면** → `web/.env.local.example`과 본 문서 §2 표에도 추가.

---

## 6. 사이트 구조 (라우트)

| 그룹 | 경로 | 비고 |
| --- | --- | --- |
| 홈 | `/` | 히어로, 빠른 진입, 예배 안내, 인사말, 최근 설교, 공지, 주간 일정, 갤러리, 오시는 길 종합 |
| 교회소개 | `/about`, `/about/greeting`, `/about/history`, `/about/location`, `/about/vision` | 비전·사명은 3개 카드(`.idx-grid`) |
| 예배 | `/worship`, `/worship/sunday`, `/worship/wednesday`, `/worship/friday`, `/worship/dawn` | |
| 사역 | `/ministry`, `/ministry/children`, `/ministry/mission`, `/ministry/praise`, `/ministry/youth` | |
| 공동체 | `/community`, `/community/cell`, `/community/men`, `/community/women` | |
| 미디어 | `/media`, `/media/sermon`, `/media/gallery` | |
| 공지 | `/notices`, `/notices/[id]` | Supabase `notices` 테이블에서 로드, 데이터 없으면 더미 6건 표시 |
| 게시판 | `/board`, `/board/[id]`, `/board/new` | |
| 새가족 | `/new-member`, `/new-member/thanks` | |
| 인증 | `/login`, `/logout` | bare 레이아웃 (헤더/푸터 미표시) |
| 관리 | `/admin`, `/admin/board`, `/admin/new-members`, `/admin/notices`, `/admin/notices/new`, `/admin/notices/[id]/edit` | `isAdminEmail`로 인증된 사용자에게만 진입 허용 (예정), bare 레이아웃 |

레이아웃 결정은 `web/src/components/site-shell.tsx`에서 `pathname`이
`/admin` 또는 `/login`으로 시작하면 헤더·푸터·유틸바를 숨긴다.

---

## 7. UI / 반응형 사양

### 7.1 브레이크포인트

| 너비 | 의미 |
| --- | --- |
| ≤ 1080px | 메인 메뉴(`.mainmenu`) 숨기고 햄버거(`.burger`)와 모바일 드로어(`.mobile-menu`) 사용 |
| ≤ 980px | `.idx-grid`를 2열로 |
| ≤ 860px | 히어로를 세로형으로 전환, 하단 strip은 2열 |
| ≤ 820px | 유틸 바의 성경 구절(`.util .left .verse`) 숨김 |
| ≤ 720px | `.wrap` 좌우 패딩을 32px → 20px |
| ≤ 560px | 유틸 바: 폰트 12px, 패딩 축소, 우측 구분자(`|`) 숨김, gap 0 |
| ≤ 520px | `.idx-grid`를 1열, 히어로 strip 1열, `.btn-primary` 폰트/패딩 축소, 모바일 드로어 좌우 패딩 14px → 20px |

### 7.2 가로 스크롤 정책

- **모든 페이지는 375px 폭에서 가로 스크롤이 발생하지 않아야 한다.**
- 새 페이지를 추가하거나 그리드/표를 변경할 때는 375px 뷰에서
  `documentElement.scrollWidth ≤ innerWidth`를 확인한다.
- `gridTemplateColumns`처럼 모바일 동작을 막을 수 있는 인라인 스타일은
  쓰지 않는다. 그리드 컬럼 수는 CSS 미디어쿼리에서만 정한다.
- 가로 너비가 가변인 행(예: 유틸 바)은 `min-width:0`, 자식 텍스트는
  `white-space:nowrap; overflow:hidden; text-overflow:ellipsis`를 기본으로 한다.

### 7.3 폰트/타이포

- 본문 한글: `Noto Serif KR` (`--serif`).
- 영문 디스플레이/eyebrow: `Cormorant Garamond` (`--display`).
- UI/메뉴 보조: `Noto Sans KR` (`--sans`).
- `word-break: keep-all; overflow-wrap: break-word` 전역 적용.
- 본문 베이스: 17px / line-height 1.7.

### 7.4 헤더 동작

- 데스크톱: 메인 메뉴 hover 시 `.submenu`가 페이드인.
- 모바일(≤1080px): 햄거버 토글로 `.mobile-menu.open` 표시. 링크 클릭 시
  `setOpen(false)`로 자동 닫힘.

---

## 8. 데이터 의존성 (현재)

| 페이지 | Supabase 테이블 | 폴백 |
| --- | --- | --- |
| `/` | `notices` (id, title, created_at, pinned) | 폴백 더미 6건 |
| `/notices`, `/notices/[id]` | `notices` | 비어 있으면 "등록된 공지가 없습니다." |
| `/board`, `/board/[id]`, `/board/new` | `board` (예정/현행 구현 참조) | 비어 있으면 "아직 등록된 게시글이 없습니다." |
| `/admin/notices` | `notices` (CRUD) | — |
| `/admin/new-members` | `new_members` | — |
| 인증 | Supabase Auth | `isAdminEmail`로 관리자 판별 |

`createClient()` 호출이 실패하면 홈은 try/catch로 빈 배열을 반환하고
폴백 데이터로 렌더링한다 (`web/src/app/page.tsx`).
