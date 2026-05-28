"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, isAdminEmail } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
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

// 관리자 전용: 비번 없이 삭제 (어드민/게시글 관리에서 호출)
export async function deleteBoardPost(id: number) {
  await requireAdmin(`/admin/board`);
  const supabase = await createClient();
  const { error } = await supabase.from("board_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/board");
  revalidatePath("/admin/board");
}

// 사이트 측 detail에서 본인 비번 삭제 + 관리자도 호출 가능 (비번 입력은 무시)
export async function deleteBoardPostWithPassword(slug: string, id: number, password: string) {
  const admin = await isCurrentUserAdmin();
  const supabase = await createClient();
  if (!admin) {
    validatePassword(password);
    const { data: existing } = await supabase
      .from("board_posts")
      .select("password_hash")
      .eq("id", id)
      .maybeSingle();
    if (!existing) throw new Error("게시글을 찾을 수 없습니다.");
    const ok = await verifyPassword(password, existing.password_hash);
    if (!ok) throw new Error("비밀번호가 일치하지 않습니다.");
  }
  const { error } = await supabase.from("board_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/board/${slug}`);
  revalidatePath(`/board/${slug}/${id}`);
  redirect(`/board/${slug}`);
}

// 상세 페이지의 관리자 삭제 + 목록으로 이동
export async function deleteBoardPostAndGoList(slug: string, id: number) {
  await deleteBoardPost(id);
  redirect(`/board/${slug}`);
}

export async function createBoardComment(input: {
  post_id: number;
  parent_id?: number | null;
  author_name: string;
  content: string;
  password: string;
  board_slug: string;
}) {
  const author = input.author_name.trim();
  const body = input.content.trim();
  if (!author) throw new Error("작성자를 입력하세요.");
  if (!body) throw new Error("내용을 입력하세요.");
  if (author.length > 30) throw new Error("작성자는 30자 이내로 입력하세요.");
  if (body.length > 1000) throw new Error("내용은 1000자 이내로 입력하세요.");
  const password_hash = await hashPassword(input.password);
  const supabase = await createClient();
  const { error } = await supabase.from("board_comments").insert({
    post_id: input.post_id,
    parent_id: input.parent_id ?? null,
    author_name: author,
    content: body,
    password_hash,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/board/${input.board_slug}/${input.post_id}`);
}

// 본인 비번 삭제 (관리자도 호출 가능 — 비번 입력은 우회)
export async function deleteBoardCommentWithPassword(
  comment_id: number,
  post_id: number,
  board_slug: string,
  password: string,
) {
  const admin = await isCurrentUserAdmin();
  const supabase = await createClient();
  if (!admin) {
    validatePassword(password);
    const { data: existing } = await supabase
      .from("board_comments")
      .select("password_hash")
      .eq("id", comment_id)
      .maybeSingle();
    if (!existing) throw new Error("댓글을 찾을 수 없습니다.");
    const ok = await verifyPassword(password, existing.password_hash);
    if (!ok) throw new Error("비밀번호가 일치하지 않습니다.");
  }
  const { error } = await supabase.from("board_comments").delete().eq("id", comment_id);
  if (error) throw new Error(error.message);
  revalidatePath(`/board/${board_slug}/${post_id}`);
}
