# WORKLOG

작업 기록 — 새 세션마다 최상단에 날짜 헤더를 추가한다.

---

## 2026-05-21 (7) — 1차 프로젝트 종료 (헤더/검색/관리자 UX 마무리 + 상품화 검토)

### 한 줄 요약

세션 (6) 종료 후 사용자 피드백을 반영해 헤더/검색/관리자 링크 UX를 여러 차례
다듬고, 마지막으로 상품화 가능 수준인지 3회 검토를 거쳐 1차 프로젝트를 종료.
오픈 전 조치가 필요한 4건(자동입력 자격증명 / 개인정보처리방침 / 동의 체크박스 /
더미 연락처)은 다음 세션에서 처리 예정.

### 헤더·검색·관리자 UX 리팩토링 (커밋 6건)

- `f32e899` — 통합 검색 텍스트화 + 다크 모드 세그먼티드 토글 (3단 cycle → 2단 pill,
  초기값은 prefers-color-scheme 자동)
- `af0c23a` — 상단바 좌측에 관리자 링크 (로그인 → 관리자 텍스트화)
- `fffd2f0` — 상단바에서 관리자 제거 후 메뉴/햄버거 드로어로 이동, 테마 토글은
  ☀ ☾ 아이콘만
- `d86830e` — 메뉴가 길어져 잘리는 문제 해결: 헤더에서 관리자 완전 제거,
  AdminCorner 컴포넌트로 메인 페이지 하단 우측에 작게 배치. 검색은 원형 SVG 버튼.
- `2f6b9a8` — 네이버 스타일 검색 캡슐(입력 가능 + 원형 돋보기 버튼)로 재설계.
  좌측 메뉴 왼쪽 정렬, 다크 토글 테두리 제거.
- `8fd69c3` — 데스크탑 좌측 끝의 시편 23:1 verse 복원.
- `a08534b` — 상단바에 갤러리·오시는 길 추가.

### 상품화 검토 (3회차)

세 명의 검토자(보안/법적·기능/품질·비즈니스/UX)가 각각 다른 시각으로 점검.
**오픈 가능 수준이며, 오픈 전 다음 4건만 조치 필요**:

1. 로그인 폼 자동 입력 (`admin@admin.com` / `admin1234`) 제거
2. 개인정보처리방침/약관 페이지 추가
3. 새가족 폼에 개인정보 수집 동의 체크박스
4. 더미 연락처 (`031-000-0000`, `office@nearchurch.kr`) → 실제값/"준비중"

SaaS 상품화(여러 교회에 판매)는 멀티 테넌시 아키텍처·핵심 기능 5개(헌금/출석/
회원/앱/롤기반 권한) 부재로 현재 불가. 단일 교회 사이트 오픈은 위 4건 조치 후
즉시 가능.

### 다음 세션 예정 작업 (오픈 전 필수)

위 4건. 실제 연락처(전화·이메일·정확한 주소) 확보 필요.

---

## 2026-05-21 (6) — 1시간 QA: 다크모드 가독성 전수 점검 + 로그인 안내문구 제거

### 한 줄 요약

다크모드에서 "어두운 배경 위에 항상 흰색 텍스트가 필요한 영역"이 토큰
재정의(`--white`가 다크에서 `#1f2a45`로 변형)로 인해 깨지는 문제를 발견.
hero / page-head / panel-head / site-footer / brand cross에 다크모드 전용 색상
오버라이드를 추가하고, 또한 누락되어 있던 로그인 페이지의 베타 안내 문구
("※ 베타버전 : admin@admin.com / admin1234")를 삭제했다.

### 다크모드 가독성 수정 (`web/src/app/globals.css`)

다음 영역에 `:root[data-theme="dark"]` 및 `prefers-color-scheme:dark` 셀렉터
오버라이드를 추가하여 어두운 배경 위 텍스트의 흰색을 명시적으로 고정:

- `.hero-content`, `.hero h1`, `.hero-strip .v` — 본문/제목/금주 정보
- `.hero-ctas .btn-line` 텍스트 / hover 시 배경
- `.panel-head` 배경(navy)·텍스트(흰색)·h3(골드)
- `.page-head h1` · `.page-head p` (게시판 등 페이지 헤더)
- `.site-footer` 본문 색 · `.foot-brand .name-ko` · `.foot-col a/li`
- `.brand .cross` (헤더 십자가 박스)
- `.foot-brand .cross-mini` 및 십자가 선

