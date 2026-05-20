import { PageHeader } from "@/components/page-header";
import { SectionGrid } from "@/components/section-grid";
import { IMG } from "@/lib/images";
export const metadata = { title: "공동체 | 가까운교회" };
const items = [
  { label: "구역모임", en: "Cell", href: "/community/cell", desc: "지역별 작은 모임" },
  { label: "남선교회", en: "Men", href: "/community/men", desc: "남성 성도들의 모임" },
  { label: "여전도회", en: "Women", href: "/community/women", desc: "여성 성도들의 모임" },
];
export default function Page() {
  return (
    <div className="bg-paper">
      <PageHeader title="공동체" eyebrow="— Community" subtitle="함께 모이는 작은 교회" image={IMG.community} />
      <div className="container-wide section">
        <SectionGrid items={items} />
      </div>
    </div>
  );
}
