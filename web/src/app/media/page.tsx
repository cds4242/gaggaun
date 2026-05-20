import { PageHeader } from "@/components/page-header";
import { SectionGrid } from "@/components/section-grid";
import { IMG } from "@/lib/images";
export const metadata = { title: "미디어 | 가까운교회" };
export default function Page() {
  return (
    <>
      <PageHeader title="미디어" eyebrow="Media" subtitle="설교와 사진" image={IMG.media} />
      <section className="py-24">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="sec-title">
            <span className="eyebrow">Media</span>
            <h2>설교와 사진</h2>
            <div className="deco"><span className="line"></span><span className="dot"></span><span className="line"></span></div>
          </div>
          <SectionGrid items={[
            { label: "설교영상", en: "Sermon", href: "/media/sermon", desc: "매주 주일 설교" },
            { label: "사진갤러리", en: "Gallery", href: "/media/gallery", desc: "교회의 추억" },
          ]} />
        </div>
      </section>
    </>
  );
}
