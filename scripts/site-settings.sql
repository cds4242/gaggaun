-- 매뉴얼 캡쳐용 site_settings 테이블 + 금주 정보 시드
-- Supabase Dashboard → SQL Editor 에서 한 번 실행하세요.
-- (schema.sql의 7) 블록과 동일 — 이미 있으면 no-op)

create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  label text not null,
  description text,
  group_key text not null default 'general',
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

-- 금주 정보 4종
insert into public.site_settings (key, value, label, description, group_key, sort_order) values
  ('home.strip.date',      '2026. 5. 31 (주일)', '금주 주일',     '히어로 띠 1열에 표시되는 날짜', 'this_week', 10),
  ('home.strip.worship',   '오전 9:00 · 11:00',  '주일 예배 시간', '히어로 띠 2열',               'this_week', 20),
  ('home.strip.text',      '요한복음 13:34-35',  '설교 본문',     '히어로 띠 3열',               'this_week', 30),
  ('home.strip.preacher',  '김요한 담임목사',     '설교자',        '히어로 띠 4열',               'this_week', 40)
on conflict (key) do nothing;

-- 상단 메뉴 트리는 이미 admin/nav에서 잘 작동하고 있으면 굳이 안 넣어도 됨.
-- 비어 있으면 코드 기본값으로 폴백되므로 캡쳐엔 문제 없음.
