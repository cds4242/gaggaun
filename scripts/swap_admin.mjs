import pg from 'pg';
import { fetch } from 'undici';

const PROJECT_REF = 'paugjrpggyxmhurzurhm';
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;
const SERVICE_KEY = process.env.SERVICE_KEY;
const DB_PW = process.env.SUPABASE_DB_PASSWORD;
const NEW_EMAIL = 'admin@admin.com';
const NEW_PW = 'admin1234';
const OLD_EMAIL = 'dschoi@konai.com';

if (!SERVICE_KEY || !DB_PW) {
  console.error('Need SERVICE_KEY + SUPABASE_DB_PASSWORD');
  process.exit(1);
}

const db = new pg.Client({
  host: 'aws-1-ap-northeast-2.pooler.supabase.com',
  port: 5432,
  user: `postgres.${PROJECT_REF}`,
  password: DB_PW,
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
});
await db.connect();

// 1) Find old auth user id
const { rows: oldRows } = await db.query(
  `select id from auth.users where lower(email) = lower($1)`,
  [OLD_EMAIL]
);
const oldId = oldRows[0]?.id;
console.log('Old user id:', oldId ?? '(none)');

// 2) Delete old admin from admins table
await db.query(`delete from public.admins where lower(email) = lower($1)`, [OLD_EMAIL]);
console.log(`✔ removed ${OLD_EMAIL} from admins`);

// 3) Delete old auth user via Admin API
if (oldId) {
  const r = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${oldId}`, {
    method: 'DELETE',
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  console.log(`auth.users delete: ${r.status}`);
}

// 4) Create new admin auth user
const create = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
  method: 'POST',
  headers: {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email: NEW_EMAIL, password: NEW_PW, email_confirm: true }),
});
const createBody = await create.json();
console.log(`auth.users create: ${create.status}`);
if (!create.ok) {
  console.log(createBody);
}

// 5) Add to admins table
await db.query(
  `insert into public.admins(email) values (lower($1)) on conflict (email) do nothing`,
  [NEW_EMAIL]
);
console.log(`✔ added ${NEW_EMAIL} to admins`);

// 6) Verify
const { rows: admins } = await db.query(`select email from public.admins order by email`);
const { rows: users } = await db.query(`select email from auth.users order by email`);
console.log('admins:', admins.map(r => r.email));
console.log('auth users:', users.map(r => r.email));

await db.end();
