import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "게시판 | 가까운교회" };
export const revalidate = 30;

type Post = {
  id: number;
  title: string;
  author_name: string;
  image_urls: string[] | null;
  views: number;
  created_at: string;
};

export default async function BoardPage() {
  let posts: Post[] | null = null;
  try {
    const supabase = await createClient();
    const res = await supabase
      .from("board_posts")
      .select("id, title, author_name, image_urls, views, created_at")
      .order("created_at", { ascending: false });
    posts = res.data as Post[] | null;
  } catch {
    posts = null;
  }

  const total = posts?.length ?? 0;

  return (
    <>
      <PageHeader title="자유 게시판" eyebrow="COMMUNITY BOARD" subtitle="성도들의 따뜻한 나눔 공간" />
      <section className="block">
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontSize: 14, color: "var(--mute)" }}>
              전체 <strong style={{ color: "var(--navy)" }}>{total}</strong>건
            </div>
            <Link href="/board/new" className="btn-primary btn-sm">글쓰기</Link>
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
                  아직 등록된 게시글이 없습니다.
                </div>
              </div>
            ) : posts.map((p, i) => {
              const hasImage = (p.image_urls?.length ?? 0) > 0;
              return (
                <div key={p.id} className="row body">
                  <div className="cell c-no">{total - i}</div>
                  <div className="cell c-title">
                    <Link href={`/board/${p.id}`}>
                      {p.title}
                      {hasImage && <span className="mark-img" title="이미지 첨부">📎</span>}
                    </Link>
                  </div>
                  <div className="cell c-author">{p.author_name}</div>
                  <div className="cell c-date">{formatDate(p.created_at)}</div>
                  <div className="cell c-views">{p.views}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
