import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { BoardForm } from "./board-form";

export const metadata = { title: "글쓰기 | 가까운교회 게시판" };

export default async function Page() {
  let email: string | undefined;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    email = data.user?.email ?? undefined;
  } catch {}

  return (
    <>
      <PageHeader title="글쓰기" eyebrow="NEW POST" subtitle="자유 게시판에 글을 남깁니다" />
      <section className="block">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <BoardForm defaultAuthor={email?.split("@")[0]} defaultEmail={email} />
        </div>
      </section>
    </>
  );
}
