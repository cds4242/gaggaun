import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata = { title: "관리자 로그인 | 가까운 서광교회" };

export default function Page() {
  return (
    <section className="block">
      <div className="wrap" style={{ maxWidth: 440 }}>
        <div className="prose-box" style={{ padding: "48px 40px" }}>
          <span className="eyebrow">Admin</span>
          <h2 style={{ marginBottom: 24 }}>로그인</h2>
          <Suspense fallback={<div style={{ color: "var(--mute)" }}>로딩 중...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
