import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { SermonForm } from "../../sermon-form";
import { updateSermon } from "../../actions";

export const metadata = { title: "설교 수정 | 가까운교회" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = parseInt(rawId, 10);
  await requireAdmin(`/admin/sermons/${rawId}/edit`);
  const supabase = await createClient();
  const { data: sermon } = await supabase.from("sermons").select("*").eq("id", id).maybeSingle();
  if (!sermon) notFound();

  async function action(formData: FormData) {
    "use server";
    await updateSermon(id, formData);
  }

  return (
    <>
      <div className="admin-page-head">
        <div className="title-side">
          <span className="eyebrow">Edit Sermon</span>
          <h1>설교 수정</h1>
        </div>
        <Link href="/admin/sermons" style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--mute)" }}>
          ← 목록으로
        </Link>
      </div>

      <div className="admin-card">
        <div className="ac-head"><h3>설교 정보</h3></div>
        <div className="ac-body">
          <SermonForm
            action={action}
            submitLabel="저장"
            cancelHref={`/media/sermon/${id}`}
            initial={{
              title: sermon.title,
              preacher: sermon.preacher,
              verse: sermon.verse ?? "",
              badge: sermon.badge ?? "",
              youtube_id: sermon.youtube_id,
              duration: sermon.duration ?? "",
              summary: sermon.summary ?? "",
              preached_at: sermon.preached_at ?? "",
            }}
          />
        </div>
      </div>
    </>
  );
}
