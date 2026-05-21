"use client";

import { useState, useTransition } from "react";
import { updateNewMemberStatus } from "./actions";

type Status = "pending" | "contacted" | "settled";

const LABELS: Record<Status, string> = {
  pending: "미응대",
  contacted: "연락 완료",
  settled: "정착",
};

export function StatusSelect({ id, value }: { id: number; value: Status }) {
  const [current, setCurrent] = useState<Status>(value);
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as Status;
    const prev = current;
    setCurrent(next);
    setErr(null);
    start(async () => {
      try {
        await updateNewMemberStatus(id, next);
      } catch (e: unknown) {
        setCurrent(prev);
        setErr(e instanceof Error ? e.message : "변경 실패");
      }
    });
  }

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <select value={current} onChange={onChange} disabled={pending} className={`status-select status-${current}`}>
        {(Object.keys(LABELS) as Status[]).map((k) => (
          <option key={k} value={k}>{LABELS[k]}</option>
        ))}
      </select>
      {pending && <span style={{ fontSize: 11, color: "var(--mute)" }}>저장 중…</span>}
      {err && <span style={{ fontSize: 11, color: "var(--burgundy)" }}>{err}</span>}
    </div>
  );
}
