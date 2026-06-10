"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { NAV, type NavItem } from "@/lib/nav";

export function SiteHeader({ nav }: { nav?: NavItem[] }) {
  const items = nav ?? NAV;
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // 라우트 변경 시 자동 닫힘 (Link 클릭으로 페이지 이동될 때)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // 모바일 드로어 열렸을 때 body 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Esc로 닫기
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // 외부 클릭/탭 시 닫힘 (모바일 드로어)
  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      const t = e.target as Node | null;
      if (!t) return;
      if (headerRef.current && headerRef.current.contains(t)) return;
      setOpen(false);
    }
    // pointerdown으로 시작 시점에 잡으면 클릭이 무효화될 수 있어 click 사용
    document.addEventListener("click", onPointer as unknown as EventListener);
    return () => document.removeEventListener("click", onPointer as unknown as EventListener);
  }, [open]);

  // 데스크톱: hover 기반 드롭다운은 CSS가 처리. JS로 click 후 stuck open 되지 않게
  // submenu가 hover로 열려도 mouseleave 시 자동 닫히므로 별도 처리 불필요.

  return (
    <header className="header" ref={headerRef}>
      <div className="nav-row">
        <Link className="brand" href="/" aria-label="가까운 서광교회 홈">
          <span className="cross" aria-hidden />
          <span className="text">
            <span className="ko">가까운 서광교회</span>
          </span>
        </Link>

        <ul className="mainmenu" role="menubar">
          {items.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
              {item.children && (
                <ul className="submenu">
                  {item.children.map((c) => (
                    <li key={`${c.label}-${c.href}`}>
                      <Link href={c.href}>{c.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <Link className="btn-primary" href="/about/location">오시는 길</Link>
          <button
            className="burger"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className={"mobile-menu" + (open ? " open" : "")}>
        <div className="inner">
          {items.map((item) => (
            <div className="grp" key={item.href}>
              <Link href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
              {item.children && (
                <div className="subs">
                  {item.children.map((c) => (
                    <Link key={`${c.label}-${c.href}`} href={c.href} onClick={() => setOpen(false)}>
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="cta">
            <Link className="btn-primary" href="/about/location" onClick={() => setOpen(false)}>
              오시는 길
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
