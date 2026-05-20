import pg from 'pg';
const client = new pg.Client({
  host: 'aws-1-ap-northeast-2.pooler.supabase.com',
  port: 5432,
  user: `postgres.paugjrpggyxmhurzurhm`,
  password: process.env.SUPABASE_DB_PASSWORD,
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
});
await client.connect();
const { rows } = await client.query(`select id, email, email_confirmed_at, created_at from auth.users order by created_at desc limit 20;`);
console.log(rows);
await client.end();
