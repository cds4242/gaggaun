import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { IMG } from "@/lib/images";

export const metadata = { title: "공지사항 | 가까운교회" };
export const revalidate = 0;

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
      <PageHeader title="공지사항" eyebrow="News & Notice" subtitle="교회의 소식을 전합니다" image={IMG.notice} />
      <section className="py-20">
        <div className="max-w-[920px] mx-auto px-8">
          {errMsg && <p className="text-[14px] text-[var(--burgundy)] mb-6">{errMsg}</p>}

          <div className="bg-white border border-[var(--line)] card-shadow">
            {!notices || notices.length === 0 ? (
              <div className="py-20 text-center text-[var(--mute)]">등록된 공지가 없습니다.</div>
            ) : (
              <ul>
                {notices.map((n, i, arr) => {
                  const isNew = (Date.now() - new Date(n.created_at).getTime()) < 7 * 24 * 60 * 60 * 1000;
                  return (
                    <li key={n.id} className={`grid grid-cols-[88px_1fr_110px] items-center gap-4 px-7 py-5 hover:bg-[var(--paper)] transition-colors ${i < arr.length - 1 ? "border-b border-[var(--line)]" : ""}`}>
                      <span className={`inline-block px-2.5 py-1 font-sans text-[12px] font-bold text-center rounded-sm ${
                        n.pinned ? "bg-[var(--burgundy)] text-[var(--gold-2)]" : "bg-[var(--paper-2)] text-[var(--navy)]"
                      }`}>
                        {n.pinned ? "공지" : "소식"}
                      </span>
                      <Link href={`/notices/${n.id}`} className="font-serif text-[16px] text-[var(--ink)] font-medium tracking-[-0.02em] line-clamp-1 hover:text-[var(--navy)]">
                        {n.title}
                        {isNew && <span className="inline-block ml-2 bg-[var(--burgundy)] text-white font-sans text-[10px] font-bold px-1.5 py-0.5 rounded-sm align-middle">N</span>}
                      </Link>
                      <span className="font-display italic text-[var(--mute)] text-[15px] text-right">{formatDate(n.created_at)}</span>
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
