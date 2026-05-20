// 실제로 보이는 크기의 placeholder 이미지로 gallery 재시드
// 1×1 PNG 대신 600×400 컬러 SVG를 PNG로 변환 — 의존성 없이 그리려고 SVG 그대로 업로드 (Storage는 image/svg+xml 허용)

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

function loadDotenv(path) {
  try {
    const txt = readFileSync(path, "utf8");
    for (const line of txt.split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (!m) continue;
      let v = m[2];
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      if (process.env[m[1]] == null) process.env[m[1]] = v;
    }
  } catch {}
}
loadDotenv(".env.local");

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

// 기존 시드 정리
console.log("Removing previous seed photos ...");
const { data: oldRows } = await sb.from("gallery_photos").select("id, image_path").like("image_path", "seed-%");
if (oldRows && oldRows.length) {
  const paths = oldRows.map(r => r.image_path);
  await sb.storage.from("gallery").remove(paths);
  await sb.from("gallery_photos").delete().like("image_path", "seed-%");
  console.log(`  removed ${oldRows.length}`);
}

const CATS = ["예배", "행사", "교제", "봉사", "기타"];
const PALETTE = [
  ["#1c2a4a", "#c79e5f"], // navy + gold
  ["#6b1f2a", "#e6d2a6"], // burgundy + soft gold
  ["#2a3a5e", "#b08648"],
  ["#1c2a4a", "#e6d2a6"],
  ["#121b34", "#c79e5f"],
];

const ITEMS = [
  { t: "주일 본당 — 봄 부활절 예배", c: "예배" },
  { t: "찬양대 연습", c: "예배" },
  { t: "주일학교 봄소풍", c: "행사" },
  { t: "금요 합심기도회", c: "예배" },
  { t: "어버이주일 점심 나눔", c: "교제" },
  { t: "단기선교 보고회", c: "행사" },
  { t: "여전도회 월례 모임", c: "교제" },
  { t: "남선교회 환경 정비 봉사", c: "봉사" },
  { t: "성탄 칸타타 합창", c: "행사" },
  { t: "청년부 야외 예배", c: "예배" },
  { t: "주일 1부 예배", c: "예배" },
  { t: "수요 강해예배", c: "예배" },
];

console.log(`Seeding ${ITEMS.length} visible placeholder photos ...`);
const rows = [];
for (let i = 0; i < ITEMS.length; i++) {
  const [bg, fg] = PALETTE[i % PALETTE.length];
  const item = ITEMS[i];
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
  <defs>
    <linearGradient id="g${i}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg}" />
      <stop offset="1" stop-color="${bg}" stop-opacity="0.7" />
    </linearGradient>
    <pattern id="dots${i}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="1.2" fill="${fg}" opacity="0.25"/>
    </pattern>
  </defs>
  <rect width="900" height="600" fill="url(#g${i})"/>
  <rect width="900" height="600" fill="url(#dots${i})"/>
  <g transform="translate(450 300)" text-anchor="middle" font-family="Noto Serif KR, serif">
    <text x="0" y="-50" font-size="42" font-weight="700" fill="${fg}">${item.t}</text>
    <text x="0" y="10" font-size="20" fill="${fg}" opacity="0.85">${item.c}</text>
    <line x1="-80" y1="50" x2="80" y2="50" stroke="${fg}" stroke-width="2" opacity="0.6"/>
    <text x="0" y="100" font-size="16" fill="${fg}" opacity="0.6" font-style="italic">가까운교회 · The Near Church</text>
  </g>
</svg>`;
  const path = `seed-v2-${Date.now()}-${i}.svg`;
  const up = await sb.storage.from("gallery").upload(path, Buffer.from(svg), { contentType: "image/svg+xml" });
  if (up.error) { console.error(` #${i} upload failed:`, up.error.message); continue; }
  const { data: pub } = sb.storage.from("gallery").getPublicUrl(path);
  rows.push({
    title: item.t,
    category: item.c,
    image_url: pub.publicUrl,
    image_path: path,
    taken_at: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  });
}
const { error, data } = await sb.from("gallery_photos").insert(rows).select("id");
if (error) { console.error("insert failed:", error.message); process.exit(1); }
console.log(`  ✓ inserted ${data.length}`);
console.log("Done.");
