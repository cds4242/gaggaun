import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { getBoardBySlug } from "@/lib/boards";
import { BoardForm } from "./board-form";

export const metadata = { title: "글쓰기 | 가까운교회 게시판" };

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const board = await getBoardBySlug(slug);
  if (!board) notFound();
  if (!board.is_active) notFound();

  let email: string | undefined;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    email = data.user?.email ?? undefined;
  } catch {}

  return (
    <>
      <PageHeader title="글쓰기" eyebrow="NEW POST" subtitle={`${board.name}에 글을 남깁니다`} />
      <section className="block">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <BoardForm
            boardSlug={board.slug}
            boardName={board.name}
            imageUploadEnabled={board.image_upload_enabled}
            defaultAuthor={email?.split("@")[0]}
            defaultEmail={email}
          />
        </div>
      </section>
    </>
  );
}
