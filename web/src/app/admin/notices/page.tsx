import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { deleteNotice } from "./actions";

export const metadata = { title: "공지사항 관리 | 가까운교회" };

export default async function Page() {
  await requireAdmin("/admin/notices");
  const supabase = await createClient();
  const { data: notices } = await supabase
    .from("notices")
    .select("id, title, pinned, created_at")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });
  const rows = notices ?? [];

  return (
    <>
      <div className="admin-page-head">
        <div className="title-side">
          <span className="eyebrow">Notices</span>
          <h1>공지사항 관리</h1>
        </div>
        <Link href="/admin/notices/new" className="btn-primary">+ 새 공지 작성</Link>
      </div>

      <div className="admin-card">
        <div className="ac-head">
          <h3>전체 공지 ({rows.length})</h3>
          <Link href="/notices" target="_blank" style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--navy)" }}>
            사이트에서 보기 ↗
          </Link>
        </div>
        <div className="ac-body" style={{ padding: 0 }}>
          {rows.length === 0 ? (
            <div className="admin-empty">등록된 공지가 없습니다.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 70 }}>유형</th>
                  <th>제목</th>
                  <th style={{ width: 130 }}>작성일</th>
                  <th style={{ width: 160 }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((n) => (
                  <tr key={n.id}>
                    <td><span className={"pill " + (n.pinned ? "notice" : "news")}>{n.pinned ? "공지" : "소식"}</span></td>
                    <td><Link href={`/notices/${n.id}`} className="a-link" target="_blank">{n.title}</Link></td>
                    <td className="muted">{formatDate(n.created_at)}</td>
                    <td>
                      <div className="actions">
                        <Link href={`/admin/notices/${n.id}/edit`}>수정</Link>
                        <form action={async () => { "use server"; await deleteNotice(n.id); }} style={{ display: "inline" }}>
                          <button type="submit" className="danger">삭제</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
