import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient, isAdminEmail } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("notices").select("title, content").eq("id", id).maybeSingle();
    if (data) {
      const desc = (data.content ?? "").toString().replace(/\s+/g, " ").slice(0, 80);
      return { title: `${data.title} | 가까운교회 공지`, description: desc };
    }
  } catch {}
  return { title: "공지 | 가까운교회" };
}

export default async function NoticeDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: notice } = await supabase
    .from("notices")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!notice) notFound();

  const { data: userData } = await supabase.auth.getUser();
  const admin = await isAdminEmail(userData.user?.email);

  return (
    <section className="block">
      <div className="wrap" style={{ maxWidth: 920 }}>
        <Link href="/notices" style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--mute)" }}>
          ← 공지사항 목록
        </Link>
        <div className="prose-box" style={{ marginTop: 24 }}>
          <span className="eyebrow">— Notice</span>
          <h2 style={{ marginBottom: 18 }}>{notice.title}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "var(--mute)", paddingBottom: 24, borderBottom: "1px solid var(--line)", marginBottom: 32 }}>
            <span>관리자</span>
            <span style={{ width: 1, height: 12, background: "var(--line)" }} />
            <span style={{ fontFamily: "var(--display)", fontStyle: "italic" }}>{formatDate(notice.created_at)}</span>
          </div>
          <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.95, color: "var(--body)", fontSize: 16 }}>{notice.content}</div>
          {admin && (
            <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--line)" }}>
              <Link href={`/admin/notices/${notice.id}/edit`} className="btn-primary">수정</Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
