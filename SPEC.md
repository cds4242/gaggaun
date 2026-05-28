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
| 게시판 인덱스 | `/board` | 활성 보드 카드 목록 (활성 보드가 1개면 그 보드로 자동 리다이렉트) |
| 게시판 보드 | `/board/[slug]`, `/board/[slug]/new`, `/board/[slug]/[id]`, `/board/[slug]/[id]/edit` | slug는 `boards.slug` (예: `free`, `qna`, `prayer`) |
| 새가족 | `/new-member`, `/new-member/thanks` | |
| 인증 | `/login`, `/logout` | bare 레이아웃 (헤더/푸터 미표시) |
| 관리 | `/admin`, `/admin/boards`, `/admin/boards/new`, `/admin/boards/[id]/edit`, `/admin/board`, `/admin/new-members`, `/admin/notices`, `/admin/notices/new`, `/admin/notices/[id]/edit` | `isAdminEmail`로 인증된 사용자에게만 진입 허용 (예정), bare 레이아웃. `/admin/boards`는 게시판 마스터 CRUD, `/admin/board`는 게시글 관리(보드 필터 지원). |

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

## 7.5 인증 / 로그아웃 흐름

### 권한 체크

- `requireAdmin(pathForRedirect)` (`web/src/lib/auth.ts`):
  - `supabase.auth.getUser()` → 실패 또는 이메일 없음 → `/login?next=...`
  - `admins` 테이블 SELECT (이메일 lowercase 매칭):
    - 쿼리 에러(RLS/네트워크 등) → `/?msg=admin-check-failed`
    - 결과 없음 → `/?msg=not-admin`
    - 결과 있음 → `{ email }` 반환
- Admin 페이지 진입 시 자동으로 "로그아웃됨"처럼 보이지 않도록, 에러 경로와
  권한 없음 경로를 분리해 안내한다.

### 로그아웃

- 일반 사용자는 `<LogoutLink />` 컴포넌트(`web/src/components/logout-link.tsx`)를 클릭.
- 클릭 시 `window.confirm("로그아웃하시겠습니까?")` 표시.
- 동의 시 `logoutAction()` (`web/src/app/logout/actions.ts`, `"use server"`)
  → `supabase.auth.signOut()` → `redirect("/?msg=logout")`.
- `useTransition` pending 동안 버튼 텍스트는 "로그아웃 중...".
- 기존 `GET /logout` route는 호환성 유지로 남아있지만, UI 진입점은 모두 LogoutLink 사용.

### Flash 메시지

- 신호: URL 쿼리 `?msg=...`.
- 핸들러: `<FlashMessage />` (`web/src/components/flash-message.tsx`, 클라이언트).
  `site-shell.tsx`에서 Suspense로 감싸 모든 레이아웃에 포함.
- 메시지 매핑:
  | key | 톤 | 문구 |
  | --- | --- | --- |
  | `logout` | ok (navy) | 로그아웃되었습니다. |
  | `not-admin` | warn (burgundy) | 관리자 권한이 없습니다. |
  | `admin-check-failed` | warn (burgundy) | 관리자 확인 중 오류가 발생했습니다. |
- 동작: 상단 중앙에서 페이드+slide-down, 2.5초 후 사라지고 URL에서 `msg` 파라미터를 제거.

### 로그인 트랜지션

- `LoginForm`(`web/src/app/login/login-form.tsx`):
  - 마운트 시 페이드인.
  - 성공 시 버튼이 "환영합니다 ✓"로 바뀌고 300ms 뒤 `router.push(next)`.
  - 로딩 중 입력 필드 disabled.

---

## 7.6 페이지 콘텐츠 / 캐시 정책

### 콘텐츠 표준 구조 (예배·사역·공동체·미디어)

리프 페이지(`/worship/sunday`, `/ministry/youth`, `/community/cell`, `/media/sermon` 등)는
모두 다음 구조를 따른다:

1. `<PageHeader>` — title / eyebrow / subtitle
2. `prose-box` — eyebrow + h2 + deco + 안내 본문 2 문단
3. `simple-table` — 시간 / 모임 / 부서 등 데이터 표 (4열 grid, 모바일에서 1열 스택)
4. 하단 안내 1줄(연락처·장소·주의사항 등)

콘텐츠는 운양동 · 한강신도시 컨텍스트를 반영하고, 과장된 표현보다
구체적인 시간/장소/대상을 명시한다.

### 캐시 / revalidate

