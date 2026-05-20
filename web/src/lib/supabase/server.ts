import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function hasSupabaseEnv() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function createClient() {
  if (!hasSupabaseEnv()) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component에서 호출된 경우 무시
          }
        },
      },
    }
  );
}

export async function isAdminEmail(email: string | null | undefined) {
  if (!email || !hasSupabaseEnv()) return false;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("admins")
      .select("email")
      .eq("email", email.toLowerCase())
      .maybeSingle();
    return !!data;
  } catch {
    return false;
  }
}
