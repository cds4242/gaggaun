import { PageHeader } from "@/components/page-header";

export const metadata = { title: "주일예배 | 가까운 서광교회" };

const rows = [
  { c: "1부 예배", t: "주일 오전 09:00", p: "본당 · 2층", n: "조용히 시작하는 이른 아침 예배" },
  { c: "2부 예배", t: "주일 오전 11:00", p: "본당 · 2층", n: "온 가족이 함께 드리는 본 예배" },
  { c: "주일학교", t: "주일 오전 11:00", p: "교육관",     n: "유치부 · 유년부 · 초등부" },
];

export default function Page() {
  return (
    <>
      <PageHeader title="주일예배" eyebrow="SUNDAY WORSHIP" subtitle="주의 날 함께 드리는 예배" />
      <section className="block">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <div className="simple-table">
            <div className="row head">
              <div className="cell">구분</div>
              <div className="cell">시간</div>
              <div className="cell">장소</div>
              <div className="cell">안내</div>
            </div>
            {rows.map((r) => (
              <div key={r.c} className="row body">
                <div className="cell" style={{ fontWeight: 600, color: "var(--navy)" }}>{r.c}</div>
                <div className="cell" style={{ color: "var(--burgundy)", fontWeight: 600 }}>{r.t}</div>
                <div className="cell">{r.p}</div>
                <div className="cell" style={{ color: "var(--mute)", fontSize: 14 }}>{r.n}</div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: 36, color: "var(--mute)", lineHeight: 1.85 }}>
            모든 분들이 환영받는 예배입니다.<br />처음 오신 분은 입구 안내데스크에서 알려주시면 친절히 안내해 드립니다.
          </p>
        </div>
      </section>
    </>
  );
}
