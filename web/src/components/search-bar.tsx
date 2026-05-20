"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function SearchBar({ placeholder = "제목 검색" }: { placeholder?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const initialQ = params.get("q") ?? "";
  const [q, setQ] = useState(initialQ);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setQ(initialQ); }, [initialQ]);

  // "/" 키로 빠르게 포커스
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const sp = new URLSearchParams(Array.from(params.entries()));
    if (q.trim()) sp.set("q", q.trim()); else sp.delete("q");
    sp.delete("page");
    const qs = sp.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function clear() {
    setQ("");
    const sp = new URLSearchParams(Array.from(params.entries()));
    sp.delete("q");
    sp.delete("page");
    const qs = sp.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <form onSubmit={submit} className="search-bar" role="search">
      <input
        ref={inputRef}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder + ' ("/" 키로 포커스)'}
        aria-label={placeholder}
      />
      {initialQ && (
        <button type="button" className="clear" onClick={clear} aria-label="검색어 지우기">×</button>
      )}
      <button type="submit" className="go" aria-label="검색">검색</button>
    </form>
  );
}
