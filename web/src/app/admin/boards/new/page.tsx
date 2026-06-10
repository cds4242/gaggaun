import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { BoardForm } from "../board-form";

export const metadata = { title: "새 게시판 만들기 | 가까운 서광교회" };

export default async function Page() {
  await requireAdmin("/admin/boards/new");

  return (
    <>
      <div className="admin-page-head">
        <div className="title-side">
          <span className="eyebrow">New Board</span>
          <h1>새 게시판 만들기</h1>
        </div>
        <Link href="/admin/boards" className="more-link">← 목록</Link>
      </div>
      <div className="admin-card">
        <div className="ac-body">
          <BoardForm mode="create" />
        </div>
      </div>
    </>
  );
}
