import { PageHeader } from "@/components/page-header";
import { ProseSection } from "@/components/section-grid";
import { IMG } from "@/lib/images";
export const metadata = { title: "청년부 | 가까운교회" };
export default function Page() {
  return (
    <div className="bg-paper">
      <PageHeader title="청년부" eyebrow="— Youth" subtitle="청년의 시기를 함께" image={IMG.youth} />
      <ProseSection eyebrow="— Youth" title="청년의 자리">
        <p>20~30대 청년들의 신앙 공동체입니다.</p>
        <p>매주 토요일 저녁 7시 예배와 소그룹 모임이 있습니다.</p>
      </ProseSection>
    </div>
  );
}
