import { PageHeader } from "@/components/page-header";
import { ProseSection } from "@/components/section-grid";
import { IMG } from "@/lib/images";
export const metadata = { title: "선교부 | 가까운교회" };
export default function Page() {
  return (
    <div className="bg-paper">
      <PageHeader title="선교부" eyebrow="— Mission" subtitle="땅 끝까지 이르러" image={IMG.mission} />
      <ProseSection eyebrow="— Mission" title="복음의 발걸음">
        <p>국내 농어촌 교회 지원과 해외 선교사 후원을 진행합니다.</p>
        <p>매년 단기선교 팀을 파송합니다.</p>
      </ProseSection>
    </div>
  );
}
