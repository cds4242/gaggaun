import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { AdminSide } from "@/components/admin-side";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { email } = await requireAdmin("/admin");

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <Link href="/admin" className="ab-brand">
          가까운교회 <span className="tag">ADMIN</span>
        </Link>
        <div className="ab-actions">
          <span className="who">{email}</span>
          <span className="sep">|</span>
          <Link href="/" target="_blank">사이트 보기 ↗</Link>
          <span className="sep">|</span>
          <Link href="/logout">로그아웃</Link>
        </div>
      </header>
      <AdminSide />
      <main className="admin-main">{children}</main>
    </div>
  );
}
