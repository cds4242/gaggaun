import { PageHeader } from "@/components/page-header";

export const metadata = { title: "여전도회 | 가까운교회" };

const flow = [
  { d: "매월 25일 (또는 가까운 주중)", v: "월례 모임 · 교회 2층" },
  { d: "매주 화 10:30",                 v: "성경공부 (사복음서 강해)" },
  { d: "분기 1회",                      v: "지역 섬김 · 어르신 도시락 나눔" },
];

export default function Page() {
  return (
    <>
      <PageHeader title="여전도회" eyebrow="WOMEN'S FELLOWSHIP" subtitle="기도와 섬김의 자리" />
      <section className="block">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <div className="prose-box">
            <span className="eyebrow">— 소개</span>
            <h2>섬김과 기도로 교회를 떠받칩니다</h2>
            <div className="deco"><span className="line" /><span className="dot" /><span className="line" /></div>
            <p>
              여전도회는 가까운교회의 청장년 자매들이 함께 모이는 공동체입니다.
              월례 모임에서 한 달의 기도 제목을 나누고 함께 식사합니다.
            </p>
            <p>
              매주 화요일 오전에는 성경공부 모임을 갖습니다.
              자녀를 등원시킨 뒤 가벼운 마음으로 오시면 됩니다 (영아 동반 가능).
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
            회장 · 한정원 권사 · 010-0000-0000
          </p>
        </div>
      </section>
    </>
  );
}
