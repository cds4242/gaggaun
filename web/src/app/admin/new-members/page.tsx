import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Pagination } from "@/components/pagination";
import { SearchBar } from "@/components/search-bar";
import { StatusSelect } from "./status-select";

export const metadata = { title: "새가족 관리 | 가까운교회" };

const PAGE_SIZE = 20;
const STATUSES = [
  { key: "all", label: "전체" },
  { key: "pending", label: "미응대" },
  { key: "contacted", label: "연락 완료" },
  { key: "settled", label: "정착" },
] as const;

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string; q?: string; status?: string }> }) {
  await requireAdmin("/admin/new-members");
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const q = (sp.q ?? "").trim();
  const statusFilter = sp.status && ["pending", "contacted", "settled"].includes(sp.status) ? sp.status : "";
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const supabase = await createClient();
  let qb = supabase
    .from("new_members")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });
  if (q) qb = qb.or(`name.ilike.%${q}%,phone.ilike.%${q}%,invited_by.ilike.%${q}%`);
  if (statusFilter) qb = qb.eq("status", statusFilter);
  const { data: members, count } = await qb.range(from, to);
  const rows = members ?? [];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const extraSp: Record<string, string> = {};
  if (q) extraSp.q = q;
  if (statusFilter) extraSp.status = statusFilter;

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
        <div className="ac-head" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <h3>전체 등록 ({total}) · {page} / {totalPages}</h3>
          <div style={{ marginLeft: "auto", minWidth: 240, flex: "0 1 320px" }}>
            <SearchBar placeholder="이름·연락처·초청자 검색" />
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 16px", borderBottom: "1px solid var(--line)" }}>
          {STATUSES.map((s) => {
            const isActive = (s.key === "all" && !statusFilter) || s.key === statusFilter;
            const params = new URLSearchParams();
            if (q) params.set("q", q);
            if (s.key !== "all") params.set("status", s.key);
            const href = `/admin/new-members${params.toString() ? `?${params}` : ""}`;
            return (
              <Link key={s.key} href={href} className={"chip" + (isActive ? " active" : "")}>
                {s.label}
              </Link>
            );
          })}
        </div>

        <div className="ac-body" style={{ padding: 0 }}>
          {rows.length === 0 ? (
            <div className="admin-empty">
              {q || statusFilter ? (
                <div className="empty-state">
                  <div className="msg">조건에 맞는 새가족이 없습니다.</div>
                  <Link href="/admin/new-members" className="empty-cta">전체 보기</Link>
                </div>
              ) : (
                <div className="empty-state"><div className="msg">아직 새가족 등록이 없습니다.</div></div>
              )}
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 90 }}>이름</th>
                  <th style={{ width: 130 }}>연락처</th>
                  <th style={{ width: 110 }}>상태</th>
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
                    <td data-label="이름" style={{ color: "var(--navy)", fontWeight: 600 }}>{m.name}</td>
                    <td data-label="연락처">{m.phone}</td>
                    <td data-label="상태"><StatusSelect id={m.id} value={(m.status ?? "pending") as "pending" | "contacted" | "settled"} /></td>
                    <td data-label="성별">{m.gender === "M" ? "남" : m.gender === "F" ? "여" : "-"}</td>
                    <td data-label="방문일" className="muted">{m.visited_at ?? "-"}</td>
                    <td data-label="초청자">{m.invited_by ?? "-"}</td>
                    <td data-label="기도 제목" className="muted" style={{ maxWidth: 320 }}>
                      <div className="line-clamp-2">{m.prayer_request ?? "-"}</div>
                    </td>
                    <td data-label="등록일" className="muted">{formatDate(m.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Pagination basePath="/admin/new-members" page={page} totalPages={totalPages} searchParams={Object.keys(extraSp).length ? extraSp : undefined} />
    </>
  );
}
