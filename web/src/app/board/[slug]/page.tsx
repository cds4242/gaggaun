import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/pagination";
import { SearchBar } from "@/components/search-bar";
import { createPublicClient } from "@/lib/supabase/public";
import { formatDateTime } from "@/lib/utils";
import { getBoardBySlug } from "@/lib/boards";

export const revalidate = 30;

const PAGE_SIZE = 20;

type Post = {
  id: number;
  title: string;
  author_name: string;
  image_urls: string[] | null;
  views: number;
  created_at: string;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const board = await getBoardBySlug(slug);
  if (!board) return { title: "게시판 | 가까운 서광교회" };
  return { title: `${board.name} | 가까운 서광교회` };
}

export default async function BoardListPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { slug } = await params;
  const board = await getBoardBySlug(slug);
  if (!board) notFound();

  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const q = (sp.q ?? "").trim();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let posts: Post[] | null = null;
  let total = 0;
  try {
    const supabase = createPublicClient();
    let qb = supabase
      .from("board_posts")
      .select("id, title, author_name, image_urls, views, created_at", { count: "exact" })
      .eq("board_id", board.id)
      .order("created_at", { ascending: false });
    if (q) qb = qb.ilike("title", `%${q}%`);
    const res = await qb.range(from, to);
    posts = res.data as Post[] | null;
    total = res.count ?? 0;
  } catch {
    posts = null;
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const extra = q ? { q } : undefined;
  const basePath = `/board/${board.slug}`;

  return (
    <>
      <PageHeader
        title={board.name}
        eyebrow={(board.category ?? "BOARD").toUpperCase()}
        subtitle={board.description ?? undefined}
      />
      <section className="block">
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
            <SearchBar placeholder="제목 검색" />
            <Link href={`${basePath}/new`} className="btn-primary btn-sm">글쓰기</Link>
          </div>
          <div style={{ fontSize: 14, color: "var(--mute)", marginBottom: 12 }}>
            {q ? <>‘<strong style={{ color: "var(--navy)" }}>{q}</strong>’ 검색 결과 <strong style={{ color: "var(--navy)" }}>{total}</strong>건 · {page} / {totalPages}</> :
                 <>전체 <strong style={{ color: "var(--navy)" }}>{total}</strong>건 · {page} / {totalPages} 페이지</>}
          </div>

          <div className="board-list">
            <div className="row head">
              <div className="cell c-no">번호</div>
              <div className="cell c-title">제목</div>
              <div className="cell c-author">작성자</div>
              <div className="cell c-date">작성일</div>
              <div className="cell c-views">조회</div>
            </div>
            {!posts || posts.length === 0 ? (
              <div className="row body empty">
                <div className="cell" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 20px", color: "var(--mute)" }}>
                  {q ? (
                    <div className="empty-state">
                      <div className="msg">‘{q}’ 검색 결과가 없습니다.</div>
                      <Link href={basePath} className="empty-cta">전체 보기</Link>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="msg">아직 등록된 게시글이 없습니다.</div>
                      <Link href={`${basePath}/new`} className="empty-cta">첫 글 작성하기</Link>
                    </div>
                  )}
                </div>
              </div>
            ) : posts.map((p, i) => {
              const hasImage = (p.image_urls?.length ?? 0) > 0;
              return (
                <div key={p.id} className="row body">
                  <div className="cell c-no">{total - from - i}</div>
                  <div className="cell c-title">
                    <Link href={`${basePath}/${p.id}`}>
                      {p.title}
                      {hasImage && <span className="mark-img" title="이미지 첨부">📎</span>}
                    </Link>
                  </div>
                  <div className="cell c-author">{p.author_name}</div>
                  <div className="cell c-date">{formatDateTime(p.created_at)}</div>
                  <div className="cell c-views">{p.views}</div>
                  <div className="cell c-meta-mobile" aria-hidden>
                    <span>{p.author_name}</span>
                    <span className="dot">·</span>
                    <span>{formatDateTime(p.created_at)}</span>
                    <span className="dot">·</span>
                    <span>조회 {p.views}</span>
                    <span className="meta-no">#{total - from - i}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <Pagination basePath={basePath} page={page} totalPages={totalPages} searchParams={extra} />
        </div>
      </section>
    </>
  );
}
