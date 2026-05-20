import pg from 'pg';

const PROJECT_REF = 'paugjrpggyxmhurzurhm';
const PASSWORD = process.env.SUPABASE_DB_PASSWORD;
const EMAIL = process.env.ADMIN_EMAIL;
if (!PASSWORD || !EMAIL) {
  console.error('Need SUPABASE_DB_PASSWORD and ADMIN_EMAIL');
  process.exit(1);
}

const client = new pg.Client({
  host: 'aws-1-ap-northeast-2.pooler.supabase.com',
  port: 5432,
  user: `postgres.${PROJECT_REF}`,
  password: PASSWORD,
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
});
await client.connect();
try {
  await client.query(
    `insert into public.admins(email) values (lower($1)) on conflict (email) do nothing;`,
    [EMAIL]
  );
  const { rows } = await client.query(`select email from public.admins;`);
  console.log('Admins now:', rows);

  // Also check if there's an auth user with this email
  const { rows: users } = await client.query(
    `select id, email, email_confirmed_at from auth.users where lower(email) = lower($1);`,
    [EMAIL]
  );
  console.log('Auth users matching:', users);
} finally {
  await client.end();
}
