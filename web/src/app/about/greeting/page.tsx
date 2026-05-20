import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { IMG } from "@/lib/images";

export const metadata = { title: "인사말 | 가까운교회" };

export default function Page() {
  return (
    <div className="bg-paper">
      <PageHeader title="인사말" eyebrow="— Greeting" subtitle="담임목사가 드리는 짧은 편지" image={IMG.greeting} />
      <div className="container-wide section grid gap-20 lg:grid-cols-12 items-start">
        <div className="lg:col-span-5">
          <div className="relative aspect-[3/4] zoom">
            <Image src={IMG.about3} alt="" fill sizes="40vw" className="object-cover" />
          </div>
          <div className="mt-8 text-center sm:text-left">
            <div className="font-display text-2xl text-ink">담임목사</div>
            <div className="text-[12px] tracking-[0.2em] text-muted mt-2">SENIOR PASTOR</div>
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="eyebrow mb-8">— A letter</div>
          <h2 className="h-display text-4xl sm:text-5xl text-ink leading-tight">
            가까운 교회,<br /><em>가까운 마음.</em>
          </h2>
          <div className="rule my-12" />
          <div className="prose-quiet text-[15px] max-w-2xl">
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
            <p className="text-right font-display text-xl text-ink mt-16">— 담임목사 드림</p>
          </div>
        </div>
      </div>
    </div>
  );
}
