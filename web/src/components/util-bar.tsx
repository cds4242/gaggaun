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
          <Link href="/search" className="util-search">검색</Link>
          <span className="sep">|</span>
          <Link href="/new-member">새가족등록</Link>
          <span className="sep">|</span>
          <Link href="/notices">교회소식</Link>
          <span className="sep">|</span>
          <Link href="/board">게시판</Link>
          <span className="sep">|</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
