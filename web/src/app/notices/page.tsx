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
    <div className="bg-paper">
      <PageHeader title="공지사항" eyebrow="— News" subtitle="교회의 소식을 전합니다" image={IMG.notice} />
      <div className="container-narrow section">
        {errMsg && <p className="text-[14px] text-red-800 mb-6">{errMsg}</p>}
        <ul className="divide-y divide-[var(--line-soft)] border-y border-[var(--line-soft)]">
          {!notices || notices.length === 0 ? (
            <li className="py-20 text-center text-muted text-[14px]">등록된 공지가 없습니다.</li>
          ) : (
            notices.map((n) => (
              <li key={n.id}>
                <Link href={`/notices/${n.id}`} className="group py-7 flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    {n.pinned && (
                      <div className="text-[10px] tracking-[0.25em] text-ink mb-2">PINNED</div>
                    )}
                    <div className="text-[16px] text-ink line-clamp-2 leading-relaxed group-hover:translate-x-1 transition-transform">
                      {n.title}
                    </div>
                  </div>
                  <div className="text-[11px] tracking-[0.15em] text-muted shrink-0 pt-1">{formatDate(n.created_at)}</div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