### 기타

- `web/src/app/login/page.tsx` — 베타 안내 `<p>` 삭제 (사용자가 이전 세션에
  요청했던 것이 누락되어 있었음).

### QA 검증

- R1~R6 라운드: 다크모드에서 홈/예배일정/설교/공지/게시판/통합검색/로그인/
  게시글 상세/푸터 모두 시각 확인. JPEG 스크린샷으로 비교.
- 라이트모드 모바일/데스크탑 회귀 확인.

### 추가 — 통합 검색·테마 토글 UX 개선

- `util-bar` 통합 검색 링크: 🔍 이모지 → "검색" 텍스트로 (모바일에서 작은
  아이콘이라 누르기 어렵다는 피드백).
- `theme-toggle` 컴포넌트를 3단 cycle 버튼 → 2단 세그먼티드(pill) 토글로
  재작성. light / dark만 노출, 초기값은 `prefers-color-scheme`로 자동 결정.
  - 모바일에서 가로로 누르기 쉬운 capsule, 활성 옵션은 골드 배경 + navy 텍스트.
  - 모바일 미디어쿼리에서 라벨 숨김을 제거하여 "라이트 / 다크" 텍스트가
    항상 노출되도록 함.

---

## 2026-05-21 (5) — 1시간 라운드 R1~R6 + 메뉴 자동 닫힘 + 사진첩 + QA/베타

### 한 줄 요약

한 세션에서 (a) 1시간 라운드 작업으로 SEO/접근성/폼/메뉴 6라운드 개선,
(b) 메뉴 외부 클릭/Esc/라우트 변경 시 자동 닫힘, (c) 사진첩 기능
(공개 라이트박스 + admin 업로드/삭제), (d) QA 3회 + 베타 3회까지 모두 완료.

### 1. 1시간 라운드 (R1~R6)

- **R1 — 첫인상/접근성**
  - 홈 hero CTA 3개로 확장: 예배 시간 / 처음 오시는 분 / 이번 주 공지
  - 모바일 햄버거 열렸을 때 `body { overflow:hidden }` 잠금
  - `Esc`로 모바일 드로어 닫기
  - 글로벌 `:focus-visible { outline:2px solid var(--gold) }`로 키보드 접근성
- **R2 — Detail/메타**
  - `app/not-found.tsx` 글로벌 404 페이지 (홈/공지/게시판/오시는 길 출구)
  - `/board/[id]`, `/notices/[id]`에 `generateMetadata` 동적 title/description
  - 게시판 본문 이미지 클릭 시 새 탭 원본 보기(`<a target=_blank>`)
- **R3 — 폼**
  - 신규 `components/phone-input.tsx` — 클라이언트에서 입력하자마자 010-xxxx-xxxx 포맷
  - 새가족 폼에 적용 (서버 정규화는 그대로 유지)
- **R4 — SEO/OG**
  - `app/layout.tsx`에 `metadataBase`, OpenGraph, Twitter card, robots 추가
- **R5 — 베타 v2**
  - P11~P13(권한 거부 / 검색 빈 결과 / 모바일 햄거버) 시뮬레이션 통과
  - 첫 호출 컴파일 외 평균 75~120ms
- **R6 — 모바일 회귀**
  - sw=360 < vw=375 유지, 게시판 detail 모바일 정상 확인

### 2. 메뉴 외부 클릭 시 자동 닫힘

- `site-header.tsx`:
  - `usePathname()` 변경 감지로 라우트 이동 시 `setOpen(false)`
  - `document.click` 외부 영역 감지 → 헤더 영역 밖이면 닫힘
  - `Escape` 키 닫힘 (기존 유지)
  - body 스크롤 잠금 (기존 유지)
- 결과: 모바일에서 햄버거 열고 다른 곳 탭 → 자동 닫힘 (QA에서 openBefore=true → openAfter=false 확인)

### 3. 사진첩 기능 (신규)

#### 기획

