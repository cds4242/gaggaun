import { PageHeader } from "@/components/page-header";
import { IMG } from "@/lib/images";

export const metadata = { title: "비전과 사명 | 가까운교회" };

const items = [
  { n: "01", t: "예배하는 교회", en: "Worship", d: "신령과 진정으로 드리는 예배 안에서 하나님을 깊이 만나는 교회를 추구합니다." },
  { n: "02", t: "양육하는 교회", en: "Disciple", d: "말씀과 기도로 그리스도의 제자를 차근차근 세우고 양육합니다." },
  { n: "03", t: "섬기는 교회", en: "Serve",   d: "지역사회와 이웃을 섬기며 예수님의 사랑을 일상에서 전합니다." },
];

export default function Page() {
  return (
    <div className="bg-paper">
      <PageHeader title="비전과 사명" eyebrow="— Vision" subtitle="가까운교회가 추구하는 세 가지 가치" image={IMG.vision} />
      <div className="container-wide section">
        <div className="grid gap-px bg-[var(--line-soft)] border-y border-[var(--line-soft)] sm:grid-cols-3">
          {items.map((v) => (
            <div key={v.n} className="bg-paper p-12 min-h-[420px] flex flex-col">
              <div className="flex items-start justify-between">
                <div className="numeral text-muted">{v.n}</div>
                <div className="eyebrow text-muted">{v.en.toUpperCase()}</div>
              </div>
              <div className="mt-auto">
                <h3 className="h-display text-4xl text-ink">{v.t}</h3>
                <div className="rule my-8" />
                <p className="text-[14px] text-muted leading-[1.95]">{v.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
