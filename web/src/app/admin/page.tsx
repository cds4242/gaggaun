import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "관리자 | 가까운교회" };

export default async function AdminPage() {
  const { email } = await requireAdmin("/admin");
  const supabase = await createClient();

  const [{ count: noticeCount }, { count: boardCount }, { count: memberCount }] =
    await Promise.all([
      supabase.from("notices").select("*", { count: "exact", head: true }),
      supabase.from("board_posts").select("*", { count: "exact", head: true }),
      supabase.from("new_members").select("*", { count: "exact", head: true }),
    ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-2xl font-bold">관리자 페이지</h1>
      <p className="mt-1 text-sm text-gray-500">로그인: {email}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <AdminCard title="공지사항" count={noticeCount ?? 0} href="/admin/notices" />
        <AdminCard title="게시판" count={boardCount ?? 0} href="/admin/board" />
        <AdminCard title="새가족 등록" count={memberCount ?? 0} href="/admin/new-members" />
      </div>

      <div className="mt-8">
        <Link href="/admin/notices/new" className="inline-flex rounded-md bg-blue-600 px-4 py-2 text-white">
          + 공지사항 작성
        </Link>
      </div>
    </div>
  );
}

function AdminCard({ title, count, href }: { title: string; count: number; href: string }) {
  return (
    <Link href={href}
      className="rounded-lg border border-gray-200 bg-white p-6 hover:border-blue-500 hover:shadow">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-1 text-3xl font-bold">{count}</div>
    </Link>
  );
}
