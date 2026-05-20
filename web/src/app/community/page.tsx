import { PageHeader } from "@/components/page-header";
import { SectionGrid } from "@/components/section-grid";
import { IMG } from "@/lib/images";
export const metadata = { title: "공동체 | 가까운교회" };
const items = [
  { label: "구역모임", en: "Cell", href: "/community/cell", desc: "지역별 작은 모임" },
  { label: "남선교회", en: "Men", href: "/community/men", desc: "남성 성도들의 모임" },
  { label: "여전도회", en: "Women", href: "/community/women", desc: "여성 성도들의 모임" },
  { label: "청년부", en: "Youth", href: "/ministry/youth", desc: "청년들의 신앙 공동체" },
];
export default function Page() {
  return (
    <>
      <PageHeader title="공동체" eyebrow="Community" subtitle="함께 모이는 작은 교회" image={IMG.community} />
      <section className="py-24">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="sec-title">
            <span className="eyebrow">Community</span>
            <h2>함께 걸어가는 공동체</h2>
            <div className="deco"><span className="line"></span><span className="dot"></span><span className="line"></span></div>
          </div>
          <SectionGrid items={items} />
        </div>
      </section>
    </>
  );
}
