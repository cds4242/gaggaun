import { PageHeader } from "@/components/page-header";

export const metadata = { title: "주보 | 가까운 서광교회" };

type Bulletin = { date: string; title: string; href?: string };

const bulletins: Bulletin[] = [
  { date: "2026-06-07", title: "주일 주보 — 성령강림 후 둘째 주" },
  { date: "2026-05-31", title: "주일 주보 — 성령강림 후 첫째 주" },
  { date: "2026-05-24", title: "주일 주보 — 성령강림 주일" },
  { date: "2026-05-17", title: "주일 주보 — 부활 후 일곱째 주" },
  { date: "2026-05-10", title: "주일 주보 — 어버이주일" },
  { date: "2026-05-03", title: "주일 주보 — 어린이주일" },
];

export default function Page() {
  return (
    <>
      <PageHeader title="주보" eyebrow="WEEKLY BULLETIN" subtitle="매 주일 발행되는 교회 주보" />
      <section className="block">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <div className="simple-table">
            <div className="row head">
              <div className="cell">발행일</div>
              <div className="cell" style={{ gridColumn: "span 3" }}>제목</div>
            </div>
            {bulletins.map((b) => (
              <div key={b.date} className="row body">
                <div className="cell" style={{ color: "var(--burgundy)", fontWeight: 600 }}>{b.date}</div>
                <div className="cell" style={{ gridColumn: "span 3" }}>
                  {b.href ? <a href={b.href}>{b.title}</a> : b.title}
                </div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: 36, color: "var(--mute)", lineHeight: 1.85 }}>
            지난 주보는 본당 입구 안내데스크에서도 받아보실 수 있습니다.<br />
            PDF 다운로드 기능은 준비 중입니다.
          </p>
        </div>
      </section>
    </>
  );
}
