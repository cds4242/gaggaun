import { PageHeader } from "@/components/page-header";

export const metadata = { title: "구역모임 | 가까운교회" };

const cells = [
  { n: "1구역", l: "운양동 한강아이파크 · 호반써밋",  t: "격주 금 19:30",  h: "한정원 권사 댁" },
  { n: "2구역", l: "운양동 호수마을 · 풍경마을",      t: "격주 목 19:30",  h: "박재희 집사 댁" },
  { n: "3구역", l: "장기동 · 마산동",                  t: "격주 화 20:00",  h: "이혜진 권사 댁" },
  { n: "4구역", l: "구래동 · 김포한강신도시 북측",     t: "격주 수 19:30",  h: "정민호 집사 댁" },
];

export default function Page() {
  return (
    <>
      <PageHeader title="구역모임" eyebrow="CELL GROUP" subtitle="이웃과 가까이, 같은 동네에서" />
      <section className="block">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <div className="prose-box">
            <span className="eyebrow">— 소개</span>
            <h2>같은 동네에서 매 주 만납니다</h2>
            <div className="deco"><span className="line" /><span className="dot" /><span className="line" /></div>
            <p>
              구역모임은 거주 지역으로 묶인 작은 공동체입니다. 격주에 한 번,
              가정에서 함께 식사하거나 차를 마시며 한 주의 묵상을 나눕니다.
            </p>
            <p>
              교회의 가장 가까운 모임으로, 새가족이 가장 먼저 소속감을 느끼는 자리이기도 합니다.
              참여를 원하시면 사무실 또는 구역장에게 연락해 주세요.
            </p>
          </div>

          <div className="simple-table" style={{ marginTop: 40 }}>
            <div className="row head">
              <div className="cell">구역</div>
              <div className="cell">담당 지역</div>
              <div className="cell">모임 시간</div>
              <div className="cell">장소</div>
            </div>
            {cells.map((r) => (
              <div key={r.n} className="row body">
                <div className="cell" style={{ fontWeight: 600, color: "var(--navy)" }}>{r.n}</div>
                <div className="cell">{r.l}</div>
                <div className="cell" style={{ color: "var(--burgundy)" }}>{r.t}</div>
                <div className="cell" style={{ color: "var(--mute)", fontSize: 14 }}>{r.h}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
