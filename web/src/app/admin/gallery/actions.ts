"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export async function deleteGalleryPhoto(id: number, imagePath: string) {
  await requireAdmin("/admin/gallery");
  const supabase = await createClient();
  // 1) DB row
  const { error } = await supabase.from("gallery_photos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  // 2) Storage file (실패해도 무시)
  if (imagePath) {
    try { await supabase.storage.from("gallery").remove([imagePath]); } catch {}
  }
  revalidatePath("/media/gallery");
  revalidatePath("/admin/gallery");
}

export async function createGalleryPhoto(input: { title: string | null; category: string; image_url: string; image_path: string; taken_at: string | null }) {
  await requireAdmin("/admin/gallery/new");
  const supabase = await createClient();
  const { error } = await supabase.from("gallery_photos").insert(input);
  if (error) throw new Error(error.message);
  revalidatePath("/media/gallery");
  revalidatePath("/admin/gallery");
}
