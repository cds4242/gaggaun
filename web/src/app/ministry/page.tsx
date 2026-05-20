import { PageHeader } from "@/components/page-header";
import { SectionGrid } from "@/components/section-grid";
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
      <PageHeader title="사역" eyebrow="MINISTRY" subtitle="우리 교회의 다양한 사역" />
      <section className="block">
        <div className="wrap"><SectionGrid items={items} /></div>
      </section>
    </>
  );
}
