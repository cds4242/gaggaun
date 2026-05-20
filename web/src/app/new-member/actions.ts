"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  return raw.trim();
}

export async function registerNewMember(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const phoneRaw = String(formData.get("phone") ?? "").trim();
  const phone = normalizePhone(phoneRaw);
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
