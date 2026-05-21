// PWA 아이콘(192/512) + og:image(1200×630) SVG 생성 후 Supabase Storage 'site' 버킷 업로드
// 사용: cd web && node scripts/generate-pwa-assets.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

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

// SVG로 아이콘 생성 (navy 배경 + gold 십자가)
function iconSvg(size) {
  const cw = Math.round(size * 0.06);
  const cl = Math.round(size * 0.50);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#121b34"/>
  <rect x="${(size - cw) / 2}" y="${(size - cl) / 2}" width="${cw}" height="${cl}" fill="#c79e5f"/>
  <rect x="${(size - cl) / 2}" y="${(size - cw) / 2}" width="${cl}" height="${cw}" fill="#c79e5f"/>
</svg>`;
}

// OG 이미지(1200×630) — navy 배경 + 우측 십자가 + 큰 타이틀
function ogSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1c2a4a"/>
      <stop offset="1" stop-color="#121b34"/>
    </linearGradient>
    <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="1.2" fill="#c79e5f" opacity="0.18"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#dots)"/>
  <!-- 우측 큰 십자가 -->
  <g transform="translate(950 315)" opacity="0.85">
    <rect x="-12" y="-160" width="24" height="320" fill="#c79e5f"/>
    <rect x="-100" y="-72" width="200" height="24" fill="#c79e5f"/>
  </g>
  <!-- 좌측 타이틀 -->
  <g transform="translate(80 250)" font-family="Noto Serif KR, serif">
    <text x="0" y="0" font-size="34" fill="#c79e5f" letter-spacing="6">THE NEAR CHURCH</text>
    <text x="0" y="100" font-size="90" font-weight="700" fill="#ffffff" letter-spacing="-3">가까운교회</text>
    <text x="0" y="170" font-size="32" fill="rgba(255,255,255,0.85)">김포 한강신도시 운양동</text>
    <line x1="0" y1="200" x2="80" y2="200" stroke="#c79e5f" stroke-width="2"/>
    <text x="0" y="260" font-size="26" fill="rgba(255,255,255,0.7)" font-style="italic">이웃과 가까이, 하나님과 가까이</text>
  </g>
</svg>`;
}

const assets = [
  { name: "icon-192.svg", body: iconSvg(192), type: "image/svg+xml" },
  { name: "icon-512.svg", body: iconSvg(512), type: "image/svg+xml" },
  { name: "og-image.svg", body: ogSvg(), type: "image/svg+xml" },
];

console.log("Uploading PWA + OG assets to site/pwa/ ...");
for (const a of assets) {
  const path = `pwa/${a.name}`;
  const { error } = await sb.storage.from("site").upload(path, Buffer.from(a.body), { contentType: a.type, upsert: true });
  if (error) { console.error(` ✗ ${a.name}:`, error.message); continue; }
  const { data: pub } = sb.storage.from("site").getPublicUrl(path);
  console.log(`  ✓ ${a.name} → ${pub.publicUrl}`);
}

// 로컬에 manifest 데이터 export
const meta = {
  icon192: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/site/pwa/icon-192.svg`,
  icon512: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/site/pwa/icon-512.svg`,
  ogImage: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/site/pwa/og-image.svg`,
};
mkdirSync("src/lib", { recursive: true });
writeFileSync("src/lib/pwa-assets.json", JSON.stringify(meta, null, 2));
console.log("\n✓ wrote src/lib/pwa-assets.json");
