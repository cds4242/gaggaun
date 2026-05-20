import { PageHeader } from "@/components/page-header";
import { SectionGrid } from "@/components/section-grid";
import { IMG } from "@/lib/images";

export const metadata = { title: "교회소개 | 가까운교회" };

const items = [
  { label: "인사말", en: "Greeting", href: "/about/greeting", desc: "담임목사가 드리는 짧은 편지" },
  { label: "비전과 사명", en: "Vision", href: "/about/vision", desc: "세 가지 가치 — 예배, 양육, 섬김" },
  { label: "교회 연혁", en: "History", href: "/about/history", desc: "걸어온 발자취" },
  { label: "오시는 길", en: "Location", href: "/about/location", desc: "운양역에서 도보 10분" },
];

export default function Page() {
  return (
    <>
      <PageHeader title="교회소개" eyebrow="About Our Church" subtitle="가까운교회를 소개합니다" image={IMG.greeting} />
      <section className="py-24">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="sec-title">
            <span className="eyebrow">About</span>
            <h2>가까운교회를 소개합니다</h2>
            <div className="deco"><span className="line"></span><span className="dot"></span><span className="line"></span></div>
          </div>
          <SectionGrid items={items} />
        </div>
      </section>
    </>
  );
}
