"use client";

import { useState, useTransition } from "react";
import { formatDateTime } from "@/lib/utils";
import { RichText } from "@/components/rich-text";
import { createBoardComment, deleteBoardCommentWithPassword } from "./actions";

export type CommentNode = {
  id: number;
  post_id: number;
  parent_id: number | null;
  author_name: string;
  content: string;
  created_at: string;
};

type Props = {
  postId: number;
  comments: CommentNode[];
  admin: boolean;
};

export function Comments({ postId, comments, admin }: Props) {
  const roots = comments.filter((c) => c.parent_id == null);
  const childrenMap = new Map<number, CommentNode[]>();
  for (const c of comments) {
    if (c.parent_id != null) {
      const arr = childrenMap.get(c.parent_id) ?? [];
      arr.push(c);
      childrenMap.set(c.parent_id, arr);
    }
  }

  return (
    <section className="comments" aria-label="댓글" style={{ marginTop: 40, borderTop: "1px solid var(--line)", paddingTop: 28 }}>
      <h3 style={{ fontFamily: "var(--serif)", fontSize: 18, color: "var(--navy)", marginBottom: 18 }}>
        댓글 <span style={{ color: "var(--mute)", fontWeight: 400, fontSize: 14 }}>{comments.length}</span>
      </h3>

      {roots.length === 0 ? (
        <p style={{ color: "var(--mute)", fontSize: 14, marginBottom: 24 }}>아직 댓글이 없습니다. 첫 댓글을 남겨 보세요.</p>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 14 }}>
          {roots.map((c) => (
            <CommentItem key={c.id} comment={c} replies={childrenMap.get(c.id) ?? []} postId={postId} admin={admin} />
          ))}
        </ul>
      )}

      <div style={{ marginTop: 24 }}>
        <CommentForm postId={postId} />
      </div>
    </section>
  );
}

function DeleteCommentBtn({ commentId, postId, admin, label = "삭제" }: { commentId: number; postId: number; admin: boolean; label?: string }) {
  const [pending, start] = useTransition();
  function onClick() {
    if (pending) return;
    if (admin) {
      if (!window.confirm("이 댓글을 삭제하시겠습니까? (관리자)")) return;
      start(async () => {
        try { await deleteBoardCommentWithPassword(commentId, postId, ""); }
        catch (e: unknown) { window.alert(e instanceof Error ? e.message : "삭제 실패"); }
      });
      return;
    }
    const pw = window.prompt("댓글 삭제: 작성 시 입력한 비밀번호 4자리");
    if (pw === null) return;
    if (!/^\d{4}$/.test(pw.trim())) {
      window.alert("비밀번호는 숫자 4자리로 입력해 주세요.");
      return;
    }
    start(async () => {
      try { await deleteBoardCommentWithPassword(commentId, postId, pw.trim()); }
      catch (e: unknown) { window.alert(e instanceof Error ? e.message : "삭제 실패"); }
    });
  }
  return (
    <button type="button" onClick={onClick} disabled={pending} style={{ fontSize: 12, color: "var(--burgundy)" }}>
      {pending ? "삭제 중..." : label}
    </button>
  );
}

function CommentItem({ comment, replies, postId, admin }: { comment: CommentNode; replies: CommentNode[]; postId: number; admin: boolean }) {
  const [replyOpen, setReplyOpen] = useState(false);

  return (
    <li style={{ border: "1px solid var(--line)", background: "var(--white)" }}>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
          <strong style={{ color: "var(--navy)", fontSize: 14 }}>{comment.author_name}</strong>
          <span style={{ color: "var(--mute)", fontSize: 12, fontFamily: "var(--sans)" }}>{formatDateTime(comment.created_at)}</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
            <button type="button" onClick={() => setReplyOpen((v) => !v)} style={{ fontSize: 12, color: "var(--navy)" }}>
              {replyOpen ? "취소" : "답글"}
            </button>
            <DeleteCommentBtn commentId={comment.id} postId={postId} admin={admin} />
          </div>
        </div>
        <RichText text={comment.content} className="comment-body" />
      </div>

      {replyOpen && (
        <div style={{ background: "var(--ivory)", padding: "12px 16px", borderTop: "1px solid var(--line)" }}>
          <CommentForm postId={postId} parentId={comment.id} compact onDone={() => setReplyOpen(false)} />
        </div>
      )}

      {replies.length > 0 && (
        <ul style={{ listStyle: "none", margin: 0, padding: "0 0 0 24px", borderTop: "1px solid var(--line)", background: "var(--paper)" }}>
          {replies.map((r) => (
            <li key={r.id} style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                <span style={{ color: "var(--gold)", fontSize: 12, fontFamily: "var(--sans)" }}>└ 답글</span>
                <strong style={{ color: "var(--navy)", fontSize: 14 }}>{r.author_name}</strong>
                <span style={{ color: "var(--mute)", fontSize: 12, fontFamily: "var(--sans)" }}>{formatDateTime(r.created_at)}</span>
                <div style={{ marginLeft: "auto" }}>
                  <DeleteCommentBtn commentId={r.id} postId={postId} admin={admin} />
                </div>
              </div>
              <RichText text={r.content} className="comment-body" />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function CommentForm({ postId, parentId, compact = false, onDone }: { postId: number; parentId?: number; compact?: boolean; onDone?: () => void }) {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!/^\d{4}$/.test(password)) {
      setErr("비밀번호는 숫자 4자리로 입력해 주세요.");
      return;
    }
    start(async () => {
      try {
        await createBoardComment({ post_id: postId, parent_id: parentId ?? null, author_name: author, content, password });
        setAuthor(""); setContent(""); setPassword("");
        onDone?.();
      } catch (e: unknown) {
        setErr(e instanceof Error ? e.message : "오류가 발생했습니다.");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 8 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          type="text"
          required
          maxLength={30}
          placeholder={parentId ? "답글 작성자" : "작성자"}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={{ flex: "0 1 160px", padding: "8px 10px", border: "1px solid var(--line)", background: "var(--white)", fontSize: 13 }}
        />
        <input
          type="password"
          inputMode="numeric"
          pattern="\d{4}"
          maxLength={4}
          required
          placeholder="비번 4자리"
          value={password}
          onChange={(e) => setPassword(e.target.value.replace(/\D/g, "").slice(0, 4))}
          style={{ flex: "0 1 120px", padding: "8px 10px", border: "1px solid var(--line)", background: "var(--white)", fontSize: 13, letterSpacing: ".3em" }}
        />
      </div>
      <textarea
        required
        maxLength={1000}
        rows={compact ? 2 : 3}
        placeholder={parentId ? "답글을 입력하세요" : "댓글을 입력하세요"}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--line)", background: "var(--white)", fontFamily: "inherit", fontSize: 14, lineHeight: 1.6, resize: "vertical" }}
      />
      {err && <p style={{ color: "var(--burgundy)", fontSize: 12, margin: 0 }}>{err}</p>}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        {parentId && onDone && (
          <button type="button" onClick={onDone} style={{ fontSize: 13, color: "var(--mute)", padding: "8px 14px" }}>취소</button>
        )}
        <button type="submit" disabled={pending} className="btn-primary btn-sm">
          {pending ? "등록 중..." : parentId ? "답글 등록" : "댓글 등록"}
        </button>
      </div>
    </form>
  );
}
