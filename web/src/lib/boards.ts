import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";

export type Board = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  category: string | null;
  write_permission: "anyone" | "member" | "admin";
  comment_enabled: boolean;
  secret_enabled: boolean;
  image_upload_enabled: boolean;
  sort_order: number;
  is_active: boolean;
};

const FIELDS =
  "id, slug, name, description, category, write_permission, comment_enabled, secret_enabled, image_upload_enabled, sort_order, is_active";

export async function getBoardBySlug(slug: string): Promise<Board | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("boards")
    .select(FIELDS)
    .eq("slug", slug)
    .maybeSingle();
  return (data as Board | null) ?? null;
}

export async function getBoardById(id: number): Promise<Board | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("boards")
    .select(FIELDS)
    .eq("id", id)
    .maybeSingle();
  return (data as Board | null) ?? null;
}

export async function listActiveBoards(): Promise<Board[]> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("boards")
      .select(FIELDS)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });
    return (data as Board[] | null) ?? [];
  } catch {
    return [];
  }
}
