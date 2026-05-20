// 이미지 업로드 → 게시글 등록 → 조회 10회 사이클
// 사용: cd web && node scripts/image-cycle-10.mjs

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

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sb = createClient(url, key, { auth: { persistSession: false } });

const BUCKET = "board-images";
const SITE = process.env.SITE_BASE || "http://localhost:3000";

// 색상이 다른 100×100 PNG를 동적으로 만들고 싶지만, 의존성을 안 쓰려고
// 가장 작은 유효 PNG(1x1 빨강) 바이너리 사용. 매번 동일.
const RED_1x1_PNG = Buffer.from(
  "89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C4890000000D49444154789C63F8CFC000000003000100487D02FE0000000049454E44AE426082",
  "hex",
);

const results = [];
for (let i = 1; i <= 10; i++) {
  const t0 = Date.now();
  const path = `auto-${Date.now()}-${i}.png`;
  // 1) Storage 업로드
  const up = await sb.storage.from(BUCKET).upload(path, RED_1x1_PNG, {
    contentType: "image/png",
    upsert: false,
  });
  if (up.error) {
    results.push({ i, step: "upload", error: up.error.message });
    continue;
  }
  const { data: pub } = sb.storage.from(BUCKET).getPublicUrl(path);
  const publicUrl = pub.publicUrl;

  // 2) 게시글 INSERT
  const { data: post, error: insErr } = await sb
    .from("board_posts")
    .insert({
      title: `[이미지테스트] 사이클 #${String(i).padStart(2, "0")}`,
      content: `자동 이미지 업로드 사이클 #${i} — ${new Date().toISOString()}`,
      author_name: "이미지테스터",
      author_email: null,
      image_urls: [publicUrl],
    })
    .select("id")
    .single();
  if (insErr) {
    results.push({ i, step: "insert", error: insErr.message });
    continue;
  }

  // 3) Public URL 직접 GET (이미지 다운로드 가능 여부)
  let imgStatus = 0, imgBytes = 0;
  try {
    const r = await fetch(publicUrl);
    imgStatus = r.status;
    imgBytes = (await r.arrayBuffer()).byteLength;
  } catch (e) {
    imgStatus = -1;
  }

  // 4) 사이트 detail 페이지 GET (조회수 증가 + 이미지 렌더 HTML 포함)
  let pageStatus = 0, pageBytes = 0, hasImgTag = false;
  try {
    const r = await fetch(`${SITE}/board/${post.id}?nocache=${Date.now()}`);
    pageStatus = r.status;
    const html = await r.text();
    pageBytes = html.length;
    hasImgTag = html.includes(publicUrl);
  } catch (e) {
    pageStatus = -1;
  }

  const ms = Date.now() - t0;
  results.push({ i, id: post.id, imgStatus, imgBytes, pageStatus, pageBytes, hasImgTag, ms });
}

console.log(JSON.stringify(results, null, 2));
const ok = results.filter(r => r.imgStatus === 200 && r.pageStatus === 200 && r.hasImgTag).length;
console.log(`\nResult: ${ok} / 10 fully successful`);
