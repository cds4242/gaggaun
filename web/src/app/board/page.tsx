import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { IMG } from "@/lib/images";

export const metadata = { title: "게시판 | 가까운교회" };
export const revalidate = 0;

type Post = { id: number; title: string; author_name: string; image_urls: string[] | null; views: number; created_at: string };

export default async function BoardPage() {
  let posts: Post[] | null = null;
  try {
    const supabase = await createClient();
    const res = await supabase
      .from("board_posts")
      .select("id, title, author_name, image_urls, views, created_at")
      .order("created_at", { ascending: false });
    posts = res.data as Post[] | null;
  } catch {
    posts = null;
  }

  return (
    <div className="bg-paper">
      <PageHeader title="자유 게시판" eyebrow="— Community" subtitle="성도들의 따뜻한 나눔 공간" image={IMG.board} />
      <div className="container-wide section">
        <div className="flex justify-end mb-10">
          <Link href="/board/new" className="btn-ink">+ 글쓰기</Link>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="py-32 text-center text-muted text-[14px] border-y border-[var(--line-soft)]">
            아직 등록된 게시글이 없습니다.
          </div>
        ) : (
          <ul className="grid gap-px bg-[var(--line-soft)] border border-[var(--line-soft)] sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <li key={p.id} className="bg-paper">
                <Link href={`/board/${p.id}`} className="block p-8 h-full hover:bg-surface transition-colors">
                  {p.image_urls?.[0] ? (
                    <div className="relative aspect-[4/3] mb-6 zoom">
                      <Image src={p.image_urls[0]} alt="" fill className="object-cover" unoptimized />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] mb-6 bg-[var(--line-soft)] flex items-center justify-center text-muted text-[10px] tracking-[0.3em]">
                      TEXT ONLY
                    </div>
                  )}
                  <div className="text-[16px] text-ink line-clamp-2 leading-snug">{p.title}</div>
                  <div className="mt-4 flex items-center justify-between text-[11px] tracking-[0.15em] text-muted">
                    <span>{p.author_name}</span>
                    <span>{formatDate(p.created_at)} · {p.views}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
