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
    <div className="bg-paper pt-32">
      <div className="container-narrow pb-24">
        <Link href="/notices" className="text-[11px] tracking-[0.25em] text-muted hover:text-ink">
          ← NOTICES
        </Link>
        <div className="eyebrow mt-8">— Notice</div>
        <h1 className="h-display text-4xl sm:text-5xl text-ink mt-6">{notice.title}</h1>
        <div className="mt-6 flex items-center gap-4 text-[12px] tracking-[0.15em] text-muted">
          <span>관리자</span>
          <span className="h-px w-8 bg-[var(--line-soft)]" />
          <span>{formatDate(notice.created_at)}</span>
        </div>

        <div className="mt-16 prose-quiet text-[15px] whitespace-pre-wrap">
          {notice.content}
        </div>

        {admin && (
          <div className="mt-20 pt-8 border-t border-[var(--line-soft)]">
            <Link href={`/admin/notices/${notice.id}/edit`} className="btn-ink">수정</Link>
          </div>
        )}
      </div>
    </div>
  );
}
