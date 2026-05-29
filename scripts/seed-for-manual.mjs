// 운영 Supabase에 매뉴얼 캡쳐용 시드 추가
// - site_settings (금주 정보 4종) — 비어 있으면 채움
// - sermons — 비어 있으면 4개 등록
// - gallery_photos — 비어 있으면 placeholder URL로 8장 등록 (Unsplash 공개)
// - boards — '기도제목' 보드 1개 추가 (없을 때만)
// - notices, board_posts, new_members — 이미 채워져 있으면 그대로 둠
//
// 사용: cd D:/ai/toy5/web && node ../scripts/seed-for-manual.mjs

import fs from "node:fs";
import path from "node:path";

const envPath = path.resolve("D:/ai/toy5/web/.env.local");
const env = Object.fromEntries(
  fs
    .readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const idx = l.indexOf("=");
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    }),
);

const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SRK = env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !SRK) {
  console.error("env에 SUPABASE URL/SERVICE_ROLE_KEY 없음");
  process.exit(1);
}

const H = {
  apikey: SRK,
  Authorization: `Bearer ${SRK}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

async function get(table, query = "") {
  const r = await fetch(`${URL}/rest/v1/${table}?${query}`, { headers: H });
  if (!r.ok) throw new Error(`${table} GET ${r.status} ${await r.text()}`);
  return r.json();
}
async function post(table, body) {
  const r = await fetch(`${URL}/rest/v1/${table}`, {
    method: "POST",
    headers: H,
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`${table} POST ${r.status} ${await r.text()}`);
  return r.json();
}
async function upsert(table, body, onConflict) {
  const r = await fetch(`${URL}/rest/v1/${table}?on_conflict=${onConflict}`, {
    method: "POST",
    headers: { ...H, Prefer: "return=representation,resolution=merge-duplicates" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`${table} UPSERT ${r.status} ${await r.text()}`);
  return r.json();
}

// 1. site_settings (this_week) — 테이블 있으면 upsert, 없으면 skip
try {
  await get("site_settings", "select=key&limit=1");
  console.log("→ site_settings (금주 정보) upsert");
  await upsert(
    "site_settings",
    [
      { key: "home.strip.date", value: "2026. 5. 31 (주일)", label: "금주 주일", description: "히어로 띠 1열에 표시되는 날짜", group_key: "this_week", sort_order: 10 },
      { key: "home.strip.worship", value: "오전 9:00 · 11:00", label: "주일 예배 시간", description: "히어로 띠 2열", group_key: "this_week", sort_order: 20 },
      { key: "home.strip.text", value: "요한복음 13:34-35", label: "설교 본문", description: "히어로 띠 3열", group_key: "this_week", sort_order: 30 },
      { key: "home.strip.preacher", value: "김요한 담임목사", label: "설교자", description: "히어로 띠 4열", group_key: "this_week", sort_order: 40 },
    ],
    "key",
  );
} catch (e) {
  console.log("! site_settings 테이블 미존재, 건너뜀:", String(e.message).slice(0, 80));
}

// 2. sermons — 비어 있으면 4개
const sermons = await get("sermons", "select=id&limit=1");
if (sermons.length === 0) {
  console.log("→ sermons 시드 4건");
  await post("sermons", [
    {
      title: "서로 사랑하라 — 새 계명의 자리",
      preacher: "김요한 담임목사",
      verse: "요한복음 13:34-35",
      badge: "주일 1부",
      youtube_id: "dQw4w9WgXcQ",
      duration: "38:21",
      summary: "주님이 우리에게 새로 주신 계명, 서로 사랑하라.",
      preached_at: "2026-05-24",
    },
    {
      title: "광야의 만나 — 오늘의 양식",
      preacher: "김요한 담임목사",
      verse: "출애굽기 16:13-21",
      badge: "주일 2부",
      youtube_id: "M7lc1UVf-VE",
      duration: "41:05",
      summary: "광야에서 매일 내려오는 만나, 오늘 우리에게도 필요한 일용할 양식.",
      preached_at: "2026-05-17",
    },
    {
      title: "기도의 자리 — 한적한 곳에서",
      preacher: "박바울 부목사",
      verse: "마가복음 1:35",
      badge: "수요 강해",
      youtube_id: "9bZkp7q19f0",
      duration: "32:48",
      summary: "예수님이 한적한 곳에서 기도하셨던 그 시간, 우리도 회복해야 한다.",
      preached_at: "2026-05-20",
    },
    {
      title: "감사의 능력 — 범사에 감사하라",
      preacher: "김요한 담임목사",
      verse: "데살로니가전서 5:16-18",
      badge: "주일 1부",
      youtube_id: "ZbZSe6N_BXs",
      duration: "37:12",
      summary: "범사에 감사하는 삶이 그리스도인의 자리이다.",
      preached_at: "2026-05-10",
    },
  ]);
} else {
  console.log("→ sermons 이미 있음, 건너뜀");
}

// 3. gallery_photos — 비어 있으면 placeholder 8장
const gallery = await get("gallery_photos", "select=id&limit=1");
if (gallery.length === 0) {
  console.log("→ gallery_photos 시드 8건 (placeholder)");
  const u = (id, w = 800, h = 600) => `https://picsum.photos/seed/gaggaun-${id}/${w}/${h}`;
  await post(
    "gallery_photos",
    [
      { title: "주일 1부 예배", category: "예배", image_url: u("worship1"), image_path: "manual/worship1.jpg", taken_at: "2026-05-24" },
      { title: "주일 2부 예배 찬양", category: "예배", image_url: u("worship2"), image_path: "manual/worship2.jpg", taken_at: "2026-05-17" },
      { title: "어버이 주일 행사", category: "행사", image_url: u("event1"), image_path: "manual/event1.jpg", taken_at: "2026-05-10" },
      { title: "전교인 야유회", category: "행사", image_url: u("event2"), image_path: "manual/event2.jpg", taken_at: "2026-04-19" },
      { title: "구역 모임 친교", category: "교제", image_url: u("fellowship1"), image_path: "manual/fellowship1.jpg", taken_at: "2026-05-15" },
      { title: "청년부 교제", category: "교제", image_url: u("fellowship2"), image_path: "manual/fellowship2.jpg", taken_at: "2026-05-08" },
      { title: "독거 어르신 섬김", category: "봉사", image_url: u("service1"), image_path: "manual/service1.jpg", taken_at: "2026-04-26" },
      { title: "지역 어린이집 봉사", category: "봉사", image_url: u("service2"), image_path: "manual/service2.jpg", taken_at: "2026-04-12" },
    ],
  );
} else {
  console.log("→ gallery_photos 이미 있음, 건너뜀");
}

// 4. boards — '기도제목' 보드 추가 (없을 때만)
const prayer = await get("boards", "slug=eq.prayer&select=id");
if (prayer.length === 0) {
  console.log("→ boards: 기도제목 1건 추가");
  await post("boards", [
    {
      slug: "prayer",
      name: "기도제목",
      description: "성도들의 기도 제목을 함께 나누는 공간입니다.",
      category: "공동체",
      write_permission: "anyone",
      comment_enabled: true,
      secret_enabled: false,
      image_upload_enabled: false,
      sort_order: 1,
      is_active: true,
    },
  ]);
} else {
  console.log("→ boards: 기도제목 이미 있음, 건너뜀");
}

console.log("✓ 시드 완료");
