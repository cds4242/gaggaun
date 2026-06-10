import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { BoardForm } from "../../board-form";

export const metadata = { title: "게시판 편집 | 가까운 서광교회" };
export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin("/admin/boards");
  const { id: rawId } = await params;
  const id = parseInt(rawId, 10);
  if (!Number.isFinite(id)) notFound();
  const supabase = await createClient();
  const { data: b } = await supabase
    .from("boards")
    .select("id, slug, name, description, category, write_permission, comment_enabled, secret_enabled, image_upload_enabled, sort_order, is_active")
    .eq("id", id)
    .maybeSingle();
  if (!b) notFound();

  return (
    <>
      <div className="admin-page-head">
        <div className="title-side">
          <span className="eyebrow">Edit Board</span>
          <h1>{b.name} 편집</h1>
        </div>
        <Link href="/admin/boards" className="more-link">← 목록</Link>
      </div>
      <div className="admin-card">
        <div className="ac-body">
          <BoardForm
            mode="edit"
            boardId={b.id}
            initial={{
              slug: b.slug,
              name: b.name,
              description: b.description ?? "",
              category: b.category ?? "",
              write_permission: b.write_permission,
              comment_enabled: b.comment_enabled,
              secret_enabled: b.secret_enabled,
              image_upload_enabled: b.image_upload_enabled,
              sort_order: b.sort_order,
              is_active: b.is_active,
            }}
          />
        </div>
      </div>
    </>
  );
}
