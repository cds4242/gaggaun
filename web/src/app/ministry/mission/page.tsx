import { PageHeader } from "@/components/page-header";

export const metadata = { title: "선교부 | 가까운교회" };

const fields = [
  { p: "동남아", n: "캄보디아 · 베트남", d: "현지 교회 개척 후원 및 단기팀 매년 1회 파송" },
  { p: "북방",   n: "몽골",                d: "현지 사역자 가정 후원" },
  { p: "국내",   n: "김포 · 인천 지역",    d: "다문화 가정 한국어 교실, 청소년 멘토링" },
];

export default function Page() {
  return (
    <>
      <PageHeader title="선교부" eyebrow="MISSION" subtitle="가까운 자리에서, 먼 곳까지" />
      <section className="block">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <div className="prose-box">
            <span className="eyebrow">— 인사</span>
            <h2>작은 교회가 함께 걷는 선교</h2>
            <div className="deco"><span className="line" /><span className="dot" /><span className="line" /></div>
            <p>
              가까운교회 선교부는 큰 규모의 사역을 추구하지 않습니다.
              대신, 후원하는 한 가정 한 가정과 오래 관계를 이어가는 데 마음을 둡니다.
            </p>
            <p>
              매년 동남아 단기선교 팀을 파송하며, 분기마다 후원 가정의 소식을
              주보와 보고회를 통해 나눕니다. 후원 · 참여를 원하시는 분은 사무실로 문의해 주세요.
            </p>
          </div>

          <div className="simple-table" style={{ marginTop: 40 }}>
            <div className="row head">
              <div className="cell">권역</div>
              <div className="cell">국가 / 지역</div>
              <div className="cell" style={{ gridColumn: "span 2" }}>사역 내용</div>
            </div>
            {fields.map((r) => (
              <div key={r.p} className="row body">
                <div className="cell" style={{ fontWeight: 600, color: "var(--navy)" }}>{r.p}</div>
                <div className="cell" style={{ color: "var(--burgundy)" }}>{r.n}</div>
                <div className="cell" style={{ gridColumn: "span 2", color: "var(--mute)", fontSize: 14 }}>{r.d}</div>
              </div>
            ))}
          </div>

          <p style={{ textAlign: "center", marginTop: 36, color: "var(--mute)", lineHeight: 1.85 }}>
            단기선교 보고회는 분기 첫째 주일 점심 시간 친교실에서 진행됩니다.
          </p>
        </div>
      </section>
    </>
  );
}
