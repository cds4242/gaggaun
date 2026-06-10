import { PageHeader } from "@/components/page-header";
import { ProseSection } from "@/components/section-grid";

export const metadata = { title: "피스티스 찬양팀 | 가까운 서광교회" };

export default function Page() {
  return (
    <>
      <PageHeader title="피스티스 찬양팀" eyebrow="PISTIS WORSHIP" subtitle="청년·젊은 세대의 워십팀" />
      <ProseSection eyebrow="우리 찬양팀" title="삶의 자리에서 부르는 노래">
        <p>
          ‘피스티스(πίστις · 믿음)’는 청년부와 다음 세대의 예배를 섬기는 워십팀입니다.
          어쿠스틱 기타와 키보드, 드럼을 중심으로 한 밴드 구성으로,
          청년들이 자기 언어로 부를 수 있는 찬양을 함께 만들어 갑니다.
        </p>
        <p>
          주일 청년부 예배와 분기별 청년 연합 찬양집회에서 섬기며,
          매년 가을에는 자체 창작 찬양 발표회를 엽니다.
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
              <div className="cell" style={{ fontWeight: 600, color: "var(--navy)" }}>섬기는 예배</div>
              <div className="cell" style={{ gridColumn: "span 3", color: "var(--burgundy)", fontWeight: 600 }}>주일 청년부 예배 (오후 2:00)</div>
            </div>
            <div className="row body">
              <div className="cell" style={{ fontWeight: 600, color: "var(--navy)" }}>연습</div>
              <div className="cell" style={{ gridColumn: "span 3" }}>금요일 저녁 9:30 · 본당 옆 카페공간</div>
            </div>
            <div className="row body">
              <div className="cell" style={{ fontWeight: 600, color: "var(--navy)" }}>구성</div>
              <div className="cell" style={{ gridColumn: "span 3" }}>보컬 4명 · 기타 · 베이스 · 드럼 · 키보드</div>
            </div>
            <div className="row body">
              <div className="cell" style={{ fontWeight: 600, color: "var(--navy)" }}>주요 행사</div>
              <div className="cell" style={{ gridColumn: "span 3" }}>가을 창작 찬양 발표회(10월) · 청년 연합 집회</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
