import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { SearchBar } from "@/components/search-bar";
import { createPublicClient } from "@/lib/supabase/public";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "통합 검색 | 가까운교회" };
export const revalidate = 60;

type Notice = { id: number; title: string; created_at: string; pinned: boolean };
type Post = { id: number; title: string; author_name: string; created_at: string; board_id: number; boards: { slug: string; name: string } | { slug: string; name: string }[] | null };
type Sermon = { id: number; title: string; preacher: string; verse: string | null; preached_at: string | null; created_at: string };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q: rawQ } = await searchParams;
  const q = (rawQ ?? "").trim();

  let notices: Notice[] = [];
  let posts: Post[] = [];
  let sermons: Sermon[] = [];

  if (q) {
    try {
      const sb = createPublicClient();
      const like = `%${q}%`;
      const [nRes, pRes, sRes] = await Promise.all([
        sb.from("notices").select("id, title, created_at, pinned").ilike("title", like).order("created_at", { ascending: false }).limit(20),
        sb.from("board_posts").select("id, title, author_name, created_at, board_id, boards(slug, name)").or(`title.ilike.${like},author_name.ilike.${like}`).order("created_at", { ascending: false }).limit(20),
        sb.from("sermons").select("id, title, preacher, verse, preached_at, created_at").or(`title.ilike.${like},preacher.ilike.${like},verse.ilike.${like}`).order("preached_at", { ascending: false, nullsFirst: false }).order("created_at", { ascending: false }).limit(20),
      ]);
      notices = (nRes.data as Notice[]) ?? [];
      posts = (pRes.data as Post[]) ?? [];
      sermons = (sRes.data as Sermon[]) ?? [];
    } catch {}
  }

  const totalCount = notices.length + posts.length + sermons.length;

  return (
    <>
      <PageHeader title="통합 검색" eyebrow="SEARCH" subtitle={q ? `‘${q}’ 검색 결과` : "공지·게시판·설교를 한 번에"} />
      <section className="block">
        <div className="wrap" style={{ maxWidth: 920 }}>
          <div style={{ marginBottom: 24, maxWidth: 520 }}>
            <SearchBar placeholder="공지·게시판·설교 통합 검색" />
          </div>

          {!q ? (
            <div className="empty-state">
              <div className="msg">검색어를 입력해 주세요.</div>
            </div>
          ) : totalCount === 0 ? (
            <div className="empty-state">
              <div className="msg">‘{q}’에 대한 결과가 없습니다.</div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 28 }}>
              <SearchSection
                title="공지사항"
                count={notices.length}
                seeAllHref={`/notices?q=${encodeURIComponent(q)}`}
              >
                {notices.length === 0 ? (
                  <p className="search-empty">해당 공지가 없습니다.</p>
                ) : (
                  <ul className="search-list">
                    {notices.map((n) => (
                      <li key={n.id}>
                        <Link href={`/notices/${n.id}`}>
                          <span className="tt">
                            {n.pinned && <span className="tag notice" style={{ marginRight: 8 }}>공지</span>}
                            {highlight(n.title, q)}
                          </span>
                          <span className="dt">{formatDate(n.created_at)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </SearchSection>

              <SearchSection
                title="게시판"
                count={posts.length}
                seeAllHref={`/board`}
              >
                {posts.length === 0 ? (
                  <p className="search-empty">해당 게시글이 없습니다.</p>
                ) : (
                  <ul className="search-list">
                    {posts.map((p) => {
                      const b = Array.isArray(p.boards) ? (p.boards[0] ?? null) : p.boards;
                      const slug = b?.slug;
                      const href = slug ? `/board/${slug}/${p.id}` : `/board`;
                      const boardName = b?.name;
                      return (
                        <li key={p.id}>
                          <Link href={href}>
                            <span className="tt">
                              {boardName && <span className="tag" style={{ marginRight: 8, fontSize: 12, color: "var(--gold)" }}>{boardName}</span>}
                              {highlight(p.title, q)}
                            </span>
                            <span className="meta">{p.author_name} · {formatDate(p.created_at)}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </SearchSection>

              <SearchSection
                title="설교 영상"
                count={sermons.length}
                seeAllHref={`/media/sermon?q=${encodeURIComponent(q)}`}
              >
                {sermons.length === 0 ? (
                  <p className="search-empty">해당 설교가 없습니다.</p>
                ) : (
                  <ul className="search-list">
                    {sermons.map((s) => (
                      <li key={s.id}>
                        <Link href={`/media/sermon/${s.id}`}>
                          <span className="tt">{highlight(s.title, q)}</span>
                          <span className="meta">
                            {s.preacher}
                            {s.verse ? ` · ${s.verse}` : ""}
                            {s.preached_at ? ` · ${formatDate(s.preached_at)}` : ""}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </SearchSection>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function SearchSection({ title, count, seeAllHref, children }: { title: string; count: number; seeAllHref: string; children: React.ReactNode }) {
  return (
    <section className="search-section">
      <header className="search-section-head">
        <h2>{title} <span className="cnt">{count}</span></h2>
        {count > 0 && <Link href={seeAllHref} className="all">해당 영역에서 더 보기 →</Link>}
      </header>
      {children}
    </section>
  );
}

// 검색어 하이라이트 — XSS 안전(React 노드만 반환)
function highlight(text: string, q: string): React.ReactNode {
  if (!q) return text;
  const lower = text.toLowerCase();
  const lq = q.toLowerCase();
  const parts: React.ReactNode[] = [];
  let i = 0;
  while (i < text.length) {
    const idx = lower.indexOf(lq, i);
    if (idx === -1) { parts.push(text.slice(i)); break; }
    if (idx > i) parts.push(text.slice(i, idx));
    parts.push(<mark key={idx}>{text.slice(idx, idx + q.length)}</mark>);
    i = idx + q.length;
  }
  return <>{parts}</>;
}
