-- 가까운교회 사이트 스키마
-- Supabase SQL Editor에서 그대로 실행하면 됩니다.

-- 1) 관리자 화이트리스트
create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

-- 관리자 판별 헬퍼
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admins a
    join auth.users u on lower(u.email) = lower(a.email)
    where u.id = auth.uid()
  );
$$;

-- 2) 공지사항
create table if not exists public.notices (
  id bigserial primary key,
  title text not null,
  content text not null,
  pinned boolean not null default false,
  author_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notices_created_at_idx on public.notices (created_at desc);

-- 3) 게시판 (멀티 보드 마스터 + 게시글)
create table if not exists public.boards (
  id bigserial primary key,
  slug text unique not null,                                       -- URL 식별자 (free, qna, prayer ...)
  name text not null,                                              -- 표시명
  description text,                                                -- 안내 문구
  category text,                                                   -- 메뉴 분류 (예: '소식', '공동체')
  write_permission text not null default 'anyone'
    check (write_permission in ('anyone','member','admin')),       -- 1차 PR에서는 컬럼만 두고 anyone 만 적용
  comment_enabled boolean not null default true,
  secret_enabled boolean not null default false,
  image_upload_enabled boolean not null default true,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists boards_sort_idx on public.boards (sort_order, id);

-- 기본 보드 시드 (자유게시판 1건). 없을 때만 삽입.
-- 기본 보드 시드 (자유게시판). category는 NAV 상위 메뉴 이름과 정확히 일치해야
-- 해당 드롭다운에 자동 노출된다 (보드 → 메뉴 매핑 정책).
insert into public.boards (slug, name, description, category, sort_order)
select 'free', '자유게시판', '성도들의 따뜻한 나눔 공간', '교회소식', 0
where not exists (select 1 from public.boards where slug = 'free');

create table if not exists public.board_posts (
  id bigserial primary key,
  title text not null,
  content text not null,
  author_name text not null,
  author_email text,
  image_urls text[] not null default '{}',
  views integer not null default 0,
  password_hash text,                                 -- 익명 작성자 본인 확인용 4자리 비번 bcrypt 해시
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.board_posts add column if not exists password_hash text;
alter table public.board_posts add column if not exists board_id bigint references public.boards(id) on delete cascade;

-- 기존 게시글 일괄 이관: board_id가 비어있으면 자유게시판으로
update public.board_posts
   set board_id = (select id from public.boards where slug = 'free')
 where board_id is null;

-- 이관 완료 후 NOT NULL 강제. 이미 NOT NULL이면 ALTER는 no-op.
alter table public.board_posts alter column board_id set not null;

create index if not exists board_posts_created_at_idx on public.board_posts (created_at desc);
create index if not exists board_posts_board_idx on public.board_posts (board_id, created_at desc);

-- 4) 새가족 등록
create table if not exists public.new_members (
  id bigserial primary key,
  name text not null,
  phone text not null,
  birth_date date,
  address text,
  gender text check (gender in ('M', 'F')),
  invited_by text,
  introduction text,
  marital_status text,
  prayer_request text,
  visited_at date,
  status text not null default 'pending',  -- pending / contacted / settled
  created_at timestamptz not null default now()
);

create index if not exists new_members_created_at_idx on public.new_members (created_at desc);

-- ───────────────────────────────────────────────────────────────
-- RLS 정책
-- ───────────────────────────────────────────────────────────────
alter table public.admins enable row level security;
alter table public.notices enable row level security;
alter table public.boards enable row level security;
alter table public.board_posts enable row level security;
alter table public.new_members enable row level security;

-- boards: 누구나 조회, 작성/수정/삭제는 관리자만
drop policy if exists boards_select on public.boards;
create policy boards_select on public.boards for select using (true);

drop policy if exists boards_modify on public.boards;
create policy boards_modify on public.boards
  for all using (public.is_admin()) with check (public.is_admin());

-- admins: 본인이 admin일 때만 조회 가능
drop policy if exists admins_select on public.admins;
create policy admins_select on public.admins
  for select using (public.is_admin());

-- notices: 누구나 조회, 작성/수정/삭제는 관리자만
drop policy if exists notices_select on public.notices;
create policy notices_select on public.notices for select using (true);

drop policy if exists notices_modify on public.notices;
create policy notices_modify on public.notices
  for all using (public.is_admin()) with check (public.is_admin());

-- board_posts: 누구나 조회/작성. 수정/삭제는 관리자만 (간단화)
drop policy if exists board_select on public.board_posts;
create policy board_select on public.board_posts for select using (true);

drop policy if exists board_insert on public.board_posts;
create policy board_insert on public.board_posts for insert with check (true);

drop policy if exists board_modify on public.board_posts;
create policy board_modify on public.board_posts
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists board_delete on public.board_posts;
create policy board_delete on public.board_posts
  for delete using (public.is_admin());

-- new_members: 누구나 등록(insert), 조회/수정/삭제는 관리자만
drop policy if exists new_members_insert on public.new_members;
create policy new_members_insert on public.new_members for insert with check (true);

drop policy if exists new_members_select on public.new_members;
create policy new_members_select on public.new_members
  for select using (public.is_admin());

drop policy if exists new_members_modify on public.new_members;
create policy new_members_modify on public.new_members
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists new_members_delete on public.new_members;
create policy new_members_delete on public.new_members
  for delete using (public.is_admin());

-- ───────────────────────────────────────────────────────────────
-- 5) 사진첩 (gallery)
-- ───────────────────────────────────────────────────────────────
create table if not exists public.gallery_photos (
  id bigserial primary key,
  title text,
  category text not null default '기타' check (category in ('예배','행사','교제','봉사','기타')),
  image_url text not null,
  image_path text not null,
  taken_at date,
  created_at timestamptz not null default now()
);
create index if not exists gallery_photos_created_at_idx on public.gallery_photos (created_at desc);
create index if not exists gallery_photos_category_idx on public.gallery_photos (category);

