import { PageHeader } from "@/components/page-header";
import { ProseSection } from "@/components/section-grid";

export const metadata = { title: "유초등부 | 가까운 서광교회" };

export default function Page() {
  return (
    <>
      <PageHeader title="유초등부" eyebrow="CHILDREN MINISTRY" subtitle="초등 1~6학년 — 말씀과 친구" />
      <ProseSection eyebrow="우리 부서" title="말씀이 자라는 자리">
        <p>
          유초등부는 초등 1~6학년 친구들이 함께 모여 예배드리는 부서입니다.
          저학년·고학년으로 나뉘어 분반 공부를 진행하며, 매주 짧은 말씀과 활동을 통해
          성경의 이야기를 자신의 삶으로 연결해 나갑니다.
        </p>
        <p>
          여름에는 비전캠프, 겨울에는 성경암송대회를 진행하며,
          부모님과 함께하는 가정예배 미션도 운영하고 있습니다.
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
              <div className="cell" style={{ gridColumn: "span 3", color: "var(--burgundy)", fontWeight: 600 }}>주일 오전 11:00</div>
            </div>
            <div className="row body">
              <div className="cell" style={{ fontWeight: 600, color: "var(--navy)" }}>장소</div>
              <div className="cell" style={{ gridColumn: "span 3" }}>교육관 2층 · 유초등부실</div>
            </div>
            <div className="row body">
              <div className="cell" style={{ fontWeight: 600, color: "var(--navy)" }}>담당</div>
              <div className="cell" style={{ gridColumn: "span 3" }}>박은혜 전도사 · 교사 8명</div>
            </div>
            <div className="row body">
              <div className="cell" style={{ fontWeight: 600, color: "var(--navy)" }}>주요 행사</div>
              <div className="cell" style={{ gridColumn: "span 3" }}>여름 비전캠프(8월) · 겨울 성경암송대회(1월)</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
