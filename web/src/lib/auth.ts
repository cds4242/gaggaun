import { redirect } from "next/navigation";
import { createClient, isAdminEmail } from "@/lib/supabase/server";

export async function requireAdmin(pathForRedirect: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email ?? null;
  if (!email) {
    redirect(`/login?next=${encodeURIComponent(pathForRedirect)}`);
  }
  if (!(await isAdminEmail(email))) {
    redirect(`/?msg=not-admin`);
  }
  return { email: email! };
}
