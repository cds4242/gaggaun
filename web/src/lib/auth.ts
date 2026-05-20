import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireAdmin(pathForRedirect: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  const email = data.user?.email ?? null;
  if (error || !email) {
    redirect(`/login?next=${encodeURIComponent(pathForRedirect)}`);
  }
  const { data: admin, error: adminErr } = await supabase
    .from("admins")
    .select("email")
    .eq("email", email!.toLowerCase())
    .maybeSingle();
  if (adminErr) {
    // RLS/네트워크 오류 등 — 로그인 페이지로 보내지 말고 명시적으로 안내
    redirect(`/?msg=admin-check-failed`);
  }
  if (!admin) {
    redirect(`/?msg=not-admin`);
  }
  return { email: email! };
}
