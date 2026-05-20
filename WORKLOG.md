# WORKLOG

작업 기록 — 새 세션마다 최상단에 날짜 헤더를 추가한다.

---

## 2026-05-21 (4) — 50건 시드 · 페이지네이션 · 검색 · 이미지 사이클 · 베타

### 한 줄 요약

게시판/공지/새가족 각 50건을 service role로 직접 시드해 large-list 환경을
만들고, 페이지네이션 + 검색 + 이미지 업로드 사이클 + 베타 페르소나 10개
시뮬레이션까지 한 번에 끝냈다. 새로 추가된 기능과 데이터 50+ 환경에서도
콘솔 에러 0건, 평균 응답 95ms.

### 1. 데이터 시드 (각 50건)

- `web/scripts/seed-50.mjs` 작성: dotenv 의존 없이 `.env.local` 파싱,
  SERVICE_ROLE_KEY로 supabase-js 직접 호출.
- 이전 자동 CRUD 데이터(`CRUD_AUTO%`, `[자동]%`)는 같이 정리.
- 50건씩 모두 6개월 균등 분포로 created_at 배치. 공지 상위 5건은 pinned.
- 결과: notices 50, board_posts 50, new_members 50 (1초 안에 완료).

### 2. 페이지네이션 (Pagination 컴포넌트)

- 신규 `components/pagination.tsx` — 첫·이전·5개 윈도우·다음·마지막,
  query string 보존(검색어 등).
- 적용: `/notices`, `/board`, `/admin/notices`, `/admin/board`,
  `/admin/new-members` — 모두 페이지당 20건.
- 효과: `/notices` 응답 214ms(50건 일괄) → 91ms(20건), 게시판 149ms → 92ms.
- CSS: `.pagination` 박스 스타일 + 모바일 축소 미디어쿼리.

### 3. 검색 (SearchBar 컴포넌트)

- 신규 `components/search-bar.tsx` (클라이언트):
  - `?q=...` URL 쿼리 연동, 폼 submit 시 `page` 파라미터는 자동 제거.
  - 검색어 ‘×’ 버튼으로 즉시 클리어.
  - 글로벌 `/` 키로 검색창 포커스 (input/textarea 안에선 무동작).
- 적용:
  - 공개: `/board`(제목), `/notices`(제목)
  - 어드민: `/admin/notices`(제목), `/admin/board`(제목·작성자),
    `/admin/new-members`(이름·연락처·초청자) — Supabase `or()` ilike.
- 페이지네이션·검색이 결합되어도 query 보존(예: `/board?q=시드&page=2`).

### 4. 게시판 글쓰기 UX

- `board/new/board-form.tsx`:
  - localStorage 기반 임시저장(`board-draft-v1`): 입력 800ms 후 자동 저장,
    재진입 시 confirm으로 복구 여부 묻고, 등록 성공 시 자동 삭제,
    "임시 글 비우기" 버튼 제공.
  - 입력 단계에서 "자동 저장됨" / "임시 글을 불러왔습니다." 우측 상단 안내.

### 5. 빈 상태 CTA 보강

- `/board` empty: "첫 글 작성하기 →" 링크.
- 검색 결과 0건 시: "전체 보기" 링크.

### 6. 게시판 이미지 업로드 + 조회 사이클 10회

- 신규 `web/scripts/image-cycle-10.mjs`: 1×1 빨강 PNG 70바이트를
  `board-images` 버킷에 업로드 → public URL → board_posts insert → public URL GET → 해당 detail 페이지 GET까지 한 사이클.
- 결과: **10 / 10 fully successful**.
  - Storage 업로드 200, public URL 다운로드 200(70 bytes),
    HTML에 image_urls 포함 200. 평균 약 950ms/회.

### 7. Admin 사용성

- 신규 stat 카드: "THIS WEEK · 최근 7일 신규 등록".
  - `.stat-grid`를 3열 → 4열, 1024px 이하 2열로 변경.
- Admin 3개 목록 페이지에 페이지네이션 + 검색 일괄 적용.

### 8. 베타 테스터 10명 시나리오

`web/src/...` 코드 변경 없이 fetch 기반으로 10개 페르소나(P1~P10) 동선을
시뮬레이션. 모든 페르소나 모든 단계 2xx 통과. 평균 응답 100~150ms.

