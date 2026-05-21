"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export async function createNotice(formData: FormData) {
  const { email } = await requireAdmin("/admin/notices/new");
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const pinned = formData.get("pinned") === "on";
  if (!title || !content) {
    throw new Error("제목과 내용을 입력하세요.");
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notices")
    .insert({ title, content, pinned, author_email: email })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/notices");
  revalidatePath("/");
  redirect(`/notices/${data.id}`);
}

export async function updateNotice(id: number, formData: FormData) {
  await requireAdmin(`/admin/notices/${id}/edit`);
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const pinned = formData.get("pinned") === "on";
  const supabase = await createClient();
  const { error } = await supabase
    .from("notices")
    .update({ title, content, pinned, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/notices");
  revalidatePath(`/notices/${id}`);
  redirect(`/notices/${id}`);
}

export async function deleteNotice(id: number) {
  await requireAdmin("/admin/notices");
  const supabase = await createClient();
  const { error } = await supabase.from("notices").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/notices");
  revalidatePath("/admin/notices");
}

// edit 페이지에서 삭제 후 목록으로 이동
export async function deleteNoticeAndGoList(id: number) {
  await deleteNotice(id);
  redirect("/admin/notices");
}
