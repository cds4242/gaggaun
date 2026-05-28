"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

const ALLOWED_KEYS = [
  "home.strip.date",
  "home.strip.worship",
  "home.strip.text",
  "home.strip.preacher",
] as const;

export async function updateThisWeek(formData: FormData) {
  const { email } = await requireAdmin("/admin/this-week");
  const supabase = await createClient();

  const updates: { key: string; value: string }[] = [];
  for (const key of ALLOWED_KEYS) {
    const raw = formData.get(key);
    if (raw === null) continue;
    const value = String(raw).trim();
    if (!value) {
      throw new Error(`'${key}' 값이 비어 있습니다.`);
    }
    updates.push({ key, value });
  }

  if (updates.length === 0) return;

  // upsert가 아니라 update — 시드된 행이 이미 있다는 전제. 없으면 따로 알림.
  const now = new Date().toISOString();
  for (const u of updates) {
    const { error } = await supabase
      .from("site_settings")
      .update({ value: u.value, updated_at: now, updated_by: email })
      .eq("key", u.key);
    if (error) throw new Error(`${u.key}: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/admin/this-week");
  redirect("/admin/this-week?saved=1");
}
