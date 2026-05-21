"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

// YouTube URL/ID 어떤 입력이든 11자리 ID로 추출
function extractYoutubeId(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  const m1 = s.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
  if (m1) return m1[1];
  const m2 = s.match(/[?&]v=([A-Za-z0-9_-]{11})/);
  if (m2) return m2[1];
  const m3 = s.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{11})/);
  if (m3) return m3[1];
  const m4 = s.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/);
  if (m4) return m4[1];
  return null;
}

function parsePayload(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const preacher = String(formData.get("preacher") ?? "").trim();
  const verse = String(formData.get("verse") ?? "").trim();
  const badge = String(formData.get("badge") ?? "").trim();
  const duration = String(formData.get("duration") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const preached_at_raw = String(formData.get("preached_at") ?? "").trim();
  const youtube_raw = String(formData.get("youtube") ?? "").trim();

  if (!title) throw new Error("제목을 입력하세요.");
  if (!preacher) throw new Error("설교자를 입력하세요.");
  const youtube_id = extractYoutubeId(youtube_raw);
  if (!youtube_id) throw new Error("YouTube URL 또는 ID가 올바르지 않습니다.");

  return {
    title,
    preacher,
    verse: verse || null,
    badge: badge || null,
    duration: duration || null,
    summary: summary || null,
    preached_at: preached_at_raw || null,
    youtube_id,
  };
}

export async function createSermon(formData: FormData) {
  await requireAdmin("/admin/sermons/new");
  const payload = parsePayload(formData);
  const supabase = await createClient();
  const { data, error } = await supabase.from("sermons").insert(payload).select("id").single();
  if (error) throw new Error(error.message);
  revalidatePath("/media/sermon");
  redirect(`/media/sermon/${data.id}`);
}

export async function updateSermon(id: number, formData: FormData) {
  await requireAdmin(`/admin/sermons/${id}/edit`);
  const payload = parsePayload(formData);
  const supabase = await createClient();
  const { error } = await supabase
    .from("sermons")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/media/sermon");
  revalidatePath(`/media/sermon/${id}`);
  redirect(`/media/sermon/${id}`);
}

export async function deleteSermon(id: number) {
  await requireAdmin("/admin/sermons");
  const supabase = await createClient();
  const { error } = await supabase.from("sermons").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/media/sermon");
  redirect("/admin/sermons");
}
