import { PageHeader } from "@/components/page-header";
import { ProseSection } from "@/components/section-grid";
export const metadata = { title: "인사말 | 가까운교회" };

export default function Page() {
  return (
    <>
      <PageHeader title="인사말" eyebrow="PASTOR'S GREETING" subtitle="담임목사가 드리는 짧은 편지" editSection="greeting" />
      <div data-edit-section="greeting.body"><ProseSection eyebrow="A Letter" title="가까운 교회, 가까운 마음">
        <p>주님의 평강이 함께 하시기를 기도합니다.</p>
        <p>
          가까운교회는 김포 한강신도시 운양동에 위치한, 이웃과 가깝고 하나님과 가까운 공동체입니다.
          매주 새로운 한 주를 시작하기 전에 우리는 예배 안에서 하나님의 음성을 듣고,
          말씀을 통해 삶의 방향을 다시 잡습니다.
        </p>
        <p>
          교회의 크기보다 중요한 것은 한 영혼을 향한 사랑입니다. 우리 교회는 작지만 따뜻하고,
          서로의 이름을 부르며 기도하는 공동체가 되기를 원합니다.
        </p>
        <p>
          누구든지 처음 오시는 분들도 편안하게 예배에 참여하실 수 있도록 안내드립니다.
          언제든 오셔서 하나님의 사랑을 함께 경험하시기를 환영합니다.
        </p>
        <p style={{ textAlign: "right", marginTop: 32, fontFamily: "var(--display)", fontStyle: "italic", color: "var(--gold)" }}>
          — 담임목사 김요한 드림
        </p>
      </ProseSection></div>
    </>
  );
}