alter table public.gallery_photos enable row level security;

drop policy if exists gallery_select on public.gallery_photos;
create policy gallery_select on public.gallery_photos for select using (true);

drop policy if exists gallery_modify on public.gallery_photos;
create policy gallery_modify on public.gallery_photos
  for all using (public.is_admin()) with check (public.is_admin());

-- ───────────────────────────────────────────────────────────────
-- board_posts views 원자적 증가 RPC + 게시판 댓글
-- ───────────────────────────────────────────────────────────────
create or replace function public.increment_board_view(post_id bigint)
returns void
language sql
security definer
set search_path = public
as $$
  update public.board_posts set views = coalesce(views, 0) + 1 where id = post_id;
$$;
revoke all on function public.increment_board_view(bigint) from public;
grant execute on function public.increment_board_view(bigint) to anon, authenticated;

create table if not exists public.board_comments (
  id bigserial primary key,
  post_id bigint not null references public.board_posts(id) on delete cascade,
  parent_id bigint references public.board_comments(id) on delete cascade,
  author_name text not null,
  content text not null,
  password_hash text,
  created_at timestamptz not null default now()
);
alter table public.board_comments add column if not exists password_hash text;
create index if not exists board_comments_post_idx on public.board_comments(post_id, created_at);
create index if not exists board_comments_parent_idx on public.board_comments(parent_id);

alter table public.board_comments enable row level security;

drop policy if exists board_comments_select on public.board_comments;
create policy board_comments_select on public.board_comments for select using (true);

drop policy if exists board_comments_insert on public.board_comments;
create policy board_comments_insert on public.board_comments for insert with check (true);

drop policy if exists board_comments_delete on public.board_comments;
create policy board_comments_delete on public.board_comments for delete using (public.is_admin());

