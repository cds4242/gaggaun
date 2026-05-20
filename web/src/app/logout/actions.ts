"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function logoutAction() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // 환경변수 미설정 등은 무시 — 어차피 세션 없음
  }
  redirect("/?msg=logout");
}
