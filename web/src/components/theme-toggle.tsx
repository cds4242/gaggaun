"use client";

import { useEffect, useState } from "react";

type Mode = "system" | "light" | "dark";
const KEY = "theme-mode";

function applyMode(mode: Mode) {
  const root = document.documentElement;
  if (mode === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", mode);
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = (localStorage.getItem(KEY) as Mode) || "system";
      setMode(saved);
      applyMode(saved);
    } catch {}
  }, []);

  function cycle() {
    const next: Mode = mode === "system" ? "light" : mode === "light" ? "dark" : "system";
    setMode(next);
    applyMode(next);
    try { localStorage.setItem(KEY, next); } catch {}
  }

  if (!mounted) return null;

  const label = mode === "system" ? "자동" : mode === "light" ? "라이트" : "다크";
  const icon = mode === "dark" ? "☾" : mode === "light" ? "☀" : "◐";
  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`테마 (${label}) 변경`}
      title={`테마: ${label} (클릭하여 변경)`}
      className="theme-toggle"
    >
      <span aria-hidden>{icon}</span>
      <span className="lbl">{label}</span>
    </button>
  );
}
