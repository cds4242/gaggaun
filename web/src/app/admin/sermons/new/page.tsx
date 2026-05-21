import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { SermonForm } from "../sermon-form";
import { createSermon } from "../actions";

export const metadata = { title: "설교 등록 | 가까운교회" };

export default async function Page() {
  await requireAdmin("/admin/sermons/new");
  return (
    <>
      <div className="admin-page-head">
        <div className="title-side">
          <span className="eyebrow">New Sermon</span>
          <h1>새 설교 등록</h1>
        </div>
        <Link href="/admin/sermons" style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--mute)" }}>
          ← 목록으로
        </Link>
      </div>

      <div className="admin-card">
        <div className="ac-head"><h3>설교 정보</h3></div>
        <div className="ac-body">
          <SermonForm action={createSermon} submitLabel="등록" cancelHref="/admin/sermons" />
        </div>
      </div>
    </>
  );
}
