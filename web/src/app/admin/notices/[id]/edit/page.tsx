import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { updateNotice, deleteNotice } from "../../actions";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdmin(`/admin/notices/${id}/edit`);
  const supabase = await createClient();
  const { data: notice } = await supabase
    .from("notices")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!notice) notFound();
  const noticeId = notice.id;

  return (
    <>
      <div className="admin-page-head">
        <div className="title-side">
          <span className="eyebrow">Edit Notice</span>
          <h1>공지 수정</h1>
        </div>
        <Link href="/admin/notices" style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--mute)" }}>
          ← 목록으로
        </Link>
      </div>

      <div className="admin-card">
        <div className="ac-head"><h3>공지 내용</h3></div>
        <div className="ac-body">
          <form action={async (fd) => { "use server"; await updateNotice(noticeId, fd); }} className="admin-form">
            <div className="row">
              <label htmlFor="title">제목</label>
              <input id="title" name="title" type="text" defaultValue={notice.title} required />
            </div>
            <div className="row">
              <label htmlFor="content">내용</label>
              <textarea id="content" name="content" defaultValue={notice.content} required />
            </div>
            <label className="check">
              <input type="checkbox" name="pinned" defaultChecked={notice.pinned} />
              상단 고정 (공지로 표시)
            </label>
            <div className="actions">
              <button type="submit" className="btn-primary">저장</button>
              <Link href="/admin/notices" className="more-link">취소</Link>
            </div>
          </form>

          <form
            action={async () => { "use server"; await deleteNotice(noticeId); }}
            style={{ marginTop: 24, paddingTop: 20, borderTop: "1px dashed var(--line)" }}
          >
            <button
              type="submit"
              className="more-link"
              style={{ borderColor: "var(--burgundy)", color: "var(--burgundy)" }}
            >
              이 공지 삭제
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
