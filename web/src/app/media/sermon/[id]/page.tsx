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
      return { title: `${data.title} | 가까운 서광교회 설교`, description: desc };
    }
  } catch {}
  return { title: "설교 | 가까운 서광교회" };
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

  // 카테고리별로 목록 페이지·인접 탐색 분기 (null=설교영상 / 'hallelujah','hosanna'=성가대)
  type Category = "hallelujah" | "hosanna" | null;
  const category = (sermon.category ?? null) as Category;
  const listMeta = category === "hallelujah"
    ? { href: "/praise/hallelujah", label: "할렐루야 성가대 영상 목록", prevLabel: "다음 영상", nextLabel: "이전 영상", endNew: "최신 영상입니다.", endOld: "가장 오래된 영상입니다.", editHref: `/admin/choir/hallelujah/${sermon.id}/edit` }
    : category === "hosanna"
    ? { href: "/praise/hosanna", label: "호산나 성가대 영상 목록", prevLabel: "다음 영상", nextLabel: "이전 영상", endNew: "최신 영상입니다.", endOld: "가장 오래된 영상입니다.", editHref: `/admin/choir/hosanna/${sermon.id}/edit` }
    : { href: "/media/sermon", label: "설교 영상 목록", prevLabel: "다음 설교", nextLabel: "이전 설교", endNew: "최신 설교입니다.", endOld: "가장 오래된 설교입니다.", editHref: `/admin/sermons/${sermon.id}/edit` };

  // 인접 영상 (preached_at 기준, 같은 카테고리 안에서만)
  const refDate = sermon.preached_at ?? sermon.created_at;
  const prevQ = supabase.from("sermons").select("id, title").lt("preached_at", refDate).order("preached_at", { ascending: false }).limit(1);
  const nextQ = supabase.from("sermons").select("id, title").gt("preached_at", refDate).order("preached_at", { ascending: true }).limit(1);
  const [{ data: prevRow }, { data: nextRow }] = await Promise.all([
    (category === null ? prevQ.is("category", null) : prevQ.eq("category", category)).maybeSingle(),
    (category === null ? nextQ.is("category", null) : nextQ.eq("category", category)).maybeSingle(),
  ]);

  return (
    <section className="block">
      <div className="wrap" style={{ maxWidth: 960 }}>
        <Link href={listMeta.href} style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--mute)" }}>
          ← {listMeta.label}
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
                <span style={{ fontSize: 12, color: "var(--mute)", fontFamily: "var(--sans)", letterSpacing: ".05em" }}>↑ {listMeta.prevLabel}</span>
                {nextRow ? (
                  <Link href={`/media/sermon/${nextRow.id}`} className="a-link" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nextRow.title}</Link>
                ) : (
                  <span style={{ color: "var(--mute)" }}>{listMeta.endNew}</span>
                )}
              </li>
              <li style={{ display: "grid", gridTemplateColumns: "80px 1fr", padding: "14px 4px", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 12, color: "var(--mute)", fontFamily: "var(--sans)", letterSpacing: ".05em" }}>↓ {listMeta.nextLabel}</span>
                {prevRow ? (
                  <Link href={`/media/sermon/${prevRow.id}`} className="a-link" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{prevRow.title}</Link>
                ) : (
                  <span style={{ color: "var(--mute)" }}>{listMeta.endOld}</span>
                )}
              </li>
            </ul>
          </nav>

          <div style={{ marginTop: 24, paddingTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href={listMeta.href} className="more-link">목록</Link>
            <a href={`https://www.youtube.com/watch?v=${sermon.youtube_id}`} target="_blank" rel="noopener noreferrer" className="more-link">YouTube에서 보기 ↗</a>
            {admin && (
              <Link href={listMeta.editHref} className="more-link" style={{ marginLeft: "auto", borderColor: "var(--navy)", color: "var(--navy)" }}>수정</Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
