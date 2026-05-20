"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV } from "@/lib/nav";

export function SiteHeader({ userEmail }: { userEmail?: string | null; isAdmin?: boolean }) {
  const [open, setOpen] = useState(false);
  void userEmail;

  return (
    <header
      className="bg-white border-b border-[var(--line)] sticky top-0 z-40"
      style={{ boxShadow: "0 2px 0 var(--gold)" }}
    >
      <div className="max-w-[1240px] mx-auto px-8 h-[96px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3.5">
          <span className="brand-cross" aria-hidden />
          <span>
            <span className="block font-serif font-bold text-[26px] text-[var(--navy)] tracking-[-0.04em] leading-none">
              가까운교회
            </span>
            <span className="block font-display italic text-[13px] text-[var(--gold)] mt-1.5 tracking-[0.04em]">
              The Near Church · Gimpo
            </span>
          </span>
        </Link>

        <ul className="hidden xl:flex items-center h-full" role="menubar">
          {NAV.map((item) => (
            <li key={item.href} className="relative h-full group">
              <Link
                href={item.href}
                className="relative flex items-center h-full px-5 font-serif text-[17px] font-medium text-[var(--ink)] tracking-[-0.02em] hover:text-[var(--navy)] transition-colors"
              >
                {item.label}
                <span className="absolute left-5 right-5 bottom-[18px] h-[2px] bg-[var(--gold)] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
              {item.children && (
                <ul className="absolute left-1/2 top-full -translate-x-1/2 translate-y-2 group-hover:translate-y-0 bg-white border border-[var(--line)] border-t-2 border-t-[var(--gold)] min-w-[180px] py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-[var(--shadow)]">
                  {item.children.map((c) => (
                    <li key={c.href}>
                      <Link
                        href={c.href}
                        className="block px-5 py-2 font-serif text-[15px] text-[var(--body)] hover:text-[var(--navy)] hover:bg-[var(--paper)] whitespace-nowrap"
                      >
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link href="/new-member" className="hidden xl:inline-flex btn-primary">
            새가족 등록
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="xl:hidden p-2 text-[var(--navy)]"
            aria-label="메뉴"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="xl:hidden border-t border-[var(--line)] bg-white">
          <div className="max-w-[1240px] mx-auto px-8 py-5 space-y-1">
            {NAV.map((item) => (
              <div key={item.href} className="py-1">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 font-serif text-[17px] text-[var(--ink)]"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-3 border-l border-[var(--line)] pl-4 py-1">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        onClick={() => setOpen(false)}
                        className="block py-1.5 font-serif text-[14px] text-[var(--mute)]"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="border-t border-[var(--line)] pt-4 mt-2">
              <Link href="/new-member" onClick={() => setOpen(false)} className="btn-primary w-full justify-center">
                새가족 등록
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
