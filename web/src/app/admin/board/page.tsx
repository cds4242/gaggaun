import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { deleteBoardPost } from "@/app/board/[id]/actions";

export const metadata = { title: "게시판 관리 | 가까운교회" };

export default async function Page() {
  await requireAdmin("/admin/board");
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("board_posts")
    .select("id, title, author_name, created_at, views, image_urls")
    .order("created_at", { ascending: false });
  const rows = posts ?? [];

  return (
    <>
      <div className="admin-page-head">
        <div className="title-side">
          <span className="eyebrow">Board</span>
          <h1>게시판 관리</h1>
        </div>
        <Link href="/board" target="_blank" className="more-link">사이트에서 보기 ↗</Link>
      </div>

      <div className="admin-card">
        <div className="ac-head">
          <h3>전체 게시글 ({rows.length})</h3>
          <Link href="/board/new" target="_blank" style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--navy)" }}>
            새 글 작성 ↗
          </Link>
        </div>
        <div className="ac-body" style={{ padding: 0 }}>
          {rows.length === 0 ? (
            <div className="admin-empty">등록된 게시글이 없습니다.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>#</th>
                  <th>제목</th>
                  <th style={{ width: 110 }}>작성자</th>
                  <th style={{ width: 70 }}>조회</th>
                  <th style={{ width: 130 }}>작성일</th>
                  <th style={{ width: 100 }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p, i) => {
                  const hasImg = (p.image_urls?.length ?? 0) > 0;
                  return (
                    <tr key={p.id}>
                      <td className="muted">{rows.length - i}</td>
                      <td>
                        <Link href={`/board/${p.id}`} className="a-link" target="_blank">
                          {p.title}
                        </Link>
                        {hasImg && <span style={{ marginLeft: 8, color: "var(--gold)", fontSize: 13 }}>📎</span>}
                      </td>
                      <td>{p.author_name}</td>
                      <td className="muted">{p.views}</td>
                      <td className="muted">{formatDate(p.created_at)}</td>
                      <td>
                        <div className="actions">
                          <form action={async () => { "use server"; await deleteBoardPost(p.id); }} style={{ display: "inline" }}>
                            <button type="submit" className="danger">삭제</button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
