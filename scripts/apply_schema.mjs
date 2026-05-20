import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';

const PROJECT_REF = 'paugjrpggyxmhurzurhm';
const PASSWORD = process.env.SUPABASE_DB_PASSWORD;
if (!PASSWORD) {
  console.error('SUPABASE_DB_PASSWORD env var is required');
  process.exit(1);
}

// Try direct first, then pooler. Direct uses port 5432, pooler 6543.
const candidates = [
  {
    label: 'session pooler aws-1 ap-northeast-2',
    config: {
      host: 'aws-1-ap-northeast-2.pooler.supabase.com',
      port: 5432,
      user: `postgres.${PROJECT_REF}`,
      password: PASSWORD,
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
    },
  },
];

const sql = fs.readFileSync(path.resolve('./web/supabase/schema.sql'), 'utf8');

let client;
for (const c of candidates) {
  console.log(`Trying ${c.label} ...`);
  client = new pg.Client(c.config);
  try {
    await client.connect();
    console.log(`✔ connected via ${c.label}`);
    break;
  } catch (e) {
    console.log(`  ✗ ${e.code ?? ''} ${e.message}`);
    client = null;
  }
}
if (!client) {
  console.error('All connection attempts failed.');
  process.exit(2);
}

try {
  console.log('Applying schema.sql ...');
  await client.query(sql);
  console.log('✔ schema applied');

  // Create storage bucket via SQL
  await client.query(`insert into storage.buckets (id, name, public) values ('board-images','board-images', true) on conflict (id) do nothing;`);
  console.log('✔ storage bucket "board-images" ensured');

  // Public read policy for the bucket (RLS on storage.objects is enabled by default in Supabase)
  await client.query(`
    drop policy if exists "board-images public read" on storage.objects;
    create policy "board-images public read" on storage.objects
      for select using (bucket_id = 'board-images');
    drop policy if exists "board-images public insert" on storage.objects;
    create policy "board-images public insert" on storage.objects
      for insert with check (bucket_id = 'board-images');
    drop policy if exists "board-images public delete" on storage.objects;
    create policy "board-images public delete" on storage.objects
      for delete using (bucket_id = 'board-images');
  `);
  console.log('✔ storage policies set');

  const { rows: tables } = await client.query(`
    select table_name from information_schema.tables
    where table_schema = 'public'
    order by table_name;
  `);
  console.log('Tables in public:', tables.map(t => t.table_name));
} finally {
  await client.end();
}
