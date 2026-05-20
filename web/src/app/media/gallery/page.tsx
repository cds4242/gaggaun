import { PageHeader } from "@/components/page-header";

export const metadata = { title: "사진갤러리 | 가까운교회" };

const tiles = [
  { cls: "t1", t: "주일 본당 — 봄 부활절 예배", d: "2026. 04. 05" },
  { cls: "t2", t: "찬양대 연습", d: "2026. 04. 12" },
  { cls: "t3", t: "주일학교 봄소풍", d: "2026. 04. 20" },
  { cls: "t4", t: "금요 합심기도회", d: "2026. 05. 02" },
  { cls: "t5", t: "어버이주일 점심 나눔", d: "2026. 05. 12" },
  { cls: "t6", t: "단기선교 보고회", d: "2026. 05. 18" },
];

export default function Page() {
  return (
    <>
      <PageHeader title="사진갤러리" eyebrow="PHOTO GALLERY" subtitle="가까운교회의 순간들" />
      <section className="block gallery-block" style={{ background: "transparent" }}>
        <div className="wrap">
          <div className="gallery-grid">
            {tiles.map((g, i) => (
              <div key={i} className={`gtile ${g.cls}`}>
                <div className="ph" />
                <div className="ovl">
                  <div className="t">{g.t}</div>
                  <div className="d">{g.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
