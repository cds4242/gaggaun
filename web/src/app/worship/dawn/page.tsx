import { PageHeader } from "@/components/page-header";
import { ProseSection } from "@/components/section-grid";
import { IMG } from "@/lib/images";
export const metadata = { title: "새벽예배 | 가까운교회" };
export default function Page() {
  return (
    <div className="bg-paper">
      <PageHeader title="새벽예배" eyebrow="— Dawn" subtitle="하루를 주님과 함께" image={IMG.dawn} />
      <ProseSection title="하루의 시작" eyebrow="— Dawn">
        <p>평일 새벽 5시 30분, 본당에서 드립니다.</p>
        <p>매일의 일상을 말씀과 기도로 시작하세요.</p>
      </ProseSection>
    </div>
  );
}
