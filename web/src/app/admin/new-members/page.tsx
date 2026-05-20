import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export default async function Page() {
  await requireAdmin("/admin/new-members");
  const supabase = await createClient();
  const { data: members } = await supabase
    .from("new_members")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">새가족 등록 목록</h1>
      <div className="overflow-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">이름</th>
              <th className="p-3 text-left">연락처</th>
              <th className="p-3 text-left">성별</th>
              <th className="p-3 text-left">초청자</th>
              <th className="p-3 text-left">방문일</th>
              <th className="p-3 text-left">기도제목</th>
              <th className="p-3 text-left">등록일</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {!members || members.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-gray-500">없음</td></tr>
            ) : members.map((m) => (
              <tr key={m.id}>
                <td className="p-3 font-medium">{m.name}</td>
                <td className="p-3">{m.phone}</td>
                <td className="p-3">{m.gender === "M" ? "남" : m.gender === "F" ? "여" : "-"}</td>
                <td className="p-3">{m.invited_by ?? "-"}</td>
                <td className="p-3">{m.visited_at ?? "-"}</td>
                <td className="p-3 max-w-xs truncate">{m.prayer_request ?? "-"}</td>
                <td className="p-3 text-gray-500">{formatDate(m.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
