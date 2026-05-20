import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "새가족 관리 | 가까운교회" };

export default async function Page() {
  await requireAdmin("/admin/new-members");
  const supabase = await createClient();
  const { data: members } = await supabase
    .from("new_members")
    .select("*")
    .order("created_at", { ascending: false });
  const rows = members ?? [];

  return (
    <>
      <div className="admin-page-head">
        <div className="title-side">
          <span className="eyebrow">New Family</span>
          <h1>새가족 등록 관리</h1>
        </div>
        <Link href="/new-member" target="_blank" className="more-link">새가족 등록 페이지 ↗</Link>
      </div>

      <div className="admin-card">
        <div className="ac-head">
          <h3>전체 등록 ({rows.length})</h3>
        </div>
        <div className="ac-body" style={{ padding: 0 }}>
          {rows.length === 0 ? (
            <div className="admin-empty">아직 새가족 등록이 없습니다.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 90 }}>이름</th>
                  <th style={{ width: 130 }}>연락처</th>
                  <th style={{ width: 60 }}>성별</th>
                  <th style={{ width: 110 }}>방문일</th>
                  <th style={{ width: 110 }}>초청자</th>
                  <th>기도 제목</th>
                  <th style={{ width: 130 }}>등록일</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((m) => (
                  <tr key={m.id}>
                    <td style={{ color: "var(--navy)", fontWeight: 600 }}>{m.name}</td>
                    <td>{m.phone}</td>
                    <td>{m.gender === "M" ? "남" : m.gender === "F" ? "여" : "-"}</td>
                    <td className="muted">{m.visited_at ?? "-"}</td>
                    <td>{m.invited_by ?? "-"}</td>
                    <td className="muted" style={{ maxWidth: 320 }}>
                      <div className="line-clamp-2">{m.prayer_request ?? "-"}</div>
                    </td>
                    <td className="muted">{formatDate(m.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