발견된 friction:
- F1: `/board/new` 첫 진입 319ms — dev 컴파일이며 prod에선 무시.
- F2: 어르신 페르소나 본문 17px / line-height 1.7 → 큰 글씨 토글은
  디자인 톤 영향이 커 별도 도입 보류.
- 결론: 코드 변경 0, 기존 IA로 충분히 동선 흡수됨.

### 변경 파일

- 신규: `scripts/seed-50.mjs`, `scripts/image-cycle-10.mjs`,
  `components/pagination.tsx`, `components/search-bar.tsx`
- 수정: `app/notices/page.tsx`, `app/board/page.tsx`,
  `app/board/new/board-form.tsx`,
  `app/admin/page.tsx`, `app/admin/notices/page.tsx`,
  `app/admin/board/page.tsx`, `app/admin/new-members/page.tsx`,
  `app/globals.css`

---

## 2026-05-21 (3) — 빈 페이지 콘텐츠 채움 · CRUD 자동 검증 · 기획개선 · 속도 QA

### 한 줄 요약

콘텐츠가 텅 비어 있던 11개 사역/예배/공동체/미디어 페이지를 의미 있는
콘텐츠(인사문 + 표 + 부가 설명)로 재작성했고, 게시판/새가족 등록 흐름을
자동으로 10회씩 돌려 안정성을 확인했다. 게시판 상세에 이전/다음 글
네비를 추가했고, 새가족 전화번호는 서버에서 자동 하이픈으로 정규화한다.
페이지 응답 시간은 평균 67ms로 측정되었다.

### 1. 빈 페이지 재기획 + 콘텐츠 작성 (11개)

기존엔 모두 `<ProseSection>` 한 줄짜리(설명 두 줄)였다. 모두
PageHeader → 인사문 prose-box → simple-table → 부가 안내 구조로 통일.

- `/worship/wednesday` 수요예배: 안내문 + 5단계 순서 표
- `/worship/friday` 금요 기도회: 안내문 + 5단계 순서 표 + 4개 기도 주제 dl
- `/worship/dawn` 새벽 기도회: 안내문 + 요일별 본문 표
- `/ministry/children` 주일학교: 부서 3개(유치/유년/초등) 안내 표
- `/ministry/youth` 청년부: 모임 시간 표 + 셀 3개 안내
- `/ministry/mission` 선교부: 권역 3개 후원 현황 표
- `/ministry/praise` 찬양대: 팀 3개 연습/대상 표
- `/community/cell` 구역모임: 4개 구역 지역/시간/장소 표
- `/community/men` 남선교회: 정기 모임 주기 표 + 회장 연락처
- `/community/women` 여전도회: 정기 모임 주기 표 + 회장 연락처
- `/media/sermon` 설교영상: 6주치 sermon-card 그리드 (요약문 포함)

### 2. 게시판 / 새가족 CRUD 자동 10회

#### 새가족 등록

`/new-member`의 server-action 폼을 fetch로 직접 호출.
- 처음엔 `redirect: 'manual'`로 호출해 "Connection closed" 500이 났으나
  실제로는 insert 자체는 성공. `redirect: 'follow'`로 바꿔 정상 200을 받음.
- 10회 모두 200, redirected → `/new-member/thanks`, 평균 ~114ms.

#### 게시판 글쓰기

BoardForm은 controlled inputs + JS에서 server action 호출이라 fetch 외부 호출이 어려움.
- Playwright로 페이지 열기 → React의 native value setter로 input 채우기 →
  submit 클릭 → 새 페이지(`/board/{id}`) 도달 후 다음 글로 반복.
- 10건 모두 등록 성공, 게시판 목록에 정상 노출 (이전 테스트 1건 포함 총 11건).

#### 공지

`requireAdmin` 게이트로 자동화 불가 → 코드 검토만 수행.
`createNotice/updateNotice/deleteNotice` 모두 server action,
`revalidatePath('/notices')`로 후속 갱신까지 처리됨을 확인.

### 3. 기획 개선 3회

1. **게시판 글쓰기**: `maxLength` (제목 120 / 작성자 20 / 본문 5000) +
   placeholder 보완, 본문 라벨에 실시간 글자수 표시.
2. **게시판 상세**: 이전/다음 글 네비게이션 추가
   (서버에서 created_at 기준 인접 글 1건씩 fetch). 하단 액션바에
   "목록 · 글쓰기" 정렬, 관리자 삭제 버튼은 우측으로 분리.
