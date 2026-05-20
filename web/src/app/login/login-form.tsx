"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      <div>
        <Label htmlFor="email">이메일</Label>
        <Input id="email" type="email" autoComplete="email" value={email}
          onChange={(e) => setEmail(e.target.value)} required
          className="mt-2 rounded-none border-0 border-b border-[var(--line-soft)] bg-transparent px-0 h-12 focus-visible:ring-0 focus-visible:border-ink" />
      </div>
      <div>
        <Label htmlFor="password">비밀번호</Label>
        <Input id="password" type="password" autoComplete="current-password" value={password}
          onChange={(e) => setPassword(e.target.value)} required
          className="mt-2 rounded-none border-0 border-b border-[var(--line-soft)] bg-transparent px-0 h-12 focus-visible:ring-0 focus-visible:border-ink" />
      </div>
      {err && <p className="text-[13px] text-red-800">{err}</p>}
      <button type="submit" disabled={loading} className="btn-ink w-full disabled:opacity-50">
        {loading ? "LOGGING IN..." : "LOGIN"}
      </button>
    </form>
  );
}
