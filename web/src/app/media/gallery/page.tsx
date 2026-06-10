import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/pagination";
import { GalleryGrid } from "./gallery-grid";
import { createPublicClient } from "@/lib/supabase/public";

export const metadata = { title: "갤러리 | 가까운 서광교회" };
export const revalidate = 60;

const PAGE_SIZE = 12;

type Photo = {
  id: number;
  title: string | null;
  category: string;
  image_url: string;
  taken_at: string | null;
  created_at: string;
};

const CATEGORIES = ["전체", "예배", "행사", "교제", "봉사", "기타"] as const;

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string; cat?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const cat = sp.cat && CATEGORIES.includes(sp.cat as (typeof CATEGORIES)[number]) ? sp.cat : "전체";
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let photos: Photo[] = [];
  let total = 0;
  let tableMissing = false;
  try {
    const supabase = createPublicClient();
    let qb = supabase
      .from("gallery_photos")
      .select("id, title, category, image_url, taken_at, created_at", { count: "exact" })
      .order("created_at", { ascending: false });
    if (cat !== "전체") qb = qb.eq("category", cat);
    const res = await qb.range(from, to);
    if (res.error) {
      if (res.error.message?.includes("gallery_photos")) tableMissing = true;
    } else {
      photos = (res.data as Photo[]) ?? [];
      total = res.count ?? 0;
    }
  } catch {
    tableMissing = true;
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const extra = cat !== "전체" ? { cat } : undefined;

  return (
    <>
      <PageHeader title="갤러리" eyebrow="PHOTO GALLERY" subtitle="가까운 서광교회의 순간들" editSection="gallery" />
      <section className="block" style={{ background: "transparent" }} data-edit-section="gallery.filter">
        <div className="wrap">
          {tableMissing ? (
            <div className="prose-box" style={{ textAlign: "center", color: "var(--mute)" }}>
              <p>갤러리가 아직 준비 중입니다. 곧 업데이트됩니다.</p>
            </div>
          ) : (
            <>
              <div className="gallery-filter" role="tablist" aria-label="카테고리 필터">
                {CATEGORIES.map((c) => {
                  const isActive = cat === c;
                  const href = c === "전체" ? "/media/gallery" : `/media/gallery?cat=${encodeURIComponent(c)}`;
                  return (
                    <Link key={c} href={href} className={"chip" + (isActive ? " active" : "")} aria-current={isActive ? "page" : undefined}>
                      {c}
                    </Link>
                  );
                })}
              </div>

              <div style={{ fontSize: 14, color: "var(--mute)", margin: "18px 0" }}>
                {cat === "전체" ? <>전체 <strong style={{ color: "var(--navy)" }}>{total}</strong>장</> : <><strong style={{ color: "var(--navy)" }}>{cat}</strong> {total}장</>}
                {totalPages > 1 && <> · {page} / {totalPages}</>}
              </div>

              {photos.length === 0 ? (
                <div className="prose-box" style={{ textAlign: "center", color: "var(--mute)" }}>
                  {cat === "전체" ? (
                    <div className="empty-state"><div className="msg">아직 등록된 사진이 없습니다.</div></div>
                  ) : (
                    <div className="empty-state">
                      <div className="msg">‘{cat}’ 카테고리에 사진이 없습니다.</div>
                      <Link href="/media/gallery" className="empty-cta">전체 보기</Link>
                    </div>
                  )}
                </div>
              ) : (
                <GalleryGrid photos={photos} />
              )}

              <Pagination basePath="/media/gallery" page={page} totalPages={totalPages} searchParams={extra} />
            </>
          )}
        </div>
      </section>
    </>
  );
}