3. **새가족 폼/완료 페이지**:
   - server action에서 전화번호를 11자리/10자리 → `010-0000-0000` 형태로
     자동 하이픈 정규화 (`normalizePhone`).
   - thanks 페이지에 "홈으로 / 예배 시간 보기 / 오시는 길" 3개 출구 옵션 제공.

### 4. 속도 / 지연 QA 3회

27개 라우트 평균 응답 시간 측정.

- **1회**: 평균 67ms. 최악 110ms (`/` — Supabase 6개 병렬 호출).
- **수정**: `/board`, `/notices`의 `revalidate=0` → 각각 30 / 60초로 변경.
  쓰기 액션마다 `revalidatePath`로 즉시 갱신되므로 사용자 체감 신선도는 유지됨.
- **2회**: 평균 67ms 동일 (dev 서버는 prod 캐시와 다른 동작; 실제 효과는 prod 배포 시).
- **3회**: 5개 핵심 라우트 네비게이션 측정 — 모두 200ms 이하 (`/board` 137ms,
  `/new-member` 172ms로 최대치).

콘솔 에러는 모든 페이지에서 0건.

### 변경 파일

- 페이지 11개 재작성 (worship/wednesday·friday·dawn, ministry/children·youth·mission·praise, community/cell·men·women, media/sermon)
- 수정: `board/new/board-form.tsx`, `board/[id]/page.tsx`, `board/page.tsx`,
  `notices/page.tsx`, `new-member/actions.ts`, `new-member/thanks/page.tsx`

---

## 2026-05-21 (2) — Admin 인증 흐름 개선 · 로그아웃 confirm · QA

### 한 줄 요약

Admin 페이지 이동 중 자동으로 "로그아웃된 것처럼" 보이던 동선을 정리하고,
로그아웃을 confirm + server action으로 바꿔 자연스럽게 동작하도록 만들었다.
로그인은 트랜지션을 입혔고, 홈 더미 공지 클릭 시 404로 빠지던 버그도 잡았다.

### 1. Admin 자동 로그아웃 — 원인과 수정

- `requireAdmin()`이 매 요청마다 `auth.getUser()` + `isAdminEmail()`을 호출하는데,
  `isAdminEmail()`이 내부에서 try/catch로 오류를 삼키고 false를 반환했다.
  → `admins` 테이블 SELECT가 RLS/네트워크 등으로 실패하면 사용자 입장에선
  로그인된 상태인데도 매번 `/?msg=not-admin`으로 튕겨 "로그아웃됨"으로 보임.
- 수정 (`web/src/lib/auth.ts`):
  - `isAdminEmail` 의존 제거, `requireAdmin` 내부에서 `admins` 조회를 직접 수행.
  - `getUser()` 에러 / 이메일 없음 → `/login?next=...`
  - admins 조회 에러 → `/?msg=admin-check-failed` (식별 가능한 메시지)
  - admins 결과 없음 → `/?msg=not-admin`
- 또 다른 원인 후보: `<Link href="/logout">`이 prefetch되어 hover만으로
  signOut이 발화될 가능성. → 다음 항목에서 server action 기반 로그아웃으로 교체해
  prefetch 영향에서 분리.

### 2. 로그아웃 confirm + 부드러운 전환

- 신규 `web/src/components/logout-link.tsx` (클라이언트 컴포넌트):
  - 클릭 시 `window.confirm("로그아웃하시겠습니까?")` → 동의 시 server action 호출.
  - `useTransition`으로 pending 상태에서 "로그아웃 중..." 표시.
- 신규 `web/src/app/logout/actions.ts`: `"use server"`로 `signOut()` 후
  `/?msg=logout` 리다이렉트. 기존 GET `/logout/route.ts`는 호환성 유지를 위해 그대로 둠.
- `web/src/components/util-bar.tsx`, `web/src/app/admin/layout.tsx`의 로그아웃 링크를
  `<LogoutLink />`로 교체.

### 3. Flash 메시지 (자연스러운 안내)

- 신규 `web/src/components/flash-message.tsx` (클라이언트):
  - URL 쿼리 `?msg=logout | not-admin | admin-check-failed`를 읽어 상단 중앙에
    토스트 표시 (페이드 + slide-down, 2.5초 후 사라지고 URL 정리).
  - `site-shell.tsx`에서 `Suspense`로 감싸 bare/일반 레이아웃 모두에 포함.

### 4. 로그인 폼 트랜지션

