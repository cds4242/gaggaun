import Link from "next/link";
export const metadata = { title: "등록 감사 | 가까운교회" };
export default function Page() {
  return (
    <section className="block">
      <div className="wrap" style={{ maxWidth: 600, textAlign: "center" }}>
        <span className="eyebrow" style={{ fontFamily: "var(--display)", fontStyle: "italic", color: "var(--gold)", letterSpacing: ".08em" }}>— Welcome</span>
        <h1 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: 42, color: "var(--navy)", letterSpacing: "-0.04em", marginTop: 16 }}>환영합니다</h1>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 28, marginBottom: 28, color: "var(--gold)" }}>
          <span style={{ width: 48, height: 1, background: "var(--gold)" }} />
          <span style={{ width: 8, height: 8, background: "var(--gold)", transform: "rotate(45deg)" }} />
          <span style={{ width: 48, height: 1, background: "var(--gold)" }} />
        </div>
        <p style={{ color: "var(--body)", lineHeight: 1.9 }}>
          새가족 등록이 완료되었습니다.<br />담당자가 곧 따뜻하게 연락드리겠습니다.
        </p>
        <Link href="/" className="btn-primary" style={{ marginTop: 36 }}>홈으로</Link>
      </div>
    </section>
  );
}
