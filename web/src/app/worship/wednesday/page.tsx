import { PageHeader } from "@/components/page-header";

export const metadata = { title: "수요예배 | 가까운교회" };

const flow = [
  { t: "19:30", v: "예배 시작 · 찬양" },
  { t: "19:40", v: "대표 기도" },
  { t: "19:50", v: "말씀 강해 (이은혜 부목사)" },
  { t: "20:20", v: "통성 / 합심 기도" },
  { t: "20:30", v: "축도 · 마침" },
];

export default function Page() {
  return (
    <>
      <PageHeader title="수요예배" eyebrow="WEDNESDAY SERVICE" subtitle="한 주를 말씀으로 다시 세우는 자리" />
      <section className="block">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <div className="prose-box">
            <span className="eyebrow">— 안내</span>
            <h2>말씀과 기도의 자리</h2>
            <div className="deco"><span className="line" /><span className="dot" /><span className="line" /></div>
            <p>
              매주 수요일 저녁 7시 30분, 본당에서 드립니다. 약 60분간 진행되며,
              한 권의 성경을 차근차근 강해해 나가는 시간입니다.
            </p>
            <p>
              주일 예배가 큰 흐름이라면 수요예배는 한 본문을 깊이 묵상하고
              서로 중보하는 자리입니다. 일과 가정에서 분주한 마음을 잠시 내려놓고,
              조용히 말씀 앞에 앉아 보시기를 권합니다.
            </p>
          </div>

          <div className="simple-table" style={{ marginTop: 40 }}>
            <div className="row head">
              <div className="cell">시간</div>
              <div className="cell" style={{ gridColumn: "span 3" }}>순서</div>
            </div>
            {flow.map((r) => (
              <div key={r.t} className="row body">
                <div className="cell" style={{ color: "var(--burgundy)", fontWeight: 600 }}>{r.t}</div>
                <div className="cell" style={{ gridColumn: "span 3" }}>{r.v}</div>
              </div>
            ))}
          </div>

          <p style={{ textAlign: "center", marginTop: 36, color: "var(--mute)", lineHeight: 1.85 }}>
            본당 · 2층 · 약 60분 · 자녀 동반 가능
          </p>
        </div>
      </section>
    </>
  );
}
