import { PageHeader } from "@/components/page-header";
import { VideoBoard } from "@/components/video-board";

export const metadata = { title: "호산나 성가대 | 가까운 서광교회" };
export const revalidate = 60;

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string; q?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const q = (sp.q ?? "").trim();

  return (
    <>
      <PageHeader title="호산나 성가대" eyebrow="HOSANNA CHOIR" subtitle="주일 2부 예배를 섬기는 성가대의 찬양 영상" />
      <section className="block">
        <div className="wrap">
          <VideoBoard category="hosanna" basePath="/praise/hosanna" page={page} q={q} />
        </div>
      </section>
    </>
  );
}
