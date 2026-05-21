"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const RECENT_KEY = "search-recents-v1";
const MAX_RECENTS = 5;

function getRecents(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((s) => typeof s === "string").slice(0, MAX_RECENTS) : [];
  } catch { return []; }
}

function saveRecent(q: string) {
  if (!q.trim()) return;
  try {
    const cur = getRecents().filter((s) => s !== q);
    cur.unshift(q);
    localStorage.setItem(RECENT_KEY, JSON.stringify(cur.slice(0, MAX_RECENTS)));
  } catch {}
}

function clearRecents() {
  try { localStorage.removeItem(RECENT_KEY); } catch {}
}

export function SearchBar({ placeholder = "제목 검색" }: { placeholder?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const initialQ = params.get("q") ?? "";
  const [q, setQ] = useState(initialQ);
  const [isMobile, setIsMobile] = useState(false);
  const [recents, setRecents] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => { setQ(initialQ); }, [initialQ]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 560px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => { setRecents(getRecents()); }, []);

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

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      const t = e.target as Node | null;
      if (formRef.current && t && !formRef.current.contains(t)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  function submitWith(value: string) {
    saveRecent(value);
    setRecents(getRecents());
    const sp = new URLSearchParams(Array.from(params.entries()));
    if (value.trim()) sp.set("q", value.trim()); else sp.delete("q");
    sp.delete("page");
    const qs = sp.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
    setOpen(false);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    submitWith(q);
  }

  function clear() {
    setQ("");
    const sp = new URLSearchParams(Array.from(params.entries()));
    sp.delete("q");
    sp.delete("page");
    const qs = sp.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function pickRecent(value: string) {
    setQ(value);
    submitWith(value);
  }

  function removeRecent(value: string, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      const next = getRecents().filter((s) => s !== value);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      setRecents(next);
    } catch {}
  }

  function onClearAll(e: React.MouseEvent) {
    e.stopPropagation();
    clearRecents();
    setRecents([]);
  }

  return (
    <form ref={formRef} onSubmit={submit} className="search-bar" role="search">
      <input
        ref={inputRef}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setOpen(true)}
        placeholder={isMobile ? placeholder : placeholder + ' ("/" 키로 포커스)'}
        aria-label={placeholder}
        autoComplete="off"
      />
      {initialQ && (
        <button type="button" className="clear" onClick={clear} aria-label="검색어 지우기">×</button>
      )}
      <button type="submit" className="go" aria-label="검색">검색</button>

      {open && recents.length > 0 && (
        <div className="recents" role="listbox" aria-label="최근 검색어">
          <div className="recents-head">
            <span>최근 검색어</span>
            <button type="button" onClick={onClearAll} className="recents-clear">전체 삭제</button>
          </div>
          <ul>
            {recents.map((r) => (
              <li key={r}>
                <button type="button" onClick={() => pickRecent(r)} className="recents-item" role="option">
                  <span className="ic" aria-hidden>↺</span>
                  <span className="tt">{r}</span>
                  <span className="rm" onClick={(e) => removeRecent(r, e)} aria-label={`${r} 검색어 삭제`}>×</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
