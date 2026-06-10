import { PageHeader } from "@/components/page-header";

export const metadata = { title: "찬양대 | 가까운 서광교회" };

const teams = [
  { n: "시온 찬양대",  t: "주일 1 · 2부 본 예배", r: "토 20:00 · 본당", a: "성인 누구나" },
  { n: "호산나 찬양팀", t: "주일 2부 회중 인도",   r: "토 18:00 · 본당", a: "청년 · 직장인" },
  { n: "다윗 찬양팀",  t: "수요예배 · 금요기도회", r: "수 18:30 · 본당", a: "청장년" },
];

export default function Page() {
  return (
    <>
      <PageHeader title="찬양대" eyebrow="PRAISE" subtitle="목소리와 마음을 함께 모아" />
      <section className="block">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <div className="prose-box">
            <span className="eyebrow">— 안내</span>
            <h2>세 팀이 한 예배를 섬깁니다</h2>
            <div className="deco"><span className="line" /><span className="dot" /><span className="line" /></div>
            <p>
              찬양대는 예배의 한 부분이 아니라, 예배 그 자체로 부름받았다고 믿습니다.
              완벽한 음악보다 한 마음으로 드리는 찬양을 더 귀하게 여깁니다.
            </p>
            <p>
              악기 · 성가에 익숙하지 않아도 환영합니다. 매주 한 자리에 모여 연습하며
              서로의 한 주를 묻는 작은 공동체이기도 합니다.
            </p>
          </div>

          <div className="simple-table" style={{ marginTop: 40 }}>
            <div className="row head">
              <div className="cell">팀</div>
              <div className="cell">섬기는 예배</div>
              <div className="cell">연습</div>
              <div className="cell">지원</div>
            </div>
            {teams.map((r) => (
              <div key={r.n} className="row body">
                <div className="cell" style={{ fontWeight: 600, color: "var(--navy)" }}>{r.n}</div>
                <div className="cell">{r.t}</div>
                <div className="cell" style={{ color: "var(--burgundy)" }}>{r.r}</div>
                <div className="cell" style={{ color: "var(--mute)", fontSize: 14 }}>{r.a}</div>
              </div>
            ))}
          </div>

          <p style={{ textAlign: "center", marginTop: 36, color: "var(--mute)", lineHeight: 1.85 }}>
            지원은 사무실 또는 예배 후 입구 안내데스크에서 받습니다.
          </p>
        </div>
      </section>
    </>
  );
}
