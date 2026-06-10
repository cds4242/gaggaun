import { PageHeader } from "@/components/page-header";
import { SectionGrid } from "@/components/section-grid";

export const metadata = { title: "찬양 | 가까운 서광교회" };

const items = [
  { label: "할렐루야 성가대", en: "Hallelujah Choir", href: "/praise/hallelujah", desc: "주일 예배를 섬기는 시니어 성가대" },
  { label: "호산나 성가대", en: "Hosanna Choir", href: "/praise/hosanna", desc: "주일 2부 예배를 섬기는 성가대" },
  { label: "피스티스 찬양팀", en: "Pistis Worship", href: "/praise/pistis", desc: "청년·젊은 세대의 워십팀" },
];

export default function Page() {
  return (
    <>
      <PageHeader title="찬양" eyebrow="WORSHIP & PRAISE" subtitle="예배를 섬기는 찬양 사역" />
      <section className="block">
        <div className="wrap">
          <SectionGrid items={items} />
        </div>
      </section>
    </>
  );
}
