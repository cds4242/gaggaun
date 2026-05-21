import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Pagination } from "@/components/pagination";
import { DeleteButton } from "@/components/delete-button";
import { deleteGalleryPhoto } from "./actions";

export const metadata = { title: "사진첩 관리 | 가까운교회" };

const PAGE_SIZE = 24;

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string; cat?: string }> }) {
  await requireAdmin("/admin/gallery");
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const cat = (sp.cat ?? "").trim();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const supabase = await createClient();
  let qb = supabase
    .from("gallery_photos")
    .select("id, title, category, image_url, image_path, taken_at, created_at", { count: "exact" })
    .order("created_at", { ascending: false });
  if (cat) qb = qb.eq("category", cat);
  const { data: photos, count, error } = await qb.range(from, to);
  const rows = photos ?? [];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const missing = !!error && error.message?.includes("gallery_photos");

  return (
    <>
      <div className="admin-page-head">
        <div className="title-side">
          <span className="eyebrow">Gallery</span>
          <h1>사진첩 관리</h1>
        </div>
        <Link href="/admin/gallery/new" className="btn-primary">+ 새 사진 업로드</Link>
      </div>

      {missing && (
        <div className="admin-card" style={{ marginBottom: 16 }}>
          <div className="ac-body" style={{ color: "var(--burgundy)" }}>
            gallery_photos 테이블이 없습니다. Supabase SQL Editor에서 web/supabase/schema.sql의 ‘5) 사진첩’ 블록을 실행해 주세요.
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="ac-head">
          <h3>전체 사진 ({total}) · {page} / {totalPages}</h3>
          <Link href="/media/gallery" target="_blank" style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--navy)" }}>
            사이트에서 보기 ↗
          </Link>
        </div>
        <div className="ac-body">
          {rows.length === 0 ? (
            <div className="admin-empty">아직 등록된 사진이 없습니다.</div>
          ) : (
            <ul className="photo-grid" role="list">
              {rows.map((p) => (
                <li key={p.id}>
                  <div className="photo-card" style={{ cursor: "default" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image_url} alt={p.title ?? ""} loading="lazy" />
                    <div className="ovl">
                      <div className="t">{p.title ?? "(제목 없음)"}</div>
                      <div className="d">
                        <span className="cat">{p.category}</span>
                        {p.taken_at && <span className="dt"> · {p.taken_at}</span>}
                        <span className="dt"> · 등록 {formatDate(p.created_at)}</span>
                      </div>
                      <div style={{ marginTop: 10 }}>
                        <DeleteButton
                          action={async () => { "use server"; await deleteGalleryPhoto(p.id, p.image_path); }}
                          confirmMessage={`'${p.title ?? "제목 없음"}' 사진을 정말 삭제하시겠습니까?`}
                          className="danger"
                          style={{ fontSize: 13, padding: "6px 12px", border: "1px solid var(--burgundy)" }}
                        />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Pagination basePath="/admin/gallery" page={page} totalPages={totalPages} searchParams={cat ? { cat } : undefined} />
    </>
  );
}
