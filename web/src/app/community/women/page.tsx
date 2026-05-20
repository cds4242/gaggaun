import { PageHeader } from "@/components/page-header";
import { ProseSection } from "@/components/section-grid";
import { IMG } from "@/lib/images";
export const metadata = { title: "여전도회 | 가까운교회" };
export default function Page() {
  return (
    <div className="bg-paper">
      <PageHeader title="여전도회" eyebrow="— Women" image={IMG.women} />
      <ProseSection eyebrow="— Women's Fellowship" title="자매들의 자리">
        <p>여성 성도들의 신앙 공동체로, 봉사와 친교를 함께합니다.</p>
      </ProseSection>
    </div>
  );
}
