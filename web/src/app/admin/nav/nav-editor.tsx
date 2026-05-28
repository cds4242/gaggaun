"use client";

import { useState } from "react";
import { updateNavTree } from "./actions";
import type { NavItem } from "@/lib/nav";

type Child = { label: string; href: string };

export function NavEditor({ initial }: { initial: NavItem[] }) {
  const [tree, setTree] = useState<NavItem[]>(() => JSON.parse(JSON.stringify(initial)));
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function update(fn: (t: NavItem[]) => void) {
    const next: NavItem[] = JSON.parse(JSON.stringify(tree));
    fn(next);
    setTree(next);
  }

  function moveTop(idx: number, dir: -1 | 1) {
    update((t) => {
      const ni = idx + dir;
      if (ni < 0 || ni >= t.length) return;
      [t[idx], t[ni]] = [t[ni], t[idx]];
    });
  }
  function moveSub(parent: number, si: number, dir: -1 | 1) {
    update((t) => {
      const children = t[parent].children ?? [];
      const ni = si + dir;
      if (ni < 0 || ni >= children.length) return;
      [children[si], children[ni]] = [children[ni], children[si]];
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.set("tree", JSON.stringify(tree));
      await updateNavTree(fd);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="nav-editor">
      {tree.map((item, idx) => (
        <div key={idx} className="nav-edit-item">
          <div className="nav-edit-row">
            <input
              className="nav-edit-input title"
              placeholder="메뉴명"
              value={item.label}
              onChange={(e) => update((t) => { t[idx].label = e.target.value; })}
            />
            <input
              className="nav-edit-input href"
              placeholder="/path"
              value={item.href}
              onChange={(e) => update((t) => { t[idx].href = e.target.value; })}
            />
            <button type="button" className="nav-edit-btn" onClick={() => moveTop(idx, -1)} aria-label="위로">↑</button>
            <button type="button" className="nav-edit-btn" onClick={() => moveTop(idx, 1)} aria-label="아래로">↓</button>
            <button
              type="button"
              className="nav-edit-btn del"
              onClick={() => {
                if (confirm(`"${item.label}" 메뉴를 삭제할까요?`)) {
                  update((t) => { t.splice(idx, 1); });
                }
              }}
            >
              삭제
            </button>
          </div>

          <div className="nav-edit-children">
            {(item.children ?? []).map((c: Child, ci) => (
              <div key={ci} className="nav-edit-subrow">
                <input
                  className="nav-edit-input title sm"
                  placeholder="하위 메뉴명"
                  value={c.label}
                  onChange={(e) => update((t) => { (t[idx].children ?? [])[ci].label = e.target.value; })}
                />
                <input
                  className="nav-edit-input href sm"
                  placeholder="/path"
                  value={c.href}
                  onChange={(e) => update((t) => { (t[idx].children ?? [])[ci].href = e.target.value; })}
                />
                <button type="button" className="nav-edit-btn sm" onClick={() => moveSub(idx, ci, -1)} aria-label="위로">↑</button>
                <button type="button" className="nav-edit-btn sm" onClick={() => moveSub(idx, ci, 1)} aria-label="아래로">↓</button>
                <button
                  type="button"
                  className="nav-edit-btn sm del"
                  onClick={() => update((t) => { (t[idx].children ?? []).splice(ci, 1); })}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              className="nav-edit-add-sub"
              onClick={() =>
                update((t) => {
                  if (!t[idx].children) t[idx].children = [];
                  t[idx].children!.push({ label: "새 하위 메뉴", href: "/" });
                })
              }
            >
              + 하위 메뉴 추가
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="nav-edit-add-top"
        onClick={() => update((t) => { t.push({ label: "새 메뉴", href: "/", children: [] }); })}
      >
        + 새 메뉴 추가
      </button>

      {err && <div className="nav-edit-error">{err}</div>}

      <div className="nav-edit-actions">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "저장 중..." : "저장 (사이트 즉시 반영)"}
        </button>
      </div>
    </form>
  );
}
