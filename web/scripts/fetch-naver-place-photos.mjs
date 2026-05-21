// 네이버 플레이스 (가까운교회) "업체" 사진 다운 → Supabase storage 'site' 버킷 업로드
// 사용: cd web && node scripts/fetch-naver-place-photos.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "node:fs";

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

const RAW_URLS = [
  "https://ldb-phinf.pstatic.net/20190201_127/1549017305100PPLVi_JPEG/M_l-7rRK3XswVkMf1L1PZAvY.jpg",
  "https://ldb-phinf.pstatic.net/20190201_284/1549017305026IwaRq_JPEG/YE37ojE2zafg3mWh_N_36ZdA.jpg",
  "https://ldb-phinf.pstatic.net/20190201_6/1549017305052Pi4QN_JPEG/jPUfJLvLHKnb0M2RP0DVohRb.jpg",
  "https://ldb-phinf.pstatic.net/20190201_124/1549017305112qL9bx_JPEG/Gn1OAYZoCUHhfNQdLQ56EH7Z.jpg",
  "https://ldb-phinf.pstatic.net/20190201_159/1549017305100Snc3W_JPEG/DhT2UyLHeEot8-3VY72uI5RO.jpg",
  "https://ldb-phinf.pstatic.net/20190201_204/1549017306015tNhqJ_JPEG/IV7CoDYzdKT4idoVXOcsvDOH.jpg",
  "https://ldb-phinf.pstatic.net/20190201_243/1549017305720eyNSY_JPEG/juw9kLiH4pzjR23s3N6IRePu.jpg",
  "https://ldb-phinf.pstatic.net/20190201_197/1549017305244uHmtn_JPEG/sQjERMtcX8ZNpVYACfyiBJnB.jpg",
];

{
  const { data } = await sb.storage.getBucket("site");
  if (!data) {
    const { error } = await sb.storage.createBucket("site", { public: true });
    if (error) console.log("bucket create failed (계속 진행):", error.message);
    else console.log("✓ created bucket 'site'");
  }
}

{
  const { data: existing } = await sb.storage.from("site").list("naver-place");
  if (existing && existing.length) {
    const paths = existing.map(f => `naver-place/${f.name}`);
    await sb.storage.from("site").remove(paths);
    console.log(`  removed ${paths.length} previous`);
  }
}

const fetched = [];
for (let i = 0; i < RAW_URLS.length; i++) {
  const url = RAW_URLS[i];
  // 원본 그대로 받는 게 더 안전 — 변환 프록시는 referer/UA 검증 있음
  const proxied = url;
  try {
    const r = await fetch(proxied, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        "Referer": "https://map.naver.com/",
      },
    });
    if (!r.ok) throw new Error("status " + r.status);
    const buf = Buffer.from(await r.arrayBuffer());
    const path = `naver-place/church-${String(i + 1).padStart(2, "0")}.jpg`;
    const up = await sb.storage.from("site").upload(path, buf, { contentType: "image/jpeg", upsert: true });
    if (up.error) throw up.error;
    const { data: pub } = sb.storage.from("site").getPublicUrl(path);
    fetched.push({ path, url: pub.publicUrl, bytes: buf.byteLength });
    console.log(`  ✓ #${i + 1} ${buf.byteLength.toLocaleString()} bytes`);
  } catch (e) {
    console.error(`  ✗ #${i + 1}`, e.message);
  }
}

console.log("\nDone. Uploaded URLs:");
for (const f of fetched) console.log(f.url);

writeFileSync("src/lib/site-photos.json", JSON.stringify(fetched.map(f => f.url), null, 2));
console.log("\n✓ wrote src/lib/site-photos.json");
