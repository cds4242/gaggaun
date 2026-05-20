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

  incrementBoardView(Number(id)).catch(() => null);

  const { data: userData } = await supabase.auth.getUser();
  const admin = await isAdminEmail(userData.user?.email);
  const postId = post.id;

  return (
    <section className="block">
      <div className="wrap" style={{ maxWidth: 920 }}>
        <Link href="/board" style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--mute)" }}>
          ← 게시판 목록
        </Link>
        <div className="prose-box" style={{ marginTop: 24 }}>
          <h2 style={{ marginBottom: 16 }}>{post.title}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "var(--mute)", paddingBottom: 20, borderBottom: "1px solid var(--line)", marginBottom: 32, flexWrap: "wrap" }}>
            <span><strong style={{ color: "var(--navy)", fontWeight: 600 }}>{post.author_name}</strong></span>
            <span style={{ width: 1, height: 12, background: "var(--line)" }} />
            <span style={{ fontFamily: "var(--display)", fontStyle: "italic" }}>{formatDate(post.created_at)}</span>
            <span style={{ width: 1, height: 12, background: "var(--line)" }} />
            <span>조회 {post.views}</span>
          </div>

          <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.95, color: "var(--body)", fontSize: 16 }}>
            {post.content}
          </div>

          {post.image_urls && post.image_urls.length > 0 && (
            <div style={{ marginTop: 32, display: "grid", gap: 16 }}>
              {post.image_urls.map((url: string, i: number) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img key={i} src={url} alt={`첨부 ${i + 1}`} style={{ width: "100%", height: "auto", border: "1px solid var(--line)" }} />
              ))}
            </div>
          )}

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--line)", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/board" className="more-link">목록</Link>
            {admin && (
              <form action={async () => { "use server"; await deleteBoardPost(postId); }} style={{ display: "inline" }}>
                <button type="submit" className="more-link" style={{ borderColor: "var(--burgundy)", color: "var(--burgundy)", background: "transparent" }}>
                  삭제
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
