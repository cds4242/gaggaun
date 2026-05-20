"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createGalleryPhoto } from "../actions";

const BUCKET = "gallery";
const CATEGORIES = ["예배", "행사", "교제", "봉사", "기타"];

type Pending = { url: string; path: string; name: string };

export function GalleryUploadForm() {
  const router = useRouter();
  const [pending, setPending] = useState<Pending[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("예배");
  const [takenAt, setTakenAt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true); setErr(null);
    try {
      const supabase = createClient();
      const next: Pending[] = [];
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
      setPending((prev) => [...prev, ...next]);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "업로드 실패");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function removePending(path: string) {
    try { await createClient().storage.from(BUCKET).remove([path]); } catch {}
    setPending((prev) => prev.filter((p) => p.path !== path));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending.length === 0) { setErr("사진을 한 장 이상 업로드해 주세요."); return; }
    setSubmitting(true); setErr(null);
    try {
      // pending 사진들에 동일한 메타데이터를 적용해 일괄 등록
      for (const p of pending) {
        await createGalleryPhoto({
          title: title.trim() || p.name.replace(/\.[^.]+$/, "") || null,
          category,
          image_url: p.url,
          image_path: p.path,
          taken_at: takenAt || null,
        });
      }
      setMsg(`${pending.length}장 등록 완료`);
      setPending([]); setTitle(""); setTakenAt("");
      setTimeout(() => router.push("/admin/gallery"), 500);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "등록 실패");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="admin-form">
      <div className="row">
        <label>사진 파일 (여러 장 가능)</label>
        <input type="file" multiple accept="image/*" onChange={onUpload} style={{ padding: 10, border: "1px dashed var(--line)", background: "var(--ivory)" }} />
        {uploading && <span style={{ fontSize: 13, color: "var(--mute)", marginTop: 6 }}>업로드 중...</span>}
        {pending.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0, margin: "10px 0 0", display: "flex", flexWrap: "wrap", gap: 8 }}>
            {pending.map((p) => (
              <li key={p.path} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", border: "1px solid var(--line)", background: "var(--ivory)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.name} style={{ width: 40, height: 40, objectFit: "cover" }} />
                <span style={{ fontSize: 13 }}>{p.name}</span>
                <button type="button" onClick={() => removePending(p.path)} style={{ color: "var(--burgundy)", fontSize: 13 }}>×</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="row">
        <label htmlFor="title">제목 (선택 — 비우면 파일명 사용)</label>
        <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} placeholder="예) 어버이주일 점심 나눔" />
      </div>
      <div className="row">
        <label htmlFor="category">카테고리</label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="row">
        <label htmlFor="taken_at">촬영일 (선택)</label>
        <input id="taken_at" type="date" value={takenAt} onChange={(e) => setTakenAt(e.target.value)} />
      </div>
      {err && <p style={{ color: "var(--burgundy)", fontSize: 13 }}>{err}</p>}
      {msg && <p style={{ color: "var(--navy)", fontSize: 13 }}>{msg}</p>}
      <div className="actions">
        <button type="submit" disabled={submitting || uploading || pending.length === 0} className="btn-primary">
          {submitting ? "등록 중..." : `등록 (${pending.length}장)`}
        </button>
        <Link href="/admin/gallery" className="more-link">취소</Link>
      </div>
    </form>
  );
}
