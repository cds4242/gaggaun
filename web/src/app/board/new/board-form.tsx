"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FilePicker } from "@/components/file-picker";
import { createBoardPost } from "../actions";

const BUCKET = "board-images";
const DRAFT_KEY = "board-draft-v1";

export function BoardForm({ defaultAuthor, defaultEmail }: { defaultAuthor?: string; defaultEmail?: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState(defaultAuthor ?? "");
  const [images, setImages] = useState<{ url: string; path: string; name: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [draftMsg, setDraftMsg] = useState<string | null>(null);
  const restoredRef = useRef(false);

  // 마운트 시 임시저장 복구
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (d.title || d.content || d.authorName) {
        const ok = window.confirm("저장된 임시 글이 있습니다. 이어서 작성하시겠습니까?");
        if (ok) {
          if (d.title) setTitle(d.title);
          if (d.content) setContent(d.content);
          if (d.authorName) setAuthorName(d.authorName);
          setDraftMsg("임시 글을 불러왔습니다.");
        } else {
          localStorage.removeItem(DRAFT_KEY);
        }
      }
    } catch {}
  }, []);

  // 자동 저장
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        if (title || content || authorName) {
          localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, content, authorName, ts: Date.now() }));
          setDraftMsg("자동 저장됨");
        }
      } catch {}
    }, 800);
    return () => clearTimeout(id);
  }, [title, content, authorName]);

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
      try { localStorage.removeItem(DRAFT_KEY); } catch {}
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "오류");
      setSubmitting(false);
    }
  }

  function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch {}
    setTitle(""); setContent(""); setAuthorName(defaultAuthor ?? "");
    setDraftMsg("임시 글을 비웠습니다.");
  }

  return (
    <form onSubmit={onSubmit} className="form-card">
      <div className="form-row">
        <label htmlFor="author">작성자<span className="req">*</span></label>
        <input id="author" value={authorName} onChange={(e) => setAuthorName(e.target.value)} required maxLength={20} placeholder="이름 또는 닉네임" />
      </div>
      <div className="form-row">
        <label htmlFor="title">제목<span className="req">*</span></label>
        <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={120} placeholder="제목을 입력하세요 (최대 120자)" />
      </div>
      <div className="form-row">
        <label htmlFor="content">
          내용<span className="req">*</span>
          <span style={{ float: "right", fontSize: 12, color: "var(--mute)", fontWeight: 400 }}>{content.length}자</span>
        </label>
        <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={12} required maxLength={5000} placeholder="이웃에게 따뜻한 마음을 나누어 보세요." />
      </div>
      <div className="form-row">
        <label>이미지 첨부 (선택)</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <FilePicker
            onChange={onUpload}
            multiple
            accept="image/*"
            disabled={uploading}
            label="이미지 파일 선택"
            hint={uploading ? "업로드 중..." : "여러 장 한 번에 선택 가능"}
          />
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
      {draftMsg && <p style={{ color: "var(--mute)", fontSize: 12, textAlign: "right" }}>{draftMsg}</p>}
      <div className="form-actions" style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <button type="submit" disabled={submitting || uploading} className="btn-primary">
          {submitting ? "등록 중..." : "등록"}
        </button>
        <button type="button" className="more-link" onClick={() => router.back()}>취소</button>
        <button type="button" className="more-link" onClick={clearDraft} style={{ borderColor: "var(--burgundy)", color: "var(--burgundy)" }}>임시 글 비우기</button>
      </div>
    </form>
  );
}
