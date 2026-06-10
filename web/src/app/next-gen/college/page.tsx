import { PageHeader } from "@/components/page-header";
import { ProseSection } from "@/components/section-grid";

export const metadata = { title: "청년부 | 가까운 서광교회" };

export default function Page() {
  return (
    <>
      <PageHeader title="청년부" eyebrow="COLLEGE & YOUNG ADULTS" subtitle="대학·청년 — 삶의 자리를 함께" />
      <ProseSection eyebrow="우리 부서" title="삶의 한복판에서 드리는 예배">
        <p>
          청년부는 대학생부터 직장 초년생까지, 인생의 한복판에서 자신의 자리를 찾아가는
          청년들이 함께 예배드리고 교제하는 부서입니다.
        </p>
        <p>
          진로, 취업, 결혼, 신앙 — 청년기의 다양한 질문을 솔직하게 나눌 수 있는 소그룹과,
          매주 금요일 저녁의 청년 큐티 모임이 있습니다.
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
              <div className="cell" style={{ fontWeight: 600, color: "var(--navy)" }}>금요 큐티</div>
              <div className="cell" style={{ gridColumn: "span 3" }}>금요일 저녁 8:00 · 본당 옆 카페공간</div>
            </div>
            <div className="row body">
              <div className="cell" style={{ fontWeight: 600, color: "var(--navy)" }}>장소</div>
              <div className="cell" style={{ gridColumn: "span 3" }}>본당 · 2층 (소그룹은 카페공간)</div>
            </div>
            <div className="row body">
              <div className="cell" style={{ fontWeight: 600, color: "var(--navy)" }}>담당</div>
              <div className="cell" style={{ gridColumn: "span 3" }}>이은혜 부목사 · 청년 리더 3명</div>
            </div>
          </div>
          <p style={{ textAlign: "center", marginTop: 36, color: "var(--mute)", lineHeight: 1.85 }}>
            새로 오신 청년 분은 예배 후 함께하는 점심에 꼭 참여해 보세요.
          </p>
        </div>
      </section>
    </>
  );
}
