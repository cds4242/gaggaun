import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "공지사항 | 가까운교회" };
export const revalidate = 60;

type Notice = { id: number; title: string; pinned: boolean; created_at: string; author_email: string | null };

export default async function NoticesPage() {
  let notices: Notice[] | null = null;
  let errMsg: string | null = null;
  try {
    const supabase = await createClient();
    const res = await supabase
      .from("notices")
      .select("id, title, pinned, created_at, author_email")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false });
    notices = res.data as Notice[] | null;
    if (res.error) errMsg = res.error.message;
  } catch {
    errMsg = "Supabase가 아직 설정되지 않았습니다.";
  }

  return (
    <>
      <PageHeader title="공지사항" eyebrow="NEWS & NOTICE" subtitle="교회의 소식을 전합니다" />
      <section className="block">
        <div className="wrap" style={{ maxWidth: 920 }}>
          {errMsg && <p style={{ color: "var(--burgundy)", marginBottom: 24 }}>{errMsg}</p>}
          <div className="panel">
            {!notices || notices.length === 0 ? (
              <div style={{ padding: "64px 28px", textAlign: "center", color: "var(--mute)" }}>
                등록된 공지가 없습니다.
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
        </div>
      </section>
    </>
  );
}
