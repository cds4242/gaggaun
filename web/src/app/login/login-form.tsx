"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      setErr(error.message);
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      router.push(next);
      router.refresh();
    }, 300);
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{
        opacity: mounted ? 1 : 0,
        transform: success ? "translateY(-4px)" : "translateY(0)",
        transition: "opacity .35s ease, transform .35s ease",
      }}
    >
      <div className="form-row">
        <label htmlFor="email">이메일</label>
        <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
      </div>
      <div className="form-row">
        <label htmlFor="password">비밀번호</label>
        <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
      </div>
      {err && (
        <p style={{ color: "var(--burgundy)", fontSize: 13, marginBottom: 12, transition: "opacity .2s ease" }}>
          {err}
        </p>
      )}
      <div className="form-actions" style={{ marginTop: 8 }}>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{ width: "100%", justifyContent: "center", transition: "background .2s ease, opacity .2s ease" }}
        >
          {success ? "환영합니다 ✓" : loading ? "로그인 중..." : "로그인"}
        </button>
      </div>
    </form>
  );
}
