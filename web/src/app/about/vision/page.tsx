import { PageHeader } from "@/components/page-header";

export const metadata = { title: "비전과 사명 | 가까운 서광교회" };

const items = [
  { n: "01", t: "예배하는 교회", en: "Worship", d: "신령과 진정으로 드리는 예배 안에서 하나님을 깊이 만나는 교회를 추구합니다." },
  { n: "02", t: "양육하는 교회", en: "Disciple", d: "말씀과 기도로 그리스도의 제자를 차근차근 세우고 양육합니다." },
  { n: "03", t: "섬기는 교회", en: "Serve",   d: "지역사회와 이웃을 섬기며 예수님의 사랑을 일상에서 전합니다." },
];

export default function Page() {
  return (
    <>
      <PageHeader title="비전과 사명" eyebrow="OUR VISION" subtitle="가까운 서광교회가 추구하는 세 가지 가치" editSection="vision" />
      <section className="block" data-edit-section="vision.values">
        <div className="wrap">
          <div className="idx-grid">
            {items.map((v) => (
              <div key={v.n} className="idx-card" style={{ minHeight: 280 }}>
                <span className="en">{v.en}</span>
                <span className="ko" style={{ fontSize: 26 }}>{v.t}</span>
                <p className="desc">{v.d}</p>
                <span className="go" style={{ marginTop: "auto", color: "var(--gold)", fontFamily: "var(--display)", fontStyle: "italic" }}>
                  No. {v.n}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
