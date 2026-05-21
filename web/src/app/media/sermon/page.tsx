import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/pagination";
import { SearchBar } from "@/components/search-bar";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "설교영상 | 가까운교회" };
export const revalidate = 60;

const PAGE_SIZE = 9;

type Sermon = {
  id: number;
  title: string;
  preacher: string;
  verse: string | null;
  badge: string | null;
  youtube_id: string;
  duration: string | null;
  summary: string | null;
  preached_at: string | null;
  created_at: string;
};

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string; q?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const q = (sp.q ?? "").trim();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let sermons: Sermon[] = [];
  let total = 0;
  let tableMissing = false;
  try {
    const supabase = await createClient();
    let qb = supabase
      .from("sermons")
      .select("id, title, preacher, verse, badge, youtube_id, duration, summary, preached_at, created_at", { count: "exact" })
      .order("preached_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (q) qb = qb.or(`title.ilike.%${q}%,preacher.ilike.%${q}%,verse.ilike.%${q}%`);
    const res = await qb.range(from, to);
    if (res.error) {
      if (res.error.message?.includes("sermons")) tableMissing = true;
    } else {
      sermons = (res.data as Sermon[]) ?? [];
      total = res.count ?? 0;
    }
  } catch {
    tableMissing = true;
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const extra = q ? { q } : undefined;

  return (
    <>
      <PageHeader title="설교영상" eyebrow="SERMON ARCHIVE" subtitle="매주 선포된 말씀을 다시 듣습니다" />
      <section className="block">
        <div className="wrap">
          {tableMissing ? (
            <div className="prose-box" style={{ textAlign: "center", color: "var(--mute)" }}>
              <p>설교 영상이 아직 준비 중입니다. 곧 업데이트됩니다.</p>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                <SearchBar placeholder="설교 제목·본문·설교자 검색" />
                <div style={{ fontSize: 14, color: "var(--mute)" }}>
                  {q ? <>‘<strong style={{ color: "var(--navy)" }}>{q}</strong>’ 검색 결과 <strong style={{ color: "var(--navy)" }}>{total}</strong>건</> :
                       <>전체 <strong style={{ color: "var(--navy)" }}>{total}</strong>편 · {page} / {totalPages}</>}
                </div>
              </div>

              {sermons.length === 0 ? (
                <div className="prose-box" style={{ textAlign: "center", color: "var(--mute)" }}>
                  {q ? <>‘{q}’ 검색 결과가 없습니다. <Link href="/media/sermon" className="a-link" style={{ marginLeft: 8 }}>전체 보기</Link></> : <>등록된 설교 영상이 없습니다.</>}
                </div>
              ) : (
                <div className="sermons-grid">
                  {sermons.map((s) => (
                    <Link key={s.id} href={`/media/sermon/${s.id}`} className="sermon-card" style={{ display: "block" }}>
                      <div className="sermon-thumb">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`https://i.ytimg.com/vi/${s.youtube_id}/mqdefault.jpg`} alt={s.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        {s.badge && <span className="badge">{s.badge}</span>}
                        {s.duration && <span className="duration">{s.duration}</span>}
                        <div className="play">
                          <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20" /></svg>
                        </div>
                      </div>
                      <div className="sermon-body">
                        {s.preached_at && <div className="date">{formatDate(s.preached_at)}</div>}
                        <h3>{s.title}</h3>
                        {s.verse && <div className="verse">{s.verse}</div>}
                        <div className="preacher">{s.preacher}</div>
                        {s.summary && (
                          <p style={{ marginTop: 12, color: "var(--mute)", fontSize: 14, lineHeight: 1.7, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {s.summary}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <Pagination basePath="/media/sermon" page={page} totalPages={totalPages} searchParams={extra} />
            </>
          )}
        </div>
      </section>
    </>
  );
}