| 라우트 | revalidate | 비고 |
| --- | --- | --- |
| `/` | 60 | 홈 — 공지 6건 폴백 포함 |
| `/notices` | 60 | revalidatePath로 작성·수정·삭제 후 즉시 갱신 |
| `/notices/[id]` | 0 | 매 요청 fetch (read by id, 1회만) |
| `/board` | 60 | 보드 인덱스 — 활성 보드 카드 |
| `/board/[slug]` | 30 | revalidatePath로 작성·삭제 후 즉시 갱신 |
| `/board/[slug]/[id]` | 동적 | 조회수 증가 + 인접 글 fetch |
| 그 외 정적 페이지 | 빌드 시점 | 정적 콘텐츠만 |

## 7.7 게시판 / 새가족 폼 정책

### 게시판 멀티 보드 모델
- `boards` 테이블이 게시판 마스터. 각 보드는 `slug` (URL 식별자), `name`, `description`,
  `category` (NAV 상위 메뉴 라벨), `write_permission` (anyone/member/admin),
  `comment_enabled`, `secret_enabled`, `image_upload_enabled`, `sort_order`, `is_active`를 갖는다.
- `board_posts.board_id`는 `boards(id)` FK (NOT NULL, ON DELETE CASCADE).
- 1차 도입에서는 `write_permission='anyone'`과 `comment_enabled`, `image_upload_enabled`만 실제 동작.
  `member`/`admin` 권한과 `secret_enabled` 비밀글은 다음 PR에서 적용 예정.
- 활성 보드(`is_active=true`)만 `/board` 인덱스에 표시되고 sitemap에도 들어간다.

### 보드 → 상단 메뉴 자동 주입
- `boards.category`가 `TOP_CATEGORIES` (`lib/nav.ts` — 교회소개/예배안내/설교말씀/
  교회소식/공동체) 중 하나와 **정확히 일치**하면 해당 드롭다운 children 끝에
  `{ label: board.name, href: '/board/[slug]' }`로 자동 추가된다.
- 일치하지 않거나 비어있으면 메뉴에 노출되지 않고 URL로만 접근 가능.
- 구현: `lib/boards-nav.ts:buildNav()`가 server에서 활성 보드를 합쳐 `NavItem[]`을 만들고,
  `app/layout.tsx`가 SiteShell → SiteHeader에 prop으로 전달.
- 캐시: layout `revalidate = 60`. 보드 CRUD server action은 `revalidatePath('/', 'layout')`로
  즉시 갱신.
- `/admin/boards` 폼은 category 입력을 셀렉터로 제공해 오타로 메뉴에서 사라지는 사고를 막는다.

### 게시판 인덱스 (`/board`)
- 활성 보드들을 카드형 그리드로 표시. 카드 한 장당 name·category·description.
- 활성 보드가 1개뿐이면 `/board/[slug]`로 즉시 redirect (인덱스 한 단계 스킵).

### 게시판 글쓰기 (`/board/[slug]/new`)
- 작성자 최대 20자, 제목 최대 120자, 본문 최대 5000자.
- 본문 라벨 우측에 실시간 글자수 표시.
- 이미지 첨부: 보드의 `image_upload_enabled`가 true일 때만 노출.
  Supabase Storage `board-images` 버킷에 업로드, public URL 저장.
- 비활성 보드(`is_active=false`)는 글쓰기 거부.

### 게시판 상세 (`/board/[slug]/[id]`)
- 진입 시 `incrementBoardView`를 fire-and-forget로 호출(응답 지연 없음).
- post.board_id가 현재 slug와 다르면 정상 slug 경로로 redirect (호환성).
- 본문 하단에 이전/다음 글 네비게이션 (같은 보드 안에서 created_at 기준 인접 글).
- 댓글은 보드의 `comment_enabled`가 true일 때만 노출.
- 하단 액션바: 목록 / 글쓰기 / 수정 / (관리자만) 삭제.

### 새가족 등록 (`/new-member`)
- 필수: 이름, 연락처.
- server action(`registerNewMember`)에서 전화번호 정규화:
  - 11자리 숫자 → `010-1234-5678`
  - 10자리 숫자 → `010-123-4567`
  - 그 외 → 원본 trim
- 등록 성공 시 `/new-member/thanks`로 redirect.
- thanks 페이지: 홈으로 / 예배 시간 보기 / 오시는 길 3개 출구.

---

## 7.8 목록 페이지 — 페이지네이션 / 검색

### 공통 규칙

- 페이지당 20건(`PAGE_SIZE = 20`).
- URL 쿼리: `?page=N&q=검색어`. 검색어 입력 시 `page` 파라미터는 자동 제거.
- 페이지네이션 컴포넌트(`components/pagination.tsx`):
  첫·이전·5개 윈도우·다음·마지막. query string은 그대로 보존.
- 검색 컴포넌트(`components/search-bar.tsx`):
  URL `?q=`와 양방향 동기화. 글로벌 `/` 키로 입력창에 포커스.

