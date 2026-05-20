import { PageHeader } from "@/components/page-header";
import { ProseSection } from "@/components/section-grid";
export const metadata = { title: "찬양대 | 가까운교회" };
export default function Page() {
  return (
    <>
      <PageHeader title="찬양대" eyebrow="PRAISE" subtitle="예배의 통로" />
      <ProseSection eyebrow="Praise" title="예배의 통로">
        <p>매 주일 예배를 찬양으로 섬깁니다.</p>
        <p>찬양에 은사가 있는 분들의 동참을 환영합니다.</p>
      </ProseSection>
    </>
  );
}
