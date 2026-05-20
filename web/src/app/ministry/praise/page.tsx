import { PageHeader } from "@/components/page-header";
import { ProseSection } from "@/components/section-grid";
import { IMG } from "@/lib/images";
export const metadata = { title: "찬양대 | 가까운교회" };
export default function Page() {
  return (
    <div className="bg-paper">
      <PageHeader title="찬양대" eyebrow="— Praise" subtitle="예배의 통로" image={IMG.praise} />
      <ProseSection eyebrow="— Praise" title="예배의 통로">
        <p>매 주일 예배를 찬양으로 섬깁니다.</p>
        <p>찬양에 은사가 있는 분들의 동참을 환영합니다.</p>
      </ProseSection>
    </div>
  );
}
