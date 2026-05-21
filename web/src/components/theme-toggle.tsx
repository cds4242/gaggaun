"use client";

import { useEffect, useState } from "react";

type Mode = "light" | "dark";
const KEY = "theme-mode";

function applyMode(mode: Mode) {
  document.documentElement.setAttribute("data-theme", mode);
}

function detectInitial(): Mode {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {}
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  return "light";
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const init = detectInitial();
    setMode(init);
    applyMode(init);
    setMounted(true);
  }, []);

  function setTo(next: Mode) {
    setMode(next);
    applyMode(next);
    try { localStorage.setItem(KEY, next); } catch {}
  }

  if (!mounted) return null;

  return (
    <div className="theme-toggle" role="group" aria-label="테마 전환">
      <button
        type="button"
        onClick={() => setTo("light")}
        aria-pressed={mode === "light"}
        aria-label="라이트 모드"
        title="라이트 모드"
        className={"tt-opt" + (mode === "light" ? " active" : "")}
      >
        <span aria-hidden>☀</span>
      </button>
      <button
        type="button"
        onClick={() => setTo("dark")}
        aria-pressed={mode === "dark"}
        aria-label="다크 모드"
        title="다크 모드"
        className={"tt-opt" + (mode === "dark" ? " active" : "")}
      >
        <span aria-hidden>☾</span>
      </button>
    </div>
  );
}
