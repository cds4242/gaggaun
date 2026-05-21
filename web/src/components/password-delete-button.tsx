"use client";

import { useState, useTransition } from "react";

type Props = {
  action: (password: string) => Promise<void>;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  promptMessage?: string;
};

/**
 * 작성자 비밀번호(4자리)를 prompt로 입력받아 삭제 server action 실행.
 * 관리자는 빈 문자열을 전달하면 server action에서 admin check로 우회 가능.
 */
export function PasswordDeleteButton({
  action,
  label = "삭제",
  className = "danger",
  style,
  promptMessage = "비밀번호 4자리를 입력하세요",
}: Props) {
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  function onClick() {
    if (pending) return;
    const pw = window.prompt(promptMessage);
    if (pw === null) return;
    if (!/^\d{4}$/.test(pw.trim())) {
      window.alert("비밀번호는 숫자 4자리로 입력해 주세요.");
      return;
    }
    setErr(null);
    start(async () => {
      try {
        await action(pw.trim());
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "삭제 실패";
        setErr(msg);
        window.alert(msg);
      }
    });
  }

  return (
    <>
      <button type="button" onClick={onClick} disabled={pending} className={className} style={style}>
        {pending ? "삭제 중..." : label}
      </button>
      {err && <span style={{ marginLeft: 8, color: "var(--burgundy)", fontSize: 12 }}>{err}</span>}
    </>
  );
}
