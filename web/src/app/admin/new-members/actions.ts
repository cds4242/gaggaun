"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

const ALLOWED = ["pending", "contacted", "settled"] as const;
type Status = (typeof ALLOWED)[number];

export async function updateNewMemberStatus(id: number, status: Status) {
  await requireAdmin("/admin/new-members");
  if (!ALLOWED.includes(status)) throw new Error("잘못된 상태값입니다.");
  const supabase = await createClient();
  const { error } = await supabase.from("new_members").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/new-members");
  revalidatePath("/admin");
}