### 적용 페이지

| 페이지 | 검색 컬럼 (ilike) |
| --- | --- |
| `/notices`, `/admin/notices` | title |
| `/board/[slug]`, `/admin/board`(어드민은 author_name까지) | title (어드민은 title \| author_name) — 어드민은 추가로 보드 셀렉터로 필터링 |
| `/admin/new-members` | name \| phone \| invited_by |

### 빈 상태

- 일반 빈 상태: 안내문 + 다음 행동 CTA(예: "첫 글 작성하기").
- 검색 결과 0건: 안내 + "전체 보기" 링크.

## 7.9 게시판 글쓰기 임시저장

- `localStorage` 키: `board-draft-v1`.
- 입력 800ms 이후 자동 저장, 다음 진입 시 confirm으로 복구.
- 등록 성공 시 자동 삭제. 사용자가 "임시 글 비우기"로 즉시 폐기 가능.

## 7.10 시드 / 운영 스크립트

`web/scripts/` 디렉터리에 service role key로 동작하는 운영 스크립트가 있다.
.env.local을 자체 파서로 읽어 dotenv 의존성 없이 동작한다.

| 스크립트 | 용도 |
| --- | --- |
| `seed-50.mjs` | notices / board_posts / new_members 각 50건 시드 (`[시드]` 접두). 이전 자동 데이터 정리 포함 |
| `image-cycle-10.mjs` | board-images 버킷에 1×1 PNG 업로드 → 게시글 등록 → public URL · detail 페이지 검증 10회 사이클 |

운영 시 사용 예:

```bash
cd web
node scripts/seed-50.mjs        # 시연용 데이터 50건씩 채우기
node scripts/image-cycle-10.mjs # 이미지 업로드 + 게시글 사이클 10회
```

---

## 7.11 사진첩 (Gallery)

### 데이터

- 테이블 `public.gallery_photos`:
  - `id bigserial`, `title text`, `category text check (in 5개)`,
    `image_url text`, `image_path text`, `taken_at date`, `created_at timestamptz`
- 인덱스: `created_at desc`, `category`
- RLS: SELECT 모두 / 그 외 `is_admin()`만
- Storage 버킷: `gallery` (public)

### 카테고리

| 키 | 비고 |
| --- | --- |
| 예배 | 주일 1·2부, 수요, 새벽 등 예배 사진 |
| 행사 | 절기 행사, 수련회, 단기선교, 칸타타 등 |
| 교제 | 점심 나눔, 모임 등 친교 |
| 봉사 | 김장, 환경 정비, 도시락 나눔 등 |
| 기타 | 위 분류에 안 들어가는 사진 |

### 공개 페이지 (`/media/gallery`)

- 페이지당 12장, 카테고리 필터 chips, 페이지네이션.
- 카드 클릭 → 라이트박스 (Esc 닫기, ← / → 키 네비, 배경 클릭 닫기,
  body 스크롤 잠금).
- 테이블이 없으면 graceful 폴백: "사진첩이 아직 준비 중입니다."

### Admin (`/admin/gallery`)

- 그리드 뷰 + 각 카드 하단 "삭제" 버튼 (Storage 파일 동시 제거).
- `/admin/gallery/new`: 여러 장 업로드 → 공통 메타데이터(제목/카테고리/촬영일)로 일괄 등록.
- 제목을 비우면 파일명을 자동 사용.
- 테이블 없을 때 "schema.sql의 사진첩 블록을 실행해 주세요" 배너 노출.

## 7.12 헤더 / 네비게이션 정책

- 데스크톱: 메인 메뉴 hover 시 `.submenu` 페이드인 (CSS만).
- 모바일 햄버거 드로어 `.mobile-menu.open`:
  - 라우트 변경(`usePathname` 변경) 시 자동 닫힘
  - 헤더 영역 밖 click 시 자동 닫힘
  - `Escape` 키 닫힘
  - 열려 있는 동안 `body { overflow:hidden }` 잠금

## 7.13 메타데이터 / SEO

- 루트 `metadataBase`: `NEXT_PUBLIC_SITE_URL` 또는 `https://gaggaun.vercel.app`
- OpenGraph: type=website, ko_KR, siteName "가까운교회"
- Twitter card: summary
- robots: index=true, follow=true
- `/board/[slug]/[id]`, `/notices/[id]`는 `generateMetadata`로 동적 title + 본문 80자 description

## 7.14 접근성

- 키보드 포커스: `:focus-visible { outline:2px solid var(--gold); outline-offset:2px }` 전역
- 마우스 포커스에는 영향 없음 (`:focus-visible`만 적용)
- 모바일 드로어 / 라이트박스에 `aria-modal`, `aria-label`, `role="dialog"`

