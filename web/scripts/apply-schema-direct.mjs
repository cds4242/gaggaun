// Supabase DB에 schema.sql의 gallery 블록을 직접 적용
// 사용: cd web && DB_PASSWORD='...' node scripts/apply-schema-direct.mjs

import pg from "pg";
import { readFileSync } from "node:fs";

const PASSWORD = process.env.DB_PASSWORD;
if (!PASSWORD) {
  console.error("Missing DB_PASSWORD env var");
  process.exit(1);
}

const REF = "paugjrpggyxmhurzurhm";

// 시도 순서: 여러 region의 pooler를 모두 시도
const regions = [
  "ap-northeast-1", "ap-northeast-2", "ap-southeast-1", "ap-southeast-2", "ap-south-1",
  "us-east-1", "us-east-2", "us-west-1", "us-west-2",
  "eu-west-1", "eu-west-2", "eu-west-3", "eu-central-1", "eu-north-1",
  "sa-east-1", "ca-central-1",
];
const candidates = regions.map(r => ({
  kind: `Session pooler (${r})`,
  host: `aws-0-${r}.pooler.supabase.com`,
  port: 6543,
  user: `postgres.${REF}`,
}));

async function tryConnect(c) {
  const client = new pg.Client({
    host: c.host,
    port: c.port,
    database: "postgres",
    user: c.user,
    password: PASSWORD,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
  });
  await client.connect();
  return client;
}

let client = null;
for (const c of candidates) {
  try {
    console.log(`Trying ${c.kind}: ${c.user}@${c.host}:${c.port} ...`);
    client = await tryConnect(c);
    console.log(`  ✓ connected via ${c.kind}`);
    break;
  } catch (e) {
    console.log(`  ✗ ${e.message}`);
  }
}
if (!client) {
  console.error("\nAll connection attempts failed. 비밀번호 또는 host를 다시 확인해 주세요.");
  process.exit(2);
}

// schema.sql 전체 파일에서 gallery 블록만 추출하기보다는, 전체를 idempotent하게 실행 (create if not exists / drop policy if exists 로 모두 안전)
const sql = readFileSync("supabase/schema.sql", "utf8");

console.log("\nExecuting schema.sql (idempotent) ...");
try {
  await client.query(sql);
  console.log("  ✓ schema applied");
} catch (e) {
  console.error("  ✗ failed:", e.message);
  await client.end();
  process.exit(3);
}

// 확인
const { rows } = await client.query("select count(*)::int as c from public.gallery_photos");
console.log(`\ngallery_photos row count: ${rows[0].c}`);

await client.end();
console.log("Done.");
