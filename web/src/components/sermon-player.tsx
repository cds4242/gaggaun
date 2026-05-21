"use client";

import { useState } from "react";
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
  const [playingId, setPlayingId] = useState<number | null>(null);

  return (
    <div className="sermons-grid">
      {sermons.map((s) => {
        const isPlaying = playingId === s.id;
        return (
          <article key={s.id} className="sermon-card" style={{ display: "block" }}>
            <div className="sermon-thumb" style={{ background: "#000" }}>
              {isPlaying ? (
                <iframe
                  src={`https://www.youtube.com/embed/${s.youtube_id}?rel=0&autoplay=1`}
                  title={s.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlayingId(s.id)}
                  aria-label={`${s.title} 영상 재생`}
                  style={{
                    position: "absolute", inset: 0,
                    padding: 0, margin: 0, border: 0, background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://i.ytimg.com/vi/${s.youtube_id}/mqdefault.jpg`}
                    alt={s.title}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  {s.badge && <span className="badge">{s.badge}</span>}
                  {s.duration && <span className="duration">{s.duration}</span>}
                  <span className="play" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20" /></svg>
                  </span>
                </button>
              )}
            </div>
            <div className="sermon-body">
              <div className="date">{formatDate(s.preached_at ?? s.created_at)}</div>
              <h3>{s.title}</h3>
              {s.verse && <div className="verse">{s.verse}</div>}
              <div className="preacher">{s.preacher}</div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
