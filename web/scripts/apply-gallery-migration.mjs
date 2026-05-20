// gallery_photos 테이블과 RLS, gallery 스토리지 버킷 생성
// 사용: cd web && node scripts/apply-gallery-migration.mjs

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
if (!url || !key) { console.error("Missing env"); process.exit(1); }
const sb = createClient(url, key, { auth: { persistSession: false } });

// gallery 버킷이 없으면 생성 (public)
console.log("Creating storage bucket 'gallery' (public) if missing ...");
{
  const { data: existing } = await sb.storage.getBucket("gallery");
  if (existing) {
    console.log("  bucket already exists");
  } else {
    const { error } = await sb.storage.createBucket("gallery", { public: true });
    if (error) {
      console.error("  failed:", error.message);
      // 계속 진행
    } else {
      console.log("  ✓ created");
    }
  }
}

// 테이블 존재 확인 후 시드 8건
console.log("\nChecking gallery_photos table ...");
const { error: probeErr, count } = await sb
  .from("gallery_photos")
  .select("*", { count: "exact", head: true });

if (probeErr) {
  console.error("\n  ⚠ gallery_photos 테이블이 없습니다.");
  console.error("    Supabase 대시보드 SQL Editor에서 web/supabase/schema.sql 의 다음 블록을 실행해 주세요:");
  console.error("    -- 5) 사진첩 (gallery) ~ gallery_modify");
  process.exit(2);
}

console.log(`  current count: ${count}`);

if ((count ?? 0) === 0) {
  console.log("\nSeeding 12 sample gallery photos ...");
  const CATS = ["예배", "행사", "교제", "봉사", "기타"];
  const TITLES = [
    "주일 본당 — 봄 부활절 예배",
    "찬양대 연습",
    "주일학교 봄소풍",
    "금요 합심기도회",
    "어버이주일 점심 나눔",
    "단기선교 보고회",
    "여전도회 월례 모임",
    "남선교회 환경 정비 봉사",
    "성탄 칸타타 합창",
    "청년부 야외 예배",
    "주일 1부 예배",
    "수요 강해예배",
  ];
  const NAVY_PNG = Buffer.from("89504E470D0A1A0A0000000D49484452000000010000000108020000007E9B55000000017352474200AECE1CE90000000C504C5445121B341C2A4AC79E5F6F6F77270000000A49444154789C63606060000000040001274A4A1C0000000049454E44AE426082", "hex");

  const rows = [];
  for (let i = 0; i < TITLES.length; i++) {
    const t = TITLES[i];
    const cat = CATS[i % CATS.length];
    const path = `seed-${Date.now()}-${i}.png`;
    const up = await sb.storage.from("gallery").upload(path, NAVY_PNG, { contentType: "image/png" });
    if (up.error) {
      console.error(`  upload #${i} failed:`, up.error.message);
      continue;
    }
    const { data: pub } = sb.storage.from("gallery").getPublicUrl(path);
    rows.push({
      title: t,
      category: cat,
      image_url: pub.publicUrl,
      image_path: path,
      taken_at: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    });
  }
  const { error: insErr, data } = await sb.from("gallery_photos").insert(rows).select("id");
  if (insErr) {
    console.error("  insert failed:", insErr.message);
    process.exit(3);
  }
  console.log(`  ✓ seeded ${data.length} photos`);
}

console.log("\nDone.");