-- ───────────────────────────────────────────────────────────────
-- 6) 설교 영상 (sermons)
-- ───────────────────────────────────────────────────────────────
create table if not exists public.sermons (
  id bigserial primary key,
  title text not null,
  preacher text not null,
  verse text,
  badge text,                        -- 예: '주일 1부', '주일 2부', '수요 강해'
  youtube_id text not null,          -- 11자리 YouTube video ID
  duration text,                     -- 'mm:ss' 형식
  summary text,
  preached_at date,                  -- 설교 일자
  category text,                     -- null=설교영상 / 'hallelujah'=할렐루야 성가대 / 'hosanna'=호산나 성가대
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- 기존 배포 환경에 컬럼 없을 수 있어 idempotent하게 추가
alter table public.sermons add column if not exists category text;
create index if not exists sermons_preached_at_idx on public.sermons (preached_at desc);
create index if not exists sermons_created_at_idx on public.sermons (created_at desc);
create index if not exists sermons_category_idx on public.sermons (category, preached_at desc);

alter table public.sermons enable row level security;

drop policy if exists sermons_select on public.sermons;
create policy sermons_select on public.sermons for select using (true);

drop policy if exists sermons_modify on public.sermons;
create policy sermons_modify on public.sermons
  for all using (public.is_admin()) with check (public.is_admin());

-- ───────────────────────────────────────────────────────────────
-- 7) 사이트 설정 (site_settings)
-- 어드민에서 자주 바뀌는 값을 코드 수정 없이 관리한다.
-- 1차 적용 범위: 홈 히어로 띠의 금주 정보 4종.
-- ───────────────────────────────────────────────────────────────
create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  label text not null,                -- 어드민 UI에 표시할 한글 라벨
  description text,                   -- 보충 설명
  group_key text not null default 'general',  -- 어드민에서 폼 그룹화용
  sort_order int not null default 0,
  updated_at timestamptz not null default now(),
  updated_by text
);

alter table public.site_settings enable row level security;

drop policy if exists site_settings_select on public.site_settings;
create policy site_settings_select on public.site_settings for select using (true);

drop policy if exists site_settings_modify on public.site_settings;
create policy site_settings_modify on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- 금주 정보 초기 시드 (이미 있으면 건너뜀)
insert into public.site_settings (key, value, label, description, group_key, sort_order) values
  ('home.strip.date',      '2026. 5. 24 (주일)',  '금주 주일',    '히어로 띠 1열에 표시되는 날짜', 'this_week', 10),
  ('home.strip.worship',   '오전 9:00 · 11:00',  '주일 예배 시간', '히어로 띠 2열',                'this_week', 20),
  ('home.strip.text',      '요한복음 13:34-36',   '설교 본문',    '히어로 띠 3열',                'this_week', 30),
  ('home.strip.preacher',  '김요한 담임목사',     '설교자',       '히어로 띠 4열',                'this_week', 40)
on conflict (key) do nothing;

-- 상단 메뉴 트리 (JSON). 어드민 /admin/nav 에서 편집.
-- 값은 NavItem[] JSON 문자열. 보드 자동 주입은 buildNav에서 별도로 머지.
-- 시드 값은 lib/nav.ts의 정적 NAV와 동일.
insert into public.site_settings (key, value, label, description, group_key, sort_order) values
  ('nav.tree', '[{"label":"교회소개","href":"/about","children":[{"label":"인사말","href":"/about/greeting"},{"label":"비전과 사명","href":"/about/vision"},{"label":"교회 연혁","href":"/about/history"},{"label":"오시는 길","href":"/about/location"}]},{"label":"예배안내","href":"/worship","children":[{"label":"주일예배","href":"/worship/sunday"},{"label":"수요예배","href":"/worship/wednesday"},{"label":"새벽예배","href":"/worship/dawn"},{"label":"금요철야","href":"/worship/friday"}]},{"label":"설교말씀","href":"/media/sermon","children":[{"label":"설교 영상","href":"/media/sermon"},{"label":"갤러리","href":"/media/gallery"}]},{"label":"교회소식","href":"/notices","children":[{"label":"공지사항","href":"/notices"},{"label":"갤러리","href":"/media/gallery"}]},{"label":"공동체","href":"/community","children":[{"label":"구역모임","href":"/community/cell"},{"label":"남선교회","href":"/community/men"},{"label":"여전도회","href":"/community/women"},{"label":"청년부","href":"/ministry/youth"},{"label":"주일학교","href":"/ministry/children"}]}]',
   '상단 메뉴', '사이트 헤더의 메인메뉴와 하위메뉴 트리 (JSON)', 'navigation', 10)
on conflict (key) do nothing;

-- ───────────────────────────────────────────────────────────────
-- Storage 버킷
-- 대시보드에서 "board-images", "gallery" 버킷을 public 으로 만들어두세요.
-- 또는 아래 SQL 실행:
-- insert into storage.buckets (id, name, public) values ('board-images', 'board-images', true) on conflict do nothing;
-- insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true) on conflict do nothing;
-- ───────────────────────────────────────────────────────────────
