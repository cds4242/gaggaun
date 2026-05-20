import Link from "next/link";

export const metadata = { title: "페이지를 찾을 수 없습니다 | 가까운교회" };

export default function NotFound() {
  return (
    <section className="block">
      <div className="wrap" style={{ maxWidth: 640, textAlign: "center", paddingTop: 40, paddingBottom: 40 }}>
        <span className="eyebrow" style={{ fontFamily: "var(--display)", fontStyle: "italic", color: "var(--gold)", letterSpacing: ".08em" }}>— 404</span>
        <h1 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: 42, color: "var(--navy)", letterSpacing: "-0.04em", marginTop: 16 }}>
          페이지를 찾을 수 없습니다
        </h1>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 28, marginBottom: 28, color: "var(--gold)" }}>
          <span style={{ width: 48, height: 1, background: "var(--gold)" }} />
          <span style={{ width: 8, height: 8, background: "var(--gold)", transform: "rotate(45deg)" }} />
          <span style={{ width: 48, height: 1, background: "var(--gold)" }} />
        </div>
        <p style={{ color: "var(--body)", lineHeight: 1.9 }}>
          요청하신 페이지가 옮겨졌거나 더 이상 존재하지 않을 수 있습니다.<br />
          아래에서 다시 시작해 보세요.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 36, flexWrap: "wrap" }}>
          <Link href="/" className="btn-primary">홈으로</Link>
          <Link href="/notices" className="more-link">공지사항</Link>
          <Link href="/board" className="more-link">게시판</Link>
          <Link href="/about/location" className="more-link">오시는 길</Link>
        </div>
      </div>
    </section>
  );
}
