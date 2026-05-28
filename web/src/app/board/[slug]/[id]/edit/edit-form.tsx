"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FilePicker } from "@/components/file-picker";
import { updateBoardPost } from "@/app/board/actions";

const BUCKET = "board-images";

type ImageItem = { url: string; path?: string; name: string };

export function BoardEditForm({
  boardSlug,
  imageUploadEnabled,
  postId,
  initialTitle,
  initialContent,
  initialImageUrls,
}: {
  boardSlug: string;
  imageUploadEnabled: boolean;
  postId: number;
  initialTitle: string;
  initialContent: string;
  initialImageUrls: string[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [password, setPassword] = useState("");
  const [images, setImages] = useState<ImageItem[]>(
    initialImageUrls.map((url) => ({ url, name: url.split("/").pop() ?? "image" })),
  );
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
      const next: ImageItem[] = [];
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

  async function removeImage(item: ImageItem) {
    if (item.path) {
      try {
        const supabase = createClient();
        await supabase.storage.from(BUCKET).remove([item.path]);
      } catch {}
    }
    setImages((prev) => prev.filter((i) => i.url !== item.url));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!/^\d{4}$/.test(password)) {
      setErr("비밀번호는 숫자 4자리로 입력해 주세요.");
      return;
    }
    setSubmitting(true);
    try {
      await updateBoardPost(postId, {
        board_slug: boardSlug,
        title,
        content,
        image_urls: images.map((i) => i.url),
        password,
      });
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "수정 실패");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="form-card">
      <div className="form-row">
        <label htmlFor="title">제목<span className="req">*</span></label>
        <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={120} />
      </div>
      <div className="form-row">
        <label htmlFor="content">
          내용<span className="req">*</span>
          <span style={{ float: "right", fontSize: 12, color: "var(--mute)", fontWeight: 400 }}>{content.length}자</span>
        </label>
        <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={12} required maxLength={5000} />
      </div>
      {imageUploadEnabled && (
        <div className="form-row">
          <label>이미지 첨부 (선택)</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <FilePicker
              onChange={onUpload}
              multiple
              accept="image/*"
              disabled={uploading}
              label="이미지 파일 추가"
              hint={uploading ? "업로드 중..." : "기존 이미지는 그대로 유지됩니다"}
            />
            {images.length > 0 && (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                {images.map((img) => (
                  <li key={img.url} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", border: "1px solid var(--line)", background: "var(--ivory)" }}>
                    <span style={{ fontSize: 13, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>📎 {img.name}</span>
                    <button type="button" onClick={() => removeImage(img)} style={{ color: "var(--burgundy)", fontSize: 13 }}>제거</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      <div className="form-row">
        <label htmlFor="password">비밀번호 (숫자 4자리)<span className="req">*</span></label>
        <input
          id="password"
          type="password"
          inputMode="numeric"
          pattern="\d{4}"
          maxLength={4}
          value={password}
          onChange={(e) => setPassword(e.target.value.replace(/\D/g, "").slice(0, 4))}
          required
          placeholder="작성 시 입력한 비밀번호"
          style={{ letterSpacing: ".4em" }}
        />
        <small style={{ color: "var(--mute)", fontSize: 12, marginTop: 6, display: "block" }}>
          관리자가 아닌 경우 작성 시 입력한 비밀번호가 일치해야 수정됩니다.
        </small>
      </div>
      {err && <p style={{ color: "var(--burgundy)", fontSize: 13 }}>{err}</p>}
      <div className="form-actions" style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <button type="submit" disabled={submitting || uploading} className="btn-primary">
          {submitting ? "저장 중..." : "저장"}
        </button>
        <button type="button" className="more-link" onClick={() => router.back()}>취소</button>
      </div>
    </form>
  );
}
