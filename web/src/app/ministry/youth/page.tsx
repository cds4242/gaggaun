import { PageHeader } from "@/components/page-header";

export const metadata = { title: "청년부 | 가까운 서광교회" };

const flow = [
  { t: "토 19:00",       v: "찬양 · 말씀 · 소그룹 나눔" },
  { t: "격주 금 20:00",   v: "QT 모임 (한강 카페 / 본당)" },
  { t: "분기별",          v: "야외 예배 · 봉사 · 단기 선교" },
];

const cells = [
  { n: "마가 셀", l: "직장인 1 — 27세 이하" },
  { n: "누가 셀", l: "직장인 2 — 28세 이상" },
  { n: "요한 셀", l: "대학생 · 사회 초년생" },
];

export default function Page() {
  return (
    <>
      <PageHeader title="청년부" eyebrow="YOUTH" subtitle="한 주의 짐을 내려놓고 다시 일어서는 자리" />
      <section className="block">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <div className="prose-box">
            <span className="eyebrow">— 청년부</span>
            <h2>토요일 저녁, 본당에서 만납니다</h2>
            <div className="deco"><span className="line" /><span className="dot" /><span className="line" /></div>
            <p>
              매주 토요일 저녁 7시, 청년 예배로 모입니다. 찬양과 말씀,
              그리고 소그룹 나눔이 한 자리에서 이어집니다. 처음 오시는 분도 환영합니다.
            </p>
            <p>
              평일에는 셀(소그룹) 단위로 카페나 가정에서 만나 한 주를 나눕니다.
              혼자 보내는 시간이 많은 청년에게, 매주 ‘부를 수 있는 이름들’이 생기길 바랍니다.
            </p>
          </div>

          <div className="simple-table" style={{ marginTop: 40 }}>
            <div className="row head">
              <div className="cell">시간</div>
              <div className="cell" style={{ gridColumn: "span 3" }}>모임</div>
            </div>
            {flow.map((r) => (
              <div key={r.t} className="row body">
                <div className="cell" style={{ color: "var(--burgundy)", fontWeight: 600 }}>{r.t}</div>
                <div className="cell" style={{ gridColumn: "span 3" }}>{r.v}</div>
              </div>
            ))}
          </div>

          <div className="prose-box" style={{ marginTop: 40 }}>
            <span className="eyebrow">— 셀 안내</span>
            <h3 style={{ fontSize: 22, marginBottom: 16 }}>세 개의 셀로 모입니다</h3>
            <ul style={{ display: "grid", gap: 10 }}>
              {cells.map((c) => (
                <li key={c.n} style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
                  <span style={{ color: "var(--navy)", fontWeight: 600, minWidth: 80 }}>{c.n}</span>
                  <span style={{ color: "var(--body)" }}>{c.l}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
