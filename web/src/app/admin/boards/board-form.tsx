"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBoard, updateBoard, type BoardInput } from "./actions";
import { TOP_CATEGORIES } from "@/lib/nav";

type Props = {
  mode: "create" | "edit";
  boardId?: number;
  initial?: Partial<BoardInput>;
};

const DEFAULTS: BoardInput = {
  slug: "",
  name: "",
  description: "",
  category: "",
  write_permission: "anyone",
  comment_enabled: true,
  secret_enabled: false,
  image_upload_enabled: true,
  sort_order: 0,
  is_active: true,
};

export function BoardForm({ mode, boardId, initial }: Props) {
  const router = useRouter();
  const [v, setV] = useState<BoardInput>({ ...DEFAULTS, ...initial });
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function set<K extends keyof BoardInput>(k: K, val: BoardInput[K]) {
    setV((p) => ({ ...p, [k]: val }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    start(async () => {
      try {
        if (mode === "create") await createBoard(v);
        else await updateBoard(boardId!, v);
      } catch (e: unknown) {
        setErr(e instanceof Error ? e.message : "오류가 발생했습니다.");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="form-card">
      <div className="form-row">
        <label htmlFor="name">게시판 이름<span className="req">*</span></label>
        <input
          id="name"
          value={v.name}
          onChange={(e) => set("name", e.target.value)}
          required
          maxLength={40}
          placeholder="예) 질문답변, 기도제목"
        />
      </div>

      <div className="form-row">
        <label htmlFor="slug">slug (URL)<span className="req">*</span></label>
        <input
          id="slug"
          value={v.slug}
          onChange={(e) => set("slug", e.target.value.toLowerCase())}
          required
          maxLength={32}
          pattern="[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?"
          placeholder="예) qna, prayer"
          style={{ fontFamily: "var(--sans)" }}
        />
        <small style={{ color: "var(--mute)", fontSize: 12, marginTop: 6, display: "block" }}>
          /board/<strong>{v.slug || "slug"}</strong> 로 접근합니다. 영문 소문자/숫자/하이픈만, 2~32자.
        </small>
      </div>

      <div className="form-row">
        <label htmlFor="description">설명</label>
        <input
          id="description"
          value={v.description}
          onChange={(e) => set("description", e.target.value)}
          maxLength={200}
          placeholder="목록 상단에 부제목으로 표시됩니다."
        />
      </div>

      <div className="form-row">
        <label htmlFor="category">메뉴 위치</label>
        <select
          id="category"
          value={v.category}
          onChange={(e) => set("category", e.target.value)}
          style={{ padding: "10px 12px", border: "1px solid var(--line)", background: "var(--white)", fontSize: 14 }}
        >
          <option value="">(메뉴에 표시하지 않음)</option>
          {TOP_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <small style={{ color: "var(--mute)", fontSize: 12, marginTop: 6, display: "block" }}>
          선택한 상위 메뉴의 드롭다운에 이 게시판이 자동으로 추가됩니다. ‘메뉴에 표시하지 않음’을 고르면 URL로만 접근 가능합니다.
        </small>
      </div>

      <div className="form-row">
        <label htmlFor="write_permission">쓰기 권한</label>
        <select
          id="write_permission"
          value={v.write_permission}
          onChange={(e) => set("write_permission", e.target.value as BoardInput["write_permission"])}
          style={{ padding: "10px 12px", border: "1px solid var(--line)", background: "var(--white)", fontSize: 14 }}
        >
          <option value="anyone">전체 (비로그인 포함)</option>
          <option value="member">회원 (로그인 필요)</option>
          <option value="admin">관리자만</option>
        </select>
        <small style={{ color: "var(--mute)", fontSize: 12, marginTop: 6, display: "block" }}>
          1차 단계에서는 ‘전체’만 실제 동작합니다. ‘회원/관리자’는 다음 PR에서 적용됩니다.
        </small>
      </div>

      <div className="form-row">
        <label>게시판 옵션</label>
        <div style={{ display: "grid", gap: 8 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
            <input type="checkbox" checked={v.comment_enabled} onChange={(e) => set("comment_enabled", e.target.checked)} />
            댓글 사용
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
            <input type="checkbox" checked={v.secret_enabled} onChange={(e) => set("secret_enabled", e.target.checked)} />
            비밀글 허용 <span style={{ color: "var(--mute)", fontSize: 12 }}>(다음 PR에서 실제 마스킹 적용)</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
            <input type="checkbox" checked={v.image_upload_enabled} onChange={(e) => set("image_upload_enabled", e.target.checked)} />
            이미지 첨부 허용
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
            <input type="checkbox" checked={v.is_active} onChange={(e) => set("is_active", e.target.checked)} />
            활성 (목록·메뉴에 노출)
          </label>
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="sort_order">표시 순서</label>
        <input
          id="sort_order"
          type="number"
          value={v.sort_order}
          onChange={(e) => set("sort_order", parseInt(e.target.value, 10) || 0)}
          style={{ maxWidth: 120 }}
        />
        <small style={{ color: "var(--mute)", fontSize: 12, marginTop: 6, display: "block" }}>
          숫자가 작을수록 위에 표시됩니다.
        </small>
      </div>

      {err && <p style={{ color: "var(--burgundy)", fontSize: 13 }}>{err}</p>}

      <div className="form-actions" style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "저장 중..." : mode === "create" ? "게시판 만들기" : "저장"}
        </button>
        <button type="button" className="more-link" onClick={() => router.push("/admin/boards")}>
          취소
        </button>
      </div>
    </form>
  );
}
