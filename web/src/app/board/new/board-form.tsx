"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createBoardPost } from "../actions";

const BUCKET = "board-images";

export function BoardForm({ defaultAuthor, defaultEmail }: { defaultAuthor?: string; defaultEmail?: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState(defaultAuthor ?? "");
  const [images, setImages] = useState<{ url: string; path: string; name: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setErr(null);
    try {
      const supabase = createClient();
      const next: typeof images = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
          cacheControl: "3600", upsert: false, contentType: file.type,
        });
        if (error) throw error;
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
        next.push({ url: pub.publicUrl, path, name: file.name });
      }
      setImages((prev) => [...prev, ...next]);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "업로드 실패");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function removeImage(path: string) {
    try {
      const supabase = createClient();
      await supabase.storage.from(BUCKET).remove([path]);
    } catch {}
    setImages((prev) => prev.filter((i) => i.path !== path));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setSubmitting(true);
    try {
      await createBoardPost({
        title,
        content,
        author_name: authorName,
        author_email: defaultEmail,
        image_urls: images.map((i) => i.url),
      });
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "오류");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="form-card">
      <div className="form-row">
        <label htmlFor="author">작성자<span className="req">*</span></label>
        <input id="author" value={authorName} onChange={(e) => setAuthorName(e.target.value)} required />
      </div>
      <div className="form-row">
        <label htmlFor="title">제목<span className="req">*</span></label>
        <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="form-row">
        <label htmlFor="content">내용<span className="req">*</span></label>
        <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={12} required />
      </div>
      <div className="form-row">
        <label>이미지 첨부 (선택)</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input type="file" multiple accept="image/*" onChange={onUpload} style={{ padding: 10, border: "1px dashed var(--line)", background: "var(--ivory)" }} />
          {uploading && <span style={{ fontSize: 13, color: "var(--mute)" }}>업로드 중...</span>}
          {images.length > 0 && (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
              {images.map((img) => (
                <li key={img.path} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", border: "1px solid var(--line)", background: "var(--ivory)" }}>
                  <span style={{ fontSize: 13, color: "var(--ink)" }}>📎 {img.name}</span>
                  <button type="button" onClick={() => removeImage(img.path)} style={{ color: "var(--burgundy)", fontSize: 13 }}>
                    제거
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {err && <p style={{ color: "var(--burgundy)", fontSize: 13 }}>{err}</p>}
      <div className="form-actions" style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <button type="submit" disabled={submitting || uploading} className="btn-primary">
          {submitting ? "등록 중..." : "등록"}
        </button>
        <button type="button" className="more-link" onClick={() => router.back()}>취소</button>
      </div>
    </form>
  );
}
