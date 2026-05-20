import { PageHeader } from "@/components/page-header";
import { ProseSection } from "@/components/section-grid";
export const metadata = { title: "설교영상 | 가까운교회" };
export default function Page() {
  return (
    <>
      <PageHeader title="설교영상" eyebrow="SERMON" />
      <ProseSection eyebrow="Coming Soon" title="설교 영상">
        <p>설교 영상이 곧 업로드됩니다. 매주 주일 설교를 다시 들어보실 수 있습니다.</p>
      </ProseSection>
    </>
  );
}
