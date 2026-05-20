import { PageHeader } from "@/components/page-header";

export const metadata = { title: "오시는 길 | 가까운교회" };

export default function Page() {
  return (
    <>
      <PageHeader title="오시는 길" eyebrow="VISIT US" subtitle="경기도 김포시 운양동 · 한강신도시" />
      <section className="block loc-block">
        <div className="wrap">
          <div className="loc-grid">
            <div className="map-box">
              <div className="ph" />
              <div className="road" />
              <span className="pin" />
              <span className="pin-label">가까운교회</span>
            </div>
            <div className="loc-info">
              <span className="eyebrow">Address &amp; Contact</span>
              <h3>가까운교회</h3>
              <div className="sub">경기도 김포시 운양동 · 한강신도시</div>
              <dl>
                <dt>주소</dt>
                <dd>경기도 김포시 운양동 0000-0<span className="small">한강신도시 운양로 인근</span></dd>
                <dt>전화</dt>
                <dd>031 — 000 — 0000<span className="small">평일 오전 9:00 – 오후 6:00</span></dd>
                <dt>이메일</dt>
                <dd>office@nearchurch.kr</dd>
                <dt>대중교통</dt>
                <dd>김포골드라인 운양역<span className="small">3번 출구 · 도보 약 10분</span></dd>
                <dt>주차</dt>
                <dd>교회 지하 주차장<span className="small">주일 예배 시 인근 공영주차장 무료</span></dd>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
