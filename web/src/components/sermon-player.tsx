"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

type Sermon = {
  id: number;
  title: string;
  preacher: string;
  verse: string | null;
  badge: string | null;
  duration: string | null;
  youtube_id: string;
  preached_at: string | null;
  created_at: string;
};

export function SermonPlayer({ sermons }: { sermons: Sermon[] }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const playing = openId !== null ? sermons.find((s) => s.id === openId) : null;

  useEffect(() => {
    if (!playing) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenId(null);
    }
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [playing]);

  return (
    <>
      <div className="sermons-grid">
        {sermons.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setOpenId(s.id)}
            className="sermon-card"
            style={{ display: "block", textAlign: "left", padding: 0, background: "transparent", border: 0, cursor: "pointer", width: "100%" }}
            aria-label={`${s.title} 영상 재생`}
          >
            <div className="sermon-thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://i.ytimg.com/vi/${s.youtube_id}/mqdefault.jpg`} alt={s.title} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              {s.badge && <span className="badge">{s.badge}</span>}
              {s.duration && <span className="duration">{s.duration}</span>}
              <div className="play">
                <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20" /></svg>
              </div>
            </div>
            <div className="sermon-body">
              <div className="date">{formatDate(s.preached_at ?? s.created_at)}</div>
              <h3>{s.title}</h3>
              {s.verse && <div className="verse">{s.verse}</div>}
              <div className="preacher">{s.preacher}</div>
            </div>
          </button>
        ))}
      </div>

      {playing && (
        <div className="lightbox sermon-lightbox" role="dialog" aria-modal="true" aria-label={`${playing.title} 영상 재생`} onClick={() => setOpenId(null)}>
          <button type="button" className="lb-close" aria-label="닫기" onClick={(e) => { e.stopPropagation(); setOpenId(null); }}>×</button>
          <div className="lb-stage" onClick={(e) => e.stopPropagation()}>
            <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", background: "#000", border: "1px solid rgba(255,255,255,0.15)" }}>
              <iframe
                src={`https://www.youtube.com/embed/${playing.youtube_id}?rel=0&autoplay=1`}
                title={playing.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
              />
            </div>
            <div className="lb-caption">
              <div className="t">{playing.title}</div>
              <div className="d">
                {playing.badge && <span className="cat">{playing.badge}</span>}
                {playing.verse && <> · <span>{playing.verse}</span></>}
                <> · <span>{playing.preacher}</span></>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
