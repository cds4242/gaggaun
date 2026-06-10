import { PageHeader } from "@/components/page-header";

export const metadata = { title: "섬기는 사람들 | 가까운 서광교회" };

type Person = { name: string; role: string; note?: string };

const pastors: Person[] = [
  { name: "김요한", role: "담임목사", note: "총회신학교 신학대학원 졸업 · 2018년 부임" },
  { name: "이은혜", role: "부목사", note: "교육·청년 담당" },
  { name: "박은혜", role: "전도사", note: "다음 세대 담당" },
];

const elders: Person[] = [
  { name: "김ㅇㅇ", role: "장로", note: "재정 · 관리" },
  { name: "이ㅇㅇ", role: "장로", note: "선교 · 봉사" },
  { name: "박ㅇㅇ", role: "장로", note: "예배 · 안내" },
];

const deacons: Person[] = [
  { name: "최ㅇㅇ", role: "안수집사" },
  { name: "정ㅇㅇ", role: "안수집사" },
  { name: "조ㅇㅇ", role: "권사" },
  { name: "장ㅇㅇ", role: "권사" },
];

function Group({ title, people }: { title: string; people: Person[] }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h3 style={{ fontSize: 20, color: "var(--navy)", marginBottom: 16, fontWeight: 700 }}>{title}</h3>
      <div className="simple-table">
        <div className="row head">
          <div className="cell">성함</div>
          <div className="cell">직분</div>
          <div className="cell" style={{ gridColumn: "span 2" }}>섬기는 영역</div>
        </div>
        {people.map((p) => (
          <div key={`${title}-${p.name}`} className="row body">
            <div className="cell" style={{ fontWeight: 600, color: "var(--navy)" }}>{p.name}</div>
            <div className="cell" style={{ color: "var(--burgundy)", fontWeight: 600 }}>{p.role}</div>
            <div className="cell" style={{ gridColumn: "span 2", color: "var(--mute)", fontSize: 14 }}>{p.note ?? "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <PageHeader title="섬기는 사람들" eyebrow="OUR PEOPLE" subtitle="함께 교회를 섬기는 분들" />
      <section className="block">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <Group title="교역자" people={pastors} />
          <Group title="장로" people={elders} />
          <Group title="안수집사 · 권사" people={deacons} />
          <p style={{ textAlign: "center", marginTop: 36, color: "var(--mute)", lineHeight: 1.85 }}>
            모든 성도가 함께 교회를 세워갑니다.<br />구역장 · 부서장 등 자세한 명단은 주보를 참고해 주세요.
          </p>
        </div>
      </section>
    </>
  );
}
