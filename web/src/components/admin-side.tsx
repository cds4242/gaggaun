"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/this-week", label: "금주 정보" },
  { href: "/admin/notices", label: "공지사항" },
  { href: "/admin/boards", label: "게시판 관리" },
  { href: "/admin/board", label: "게시글 관리" },
  { href: "/admin/sermons", label: "설교 영상" },
  { href: "/admin/gallery", label: "갤러리" },
  { href: "/admin/new-members", label: "새가족 등록" },
];

export function AdminSide() {
  const pathname = usePathname() ?? "";
  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    // 정확 매칭 또는 하위 경로(/admin/boards/new 등). /admin/board가 /admin/boards에 흘러들지 않도록 경계 확인.
    return pathname === href || pathname.startsWith(href + "/");
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
