"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export function UtilBar() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = q.trim();
    router.push(value ? `/search?q=${encodeURIComponent(value)}` : "/search");
  }

  return (
    <div className="util">
      <div className="util-row">
        <div className="left">
          <Link href="/new-member">새가족등록</Link>
          <span className="sep">|</span>
          <Link href="/notices">교회소식</Link>
          <span className="sep">|</span>
          <Link href="/board">게시판</Link>
        </div>
        <div className="right">
          <form className="util-search-pill" onSubmit={onSubmit} role="search">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="통합 검색"
              aria-label="통합 검색"
            />
            <button type="submit" aria-label="검색">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="11" cy="11" r="7"/>
                <line x1="20" y1="20" x2="16.5" y2="16.5"/>
              </svg>
            </button>
          </form>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
