import { PageHeader } from "@/components/page-header";
import { ProseSection } from "@/components/section-grid";
export const metadata = { title: "금요철야 | 가까운교회" };
export default function Page() {
  return (
    <>
      <PageHeader title="금요철야" eyebrow="FRIDAY NIGHT" subtitle="기도의 밤" />
      <ProseSection title="깊은 기도의 자리" eyebrow="Friday Night Prayer">
        <p>매주 금요일 저녁 10시, 본당에서 진행됩니다.</p>
        <p>중보기도와 자유로운 기도의 시간을 갖습니다. 처음 오신 분도 환영합니다.</p>
      </ProseSection>
    </>
  );
}
