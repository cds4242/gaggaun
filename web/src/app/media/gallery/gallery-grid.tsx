"use client";

import { useEffect, useState, useCallback } from "react";

type Photo = {
  id: number;
  title: string | null;
  category: string;
  image_url: string;
  taken_at: string | null;
};

export function GalleryGrid({ photos }: { photos: Photo[] }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const open = lightboxIdx !== null;

  const close = useCallback(() => setLightboxIdx(null), []);
  const prev = useCallback(() => setLightboxIdx((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)), [photos.length]);
  const next = useCallback(() => setLightboxIdx((i) => (i === null ? null : (i + 1) % photos.length)), [photos.length]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, prev, next]);

  return (
    <>
      <ul className="photo-grid" role="list">
        {photos.map((p, i) => (
          <li key={p.id}>
            <button type="button" className="photo-card" onClick={() => setLightboxIdx(i)} aria-label={`${p.title ?? "사진"} 크게 보기`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image_url} alt={p.title ?? ""} loading="lazy" />
              <div className="ovl">
                <div className="t">{p.title ?? "(제목 없음)"}</div>
                <div className="d">
                  <span className="cat">{p.category}</span>
                  {p.taken_at && <span className="dt"> · {p.taken_at}</span>}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {open && lightboxIdx !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={photos[lightboxIdx].title ?? "사진 크게 보기"} onClick={close}>
          <button type="button" className="lb-close" aria-label="닫기" onClick={(e) => { e.stopPropagation(); close(); }}>×</button>
          {photos.length > 1 && (
            <>
              <button type="button" className="lb-nav prev" aria-label="이전" onClick={(e) => { e.stopPropagation(); prev(); }}>‹</button>
              <button type="button" className="lb-nav next" aria-label="다음" onClick={(e) => { e.stopPropagation(); next(); }}>›</button>
            </>
          )}
          <div className="lb-stage" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos[lightboxIdx].image_url} alt={photos[lightboxIdx].title ?? ""} />
            <div className="lb-caption">
              <div className="t">{photos[lightboxIdx].title ?? "(제목 없음)"}</div>
              <div className="d">
                <span className="cat">{photos[lightboxIdx].category}</span>
                {photos[lightboxIdx].taken_at && <span className="dt"> · {photos[lightboxIdx].taken_at}</span>}
                <span className="idx"> · {lightboxIdx + 1} / {photos.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
