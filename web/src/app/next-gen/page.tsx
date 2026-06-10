import { PageHeader } from "@/components/page-header";
import { SectionGrid } from "@/components/section-grid";

export const metadata = { title: "다음 세대 | 가까운 서광교회" };

const items = [
  { label: "유치부", en: "Kindergarten", href: "/next-gen/kindergarten", desc: "5~7세 — 처음 만나는 예배" },
  { label: "유초등부", en: "Children", href: "/next-gen/children", desc: "초등 1~6학년 — 말씀과 친구" },
  { label: "중고등부", en: "Youth", href: "/next-gen/youth", desc: "중·고등학생 — 청소년의 신앙 여정" },
  { label: "청년부", en: "College", href: "/next-gen/college", desc: "대학·청년 — 삶의 자리를 함께" },
];

export default function Page() {
  return (
    <>
      <PageHeader title="다음 세대" eyebrow="NEXT GENERATION" subtitle="다음 세대를 위한 신앙 공동체" />
      <section className="block">
        <div className="wrap">
          <SectionGrid items={items} />
        </div>
      </section>
    </>
  );
}