---

## 8. 데이터 의존성 (현재)

| 페이지 | Supabase 테이블 | 폴백 |
| --- | --- | --- |
| `/` | `notices` (id, title, created_at, pinned), `site_settings` (this_week 그룹) | 공지 폴백 더미 6건, 금주 정보 DEFAULTS |
| `/notices`, `/notices/[id]` | `notices` | 비어 있으면 "등록된 공지가 없습니다." |
| `/board` | `boards` (활성 보드 목록) | 보드 0건이면 안내 |
| `/board/[slug]`, `/board/[slug]/[id]`, `/board/[slug]/new` | `boards` + `board_posts` (board_id FK) | 비어 있으면 "아직 등록된 게시글이 없습니다." |
| `/admin/boards` | `boards` (CRUD) | 게시판 마스터 관리 |
| `/admin/board` | `board_posts` + `boards` (filter) | 보드 셀렉터로 필터링 |
| `/admin/notices` | `notices` (CRUD) | — |
| `/admin/this-week` | `site_settings` (group_key=this_week) | 시드 안 됐으면 안내 |
| `/admin/nav` | `site_settings` (key=nav.tree, JSON) | 코드 정적 NAV로 fallback |
| `/admin/feedback-tool` | (없음 — `/edit-tool/` iframe 임베드) | — |
| `/admin/new-members` | `new_members` | — |
| 인증 | Supabase Auth | `isAdminEmail`로 관리자 판별 |

`createClient()` 호출이 실패하면 홈은 try/catch로 빈 배열을 반환하고
폴백 데이터로 렌더링한다 (`web/src/app/page.tsx`).

### 8.1 `site_settings` 테이블 (key-value 사이트 설정)

자주 바뀌는 사이트 콘텐츠를 코드 수정 없이 어드민에서 관리하기 위한 generic 테이블.

| 컬럼 | 용도 |
| --- | --- |
| `key` | PK. 카탈로그 ID 형식 (예: `home.strip.date`) |
| `value` | 실제 표시되는 값 |
| `label`, `description` | 어드민 폼에 표시되는 한글 라벨/설명 |
| `group_key` | 어드민에서 폼 그룹화용. 1차: `this_week` |
| `sort_order` | 폼 내 표시 순서 |

RLS: select public / modify is_admin. fetcher (`lib/site-settings.ts`)는 DB 실패 시
`DEFAULTS`로 fallback해서 사이트가 무조건 뜨도록.

확장 후보: 연락처(전화·이메일·주소), 소셜 링크.

#### 현재 그룹

| group_key | 키 | 용도 |
| --- | --- | --- |
| `this_week` | `home.strip.date`, `home.strip.worship`, `home.strip.text`, `home.strip.preacher` | 홈 히어로 띠 금주 정보 |
| `navigation` | `nav.tree` | 상단 메뉴 트리 (JSON 직렬화) |

---

## 9. 관리자 피드백 도구 (`web/public/edit-tool/`)

비개발자(교회 관리자)가 홈페이지의 텍스트/이미지 변경 요청을 정확히 전달하기 위한
정적 편집 도구. Next.js 라우터를 거치지 않는 정적 자산.

| 항목 | 값 |
| --- | --- |
| 정적 위치 | `web/public/edit-tool/index.html` + `README.md` |
| 직접 URL | `https://gaggaun.vercel.app/edit-tool/` |
| 어드민 임베드 | `/admin/feedback-tool` — iframe으로 풀스크린 임베드 + 안내 |
| 출력 | `church-edits-YYYY-MM-DD.json` 다운로드 |
| 라이브 URL 점프 | 카드의 "↗ 사이트에서 위치 보기" → `https://gaggaun.vercel.app/path?edit=ID` |

사이트 측 통합:
- `data-edit-section="ID"` 속성을 섹션 단위로 부여 (개별 텍스트마다 X)
- `web/src/components/edit-highlight.tsx` 가 `?edit=ID` 쿼리를 읽어 해당 섹션을
  스크롤 + 강조 + 토스트 안내
- 카탈로그 ID는 `web/public/edit-tool/index.html` 내부 `CATALOG` 상수가 단일 출처

상단 메뉴와 금주 정보는 편집기에서 빼고 어드민 페이지(`/admin/nav`,
`/admin/this-week`)에서 직접 DB로 관리한다. 편집기는 "코드 수정이 필요한 진짜 피드백"
(어감 다듬기, 단락 변경, 이미지 교체, 섹션 순서 등)에 집중.

JSON을 Claude Code에 던지면 카탈로그 ID로 코드 위치를 찾아 텍스트/이미지를 수정.
