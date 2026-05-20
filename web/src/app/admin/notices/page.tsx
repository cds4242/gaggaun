import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { deleteNotice } from "./actions";

export default async function Page() {
  await requireAdmin("/admin/notices");
  const supabase = await createClient();
  const { data: notices } = await supabase
    .from("notices")
    .select("id, title, pinned, created_at")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">공지사항 관리</h1>
        <Link href="/admin/notices/new" className="rounded-md bg-blue-600 px-4 py-2 text-white text-sm">
          + 새 공지
        </Link>
      </div>

      <table className="w-full border-t border-gray-200">
        <thead className="bg-gray-50 text-sm">
          <tr>
            <th className="p-3 text-left">제목</th>
            <th className="p-3 text-left w-28">날짜</th>
            <th className="p-3 text-left w-40">관리</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {!notices || notices.length === 0 ? (
            <tr><td colSpan={3} className="p-8 text-center text-gray-500">없음</td></tr>
          ) : notices.map((n) => (
            <tr key={n.id}>
              <td className="p-3">
                {n.pinned && <span className="mr-2 text-xs font-semibold rounded bg-red-100 text-red-700 px-2 py-0.5">공지</span>}
                <Link href={`/notices/${n.id}`} className="hover:underline">{n.title}</Link>
              </td>
              <td className="p-3 text-sm text-gray-500">{formatDate(n.created_at)}</td>
              <td className="p-3 text-sm">
                <Link href={`/admin/notices/${n.id}/edit`} className="text-blue-700 hover:underline mr-3">수정</Link>
                <form action={async () => { "use server"; await deleteNotice(n.id); }} className="inline">
                  <button type="submit" className="text-red-600 hover:underline">삭제</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
