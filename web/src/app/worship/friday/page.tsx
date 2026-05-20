import { PageHeader } from "@/components/page-header";

export const metadata = { title: "금요 기도회 | 가까운교회" };

const flow = [
  { t: "20:00", v: "찬양 · 마음을 여는 시간" },
  { t: "20:15", v: "말씀 한 토막 (교역자 순번)" },
  { t: "20:30", v: "주제별 합심 기도" },
  { t: "21:00", v: "개인 기도 / 자유 머묾" },
  { t: "21:30", v: "축도 · 마침" },
];

const topics = [
  { k: "한 주", v: "한 주 동안 받은 은혜와 무거운 짐을 정리합니다." },
  { k: "교회", v: "교역자, 다음 주일 예배, 새가족, 환우들을 위해 기도합니다." },
  { k: "이웃", v: "운양동 · 한강신도시 지역과 학교, 직장, 가정을 위해 기도합니다." },
  { k: "선교", v: "단기·장기 선교사역과 후원 가정들을 기억합니다." },
];

export default function Page() {
  return (
    <>
      <PageHeader title="금요 기도회" eyebrow="FRIDAY PRAYER" subtitle="한 주를 정돈하는 합심 기도" />
      <section className="block">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <div className="prose-box">
            <span className="eyebrow">— 안내</span>
            <h2>금요일 저녁, 본당에 모입니다</h2>
            <div className="deco"><span className="line" /><span className="dot" /><span className="line" /></div>
            <p>
              매주 금요일 저녁 8시, 본당에서 약 90분간 합심 기도회로 모입니다.
              한 주의 매듭을 짓고, 다음 주일을 준비하는 시간입니다.
            </p>
            <p>
              조용히 머무르며 기도하실 수 있도록 좌석은 비워두며,
              자녀 동반 시에는 입구쪽 좌석을 이용해 주시면 감사하겠습니다.
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

          <div className="prose-box" style={{ marginTop: 40 }}>
            <span className="eyebrow">— 합심 기도 주제</span>
            <h3 style={{ fontSize: 22, marginBottom: 16 }}>네 가지 큰 주제로 나누어 기도합니다</h3>
            <dl style={{ display: "grid", gridTemplateColumns: "100px 1fr", rowGap: 14, columnGap: 20 }}>
              {topics.map((t) => (
                <div key={t.k} style={{ display: "contents" }}>
                  <dt style={{ color: "var(--navy)", fontWeight: 600 }}>{t.k}</dt>
                  <dd style={{ color: "var(--body)" }}>{t.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
