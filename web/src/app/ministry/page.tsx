import { PageHeader } from "@/components/page-header";
import { SectionGrid } from "@/components/section-grid";
import { IMG } from "@/lib/images";
export const metadata = { title: "사역 | 가까운교회" };
const items = [
  { label: "주일학교", en: "Children", href: "/ministry/children", desc: "다음세대를 위한 신앙교육" },
  { label: "청년부", en: "Youth", href: "/ministry/youth", desc: "청년들의 신앙 공동체" },
  { label: "선교부", en: "Mission", href: "/ministry/mission", desc: "국내외 선교 사역" },
  { label: "찬양대", en: "Praise", href: "/ministry/praise", desc: "예배를 섬기는 찬양" },
];
export default function Page() {
  return (
    <>
      <PageHeader title="사역" eyebrow="Ministry" subtitle="우리 교회의 다양한 사역" image={IMG.ministry} />
      <section className="py-24">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="sec-title">
            <span className="eyebrow">Ministry</span>
            <h2>함께 만들어가는 사역</h2>
            <div className="deco"><span className="line"></span><span className="dot"></span><span className="line"></span></div>
          </div>
          <SectionGrid items={items} />
        </div>
      </section>
    </>
  );
}