- 공개 페이지 `/media/gallery` — 카테고리 필터(전체/예배/행사/교제/봉사/기타) +
  12장 카드 그리드 + 페이지네이션 + **라이트박스** (Esc/←/→/× 지원)
- Admin 페이지 `/admin/gallery` + `/admin/gallery/new` — 여러 장 동시 업로드,
  공통 메타데이터(제목/카테고리/촬영일) 적용, 삭제 시 Storage 파일도 함께 제거

#### 데이터

- 테이블: `public.gallery_photos`
  (id, title, category check, image_url, image_path, taken_at, created_at)
- 인덱스: `created_at desc`, `category`
- RLS: SELECT 모두 / 그 외 `is_admin()`만
- Storage 버킷: `gallery` (public)
- `web/supabase/schema.sql`의 ‘5) 사진첩’ 블록 추가 — 운영자가 SQL Editor에서 1회 실행 필요

#### 신규 파일

- 공개: `app/media/gallery/page.tsx` (재작성), `app/media/gallery/gallery-grid.tsx`
- 어드민: `app/admin/gallery/page.tsx`, `app/admin/gallery/actions.ts`,
  `app/admin/gallery/new/page.tsx`, `app/admin/gallery/new/upload-form.tsx`
- 운영: `scripts/apply-gallery-migration.mjs` (gallery 버킷 자동 생성 + 12장 시드 시도)
- CSS: `.gallery-filter`, `.photo-grid`, `.photo-card`, `.lightbox`,
  Admin stat-grid 4→5열로 변경 (1200px 이하 3열, 720px 이하 2열)
- `components/admin-side.tsx` — "사진첩" 메뉴 항목 추가

#### 폴백 동작

- 테이블이 없으면 공개 페이지는 "사진첩이 아직 준비 중입니다." 안내,
  admin은 schema.sql 실행 안내 배너 표시 (콘솔 에러 없이 graceful).

### 4. QA 3회

1. **메뉴 자동 닫힘 검증**: 모바일에서 햄버거 클릭 → openBefore=true,
   외부 click → openAfter=false. 정상.
2. **34개 라우트 회귀** (홈/about/worship/ministry/community/media + 갤러리 카테고리 2개 + 페이지네이션/검색 + /does-not-exist): 모두 적정, 600ms 이상 0건, 404 페이지 정상.
3. **콘솔 에러 0건** (`/media/gallery` 포함).

### 5. 베타 3회

- B1 사진 보러 온 성도: home → gallery → cat=예배 → cat=행사 (모두 88~192ms)
- B2 모바일 햄버거 사용자: home → board → notices (98~274ms)
- B3 빈 결과 사용자: cat=봉사(0건 안내) → 전체 보기 (79~86ms)

모두 정상 동선, friction 없음.

### 변경 파일

- 신규: `app/not-found.tsx`, `app/media/gallery/gallery-grid.tsx`,
  `app/admin/gallery/page.tsx`, `app/admin/gallery/actions.ts`,
  `app/admin/gallery/new/page.tsx`, `app/admin/gallery/new/upload-form.tsx`,
  `components/phone-input.tsx`, `scripts/apply-gallery-migration.mjs`
- 수정: `app/page.tsx`(hero CTA), `app/layout.tsx`(OG), `app/globals.css`(focus-visible + gallery + lightbox + stat-grid 5열), `app/board/[id]/page.tsx`(메타+이미지 새 탭), `app/notices/[id]/page.tsx`(메타), `app/new-member/page.tsx`(PhoneInput),
  `app/admin/page.tsx`(GALLERY stat), `app/media/gallery/page.tsx`(재작성),
  `components/site-header.tsx`(외부 클릭/라우트 변경 자동 닫힘),
  `components/admin-side.tsx`(사진첩 메뉴), `supabase/schema.sql`(gallery 블록)

### 운영자 작업 (필요)

Supabase SQL Editor에서 `web/supabase/schema.sql`의 ‘5) 사진첩 (gallery)’
블록을 한 번 실행하면, `/media/gallery`와 `/admin/gallery`가 즉시 동작합니다.
그 후 `node web/scripts/apply-gallery-migration.mjs`로 12장 샘플을 자동 시드할 수 있습니다.

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
