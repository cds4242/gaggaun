"use client";

import { useState, useTransition } from "react";
import { logoutAction } from "@/app/logout/actions";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export function LogoutLink({ className, children = "로그아웃" }: Props) {
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    if (pending) return;
    if (!confirming) {
      const ok = window.confirm("로그아웃하시겠습니까?");
      if (!ok) return;
      setConfirming(true);
    }
    start(() => {
      logoutAction();
    });
  }

  return (
    <a
      href="/logout"
      className={className}
      onClick={onClick}
      aria-busy={pending}
      data-pending={pending ? "true" : undefined}
    >
      {pending ? "로그아웃 중..." : children}
    </a>
  );
}
