"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export async function deleteBoardPost(id: number) {
  await requireAdmin(`/admin/board`);
  const supabase = await createClient();
  const { error } = await supabase.from("board_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/board");
  revalidatePath("/admin/board");
  // redirect 없이 종료 — 호출자가 어디서 부르든 그 페이지가 자동 갱신됨
}

// 사이트 측 detail 페이지(/board/[id])에서 삭제할 때는 목록으로 이동해야 한다
export async function deleteBoardPostAndGoList(id: number) {
  await deleteBoardPost(id);
  redirect("/board");
}

export async function createBoardComment(input: { post_id: number; parent_id?: number | null; author_name: string; content: string }) {
  const author = input.author_name.trim();
  const body = input.content.trim();
  if (!author) throw new Error("작성자를 입력하세요.");
  if (!body) throw new Error("내용을 입력하세요.");
  if (author.length > 30) throw new Error("작성자는 30자 이내로 입력하세요.");
  if (body.length > 1000) throw new Error("내용은 1000자 이내로 입력하세요.");
  const supabase = await createClient();
  const { error } = await supabase.from("board_comments").insert({
    post_id: input.post_id,
    parent_id: input.parent_id ?? null,
    author_name: author,
    content: body,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/board/${input.post_id}`);
}

export async function deleteBoardComment(comment_id: number, post_id: number) {
  await requireAdmin(`/board/${post_id}`);
  const supabase = await createClient();
  const { error } = await supabase.from("board_comments").delete().eq("id", comment_id);
  if (error) throw new Error(error.message);
  revalidatePath(`/board/${post_id}`);
}
