import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient, isAdminEmail } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;

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
    <section className="py-20 bg-[var(--paper)]">
      <div className="max-w-[920px] mx-auto px-8">
        <Link href="/notices" className="font-sans text-[13px] text-[var(--mute)] hover:text-[var(--navy)]">
          ← 공지사항 목록
        </Link>
        <div className="bg-white border border-[var(--line)] card-shadow mt-6 px-10 py-12">
          <span className="font-display italic text-[17px] text-[var(--gold)] tracking-[0.08em] block mb-3">— Notice</span>
          <h1 className="font-serif font-bold text-[32px] text-[var(--navy)] tracking-[-0.04em] leading-[1.35]">
            {notice.title}
          </h1>
          <div className="mt-5 flex items-center gap-4 text-[13px] text-[var(--mute)] pb-6 border-b border-[var(--line)]">
            <span>관리자</span>
            <span className="w-px h-3 bg-[var(--line)]" />
            <span className="font-display italic">{formatDate(notice.created_at)}</span>
          </div>

          <div className="mt-10 prose-quiet whitespace-pre-wrap">{notice.content}</div>

          {admin && (
            <div className="mt-12 pt-8 border-t border-[var(--line)]">
              <Link href={`/admin/notices/${notice.id}/edit`} className="btn-primary">수정</Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
