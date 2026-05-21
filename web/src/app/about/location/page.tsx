import { PageHeader } from "@/components/page-header";

export const metadata = { title: "오시는 길 | 가까운교회" };

const ADDRESS = "경기 김포시 김포한강11로 234";
const PLACE = "가까운교회";

const naverMapUrl = `https://map.naver.com/p/search/${encodeURIComponent(ADDRESS)}`;
const kakaoMapUrl = `https://map.kakao.com/?q=${encodeURIComponent(ADDRESS)}`;
const googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;
// Google Maps embed (검색 결과 iframe — 별도 API 키 없이 동작)
const googleEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&hl=ko&z=16&output=embed`;

export default function Page() {
  return (
    <>
      <PageHeader title="오시는 길" eyebrow="VISIT US" subtitle="경기 김포시 한강신도시 운양동" />
      <section className="block">
        <div className="wrap">
          <div className="loc-grid">
            <div className="map-wrap">
              <iframe
                src={googleEmbedUrl}
                title={`${PLACE} 지도`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                style={{ width: "100%", height: 460, border: "1px solid var(--line)", background: "var(--paper)" }}
              />
              <div className="map-actions">
                <a href={naverMapUrl} target="_blank" rel="noopener noreferrer" className="map-btn naver" aria-label="네이버 지도에서 보기">
                  <span className="mark">N</span><span>네이버 지도</span>
                </a>
                <a href={kakaoMapUrl} target="_blank" rel="noopener noreferrer" className="map-btn kakao" aria-label="카카오 맵에서 보기">
                  <span className="mark">K</span><span>카카오 맵</span>
                </a>
                <a href={googleMapUrl} target="_blank" rel="noopener noreferrer" className="map-btn google" aria-label="구글 맵에서 보기">
                  <span className="mark">G</span><span>구글 맵</span>
                </a>
              </div>
            </div>

            <div className="loc-info">
              <span className="eyebrow">Address &amp; Contact</span>
              <h3>가까운교회</h3>
              <div className="sub">경기 김포시 한강신도시 운양동</div>
              <dl>
                <dt>주소</dt>
                <dd>{ADDRESS}<span className="small">김포한강신도시 운양동</span></dd>
                <dt>전화</dt>
                <dd>031 — 000 — 0000<span className="small">평일 오전 9:00 – 오후 6:00</span></dd>
                <dt>이메일</dt>
                <dd>office@nearchurch.kr</dd>
                <dt>대중교통</dt>
                <dd>김포골드라인 운양역<span className="small">도보 약 10분 거리</span></dd>
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