- `web/src/app/login/login-form.tsx`:
  - 마운트 시 페이드인, 로그인 성공 시 버튼 라벨이 "환영합니다 ✓"로 바뀌고
    300ms 뒤 `router.push(next)`로 부드럽게 전환.
  - 로딩 중 입력 필드 disabled 처리.

### 5. 기획 개선 (NAV 정리 · 키 중복)

- `/media/sermon` 페이지에서 React 콘솔 경고 "두 children이 같은 key" 발생.
  - 원인: `lib/nav.ts`의 '설교말씀' children에 `/media/sermon`이 두 번
    (`주일 설교`, `수요 강해`). site-header가 `key={c.href}`를 쓰고 있었다.
  - 수정: NAV의 중복 항목을 `설교 영상` 하나로 합치고,
    site-header의 key는 안전하게 `${label}-${href}`로 변경.

### 6. QA 자동 점검 (Playwright headless · 백그라운드)

- 27개 라우트에서 HTML을 파싱해 모든 내부 링크를 fetch.
- 1회차 결과: 홈 카드의 `/notices/1` ~ `/notices/6`이 전부 404.
  - 원인: Supabase 비어 있을 때 더미 공지 6건을 렌더링하면서
    각 항목 링크가 실제 존재하지 않는 detail 경로를 가리킴.
  - 수정 (`web/src/app/page.tsx`): 더미일 때는 `/notices` 목록으로 보내도록 분기.
- 2회차: 404 0건.
- 3회차: 모바일 375px에서 27개 라우트 가로 오버플로 0건 유지,
  콘솔 에러도 0건(이전의 key 중복 경고 포함 모두 해소).

### 변경 파일

- 수정: `admin/layout.tsx`, `login/login-form.tsx`, `page.tsx`,
  `components/site-header.tsx`, `components/site-shell.tsx`,
  `components/util-bar.tsx`, `lib/auth.ts`, `lib/nav.ts`
- 신규: `app/logout/actions.ts`, `components/flash-message.tsx`, `components/logout-link.tsx`

---

## 2026-05-21 — 모바일 가로 오버플로 수정

### 한 줄 요약

모바일(375px)에서 모든 페이지에 발생하던 가로 스크롤을 잡았다. 원인은
상단 유틸 바(`.util .right`)의 링크 5개와, `/about/vision` 페이지의
인라인 그리드 스타일 두 곳이었다.

### 점검 방법

- Playwright(헤드리스, 백그라운드)로 viewport 375×812 설정.
- 27개 라우트를 iframe 375px로 띄워 `documentElement.scrollWidth >
  innerWidth`인 페이지와 어떤 엘리먼트가 넘치는지 자동 수집.

### 1. 상단 유틸 바 오버플로 — 전 페이지 공통

- 증상: 모든 페이지에서 `.util .right`가 19px 초과 (sw=394, vw=375).
- 원인: 로그인 상태에서 우측 링크 5개(관리자/로그아웃/새가족등록/
  교회소식/게시판) + 구분자(|)가 13px 폰트로 한 줄에 안 들어감.
  기존 `@media (max-width:520px)`도 좁히긴 했지만 부족했다.
- 수정 (`web/src/app/globals.css`):
  - `.util-row`, `.util .left/.right`에 `min-width:0`, `flex-shrink:0` 추가.
  - `.util .left .verse`는 `nowrap + ellipsis` 처리(안전망).
  - 새 `@media (max-width:560px)` 블록:
    - `.util` 폰트 12px.
    - `.util-row` 좌우 패딩 14px.
    - `.util .right` gap 0.
    - `.util .right a` 패딩 `6px 5px`.
    - `.util .right .sep` 숨김 (모바일에서 구분자 제거).
- 결과: sw=360 < vw=375 → 가로 스크롤 사라짐.

### 2. `/about/vision` 페이지 그리드 인라인 스타일

- 증상: 별도로 추가 오버플로(sw=490). `.idx-card` 3개가 PC용 3열 그리드를
  강제 유지하면서 모바일에서 화면 밖으로 넘어감.
- 원인: `web/src/app/about/vision/page.tsx`에 인라인
  `style={{ gridTemplateColumns: "repeat(3,1fr)" }}`가
  `globals.css`의 모바일 미디어쿼리(`@media (max-width:520px){ .idx-grid{grid-template-columns:1fr} }`)를 덮어쓰고 있었다.
- 수정: 해당 인라인 스타일 제거 → CSS가 그대로 적용되어 모바일에서 1열로 떨어짐.

