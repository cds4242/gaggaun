import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { createClient } from "@/lib/supabase/server";
import { BoardEditForm } from "./edit-form";

export const metadata = { title: "글 수정 | 가까운교회 게시판" };
export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = parseInt(rawId, 10);
  if (!Number.isFinite(id)) notFound();

  const supabase = await createClient();
  const { data: post } = await supabase
    .from("board_posts")
    .select("id, title, content, image_urls")
    .eq("id", id)
    .maybeSingle();
  if (!post) notFound();

  return (
    <>
      <PageHeader title="글 수정" eyebrow="EDIT POST" subtitle="작성 시 입력한 비밀번호가 필요합니다" />
      <section className="block">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <BoardEditForm
            postId={post.id}
            initialTitle={post.title}
            initialContent={post.content}
            initialImageUrls={post.image_urls ?? []}
          />
        </div>
      </section>
    </>
  );
}
