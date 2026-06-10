import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Pagination } from "@/components/pagination";
import { SearchBar } from "@/components/search-bar";
import { DeleteButton } from "@/components/delete-button";
import { deleteChoirVideo } from "@/app/admin/sermons/actions";

const PAGE_SIZE = 20;

const CHOIR_META: Record<string, { label: string; eyebrow: string; conductorLabel: string }> = {
  hallelujah: { label: "할렐루야 성가대", eyebrow: "Hallelujah Choir", conductorLabel: "지휘자" },
  hosanna:    { label: "호산나 성가대",    eyebrow: "Hosanna Choir",    conductorLabel: "지휘자" },
};

export async function generateMetadata({ params }: { params: Promise<{ choir: string }> }) {
  const { choir } = await params;
  const meta = CHOIR_META[choir];
  return { title: meta ? `${meta.label} 영상 관리 | 가까운 서광교회` : "성가대 영상 관리" };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ choir: string }>;
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { choir } = await params;
  const meta = CHOIR_META[choir];
  if (!meta) notFound();
  await requireAdmin(`/admin/choir/${choir}`);

  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const q = (sp.q ?? "").trim();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const supabase = await createClient();
  let qb = supabase
    .from("sermons")
    .select("id, title, preacher, badge, youtube_id, preached_at, created_at", { count: "exact" })
    .eq("category", choir)
    .order("preached_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (q) qb = qb.or(`title.ilike.%${q}%,preacher.ilike.%${q}%`);
  const { data: rows, count, error } = await qb.range(from, to);
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const missing = !!error && error.message?.toLowerCase().includes("sermons");

  return (
    <>
      <div className="admin-page-head">
        <div className="title-side">
          <span className="eyebrow">{meta.eyebrow}</span>
          <h1>{meta.label} 영상 관리</h1>
        </div>
        <Link href={`/admin/choir/${choir}/new`} className="btn-primary">+ 새 영상 등록</Link>
      </div>

      {missing && (
        <div className="admin-card" style={{ marginBottom: 16 }}>
          <div className="ac-body" style={{ color: "var(--burgundy)" }}>
            sermons 테이블 또는 category 컬럼이 없습니다. Supabase SQL Editor에서 schema.sql의 ‘6) 설교 영상’ 블록을 다시 실행해 주세요.
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="ac-head" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <h3>전체 영상 ({total}) · {page} / {totalPages}</h3>
          <div style={{ marginLeft: "auto", minWidth: 240, flex: "0 1 320px" }}>
            <SearchBar placeholder="제목·지휘자 검색" />
          </div>
          <Link href={`/praise/${choir}`} target="_blank" style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--navy)" }}>
            사이트에서 보기 ↗
          </Link>
        </div>
        <div className="ac-body" style={{ padding: 0 }}>
          {!rows || rows.length === 0 ? (
            <div className="admin-empty">
              {q ? (
                <div className="empty-state">
                  <div className="msg">‘{q}’ 검색 결과가 없습니다.</div>
                  <Link href={`/admin/choir/${choir}`} className="empty-cta">전체 보기</Link>
                </div>
              ) : (
                <div className="empty-state"><div className="msg">등록된 영상이 없습니다.</div></div>
              )}
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 92 }}>썸네일</th>
                  <th>제목</th>
                  <th style={{ width: 110 }}>{meta.conductorLabel}</th>
                  <th style={{ width: 90 }}>유형</th>
                  <th style={{ width: 130 }}>공연일</th>
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
                    <td data-label={meta.conductorLabel}>{s.preacher}</td>
                    <td data-label="유형">{s.badge ?? "-"}</td>
                    <td data-label="공연일" className="muted">{s.preached_at ? formatDate(s.preached_at) : "-"}</td>
                    <td data-label="관리">
                      <div className="actions">
                        <Link href={`/admin/choir/${choir}/${s.id}/edit`}>수정</Link>
                        <DeleteButton
                          action={async () => { "use server"; await deleteChoirVideo(choir, s.id); }}
                          confirmMessage={`'${s.title}' 영상을 정말 삭제하시겠습니까?`}
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
      <Pagination basePath={`/admin/choir/${choir}`} page={page} totalPages={totalPages} searchParams={q ? { q } : undefined} />
    </>
  );
}
