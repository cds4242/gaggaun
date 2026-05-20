const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SERVICE_KEY;
const EMAIL = process.env.ADMIN_EMAIL;
const PASSWORD = process.env.ADMIN_PASSWORD;

if (!SUPABASE_URL || !SERVICE_KEY || !EMAIL || !PASSWORD) {
  console.error('Missing env vars');
  process.exit(1);
}

const resp = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
  method: 'POST',
  headers: {
    'apikey': SERVICE_KEY,
    'Authorization': `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
  }),
});
const data = await resp.json();
console.log('status:', resp.status);
console.log('body:', JSON.stringify(data, null, 2));