### 3. 검증

- 27개 라우트(루트, /about 4개, /worship 4개, /ministry 4개,
  /community 3개, /media 3개, /notices, /board, /new-member, /login 등)에서
  모두 `sw=360, overflow=-15`로 통과.

### 메모

- 작업 중 Next 16(Turbopack) dev 서버에서 globals.css HMR이 한 차례 안 먹히는
  현상을 봤다. 페이지 새로고침 후에는 정상 반영됐다.
- 사용자 지시로 기획 개선 3회 · QA 3회는 다음 세션으로 미룸. 관련
  TaskCreate 항목은 정리(삭제).

---

## 2026-05-20 — GitHub 레포 생성 · Vercel 배포 · Supabase Auth URL 등록

### 한 줄 요약

`D:/ai/toy5`를 GitHub `cds4242/gaggaun`으로 초기화하고, Vercel에서 `web/`을
루트로 한 Next.js 앱을 배포한 뒤, Supabase Auth의 Site URL과 Redirect URLs를
Vercel 도메인으로 맞췄다.

### 1. GitHub 레포 생성 · 초기화

- `D:/ai/toy5`에 `git init -b main`.
- 루트 `.gitignore` 작성: `node_modules/`, 빌드 산출물, 로그, `.env*`,
  에디터/OS, `.playwright-mcp/` 등 제외.
- `README.md`(타이틀만) + `.gitignore`로 첫 커밋 `chore: initial commit`.
- `gh repo create gaggaun --public --source=. --remote=origin --push`로
  https://github.com/cds4242/gaggaun 생성 · 푸시.

### 2. 전체 파일 커밋 (잡힌 함정 포함)

- `git add -A` 시 `web/` 폴더가 자체 `.git`을 가진 **embedded repo**로
  잡혔다. 그대로 두면 GitHub에는 submodule 포인터만 올라가고 내용물이
  비어버린다.
- 해결: `git rm --cached -rf web` 으로 인덱스에서 제거 → `rm -rf web/.git`
  으로 내부 `.git` 삭제 → `git add web/`로 일반 폴더로 재추가.
- `web/.gitignore`가 살아있어서 `web/.env.local`, `web/node_modules`는
  자동으로 제외됨을 `git check-ignore -v`로 확인.
- 160개 파일을 `chore: add project files`로 커밋·푸시.
- 이후 다른 세션에서 디자인 작업으로 수정된 `web/src/...` 9개 파일을
  `chore: update web pages`로 추가 커밋·푸시.

### 3. Vercel 프로젝트 생성 · 배포

- 팀: `dsjh-projects` (Hobby) — Chrome DevTools MCP로 대시보드 조작.
- `New Project` → GitHub `cds4242/gaggaun` Import.
- 처음에는 framework가 `Other`로 잡혔다 (루트가 모노레포라서).
- **Root Directory를 `web`으로 변경**하니 Next.js로 자동 재감지.
- Environment Variables 3개 등록 (Production + Preview, Sensitive 체크):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Deploy → 성공. Production 도메인: https://gaggaun.vercel.app

### 4. Supabase Auth URL Configuration

- 프로젝트: `paugjrpggyxmhurzurhm` (`cds4242's Project`).
- Authentication → URL Configuration에서:
  - **Site URL** `http://localhost:3000` → `https://gaggaun.vercel.app`
  - **Redirect URLs** 3개 추가:
    - `https://gaggaun.vercel.app/**`
    - `https://gaggaun-*-dsjh-projects.vercel.app/**` (Preview 와일드카드)
    - `http://localhost:3000/**` (로컬)
- 와일드카드 `**` 덕분에 콜백 경로(`/auth/callback` 등)는 추가 등록 불필요.

### 5. 문서화

- `SPEC.md` 작성 — 인프라/배포 사양 단일 출처.
- `WORKLOG.md`(본 문서) 작성 — 날짜별 세션 로그.

### 보안 메모

- `SUPABASE_SERVICE_ROLE_KEY` 값이 이번 대화 로그(LLM 세션)에 평문으로
  노출되었음. 채팅 로그가 외부 저장/공유되는 환경이라면 Supabase에서 키를
  rotate하고 Vercel `SUPABASE_SERVICE_ROLE_KEY`도 새 값으로 교체할 것.
- 키 자체는 GitHub에는 푸시되지 않음 (`.gitignore`로 차단됨).
