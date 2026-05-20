import { PageHeader } from "@/components/page-header";
import { ProseSection } from "@/components/section-grid";
export const metadata = { title: "새벽예배 | 가까운교회" };
export default function Page() {
  return (
    <>
      <PageHeader title="새벽예배" eyebrow="DAWN" subtitle="하루를 주님과 함께" />
      <ProseSection title="하루의 시작" eyebrow="Dawn Service">
        <p>평일 새벽 5시 30분, 본당에서 드립니다.</p>
        <p>매일의 일상을 말씀과 기도로 시작하세요.</p>
      </ProseSection>
    </>
  );
}
