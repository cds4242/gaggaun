"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Option = { slug: string; name: string };

export function BoardFilter({ options, value }: { options: Option[]; value: string }) {
  const router = useRouter();
  const sp = useSearchParams();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = new URLSearchParams(sp?.toString() ?? "");
    const v = e.target.value;
    if (v) next.set("board", v);
    else next.delete("board");
    next.delete("page");
    const qs = next.toString();
    router.push(qs ? `/admin/board?${qs}` : "/admin/board");
  }

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <label htmlFor="board-filter" style={{ fontSize: 13, color: "var(--mute)" }}>게시판</label>
      <select
        id="board-filter"
        value={value}
        onChange={onChange}
        style={{ padding: "8px 10px", border: "1px solid var(--line)", background: "var(--white)", fontSize: 13 }}
      >
        <option value="">전체</option>
        {options.map((b) => (
          <option key={b.slug} value={b.slug}>{b.name}</option>
        ))}
      </select>
    </div>
  );
}
