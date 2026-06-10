import { PageHeader } from "@/components/page-header";
import { ProseSection } from "@/components/section-grid";

export const metadata = { title: "해외 선교 | 가까운 서광교회" };

const fields = [
  { country: "캄보디아", name: "프놈펜 한인선교회", missionary: "조ㅇㅇ 선교사", note: "현지 교회 개척 · 어린이 사역" },
  { country: "필리핀", name: "마닐라 사랑의 교회", missionary: "윤ㅇㅇ 선교사", note: "신학교 사역 · 빈민 구제" },
  { country: "몽골", name: "울란바토르 빛교회", missionary: "한ㅇㅇ 선교사", note: "청년 사역 · 한국어 교실" },
];

export default function Page() {
  return (
    <>
      <PageHeader title="해외 선교" eyebrow="GLOBAL MISSION" subtitle="땅끝까지 보내신 선교의 사명" />
      <ProseSection eyebrow="우리의 사명" title="이방 땅의 형제 자매들과 함께">
        <p>
          예수님께서는 “모든 족속으로 제자를 삼으라” 명하셨습니다.
          가까운 서광교회는 작지만 진심을 다해 세계 선교에 동참하고 있습니다.
        </p>
        <p>
          현재 세 곳의 선교지를 정기 후원하며, 매년 단기선교팀을 파송합니다.
          파송 선교사님들의 사역 보고는 매월 첫째 주일 광고 시간에 함께 듣습니다.
        </p>
      </ProseSection>
      <section className="block">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <h3 style={{ fontSize: 20, color: "var(--navy)", marginBottom: 16, fontWeight: 700, textAlign: "center" }}>
            파송 선교지
          </h3>
          <div className="simple-table">
            <div className="row head">
              <div className="cell">국가</div>
              <div className="cell">선교지</div>
              <div className="cell">선교사</div>
              <div className="cell">사역</div>
            </div>
            {fields.map((f) => (
              <div key={f.name} className="row body">
                <div className="cell" style={{ color: "var(--burgundy)", fontWeight: 600 }}>{f.country}</div>
                <div className="cell" style={{ fontWeight: 600, color: "var(--navy)" }}>{f.name}</div>
                <div className="cell">{f.missionary}</div>
                <div className="cell" style={{ color: "var(--mute)", fontSize: 14 }}>{f.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
