import { PageHeader } from "@/components/page-header";
import { SectionGrid } from "@/components/section-grid";

export const metadata = { title: "예배안내 | 가까운 서광교회" };

const items = [
  { label: "주일예배", en: "Sunday", href: "/worship/sunday", desc: "주일 1·2부 본당 예배" },
  { label: "수요예배", en: "Wednesday", href: "/worship/wednesday", desc: "말씀과 기도의 자리" },
  { label: "새벽예배", en: "Dawn", href: "/worship/dawn", desc: "하루를 주님과 함께" },
  { label: "금요철야", en: "Friday Night", href: "/worship/friday", desc: "기도의 밤" },
];

export default function Page() {
  return (
    <>
      <PageHeader title="예배안내" eyebrow="WORSHIP SERVICE" subtitle="가까운 서광교회의 예배" />
      <section className="block">
        <div className="wrap">
          <SectionGrid items={items} />
        </div>
      </section>
    </>
  );
}
