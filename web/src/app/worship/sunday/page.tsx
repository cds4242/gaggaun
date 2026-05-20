import { PageHeader } from "@/components/page-header";
import { IMG } from "@/lib/images";

export const metadata = { title: "주일예배 | 가까운교회" };

export default function Page() {
  return (
    <div className="bg-paper">
      <PageHeader title="주일예배" eyebrow="— Sunday" subtitle="주의 날 함께 드리는 예배" image={IMG.sunday} />
      <div className="container-narrow section">
        <ul className="divide-y border-y border-[var(--line-soft)]">
          {[
            { c: "1부 예배", t: "주일 오전 09:00", p: "본당" },
            { c: "2부 예배", t: "주일 오전 11:00", p: "본당" },
            { c: "주일학교", t: "주일 오전 11:00", p: "교육관" },
          ].map((row, i) => (
            <li key={row.c} className="py-8 grid grid-cols-12 gap-6 items-baseline">
              <div className="col-span-1 numeral text-muted">0{i + 1}</div>
              <div className="col-span-5 font-display text-2xl text-ink">{row.c}</div>
              <div className="col-span-4 font-display text-2xl text-ink">{row.t}</div>
              <div className="col-span-2 text-right text-[12px] tracking-[0.2em] text-muted">{row.p}</div>
            </li>
          ))}
        </ul>
        <p className="mt-16 text-center text-muted text-[14px] leading-[1.95]">
          모든 분들이 환영받는 예배입니다.<br />
          처음 오신 분은 입구 안내데스크에서 알려주시면 친절히 안내해 드립니다.
        </p>
      </div>
    </div>
  );
}
