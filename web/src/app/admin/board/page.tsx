import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Pagination } from "@/components/pagination";
import { SearchBar } from "@/components/search-bar";
import { DeleteButton } from "@/components/delete-button";
import { deleteBoardPost } from "@/app/board/[id]/actions";

export const metadata = { title: "게시판 관리 | 가까운교회" };

const PAGE_SIZE = 20;

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string; q?: string }> }) {
  await requireAdmin("/admin/board");
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const q = (sp.q ?? "").trim();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const supabase = await createClient();
  let qb = supabase
    .from("board_posts")
    .select("id, title, author_name, created_at, views, image_urls", { count: "exact" })
    .order("created_at", { ascending: false });
  if (q) qb = qb.or(`title.ilike.%${q}%,author_name.ilike.%${q}%`);
  const { data: posts, count } = await qb.range(from, to);
  const rows = posts ?? [];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

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
        <div className="ac-head" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <h3>전체 게시글 ({total}) · {page} / {totalPages}</h3>
          <div style={{ marginLeft: "auto", minWidth: 240, flex: "0 1 320px" }}>
            <SearchBar placeholder="제목·작성자 검색" />
          </div>
          <Link href="/board/new" target="_blank" style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--navy)" }}>
            새 글 작성 ↗
          </Link>
        </div>
        <div className="ac-body" style={{ padding: 0 }}>
          {rows.length === 0 ? (
            <div className="admin-empty">
              {q ? <>‘{q}’ 검색 결과가 없습니다. <Link href="/admin/board" className="a-link" style={{ marginLeft: 8 }}>전체 보기</Link></> : <>등록된 게시글이 없습니다.</>}
            </div>
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
                      <td className="muted">{total - from - i}</td>
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
                          <DeleteButton
                            action={async () => { "use server"; await deleteBoardPost(p.id); }}
                            confirmMessage={`'${p.title}' 게시글을 정말 삭제하시겠습니까?`}
                          />
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
      <Pagination basePath="/admin/board" page={page} totalPages={totalPages} searchParams={q ? { q } : undefined} />
    </>
  );
}
