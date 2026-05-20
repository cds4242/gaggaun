"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function registerNewMember(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  if (!name || !phone) {
    throw new Error("이름과 연락처는 필수입니다.");
  }
  const payload = {
    name,
    phone,
    gender: (formData.get("gender") as string) || null,
    birth_date: (formData.get("birth_date") as string) || null,
    address: (formData.get("address") as string) || null,
    marital_status: (formData.get("marital_status") as string) || null,
    invited_by: (formData.get("invited_by") as string) || null,
    introduction: (formData.get("introduction") as string) || null,
    prayer_request: (formData.get("prayer_request") as string) || null,
    visited_at: (formData.get("visited_at") as string) || null,
  };

  const supabase = await createClient();
  const { error } = await supabase.from("new_members").insert(payload);
  if (error) throw new Error(error.message);
  redirect("/new-member/thanks");
}
