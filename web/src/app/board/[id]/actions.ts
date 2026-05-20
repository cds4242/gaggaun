"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export async function deleteBoardPost(id: number) {
  await requireAdmin(`/board/${id}`);
  const supabase = await createClient();
  const { error } = await supabase.from("board_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/board");
  redirect("/board");
}
