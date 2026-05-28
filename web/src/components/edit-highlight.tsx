"use client";

import { useEffect } from "react";

export function EditHighlight() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get("edit");
    if (!id) return;

    const tryHighlight = (attempt = 0) => {
      const el = document.querySelector<HTMLElement>(`[data-edit-section="${CSS.escape(id)}"]`)
        ?? document.querySelector<HTMLElement>(`[data-edit-id="${CSS.escape(id)}"]`);
      if (!el) {
        if (attempt < 10) setTimeout(() => tryHighlight(attempt + 1), 200);
        return;
      }
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("edit-highlight-pulse");
      setTimeout(() => el.classList.remove("edit-highlight-pulse"), 4000);

      // 작은 토스트 — 어떤 섹션이 강조됐는지 알려줌
      const toast = document.createElement("div");
      toast.className = "edit-highlight-toast";
      toast.textContent = `편집 도구가 가리킨 위치: ${id}`;
      document.body.appendChild(toast);
      setTimeout(() => toast.classList.add("show"), 50);
      setTimeout(() => toast.classList.remove("show"), 4500);
      setTimeout(() => toast.remove(), 5000);
    };
    tryHighlight();
  }, []);

  return null;
}
