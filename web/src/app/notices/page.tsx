import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/pagination";
import { SearchBar } from "@/components/search-bar";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "공지사항 | 가까운교회" };
export const revalidate = 60;

const PAGE_SIZE = 20;

type Notice = { id: number; title: string; pinned: boolean; created_at: string; author_email: string | null };

export default async function NoticesPage({ searchParams }: { searchParams: Promise<{ page?: string; q?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const q = (sp.q ?? "").trim();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let notices: Notice[] | null = null;
  let total = 0;
  let errMsg: string | null = null;
  try {
    const supabase = await createClient();
    let qb = supabase
      .from("notices")
      .select("id, title, pinned, created_at, author_email", { count: "exact" })
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false });
    if (q) qb = qb.ilike("title", `%${q}%`);
    const res = await qb.range(from, to);
    notices = res.data as Notice[] | null;
    total = res.count ?? 0;
    if (res.error) errMsg = res.error.message;
  } catch {
    errMsg = "Supabase가 아직 설정되지 않았습니다.";
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const extra = q ? { q } : undefined;

  return (
    <>
      <PageHeader title="공지사항" eyebrow="NEWS & NOTICE" subtitle="교회의 소식을 전합니다" />
      <section className="block">
        <div className="wrap" style={{ maxWidth: 920 }}>
          {errMsg && <p style={{ color: "var(--burgundy)", marginBottom: 24 }}>{errMsg}</p>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
            <SearchBar placeholder="공지 제목 검색" />
            <div style={{ fontSize: 14, color: "var(--mute)" }}>
              {q ? <>‘<strong style={{ color: "var(--navy)" }}>{q}</strong>’ {total}건</> : <>전체 <strong style={{ color: "var(--navy)" }}>{total}</strong>건 · {page} / {totalPages}</>}
            </div>
          </div>
          <div className="panel">
            {!notices || notices.length === 0 ? (
              <div style={{ padding: "64px 28px", textAlign: "center", color: "var(--mute)" }}>
                {q ? <>‘{q}’ 검색 결과가 없습니다. <Link href="/notices" className="a-link" style={{ marginLeft: 8 }}>전체 보기</Link></> : <>등록된 공지가 없습니다.</>}
              </div>
            ) : (
              <ul className="notice-list">
                {notices.map((n) => {
                  const isNew = (Date.now() - new Date(n.created_at).getTime()) < 14 * 24 * 60 * 60 * 1000;
                  return (
                    <li key={n.id}>
                      <span className={"tag " + (n.pinned ? "notice" : "news")}>{n.pinned ? "공지" : "소식"}</span>
                      <span className="ttl">
                        <Link href={`/notices/${n.id}`}>{n.title}</Link>
                        {isNew && <span className="new">N</span>}
                      </span>
                      <span className="date">{formatDate(n.created_at)}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <Pagination basePath="/notices" page={page} totalPages={totalPages} searchParams={extra} />
        </div>
      </section>
    </>
  );
}
