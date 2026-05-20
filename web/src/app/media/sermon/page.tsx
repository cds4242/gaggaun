import { PageHeader } from "@/components/page-header";

export const metadata = { title: "설교영상 | 가까운교회" };

type Sermon = {
  date: string;
  badge: string;
  duration: string;
  title: string;
  verse: string;
  preacher: string;
  summary: string;
};

const sermons: Sermon[] = [
  { date: "2026. 05. 19", badge: "주일 2부", duration: "38:21", title: "서로 사랑하라 — 새 계명의 자리", verse: "요한복음 13:34-35", preacher: "김요한 담임목사", summary: "예수님이 마지막 밤에 남기신 새 계명을, 오늘 우리의 식탁과 일터로 가져옵니다." },
  { date: "2026. 05. 15", badge: "수요 강해", duration: "42:07", title: "광야의 만나 — 오늘의 양식", verse: "출애굽기 16:1-21", preacher: "이은혜 부목사", summary: "하루치 양식만 거두라는 명령이 우리에게 주는 자유에 대해 묵상합니다." },
  { date: "2026. 05. 12", badge: "주일 1부", duration: "35:54", title: "여호와는 나의 목자시니", verse: "시편 23:1-6", preacher: "김요한 담임목사", summary: "익숙한 시편 23편을 한 절씩 천천히 다시 듣습니다." },
  { date: "2026. 05. 08", badge: "수요 강해", duration: "39:48", title: "엘리야와 까마귀", verse: "열왕기상 17:1-7", preacher: "이은혜 부목사", summary: "공급하시는 하나님과, 그 공급을 기다리는 마음." },
  { date: "2026. 05. 05", badge: "주일 2부", duration: "40:12", title: "어린이와 천국", verse: "마태복음 19:13-15", preacher: "김요한 담임목사", summary: "어린이주일에 함께 듣는, 어린이를 향한 예수님의 마음." },
  { date: "2026. 04. 28", badge: "주일 1부", duration: "33:21", title: "다시 갈릴리로", verse: "요한복음 21:1-14", preacher: "김요한 담임목사", summary: "부활하신 주님이 다시 일터로 부르시는 자리." },
];

export default function Page() {
  return (
    <>
      <PageHeader title="설교영상" eyebrow="SERMON ARCHIVE" subtitle="매주 선포된 말씀을 다시 듣습니다" />
      <section className="block">
        <div className="wrap">
          <div className="sermons-grid">
            {sermons.map((s) => (
              <article key={s.date + s.title} className="sermon-card">
                <div className="sermon-thumb">
                  <div className="ph" />
                  <span className="badge">{s.badge}</span>
                  <span className="duration">{s.duration}</span>
                  <div className="play">
                    <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20" /></svg>
                  </div>
                </div>
                <div className="sermon-body">
                  <div className="date">{s.date}</div>
                  <h3>{s.title}</h3>
                  <div className="verse">{s.verse}</div>
                  <div className="preacher">{s.preacher}</div>
                  <p style={{ marginTop: 12, color: "var(--mute)", fontSize: 14, lineHeight: 1.7 }}>
                    {s.summary}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <p style={{ textAlign: "center", marginTop: 48, color: "var(--mute)", lineHeight: 1.85 }}>
            영상 업로드는 매주 화요일까지 완료됩니다.<br />
            지난 설교 전체 목록은 별도 아카이브 페이지에서 곧 제공할 예정입니다.
          </p>
        </div>
      </section>
    </>
  );
}
