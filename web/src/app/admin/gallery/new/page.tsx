import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { GalleryUploadForm } from "./upload-form";

export const metadata = { title: "사진 업로드 | 가까운교회" };

export default async function Page() {
  await requireAdmin("/admin/gallery/new");
  return (
    <>
      <div className="admin-page-head">
        <div className="title-side">
          <span className="eyebrow">New Photo</span>
          <h1>새 사진 업로드</h1>
        </div>
        <Link href="/admin/gallery" style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--mute)" }}>
          ← 목록으로
        </Link>
      </div>

      <div className="admin-card">
        <div className="ac-head"><h3>사진 정보</h3></div>
        <div className="ac-body">
          <GalleryUploadForm />
        </div>
      </div>
    </>
  );
}
