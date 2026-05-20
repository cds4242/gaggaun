import { PageHeader } from "@/components/page-header";
import { SectionGrid } from "@/components/section-grid";
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
      <PageHeader title="공동체" eyebrow="COMMUNITY" subtitle="함께 모이는 작은 교회" />
      <section className="block">
        <div className="wrap"><SectionGrid items={items} /></div>
      </section>
    </>
  );
}
