import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/pagination";
import { SearchBar } from "@/components/search-bar";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";

export const metadata = { title: "게시판 | 가까운교회" };
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

export default async function BoardPage({ searchParams }: { searchParams: Promise<{ page?: string; q?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const q = (sp.q ?? "").trim();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let posts: Post[] | null = null;
  let total = 0;
  try {
    const supabase = await createClient();
    let qb = supabase
      .from("board_posts")
      .select("id, title, author_name, image_urls, views, created_at", { count: "exact" })
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

  return (
    <>
      <PageHeader title="자유 게시판" eyebrow="COMMUNITY BOARD" subtitle="성도들의 따뜻한 나눔 공간" />
      <section className="block">
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
            <SearchBar placeholder="제목 검색" />
            <Link href="/board/new" className="btn-primary btn-sm">글쓰기</Link>
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
                  {q ? <>‘{q}’ 검색 결과가 없습니다. <Link href="/board" className="a-link" style={{ marginLeft: 8 }}>전체 보기</Link></> : <>아직 등록된 게시글이 없습니다. <Link href="/board/new" className="a-link" style={{ marginLeft: 8 }}>첫 글 작성하기 →</Link></>}
                </div>
              </div>
            ) : posts.map((p, i) => {
              const hasImage = (p.image_urls?.length ?? 0) > 0;
              return (
                <div key={p.id} className="row body">
                  <div className="cell c-no">{total - from - i}</div>
                  <div className="cell c-title">
                    <Link href={`/board/${p.id}`}>
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
                  </div>
                </div>
              );
            })}
          </div>
          <Pagination basePath="/board" page={page} totalPages={totalPages} searchParams={extra} />
        </div>
      </section>
    </>
  );
}
