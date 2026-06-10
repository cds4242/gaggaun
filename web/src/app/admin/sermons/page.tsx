import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Pagination } from "@/components/pagination";
import { SearchBar } from "@/components/search-bar";
import { DeleteButton } from "@/components/delete-button";
import { deleteSermon } from "./actions";

export const metadata = { title: "설교 관리 | 가까운 서광교회" };

const PAGE_SIZE = 20;

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string; q?: string }> }) {
  await requireAdmin("/admin/sermons");
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const q = (sp.q ?? "").trim();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const supabase = await createClient();
  let qb = supabase
    .from("sermons")
    .select("id, title, preacher, badge, youtube_id, preached_at, created_at", { count: "exact" })
    .is("category", null)
    .order("preached_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (q) qb = qb.or(`title.ilike.%${q}%,preacher.ilike.%${q}%`);
  const { data: rows, count, error } = await qb.range(from, to);
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const missing = !!error && error.message?.includes("sermons");

  return (
    <>
      <div className="admin-page-head">
        <div className="title-side">
          <span className="eyebrow">Sermons</span>
          <h1>설교 영상 관리</h1>
        </div>
        <Link href="/admin/sermons/new" className="btn-primary">+ 새 설교 등록</Link>
      </div>

      {missing && (
        <div className="admin-card" style={{ marginBottom: 16 }}>
          <div className="ac-body" style={{ color: "var(--burgundy)" }}>
            sermons 테이블이 없습니다. Supabase SQL Editor에서 schema.sql의 ‘6) 설교 영상’ 블록을 실행해 주세요.
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="ac-head" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <h3>전체 설교 ({total}) · {page} / {totalPages}</h3>
          <div style={{ marginLeft: "auto", minWidth: 240, flex: "0 1 320px" }}>
            <SearchBar placeholder="제목·설교자 검색" />
          </div>
          <Link href="/media/sermon" target="_blank" style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--navy)" }}>
            사이트에서 보기 ↗
          </Link>
        </div>
        <div className="ac-body" style={{ padding: 0 }}>
          {!rows || rows.length === 0 ? (
            <div className="admin-empty">
              {q ? (
                <div className="empty-state">
                  <div className="msg">‘{q}’ 검색 결과가 없습니다.</div>
                  <Link href="/admin/sermons" className="empty-cta">전체 보기</Link>
                </div>
              ) : (
                <div className="empty-state"><div className="msg">등록된 설교가 없습니다.</div></div>
              )}
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 92 }}>썸네일</th>
                  <th>제목</th>
                  <th style={{ width: 110 }}>설교자</th>
                  <th style={{ width: 90 }}>유형</th>
                  <th style={{ width: 130 }}>설교일</th>
                  <th style={{ width: 160 }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.id}>
                    <td data-label="썸네일">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`https://i.ytimg.com/vi/${s.youtube_id}/default.jpg`} alt="" width="80" height="60" style={{ objectFit: "cover", border: "1px solid var(--line)" }} />
                    </td>
                    <td data-label="제목">
                      <Link href={`/media/sermon/${s.id}`} className="a-link" target="_blank">{s.title}</Link>
                    </td>
                    <td data-label="설교자">{s.preacher}</td>
                    <td data-label="유형">{s.badge ?? "-"}</td>
                    <td data-label="설교일" className="muted">{s.preached_at ? formatDate(s.preached_at) : "-"}</td>
                    <td data-label="관리">
                      <div className="actions">
                        <Link href={`/admin/sermons/${s.id}/edit`}>수정</Link>
                        <DeleteButton
                          action={async () => { "use server"; await deleteSermon(s.id); }}
                          confirmMessage={`'${s.title}' 설교를 정말 삭제하시겠습니까?`}
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
      <Pagination basePath="/admin/sermons" page={page} totalPages={totalPages} searchParams={q ? { q } : undefined} />
    </>
  );
}
