"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function UtilBar() {
  return (
    <div className="util">
      <div className="util-row">
        <div className="left">
          <span className="verse">
            “여호와는 나의 목자시니 내게 부족함이 없으리로다” &nbsp;— 시편 23:1
          </span>
        </div>
        <div className="right">
          <Link href="/new-member">새가족등록</Link>
          <span className="sep">|</span>
          <Link href="/notices">교회소식</Link>
          <span className="sep">|</span>
          <Link href="/board">게시판</Link>
          <Link href="/search" className="util-search-btn" aria-label="통합 검색">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="11" cy="11" r="7"/>
              <line x1="20" y1="20" x2="16.5" y2="16.5"/>
            </svg>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
