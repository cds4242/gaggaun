"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const MESSAGES: Record<string, { text: string; tone: "ok" | "warn" }> = {
  logout: { text: "로그아웃되었습니다.", tone: "ok" },
  "not-admin": { text: "관리자 권한이 없습니다.", tone: "warn" },
  "admin-check-failed": { text: "관리자 확인 중 오류가 발생했습니다.", tone: "warn" },
};

export function FlashMessage() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const key = params.get("msg");
  const msg = key ? MESSAGES[key] : null;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!msg) return;
    setVisible(true);
    const t1 = setTimeout(() => setVisible(false), 2500);
    const t2 = setTimeout(() => {
      const p = new URLSearchParams(Array.from(params.entries()));
      p.delete("msg");
      const qs = p.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    }, 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [msg, params, pathname, router]);

  if (!msg) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        top: 18,
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? 0 : -16}px)`,
        opacity: visible ? 1 : 0,
        transition: "opacity .25s ease, transform .25s ease",
        background: msg.tone === "ok" ? "var(--navy)" : "var(--burgundy)",
        color: "#fff",
        padding: "10px 18px",
        fontFamily: "var(--serif)",
        fontSize: 14,
        boxShadow: "var(--shadow)",
        zIndex: 80,
        pointerEvents: "none",
      }}
    >
      {msg.text}
    </div>
  );
}
