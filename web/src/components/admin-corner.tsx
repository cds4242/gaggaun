"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LogoutLink } from "@/components/logout-link";

export function AdminCorner() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setSignedIn(!!data.user);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setSignedIn(!!session?.user);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  return (
    <div className="admin-corner" aria-label="관리자 접근">
      {signedIn ? (
        <>
          <Link href="/admin">관리자</Link>
          <span className="dot" aria-hidden>·</span>
          <LogoutLink />
        </>
      ) : (
        <Link href="/login">관리자</Link>
      )}
    </div>
  );
}
