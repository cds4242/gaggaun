"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/notices", label: "공지사항" },
  { href: "/admin/board", label: "게시판" },
  { href: "/admin/new-members", label: "새가족 등록" },
];

export function AdminSide() {
  const pathname = usePathname() ?? "";
  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <nav className="admin-side" aria-label="관리자 메뉴">
      <div className="group">
        <div className="lbl">MENU</div>
        {items.map((i) => (
          <Link key={i.href} href={i.href} className={isActive(i.href) ? "active" : ""}>
            <span className="ico">◆</span>
            <span>{i.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
