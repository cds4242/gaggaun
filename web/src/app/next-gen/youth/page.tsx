import { PageHeader } from "@/components/page-header";
import { ProseSection } from "@/components/section-grid";

export const metadata = { title: "중고등부 | 가까운 서광교회" };

export default function Page() {
  return (
    <>
      <PageHeader title="중고등부" eyebrow="YOUTH MINISTRY" subtitle="중·고등학생 — 청소년의 신앙 여정" />
      <ProseSection eyebrow="우리 부서" title="흔들리는 시기, 든든한 자리">
        <p>
          중고등부는 청소년 시기를 함께 통과해 가는 친구들이 모이는 자리입니다.
          학업과 진로, 관계의 고민 속에서도 말씀과 기도로 자신을 세워가는 시간을 만듭니다.
        </p>
        <p>
          주일 예배 외에도 토요일 청소년 모임, 분기별 수련회를 통해
          신앙의 친구들과 깊은 우정을 쌓아갑니다.
        </p>
      </ProseSection>
      <section className="block">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <div className="simple-table">
            <div className="row head">
              <div className="cell">구분</div>
              <div className="cell" style={{ gridColumn: "span 3" }}>안내</div>
            </div>
            <div className="row body">
              <div className="cell" style={{ fontWeight: 600, color: "var(--navy)" }}>예배 시간</div>
              <div className="cell" style={{ gridColumn: "span 3", color: "var(--burgundy)", fontWeight: 600 }}>주일 오후 2:00</div>
            </div>
            <div className="row body">
              <div className="cell" style={{ fontWeight: 600, color: "var(--navy)" }}>토요 모임</div>
              <div className="cell" style={{ gridColumn: "span 3" }}>토요일 오후 5:00 · 찬양 · 소그룹 · 식사</div>
            </div>
            <div className="row body">
              <div className="cell" style={{ fontWeight: 600, color: "var(--navy)" }}>장소</div>
              <div className="cell" style={{ gridColumn: "span 3" }}>교육관 3층 · 중고등부실</div>
            </div>
            <div className="row body">
              <div className="cell" style={{ fontWeight: 600, color: "var(--navy)" }}>담당</div>
              <div className="cell" style={{ gridColumn: "span 3" }}>이은혜 부목사 · 교사 5명</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
