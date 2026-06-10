import { PageHeader } from "@/components/page-header";
import { SectionGrid } from "@/components/section-grid";

export const metadata = { title: "선교봉사 | 가까운 서광교회" };

const items = [
  { label: "국내 선교", en: "Domestic", href: "/missions/domestic", desc: "농어촌 · 미자립 교회와 함께" },
  { label: "해외 선교", en: "Global", href: "/missions/global", desc: "땅끝까지 보내신 선교의 사명" },
  { label: "지역 섬김", en: "Local Service", href: "/missions/local", desc: "이웃을 향한 따뜻한 손길" },
];

export default function Page() {
  return (
    <>
      <PageHeader title="선교봉사" eyebrow="MISSIONS & SERVICE" subtitle="복음을 살아내는 자리" />
      <section className="block">
        <div className="wrap">
          <SectionGrid items={items} />
        </div>
      </section>
    </>
  );
}
