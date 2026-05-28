"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { NAV, type NavItem } from "@/lib/nav";

function isValidTree(input: unknown): input is NavItem[] {
  if (!Array.isArray(input)) return false;
  for (const it of input) {
    if (!it || typeof it !== "object") return false;
    const v = it as Record<string, unknown>;
    if (typeof v.label !== "string" || !v.label.trim()) return false;
    if (typeof v.href !== "string" || !v.href.trim()) return false;
    if (v.children !== undefined) {
      if (!Array.isArray(v.children)) return false;
      for (const c of v.children) {
        if (!c || typeof c !== "object") return false;
        const cv = c as Record<string, unknown>;
        if (typeof cv.label !== "string" || !cv.label.trim()) return false;
        if (typeof cv.href !== "string" || !cv.href.trim()) return false;
      }
    }
  }
  return true;
}

export async function updateNavTree(formData: FormData) {
  const { email } = await requireAdmin("/admin/nav");
  const raw = String(formData.get("tree") ?? "").trim();
  if (!raw) throw new Error("메뉴 데이터가 비어 있습니다.");

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("메뉴 JSON 파싱 실패");
  }
  if (!isValidTree(parsed)) throw new Error("메뉴 구조가 올바르지 않습니다.");

  const supabase = await createClient();
  const value = JSON.stringify(parsed);
  const { error } = await supabase
    .from("site_settings")
    .upsert(
      {
        key: "nav.tree",
        value,
        label: "상단 메뉴",
        description: "사이트 헤더의 메인메뉴와 하위메뉴 트리 (JSON)",
        group_key: "navigation",
        sort_order: 10,
        updated_at: new Date().toISOString(),
        updated_by: email,
      },
      { onConflict: "key" }
    );
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/nav");
  redirect("/admin/nav?saved=1");
}

export async function resetNavToDefault() {
  const { email } = await requireAdmin("/admin/nav");
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert(
      {
        key: "nav.tree",
        value: JSON.stringify(NAV),
        label: "상단 메뉴",
        description: "사이트 헤더의 메인메뉴와 하위메뉴 트리 (JSON)",
        group_key: "navigation",
        sort_order: 10,
        updated_at: new Date().toISOString(),
        updated_by: email,
      },
      { onConflict: "key" }
    );
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  redirect("/admin/nav?reset=1");
}
