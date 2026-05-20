import { PageHeader } from "@/components/page-header";
import { ProseSection } from "@/components/section-grid";
import { IMG } from "@/lib/images";
export const metadata = { title: "남선교회 | 가까운교회" };
export default function Page() {
  return (
    <div className="bg-paper">
      <PageHeader title="남선교회" eyebrow="— Men" image={IMG.men} />
      <ProseSection eyebrow="— Men's Fellowship" title="형제들의 자리">
        <p>남성 성도들이 함께 신앙과 친교를 나누는 모임입니다.</p>
      </ProseSection>
    </div>
  );
}
