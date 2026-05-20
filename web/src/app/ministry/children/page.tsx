import { PageHeader } from "@/components/page-header";
import { ProseSection } from "@/components/section-grid";
export const metadata = { title: "주일학교 | 가까운교회" };
export default function Page() {
  return (
    <>
      <PageHeader title="주일학교" eyebrow="CHILDREN" subtitle="다음세대를 세우는 사역" />
      <ProseSection eyebrow="Sunday School" title="아이들의 자리">
        <p>유치부, 유년부, 초등부로 나뉘어 매주 주일 11시에 진행됩니다.</p>
        <p>아이들의 눈높이에 맞는 말씀 교육과 즐거운 활동을 함께합니다.</p>
      </ProseSection>
    </>
  );
}
