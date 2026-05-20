import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { deleteBoardPost } from "@/app/board/[id]/actions";

export default async function Page() {
  await requireAdmin("/admin/board");
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("board_posts")
    .select("id, title, author_name, created_at, views")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">게시판 관리</h1>
      <table className="w-full border-t border-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left">제목</th>
            <th className="p-3 text-left w-32">작성자</th>
            <th className="p-3 text-left w-20">조회</th>
            <th className="p-3 text-left w-28">날짜</th>
            <th className="p-3 text-left w-20">관리</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {!posts || posts.length === 0 ? (
            <tr><td colSpan={5} className="p-8 text-center text-gray-500">없음</td></tr>
          ) : posts.map((p) => (
            <tr key={p.id}>
              <td className="p-3"><Link href={`/board/${p.id}`} className="hover:underline">{p.title}</Link></td>
              <td className="p-3">{p.author_name}</td>
              <td className="p-3">{p.views}</td>
              <td className="p-3 text-gray-500">{formatDate(p.created_at)}</td>
              <td className="p-3">
                <form action={async () => { "use server"; await deleteBoardPost(p.id); }}>
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
