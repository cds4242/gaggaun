"use client";

import { useState, useTransition } from "react";

type Props = {
  action: () => Promise<void>;
  confirmMessage?: string;
  label?: string;
  pendingLabel?: string;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * 공용 삭제 버튼.
 * - 클릭 시 confirm 다이얼로그 노출, 동의해야 server action 실행
 * - 실행 중에는 pending 상태로 라벨 변경 + 비활성화
 * - 액션 안에서 revalidatePath만 호출하고 redirect 없이 끝나면 자동으로 같은 페이지가 갱신됨
 */
export function DeleteButton({
  action,
  confirmMessage = "정말 삭제하시겠습니까?",
  label = "삭제",
  pendingLabel = "삭제 중...",
  className = "danger",
  style,
}: Props) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onClick() {
    if (pending) return;
    if (!window.confirm(confirmMessage)) return;
    setError(null);
    start(async () => {
      try {
        await action();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "삭제 실패");
      }
    });
  }

  return (
    <>
      <button type="button" onClick={onClick} disabled={pending} className={className} style={style}>
        {pending ? pendingLabel : label}
      </button>
      {error && <span style={{ marginLeft: 8, color: "var(--burgundy)", fontSize: 12 }}>{error}</span>}
    </>
  );
}
