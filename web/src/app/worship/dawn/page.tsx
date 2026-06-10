import { PageHeader } from "@/components/page-header";

export const metadata = { title: "새벽 기도회 | 가까운 서광교회" };

const weekly = [
  { d: "월", v: "시편 · 묵상" },
  { d: "화", v: "역대상하 · 강해" },
  { d: "수", v: "복음서 · 묵상" },
  { d: "목", v: "서신서 · 강해" },
  { d: "금", v: "특별 합심 기도" },
  { d: "토", v: "쉼 (모임 없음)" },
];

export default function Page() {
  return (
    <>
      <PageHeader title="새벽 기도회" eyebrow="DAWN PRAYER" subtitle="하루를 주님과 함께 여는 자리" />
      <section className="block">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <div className="prose-box">
            <span className="eyebrow">— 안내</span>
            <h2>매일 새벽, 본당에서 모입니다</h2>
            <div className="deco"><span className="line" /><span className="dot" /><span className="line" /></div>
            <p>
              월요일부터 금요일까지 새벽 5시 30분, 본당에서 약 60분간 드립니다.
              담임목사와 부목사가 요일별로 본문을 나누어 강해합니다.
            </p>
            <p>
              하루의 첫 시간을 말씀과 기도로 시작하시기를 권합니다.
              늦게 오셔도 괜찮습니다. 조용히 자리에 앉아 함께 머물러 주세요.
            </p>
          </div>

          <div className="simple-table" style={{ marginTop: 40 }}>
            <div className="row head">
              <div className="cell">요일</div>
              <div className="cell" style={{ gridColumn: "span 3" }}>본문 / 형식</div>
            </div>
            {weekly.map((r) => (
              <div key={r.d} className="row body">
                <div className="cell" style={{ color: "var(--navy)", fontWeight: 600 }}>{r.d}</div>
                <div className="cell" style={{ gridColumn: "span 3" }}>{r.v}</div>
              </div>
            ))}
          </div>

          <p style={{ textAlign: "center", marginTop: 36, color: "var(--mute)", lineHeight: 1.85 }}>
            본당 · 2층 · 약 60분 · 자유 좌석<br />주말(토 · 주일)은 모이지 않습니다.
          </p>
        </div>
      </section>
    </>
  );
}
