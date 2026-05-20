"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createBoardPost } from "../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const BUCKET = "board-images";

export function BoardForm({ defaultAuthor, defaultEmail }: { defaultAuthor?: string; defaultEmail?: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState(defaultAuthor ?? "");
  const [images, setImages] = useState<{ url: string; path: string }[]>([]);
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
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });
        if (error) throw error;
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
        next.push({ url: pub.publicUrl, path });
      }
      setImages((prev) => [...prev, ...next]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "업로드 실패";
      setErr(msg);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function removeImage(path: string) {
    try {
      const supabase = createClient();
      await supabase.storage.from(BUCKET).remove([path]);
    } catch {
      // 실패해도 UI에서는 제거
    }
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
      const msg = e instanceof Error ? e.message : "오류";
      setErr(msg);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="author">작성자</Label>
        <Input id="author" value={authorName} onChange={(e) => setAuthorName(e.target.value)} required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="title">제목</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="content">내용</Label>
        <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={10} required className="mt-1" />
      </div>
      <div>
        <Label>이미지 첨부</Label>
        <input type="file" multiple accept="image/*" onChange={onUpload} className="mt-1 block text-sm" />
        {uploading && <p className="text-xs text-gray-500 mt-1">업로드 중...</p>}
        {images.length > 0 && (
          <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
            {images.map((img) => (
              <div key={img.path} className="relative aspect-square overflow-hidden rounded border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(img.path)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
                  aria-label="삭제"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={submitting || uploading}>
          {submitting ? "등록 중..." : "등록"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>취소</Button>
      </div>
    </form>
  );
}
