import { PageHeader } from "@/components/page-header";
import { SectionGrid } from "@/components/section-grid";
export const metadata = { title: "미디어 | 가까운교회" };
export default function Page() {
  return (
    <>
      <PageHeader title="미디어" eyebrow="MEDIA" subtitle="설교와 사진" />
      <section className="block">
        <div className="wrap">
          <SectionGrid items={[
            { label: "설교영상", en: "Sermon", href: "/media/sermon", desc: "매주 주일 설교" },
            { label: "사진갤러리", en: "Gallery", href: "/media/gallery", desc: "교회의 추억" },
          ]} />
        </div>
      </section>
    </>
  );
}
