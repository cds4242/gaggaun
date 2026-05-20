import { PageHeader } from "@/components/page-header";

export const metadata = { title: "교회 연혁 | 가까운교회" };

const history = [
  { year: "2015", events: ["가까운교회 설립", "김포 운양동 임시 예배 시작"] },
  { year: "2017", events: ["한강신도시 본당 입당", "주일학교 신설"] },
  { year: "2019", events: ["청년부 출범", "지역사회 섬김 사역 시작"] },
  { year: "2022", events: ["선교부 발족", "온라인 예배 시스템 구축"] },
];

export default function Page() {
  return (
    <>
      <PageHeader title="교회 연혁" eyebrow="HISTORY" subtitle="걸어온 발자취" />
      <section className="block">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <div className="prose-box" style={{ padding: "48px 56px" }}>
            {history.map((h, i, arr) => (
              <div
                key={h.year}
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr",
                  gap: 40,
                  padding: "28px 0",
                  borderBottom: i < arr.length - 1 ? "1px solid var(--line)" : "none",
                }}
              >
                <div>
                  <div style={{ fontFamily: "var(--display)", fontStyle: "italic", fontSize: 44, color: "var(--gold)", lineHeight: 1 }}>
                    {h.year}
                  </div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 11, letterSpacing: "0.25em", color: "var(--mute)", marginTop: 10 }}>
                    CHAPTER {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {h.events.map((e) => (
                    <li
                      key={e}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 14,
                        padding: "6px 0",
                        fontSize: 16,
                        color: "var(--ink)",
                      }}
                    >
                      <span style={{ marginTop: 12, width: 18, height: 1, background: "var(--gold)", flexShrink: 0 }} />
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
