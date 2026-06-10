import { PageHeader } from "@/components/page-header";
import { ProseSection } from "@/components/section-grid";

export const metadata = { title: "국내 선교 | 가까운 서광교회" };

const partners = [
  { region: "강원 정선", name: "정선중앙교회", note: "여름 단기선교 · 어린이성경학교" },
  { region: "전북 부안", name: "부안소망교회", note: "농어촌 미자립 교회 지원" },
  { region: "충북 보은", name: "보은새빛교회", note: "정기 후원 · 연 1회 방문" },
];

export default function Page() {
  return (
    <>
      <PageHeader title="국내 선교" eyebrow="DOMESTIC MISSION" subtitle="농어촌과 미자립 교회와 함께" />
      <ProseSection eyebrow="우리의 마음" title="가까이서 시작하는 선교">
        <p>
          우리 교회는 멀리 보내는 선교에 앞서, 같은 땅에서 함께 신앙의 길을 걷는
          농어촌 · 미자립 교회를 후원하고 협력합니다.
        </p>
        <p>
          정기 재정 후원과 더불어, 매년 여름 단기선교팀을 파송하여 어린이 성경학교와
          마을 섬김을 함께 진행합니다.
        </p>
      </ProseSection>
      <section className="block">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <h3 style={{ fontSize: 20, color: "var(--navy)", marginBottom: 16, fontWeight: 700, textAlign: "center" }}>
            협력 교회
          </h3>
          <div className="simple-table">
            <div className="row head">
              <div className="cell">지역</div>
              <div className="cell">교회명</div>
              <div className="cell" style={{ gridColumn: "span 2" }}>섬김 내용</div>
            </div>
            {partners.map((p) => (
              <div key={p.name} className="row body">
                <div className="cell" style={{ color: "var(--burgundy)", fontWeight: 600 }}>{p.region}</div>
                <div className="cell" style={{ fontWeight: 600, color: "var(--navy)" }}>{p.name}</div>
                <div className="cell" style={{ gridColumn: "span 2", color: "var(--mute)", fontSize: 14 }}>{p.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
