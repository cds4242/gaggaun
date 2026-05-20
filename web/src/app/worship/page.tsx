import { PageHeader } from "@/components/page-header";
import { SectionGrid } from "@/components/section-grid";
import { IMG } from "@/lib/images";

export const metadata = { title: "예배안내 | 가까운교회" };

const items = [
  { label: "주일예배", en: "Sunday", href: "/worship/sunday", desc: "주일 1·2부 본당 예배" },
  { label: "수요예배", en: "Wednesday", href: "/worship/wednesday", desc: "말씀과 기도의 자리" },
  { label: "새벽예배", en: "Dawn", href: "/worship/dawn", desc: "하루를 주님과 함께" },
  { label: "금요철야", en: "Friday Night", href: "/worship/friday", desc: "기도의 밤" },
];

export default function Page() {
  return (
    <>
      <PageHeader title="예배안내" eyebrow="Worship Service" subtitle="가까운교회의 예배" image={IMG.worship} />
      <section className="py-24">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="sec-title">
            <span className="eyebrow">Worship</span>
            <h2>한 주의 예배를 안내합니다</h2>
            <div className="deco"><span className="line"></span><span className="dot"></span><span className="line"></span></div>
          </div>
          <SectionGrid items={items} />
        </div>
      </section>
    </>
  );
}
