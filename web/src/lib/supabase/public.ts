// 공개 데이터 읽기 전용 클라이언트 (cookies() 의존 없음 → ISR 가능)
// 인증 세션이 필요 없는 페이지(/board /notices /media/sermon /media/gallery)에서 사용.

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

let cached: ReturnType<typeof createSupabaseClient> | null = null;

export function createPublicClient() {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("SUPABASE_NOT_CONFIGURED");
  cached = createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
