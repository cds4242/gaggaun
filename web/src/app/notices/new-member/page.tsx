import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { ProseSection } from "@/components/section-grid";

export const metadata = { title: "새신자 소개 | 가까운 서광교회" };

const recent = [
  { date: "2026-06-07", name: "김ㅇㅇ 가정", note: "운양동에서 이사 오심" },
  { date: "2026-05-24", name: "이ㅇㅇ 자매", note: "친구 초대로 첫 출석" },
  { date: "2026-05-10", name: "박ㅇㅇ 형제", note: "직장 동료 초대" },
  { date: "2026-04-26", name: "최ㅇㅇ 가정", note: "구역 식구의 전도" },
];

export default function Page() {
  return (
    <>
      <PageHeader title="새신자 소개" eyebrow="WELCOME" subtitle="새롭게 함께하시는 분들을 환영합니다" />
      <ProseSection eyebrow="환영의 인사" title="가까운 서광교회에 오신 것을 환영합니다">
        <p>
          처음 교회를 찾으시는 분, 다시 신앙생활을 시작하시는 분, 이사 오시면서 새 교회를 찾고 계신 분 —
          어떤 모습으로 오시든 따뜻하게 맞이합니다.
        </p>
        <p>
          새가족 등록을 하시면 6주간의 새가족 양육 과정에 참여하실 수 있으며,
          담당 교역자와 1:1 인사 시간을 가집니다.
        </p>
        <p style={{ textAlign: "center", marginTop: 32 }}>
          <Link href="/new-member" className="btn-primary" style={{ display: "inline-block", padding: "12px 28px" }}>
            새가족 등록하기
          </Link>
        </p>
      </ProseSection>

      <section className="block">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <h3 style={{ fontSize: 20, color: "var(--navy)", marginBottom: 16, fontWeight: 700, textAlign: "center" }}>
            최근 등록하신 분들
          </h3>
          <div className="simple-table">
            <div className="row head">
              <div className="cell">등록일</div>
              <div className="cell">성함</div>
              <div className="cell" style={{ gridColumn: "span 2" }}>안내</div>
            </div>
            {recent.map((r) => (
              <div key={r.date + r.name} className="row body">
                <div className="cell" style={{ color: "var(--burgundy)", fontWeight: 600 }}>{r.date}</div>
                <div className="cell" style={{ fontWeight: 600, color: "var(--navy)" }}>{r.name}</div>
                <div className="cell" style={{ gridColumn: "span 2", color: "var(--mute)", fontSize: 14 }}>{r.note}</div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: 36, color: "var(--mute)", lineHeight: 1.85 }}>
            한 영혼이 하나님 앞에 나아오는 것은 천하보다 귀한 일입니다.
          </p>
        </div>
      </section>
    </>
  );
}
