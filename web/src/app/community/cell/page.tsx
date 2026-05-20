import { PageHeader } from "@/components/page-header";
import { ProseSection } from "@/components/section-grid";
export const metadata = { title: "구역모임 | 가까운교회" };
export default function Page() {
  return (
    <>
      <PageHeader title="구역모임" eyebrow="CELL" />
      <ProseSection eyebrow="Cell Group" title="이웃과 가까이">
        <p>지역별로 묶인 작은 모임입니다. 매주 또는 격주로 가정에서 모입니다.</p>
      </ProseSection>
    </>
  );
}
