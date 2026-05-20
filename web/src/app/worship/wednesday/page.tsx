import { PageHeader } from "@/components/page-header";
import { ProseSection } from "@/components/section-grid";
export const metadata = { title: "수요예배 | 가까운교회" };
export default function Page() {
  return (
    <>
      <PageHeader title="수요예배" eyebrow="WEDNESDAY" subtitle="말씀과 기도의 자리" />
      <ProseSection title="중보와 통성의 시간" eyebrow="Wednesday Service">
        <p>매주 수요일 저녁 7시 30분, 본당에서 드립니다.</p>
        <p>중보기도와 통성기도, 말씀 강해가 함께 이루어지는 예배입니다.</p>
      </ProseSection>
    </>
  );
}
