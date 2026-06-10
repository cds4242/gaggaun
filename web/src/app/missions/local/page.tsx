import { PageHeader } from "@/components/page-header";
import { ProseSection } from "@/components/section-grid";

export const metadata = { title: "지역 섬김 | 가까운 서광교회" };

const services = [
  { when: "매월 둘째 토요일", what: "독거 어르신 반찬 나눔", where: "운양동 · 마산동 일대" },
  { when: "매월 넷째 토요일", what: "지역 환경 정화", where: "한강 둘레길" },
  { when: "분기별 1회", what: "다문화 가정 한국어 교실", where: "교육관" },
  { when: "연 2회", what: "헌혈 캠페인", where: "교회 마당 · 헌혈버스" },
];

export default function Page() {
  return (
    <>
      <PageHeader title="지역 섬김" eyebrow="LOCAL SERVICE" subtitle="이웃을 향한 따뜻한 손길" />
      <ProseSection eyebrow="우리의 자리" title="가까이 있는 이웃을 사랑합니다">
        <p>
          교회의 사명은 예배당 안에서 끝나지 않습니다. 우리는 김포 한강신도시와
          운양동 · 마산동 지역에서 함께 살아가는 이웃들의 가까운 이웃이 되기를 원합니다.
        </p>
        <p>
          작은 일이라도 꾸준히, 함께 — 그것이 가까운 교회가 지역을 섬기는 방식입니다.
        </p>
      </ProseSection>
      <section className="block">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <h3 style={{ fontSize: 20, color: "var(--navy)", marginBottom: 16, fontWeight: 700, textAlign: "center" }}>
            정기 섬김 프로그램
          </h3>
          <div className="simple-table">
            <div className="row head">
              <div className="cell">주기</div>
              <div className="cell" style={{ gridColumn: "span 2" }}>섬김 내용</div>
              <div className="cell">장소</div>
            </div>
            {services.map((s) => (
              <div key={s.what} className="row body">
                <div className="cell" style={{ color: "var(--burgundy)", fontWeight: 600 }}>{s.when}</div>
                <div className="cell" style={{ gridColumn: "span 2", fontWeight: 600, color: "var(--navy)" }}>{s.what}</div>
                <div className="cell" style={{ color: "var(--mute)", fontSize: 14 }}>{s.where}</div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: 36, color: "var(--mute)", lineHeight: 1.85 }}>
            함께 섬기고 싶으신 분은 안내데스크 또는 봉사부에 문의해 주세요.
          </p>
        </div>
      </section>
    </>
  );
}
