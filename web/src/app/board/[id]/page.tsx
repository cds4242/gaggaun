import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient, isAdminEmail } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { incrementBoardView } from "../actions";
import { deleteBoardPost } from "./actions";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("board_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!post) notFound();

  // best-effort view increment
  incrementBoardView(Number(id)).catch(() => null);

  const { data: userData } = await supabase.auth.getUser();
  const admin = await isAdminEmail(userData.user?.email);
  const postId = post.id;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-4">
        <Link href="/board" className="text-sm text-gray-500 hover:underline">← 게시판으로</Link>
      </div>
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <div className="mt-2 text-sm text-gray-500">
        {post.author_name} · {formatDate(post.created_at)} · 조회 {post.views}
      </div>
      <div className="mt-8 whitespace-pre-wrap text-gray-800 leading-relaxed">
        {post.content}
      </div>
      {post.image_urls && post.image_urls.length > 0 && (
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {post.image_urls.map((url: string, i: number) => (
            <div key={i} className="relative aspect-video overflow-hidden rounded-lg border border-gray-200">
              <Image src={url} alt={`첨부 ${i + 1}`} fill className="object-cover" unoptimized />
            </div>
          ))}
        </div>
      )}
      {admin && (
        <form action={async () => { "use server"; await deleteBoardPost(postId); }} className="mt-12">
          <button type="submit" className="text-sm text-red-600 hover:underline">
            관리자: 이 글 삭제
          </button>
        </form>
      )}
    </div>
  );
}
