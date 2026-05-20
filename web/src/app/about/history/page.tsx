import { PageHeader } from "@/components/page-header";
import { IMG } from "@/lib/images";

export const metadata = { title: "교회 연혁 | 가까운교회" };

const history = [
  { year: "2015", events: ["가까운교회 설립", "김포 운양동 임시 예배 시작"] },
  { year: "2017", events: ["한강신도시 본당 입당", "주일학교 신설"] },
  { year: "2019", events: ["청년부 출범", "지역사회 섬김 사역 시작"] },
  { year: "2022", events: ["선교부 발족", "온라인 예배 시스템 구축"] },
];

export default function Page() {
  return (
    <div className="bg-paper">
      <PageHeader title="교회 연혁" eyebrow="— History" subtitle="걸어온 발자취" image={IMG.history} />
      <div className="container-narrow section">
        {history.map((h, i) => (
          <div key={h.year} className="grid grid-cols-[120px_1fr] gap-12 py-12 border-b border-[var(--line-soft)]">
            <div>
              <div className="font-display text-5xl text-ink">{h.year}</div>
              <div className="text-[11px] tracking-[0.25em] text-muted mt-3">CHAPTER {String(i + 1).padStart(2, "0")}</div>
            </div>
            <ul className="space-y-3 pt-3">
              {h.events.map((e) => (
                <li key={e} className="flex items-start gap-4 text-ink/85 text-[15px]">
                  <span className="mt-3 h-px w-6 bg-ink shrink-0" />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
