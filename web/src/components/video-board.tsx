import Link from "next/link";
import { Pagination } from "@/components/pagination";
import { SearchBar } from "@/components/search-bar";
import { createPublicClient } from "@/lib/supabase/public";
import { formatDate } from "@/lib/utils";

type Video = {
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

type Props = {
  category: string;
  basePath: string;
  page: number;
  q: string;
  pageSize?: number;
  conductorLabel?: string;
};

// 같은 sermons 테이블을 category로 필터해서 영상 그리드를 렌더한다.
// /praise/hallelujah, /praise/hosanna 처럼 성가대 영상용 게시판에서 사용.
export async function VideoBoard({ category, basePath, page, q, pageSize = 9, conductorLabel = "지휘" }: Props) {
  const size = pageSize;
  const from = (page - 1) * size;
  const to = from + size - 1;

  let videos: Video[] = [];
  let total = 0;
  let tableMissing = false;
  try {
    const supabase = createPublicClient();
    let qb = supabase
      .from("sermons")
      .select("id, title, preacher, verse, badge, youtube_id, duration, summary, preached_at, created_at", { count: "exact" })
      .eq("category", category)
      .order("preached_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (q) qb = qb.or(`title.ilike.%${q}%,preacher.ilike.%${q}%,verse.ilike.%${q}%`);
    const res = await qb.range(from, to);
    if (res.error) {
      if (res.error.message?.toLowerCase().includes("sermons")) tableMissing = true;
    } else {
      videos = (res.data as Video[]) ?? [];
      total = res.count ?? 0;
    }
  } catch {
    tableMissing = true;
  }

  const totalPages = Math.max(1, Math.ceil(total / size));
  const extra = q ? { q } : undefined;

  if (tableMissing) {
    return (
      <div className="prose-box" style={{ textAlign: "center", color: "var(--mute)" }}>
        <p>영상이 아직 준비 중입니다. 곧 업데이트됩니다.</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
        <SearchBar placeholder="제목·곡목·지휘자 검색" />
        <div style={{ fontSize: 14, color: "var(--mute)" }}>
          {q
            ? <>‘<strong style={{ color: "var(--navy)" }}>{q}</strong>’ 검색 결과 <strong style={{ color: "var(--navy)" }}>{total}</strong>건</>
            : <>전체 <strong style={{ color: "var(--navy)" }}>{total}</strong>편 · {page} / {totalPages}</>}
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="prose-box" style={{ textAlign: "center", color: "var(--mute)" }}>
          {q ? (
            <div className="empty-state">
              <div className="msg">‘{q}’ 검색 결과가 없습니다.</div>
              <Link href={basePath} className="empty-cta">전체 보기</Link>
            </div>
          ) : (
            <div className="empty-state"><div className="msg">등록된 영상이 없습니다.</div></div>
          )}
        </div>
      ) : (
        <div className="sermons-grid">
          {videos.map((s) => (
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
                <div className="preacher">{conductorLabel} · {s.preacher}</div>
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

      <Pagination basePath={basePath} page={page} totalPages={totalPages} searchParams={extra} />
    </>
  );
}
