import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Pagination } from "@/components/pagination";
import { SearchBar } from "@/components/search-bar";
import { DeleteButton } from "@/components/delete-button";
import { deleteBoardPost } from "@/app/board/[slug]/[id]/actions";
import { BoardFilter } from "./board-filter";

export const metadata = { title: "게시글 관리 | 가까운교회" };

const PAGE_SIZE = 20;

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string; q?: string; board?: string }> }) {
  await requireAdmin("/admin/board");
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const q = (sp.q ?? "").trim();
  const boardSlug = (sp.board ?? "").trim();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const supabase = await createClient();

  const { data: allBoards } = await supabase
    .from("boards")
    .select("id, slug, name")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });
  const boards = (allBoards as { id: number; slug: string; name: string }[] | null) ?? [];
  const boardIdBySlug = new Map(boards.map((b) => [b.slug, b.id] as const));
  const slugById = new Map(boards.map((b) => [b.id, b.slug] as const));
  const nameById = new Map(boards.map((b) => [b.id, b.name] as const));
  const filterBoardId = boardSlug ? boardIdBySlug.get(boardSlug) : undefined;

  let qb = supabase
    .from("board_posts")
    .select("id, board_id, title, author_name, created_at, views, image_urls", { count: "exact" })
    .order("created_at", { ascending: false });
  if (filterBoardId) qb = qb.eq("board_id", filterBoardId);
  if (q) qb = qb.or(`title.ilike.%${q}%,author_name.ilike.%${q}%`);
  const { data: posts, count } = await qb.range(from, to);
  const rows = (posts as { id: number; board_id: number; title: string; author_name: string; created_at: string; views: number; image_urls: string[] | null }[] | null) ?? [];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // 페이지네이션·검색 쿼리 보존용
  const extra: Record<string, string> = {};
  if (q) extra.q = q;
  if (boardSlug) extra.board = boardSlug;

  return (
    <>
      <div className="admin-page-head">
        <div className="title-side">
          <span className="eyebrow">Posts</span>
          <h1>게시글 관리</h1>
        </div>
        <Link href="/admin/boards" className="more-link">← 게시판 관리</Link>
      </div>

      <div className="admin-card">
        <div className="ac-head" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <h3>전체 게시글 ({total}) · {page} / {totalPages}</h3>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <BoardFilter options={boards.map((b) => ({ slug: b.slug, name: b.name }))} value={boardSlug} />
            <div style={{ minWidth: 240, flex: "0 1 320px" }}>
              <SearchBar placeholder="제목·작성자 검색" />
            </div>
          </div>
        </div>
        <div className="ac-body" style={{ padding: 0 }}>
          {rows.length === 0 ? (
            <div className="admin-empty">
              {q || boardSlug ? (
                <div className="empty-state">
                  <div className="msg">검색 결과가 없습니다.</div>
                  <Link href="/admin/board" className="empty-cta">전체 보기</Link>
                </div>
              ) : (
                <div className="empty-state"><div className="msg">등록된 게시글이 없습니다.</div></div>
              )}
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>#</th>
                  <th style={{ width: 110 }}>게시판</th>
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
                  const slug = slugById.get(p.board_id);
                  const bname = nameById.get(p.board_id) ?? "—";
                  return (
                    <tr key={p.id}>
                      <td data-label="#" className="muted">{total - from - i}</td>
                      <td data-label="게시판">
                        {slug ? (
                          <Link href={`/admin/board?board=${slug}`} className="a-link" style={{ fontSize: 13 }}>{bname}</Link>
                        ) : (
                          <span className="muted">{bname}</span>
                        )}
                      </td>
                      <td data-label="제목">
                        {slug ? (
                          <Link href={`/board/${slug}/${p.id}`} className="a-link" target="_blank">
                            {p.title}
                          </Link>
                        ) : (
                          <span>{p.title}</span>
                        )}
                        {hasImg && <span style={{ marginLeft: 8, color: "var(--gold)", fontSize: 13 }}>📎</span>}
                      </td>
                      <td data-label="작성자">{p.author_name}</td>
                      <td data-label="조회" className="muted">{p.views}</td>
                      <td data-label="작성일" className="muted">{formatDate(p.created_at)}</td>
                      <td data-label="관리">
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
      <Pagination basePath="/admin/board" page={page} totalPages={totalPages} searchParams={Object.keys(extra).length > 0 ? extra : undefined} />
    </>
  );
}
