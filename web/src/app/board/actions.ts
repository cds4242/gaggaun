"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, isAdminEmail } from "@/lib/supabase/server";
import { hashPassword, verifyPassword, validatePassword } from "@/lib/password";

async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return await isAdminEmail(data.user?.email);
  } catch {
    return false;
  }
}

export async function createBoardPost(input: {
  board_slug: string;
  title: string;
  content: string;
  author_name: string;
  author_email?: string;
  image_urls: string[];
  password: string;
}) {
  const { title, content, author_name, board_slug } = input;
  if (!title.trim() || !content.trim() || !author_name.trim()) {
    throw new Error("제목/내용/작성자는 필수입니다.");
  }
  const supabase = await createClient();
  const { data: board, error: boardErr } = await supabase
    .from("boards")
    .select("id, is_active, image_upload_enabled")
    .eq("slug", board_slug)
    .maybeSingle();
  if (boardErr) throw new Error(boardErr.message);
  if (!board) throw new Error("존재하지 않는 게시판입니다.");
  if (!board.is_active) throw new Error("비활성화된 게시판에는 글을 작성할 수 없습니다.");
  const images = board.image_upload_enabled ? input.image_urls : [];
  const password_hash = await hashPassword(input.password);
  const { data, error } = await supabase
    .from("board_posts")
    .insert({
      board_id: board.id,
      title: title.trim(),
      content,
      author_name: author_name.trim(),
      author_email: input.author_email ?? null,
      image_urls: images,
      password_hash,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  revalidatePath(`/board/${board_slug}`);
  redirect(`/board/${board_slug}/${data.id}`);
}

export async function updateBoardPost(id: number, input: {
  board_slug: string;
  title: string;
  content: string;
  image_urls: string[];
  password: string;
}) {
  if (!input.title.trim() || !input.content.trim()) {
    throw new Error("제목과 내용은 필수입니다.");
  }
  const admin = await isCurrentUserAdmin();
  const supabase = await createClient();
  if (!admin) {
    validatePassword(input.password);
    const { data: existing } = await supabase
      .from("board_posts")
      .select("password_hash")
      .eq("id", id)
      .maybeSingle();
    if (!existing) throw new Error("게시글을 찾을 수 없습니다.");
    const ok = await verifyPassword(input.password, existing.password_hash);
    if (!ok) throw new Error("비밀번호가 일치하지 않습니다.");
  }
  const { error } = await supabase
    .from("board_posts")
    .update({
      title: input.title.trim(),
      content: input.content,
      image_urls: input.image_urls,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/board/${input.board_slug}`);
  revalidatePath(`/board/${input.board_slug}/${id}`);
  redirect(`/board/${input.board_slug}/${id}`);
}

export async function incrementBoardView(id: number) {
  const supabase = await createClient();
  await supabase.rpc("increment_board_view", { post_id: id });
}
