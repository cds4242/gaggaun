"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createBoardPost(input: {
  title: string;
  content: string;
  author_name: string;
  author_email?: string;
  image_urls: string[];
}) {
  const { title, content, author_name } = input;
  if (!title.trim() || !content.trim() || !author_name.trim()) {
    throw new Error("제목/내용/작성자는 필수입니다.");
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("board_posts")
    .insert({
      title: title.trim(),
      content,
      author_name: author_name.trim(),
      author_email: input.author_email ?? null,
      image_urls: input.image_urls,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/board");
  redirect(`/board/${data.id}`);
}

export async function incrementBoardView(id: number) {
  const supabase = await createClient();
  // RPC는 SECURITY DEFINER로 RLS를 우회하며 원자적으로 +1 한다
  await supabase.rpc("increment_board_view", { post_id: id });
}
