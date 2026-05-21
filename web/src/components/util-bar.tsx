"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LogoutLink } from "@/components/logout-link";

// 클라이언트에서 supabase 세션을 확인 — 페이지 자체는 static/ISR로 캐싱 가능
export function UtilBar() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setUserEmail(data.user?.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="util">
      <div className="util-row">
        <div className="left">
          <span className="verse">
            “여호와는 나의 목자시니 내게 부족함이 없으리로다” &nbsp;— 시편 23:1
          </span>
        </div>
        <div className="right">
          {userEmail ? (
            <>
              <Link href="/admin">관리자</Link>
              <span className="sep">|</span>
              <LogoutLink />
            </>
          ) : (
            <>
              <Link href="/login">로그인</Link>
              <span className="sep">|</span>
            </>
          )}
          <Link href="/new-member">새가족등록</Link>
          <span className="sep">|</span>
          <Link href="/notices">교회소식</Link>
          <span className="sep">|</span>
          <Link href="/board">게시판</Link>
        </div>
      </div>
    </div>
  );
}
