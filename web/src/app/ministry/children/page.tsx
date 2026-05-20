import { PageHeader } from "@/components/page-header";

export const metadata = { title: "주일학교 | 가까운교회" };

const grades = [
  { k: "유치부", a: "5 – 7세", t: "주일 11:00 · 교육관 1층", n: "찬양과 놀이로 만나는 첫 신앙 교육" },
  { k: "유년부", a: "초 1 – 3", t: "주일 11:00 · 교육관 2층", n: "성경 이야기와 활동 중심 수업" },
  { k: "초등부", a: "초 4 – 6", t: "주일 11:00 · 교육관 2층", n: "본문 묵상 · 소그룹 나눔" },
];

export default function Page() {
  return (
    <>
      <PageHeader title="주일학교" eyebrow="CHILDREN'S MINISTRY" subtitle="다음 세대를 함께 세웁니다" />
      <section className="block">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <div className="prose-box">
            <span className="eyebrow">— 인사</span>
            <h2>아이들이 주인공입니다</h2>
            <div className="deco"><span className="line" /><span className="dot" /><span className="line" /></div>
            <p>
              주일학교는 부모님 예배 시간(11:00 본 예배) 동안 같은 건물 안 교육관에서 진행됩니다.
              유치부부터 초등 6학년까지, 발달 단계에 맞춘 세 부서로 운영합니다.
            </p>
            <p>
              예배 후에는 부서별 간단한 간식과 교제 시간이 있고,
              매월 첫째 주는 부서 공동의 ‘말씀 암송 시간’이 있습니다.
            </p>
          </div>

          <div className="simple-table" style={{ marginTop: 40 }}>
            <div className="row head">
              <div className="cell">부서</div>
              <div className="cell">대상</div>
              <div className="cell">시간 · 장소</div>
              <div className="cell">특징</div>
            </div>
            {grades.map((r) => (
              <div key={r.k} className="row body">
                <div className="cell" style={{ fontWeight: 600, color: "var(--navy)" }}>{r.k}</div>
                <div className="cell">{r.a}</div>
                <div className="cell" style={{ color: "var(--burgundy)" }}>{r.t}</div>
                <div className="cell" style={{ color: "var(--mute)", fontSize: 14 }}>{r.n}</div>
              </div>
            ))}
          </div>

          <p style={{ textAlign: "center", marginTop: 36, color: "var(--mute)", lineHeight: 1.85 }}>
            처음 오시는 자녀와 가족을 위해, 첫 주일에는 입구 안내데스크에 들러 주세요.<br />
            부서 교사가 직접 안내해 드립니다.
          </p>
        </div>
      </section>
    </>
  );
}
