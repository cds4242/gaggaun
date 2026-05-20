import { PageHeader } from "@/components/page-header";
import { ProseSection } from "@/components/section-grid";
export const metadata = { title: "남선교회 | 가까운교회" };
export default function Page() {
  return (
    <>
      <PageHeader title="남선교회" eyebrow="MEN" />
      <ProseSection eyebrow="Men's Fellowship" title="형제들의 자리">
        <p>남성 성도들이 함께 신앙과 친교를 나누는 모임입니다.</p>
      </ProseSection>
    </>
  );
}
