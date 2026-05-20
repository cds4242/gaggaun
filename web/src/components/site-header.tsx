"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV } from "@/lib/nav";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="nav-row">
        <Link className="brand" href="/" aria-label="가까운교회 홈">
          <span className="cross" aria-hidden />
          <span className="text">
            <span className="ko">가까운교회</span>
            <span className="en">The Near Church · Gimpo</span>
          </span>
        </Link>

        <ul className="mainmenu" role="menubar">
          {NAV.map((item) => (
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
          <Link className="btn-primary" href="/new-member">새가족 등록</Link>
          <button
            className="burger"
            aria-label="메뉴 열기"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className={"mobile-menu" + (open ? " open" : "")}>
        <div className="inner">
          {NAV.map((item) => (
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
            <Link className="btn-primary" href="/new-member" onClick={() => setOpen(false)}>
              새가족 등록
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
