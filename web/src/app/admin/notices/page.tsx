import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Pagination } from "@/components/pagination";
import { SearchBar } from "@/components/search-bar";
import { DeleteButton } from "@/components/delete-button";
import { deleteNotice } from "./actions";

export const metadata = { title: "공지사항 관리 | 가까운교회" };

const PAGE_SIZE = 20;

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string; q?: string }> }) {
  await requireAdmin("/admin/notices");
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const q = (sp.q ?? "").trim();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const supabase = await createClient();
  let qb = supabase
    .from("notices")
    .select("id, title, pinned, created_at", { count: "exact" })
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });
  if (q) qb = qb.ilike("title", `%${q}%`);
  const { data: notices, count } = await qb.range(from, to);
  const rows = notices ?? [];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <div className="admin-page-head">
        <div className="title-side">
          <span className="eyebrow">Notices</span>
          <h1>공지사항 관리</h1>
        </div>
        <Link href="/admin/notices/new" className="btn-primary">+ 새 공지 작성</Link>
      </div>

      <div className="admin-card">
        <div className="ac-head" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <h3>전체 공지 ({total}) · {page} / {totalPages}</h3>
          <div style={{ marginLeft: "auto", minWidth: 240, flex: "0 1 320px" }}>
            <SearchBar placeholder="제목 검색" />
          </div>
          <Link href="/notices" target="_blank" style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--navy)" }}>
            사이트에서 보기 ↗
          </Link>
        </div>
        <div className="ac-body" style={{ padding: 0 }}>
          {rows.length === 0 ? (
            <div className="admin-empty">
              {q ? <>‘{q}’ 검색 결과가 없습니다. <Link href="/admin/notices" className="a-link" style={{ marginLeft: 8 }}>전체 보기</Link></> : <>등록된 공지가 없습니다.</>}
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 70 }}>유형</th>
                  <th>제목</th>
                  <th style={{ width: 130 }}>작성일</th>
                  <th style={{ width: 160 }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((n) => (
                  <tr key={n.id}>
                    <td><span className={"pill " + (n.pinned ? "notice" : "news")}>{n.pinned ? "공지" : "소식"}</span></td>
                    <td><Link href={`/notices/${n.id}`} className="a-link" target="_blank">{n.title}</Link></td>
                    <td className="muted">{formatDate(n.created_at)}</td>
                    <td>
                      <div className="actions">
                        <Link href={`/admin/notices/${n.id}/edit`}>수정</Link>
                        <DeleteButton
                          action={async () => { "use server"; await deleteNotice(n.id); }}
                          confirmMessage={`'${n.title}' 공지를 정말 삭제하시겠습니까?`}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Pagination basePath="/admin/notices" page={page} totalPages={totalPages} searchParams={q ? { q } : undefined} />
    </>
  );
}
