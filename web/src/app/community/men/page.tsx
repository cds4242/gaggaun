import { PageHeader } from "@/components/page-header";

export const metadata = { title: "남선교회 | 가까운 서광교회" };

const flow = [
  { d: "매월 첫째 주일", v: "예배 후 점심 · 정기 모임" },
  { d: "분기 1회",       v: "야외 봉사 (이웃 환경 정비 · 김장 등)" },
  { d: "반기 1회",       v: "1박 2일 수련회" },
];

export default function Page() {
  return (
    <>
      <PageHeader title="남선교회" eyebrow="MEN'S FELLOWSHIP" subtitle="아버지의 자리에서, 형제의 자리에서" />
      <section className="block">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <div className="prose-box">
            <span className="eyebrow">— 소개</span>
            <h2>가까운 형제들의 자리</h2>
            <div className="deco"><span className="line" /><span className="dot" /><span className="line" /></div>
            <p>
              남선교회는 교회의 청장년 형제들이 함께 모이는 공동체입니다.
              매월 첫째 주일 예배 후 점심을 함께 하며 한 달을 나눕니다.
            </p>
            <p>
              교회 안의 봉사(주차 안내, 예배 준비, 시설 관리)와
              지역의 작은 일들을 함께 감당합니다. 누구나 환영합니다.
            </p>
          </div>

          <div className="simple-table" style={{ marginTop: 40 }}>
            <div className="row head">
              <div className="cell">주기</div>
              <div className="cell" style={{ gridColumn: "span 3" }}>모임</div>
            </div>
            {flow.map((r) => (
              <div key={r.d} className="row body">
                <div className="cell" style={{ fontWeight: 600, color: "var(--navy)" }}>{r.d}</div>
                <div className="cell" style={{ gridColumn: "span 3" }}>{r.v}</div>
              </div>
            ))}
          </div>

          <p style={{ textAlign: "center", marginTop: 36, color: "var(--mute)", lineHeight: 1.85 }}>
            회장 · 정민호 집사 · 010-0000-0000
          </p>
        </div>
      </section>
    </>
  );
}
