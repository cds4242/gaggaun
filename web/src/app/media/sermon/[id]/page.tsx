import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient, isAdminEmail } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("sermons").select("title, summary").eq("id", id).maybeSingle();
    if (data) {
      const desc = (data.summary ?? "").toString().slice(0, 80);
      return { title: `${data.title} | 가까운교회 설교`, description: desc };
    }
  } catch {}
  return { title: "설교 | 가까운교회" };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: sermon } = await supabase
    .from("sermons")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!sermon) notFound();

  const { data: userData } = await supabase.auth.getUser();
  const admin = await isAdminEmail(userData.user?.email);

  // 인접 설교 (preached_at 기준)
  const refDate = sermon.preached_at ?? sermon.created_at;
  const [{ data: prevRow }, { data: nextRow }] = await Promise.all([
    supabase.from("sermons").select("id, title").lt("preached_at", refDate).order("preached_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("sermons").select("id, title").gt("preached_at", refDate).order("preached_at", { ascending: true }).limit(1).maybeSingle(),
  ]);

  return (
    <section className="block">
      <div className="wrap" style={{ maxWidth: 960 }}>
        <Link href="/media/sermon" style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--mute)" }}>
          ← 설교 영상 목록
        </Link>

        <div className="sermon-detail" style={{ marginTop: 24 }}>
          <div className="video-frame" style={{ position: "relative", width: "100%", paddingBottom: "56.25%", background: "#000", border: "1px solid var(--line)" }}>
            <iframe
              src={`https://www.youtube.com/embed/${sermon.youtube_id}?rel=0`}
              title={sermon.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
            />
          </div>

          <div className="prose-box" style={{ marginTop: 28 }}>
            {sermon.badge && <span className="eyebrow">— {sermon.badge}</span>}
            <h2 style={{ marginBottom: 14 }}>{sermon.title}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 13, color: "var(--mute)", paddingBottom: 20, borderBottom: "1px solid var(--line)", marginBottom: 28, flexWrap: "wrap" }}>
              {sermon.verse && <span style={{ color: "var(--burgundy)", fontWeight: 600 }}>{sermon.verse}</span>}
              {sermon.verse && <span style={{ width: 1, height: 12, background: "var(--line)" }} />}
              <span><strong style={{ color: "var(--navy)", fontWeight: 600 }}>{sermon.preacher}</strong></span>
              {sermon.preached_at && (
                <>
                  <span style={{ width: 1, height: 12, background: "var(--line)" }} />
                  <span style={{ fontFamily: "var(--display)", fontStyle: "italic" }}>{formatDate(sermon.preached_at)}</span>
                </>
              )}
              {sermon.duration && (
                <>
                  <span style={{ width: 1, height: 12, background: "var(--line)" }} />
                  <span>{sermon.duration}</span>
                </>
              )}
            </div>

            {sermon.summary && (
              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.95, color: "var(--body)", fontSize: 16 }}>
                {sermon.summary}
              </div>
            )}
          </div>

          <nav style={{ marginTop: 32, borderTop: "1px solid var(--line)" }} aria-label="이전·다음 설교">
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              <li style={{ display: "grid", gridTemplateColumns: "80px 1fr", padding: "14px 4px", borderBottom: "1px solid var(--line)", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 12, color: "var(--mute)", fontFamily: "var(--sans)", letterSpacing: ".05em" }}>↑ 다음 설교</span>
                {nextRow ? (
                  <Link href={`/media/sermon/${nextRow.id}`} className="a-link" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nextRow.title}</Link>
                ) : (
                  <span style={{ color: "var(--mute)" }}>최신 설교입니다.</span>
                )}
              </li>
              <li style={{ display: "grid", gridTemplateColumns: "80px 1fr", padding: "14px 4px", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 12, color: "var(--mute)", fontFamily: "var(--sans)", letterSpacing: ".05em" }}>↓ 이전 설교</span>
                {prevRow ? (
                  <Link href={`/media/sermon/${prevRow.id}`} className="a-link" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{prevRow.title}</Link>
                ) : (
                  <span style={{ color: "var(--mute)" }}>가장 오래된 설교입니다.</span>
                )}
              </li>
            </ul>
          </nav>

          <div style={{ marginTop: 24, paddingTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/media/sermon" className="more-link">목록</Link>
            <a href={`https://www.youtube.com/watch?v=${sermon.youtube_id}`} target="_blank" rel="noopener noreferrer" className="more-link">YouTube에서 보기 ↗</a>
            {admin && (
              <Link href={`/admin/sermons/${sermon.id}/edit`} className="more-link" style={{ marginLeft: "auto", borderColor: "var(--navy)", color: "var(--navy)" }}>수정</Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
