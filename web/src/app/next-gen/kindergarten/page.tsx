import { PageHeader } from "@/components/page-header";
import { ProseSection } from "@/components/section-grid";

export const metadata = { title: "유치부 | 가까운 서광교회" };

export default function Page() {
  return (
    <>
      <PageHeader title="유치부" eyebrow="KINDERGARTEN" subtitle="5~7세 — 처음 만나는 예배" />
      <ProseSection eyebrow="우리 부서" title="작은 손으로 드리는 첫 예배">
        <p>
          유치부는 5~7세 친구들이 노래와 율동, 그림 성경 이야기로 하나님을 처음 만나는 자리입니다.
          매주 한 가지 짧은 말씀을 듣고, 친구들과 함께 기도하고 만들기 활동을 합니다.
        </p>
        <p>
          교사 선생님들이 두 명씩 짝을 이뤄 아이들을 돌보며, 안전한 환경에서 예배드릴 수 있도록 준비합니다.
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
              <div className="cell" style={{ gridColumn: "span 3" }}>교육관 1층 · 유치부실</div>
            </div>
            <div className="row body">
              <div className="cell" style={{ fontWeight: 600, color: "var(--navy)" }}>담당</div>
              <div className="cell" style={{ gridColumn: "span 3" }}>박은혜 전도사 · 교사 6명</div>
            </div>
          </div>
          <p style={{ textAlign: "center", marginTop: 36, color: "var(--mute)", lineHeight: 1.85 }}>
            처음 오시는 부모님은 교육관 입구에서 안내받으실 수 있습니다.
          </p>
        </div>
      </section>
    </>
  );
}
