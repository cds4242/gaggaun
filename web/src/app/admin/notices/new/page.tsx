import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createNotice } from "../actions";

export const metadata = { title: "공지 작성 | 가까운 서광교회" };

export default async function Page() {
  await requireAdmin("/admin/notices/new");
  return (
    <>
      <div className="admin-page-head">
        <div className="title-side">
          <span className="eyebrow">New Notice</span>
          <h1>새 공지 작성</h1>
        </div>
        <Link href="/admin/notices" style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--mute)" }}>
          ← 목록으로
        </Link>
      </div>

      <div className="admin-card">
        <div className="ac-head"><h3>공지 내용</h3></div>
        <div className="ac-body">
          <form action={createNotice} className="admin-form">
            <div className="row">
              <label htmlFor="title">제목</label>
              <input id="title" name="title" type="text" required placeholder="공지 제목을 입력하세요" />
            </div>
            <div className="row">
              <label htmlFor="content">내용</label>
              <textarea id="content" name="content" required placeholder="공지 내용을 입력하세요" />
            </div>
            <label className="check">
              <input type="checkbox" name="pinned" />
              상단 고정 (공지로 표시)
            </label>
            <div className="actions">
              <button type="submit" className="btn-primary">등록</button>
              <Link href="/admin/notices" className="more-link">취소</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
