"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export type BoardInput = {
  slug: string;
  name: string;
  description: string;
  category: string;
  write_permission: "anyone" | "member" | "admin";
  comment_enabled: boolean;
  secret_enabled: boolean;
  image_upload_enabled: boolean;
  sort_order: number;
  is_active: boolean;
};

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?$/;

function normalize(input: BoardInput): BoardInput {
  return {
    ...input,
    slug: input.slug.trim().toLowerCase(),
    name: input.name.trim(),
    description: input.description.trim(),
    category: input.category.trim(),
  };
}

function validate(input: BoardInput) {
  if (!input.slug) throw new Error("slug는 필수입니다.");
  if (!SLUG_RE.test(input.slug)) {
    throw new Error("slug는 영문 소문자/숫자/하이픈만 사용하며 2~32자여야 합니다.");
  }
  if (!input.name) throw new Error("게시판 이름은 필수입니다.");
  if (input.name.length > 40) throw new Error("게시판 이름은 40자 이내여야 합니다.");
  if (input.description.length > 200) throw new Error("설명은 200자 이내여야 합니다.");
  if (!["anyone", "member", "admin"].includes(input.write_permission)) {
    throw new Error("쓰기 권한 값이 올바르지 않습니다.");
  }
}

export async function createBoard(input: BoardInput) {
  await requireAdmin("/admin/boards/new");
  const v = normalize(input);
  validate(v);
  const supabase = await createClient();
  const { error } = await supabase.from("boards").insert({
    slug: v.slug,
    name: v.name,
    description: v.description || null,
    category: v.category || null,
    write_permission: v.write_permission,
    comment_enabled: v.comment_enabled,
    secret_enabled: v.secret_enabled,
    image_upload_enabled: v.image_upload_enabled,
    sort_order: v.sort_order,
    is_active: v.is_active,
  });
  if (error) {
    if (error.code === "23505") throw new Error("이미 사용 중인 slug입니다.");
    throw new Error(error.message);
  }
  revalidatePath("/admin/boards");
  revalidatePath("/board");
  redirect("/admin/boards");
}

export async function updateBoard(id: number, input: BoardInput) {
  await requireAdmin(`/admin/boards/${id}/edit`);
  const v = normalize(input);
  validate(v);
  const supabase = await createClient();
  const { error } = await supabase
    .from("boards")
    .update({
      slug: v.slug,
      name: v.name,
      description: v.description || null,
      category: v.category || null,
      write_permission: v.write_permission,
      comment_enabled: v.comment_enabled,
      secret_enabled: v.secret_enabled,
      image_upload_enabled: v.image_upload_enabled,
      sort_order: v.sort_order,
      is_active: v.is_active,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) {
    if (error.code === "23505") throw new Error("이미 사용 중인 slug입니다.");
    throw new Error(error.message);
  }
  revalidatePath("/admin/boards");
  revalidatePath("/board");
  revalidatePath(`/board/${v.slug}`);
  redirect("/admin/boards");
}

export async function deleteBoard(id: number) {
  await requireAdmin("/admin/boards");
  const supabase = await createClient();
  // 글이 있는 보드는 삭제 차단 (사용자 데이터 보호)
  const { count } = await supabase
    .from("board_posts")
    .select("*", { count: "exact", head: true })
    .eq("board_id", id);
  if ((count ?? 0) > 0) {
    throw new Error(`이 게시판에 ${count}건의 글이 있어 삭제할 수 없습니다. 먼저 글을 옮기거나 삭제해 주세요.`);
  }
  const { error } = await supabase.from("boards").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/boards");
  revalidatePath("/board");
}
