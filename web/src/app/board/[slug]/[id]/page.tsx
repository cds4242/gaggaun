import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient, isAdminEmail } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";
import { getBoardBySlug } from "@/lib/boards";
import { incrementBoardView } from "@/app/board/actions";
import { deleteBoardPostAndGoList, deleteBoardPostWithPassword } from "@/app/board/[slug]/[id]/actions";
import { Comments } from "./comments";
import { DeleteButton } from "@/components/delete-button";
import { PasswordDeleteButton } from "@/components/password-delete-button";
import { RichText } from "@/components/rich-text";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string; id: string }> }): Promise<Metadata> {
  const { slug, id } = await params;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("board_posts").select("title, content").eq("id", id).maybeSingle();
    if (data) {
      const board = await getBoardBySlug(slug);
      const desc = (data.content ?? "").toString().replace(/\s+/g, " ").slice(0, 80);
      return { title: `${data.title} | 가까운 서광교회 ${board?.name ?? "게시판"}`, description: desc };
    }
  } catch {}
  return { title: "게시글 | 가까운 서광교회" };
}

export default async function Page({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  const board = await getBoardBySlug(slug);
  if (!board) notFound();

  const supabase = await createClient();
  const { data: post } = await supabase
    .from("board_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!post) notFound();

  // 다른 보드의 글에 접근하면 정상 slug로 리다이렉트
  if (post.board_id !== board.id) {
    const { data: realBoard } = await supabase.from("boards").select("slug").eq("id", post.board_id).maybeSingle();
    if (realBoard?.slug) redirect(`/board/${realBoard.slug}/${post.id}`);
    notFound();
  }

  incrementBoardView(Number(id)).catch(() => null);

  const { data: userData } = await supabase.auth.getUser();
  const admin = await isAdminEmail(userData.user?.email);
  const postId = post.id;
  const basePath = `/board/${board.slug}`;

  const [{ data: prevRow }, { data: nextRow }, commentRes] = await Promise.all([
    supabase
      .from("board_posts")
      .select("id, title")
      .eq("board_id", board.id)
      .lt("created_at", post.created_at)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("board_posts")
      .select("id, title")
      .eq("board_id", board.id)
      .gt("created_at", post.created_at)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    board.comment_enabled
      ? supabase
          .from("board_comments")
          .select("id, post_id, parent_id, author_name, content, created_at")
          .eq("post_id", postId)
          .order("created_at", { ascending: true })
      : Promise.resolve({ data: [] }),
  ]);
  const comments = commentRes.data ?? [];

  return (
    <section className="block">
      <div className="wrap" style={{ maxWidth: 920 }}>
        <Link href={basePath} style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--mute)" }}>
          ← {board.name} 목록
        </Link>
        <div className="prose-box" style={{ marginTop: 24 }}>
          <h2 style={{ marginBottom: 16 }}>{post.title}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "var(--mute)", paddingBottom: 20, borderBottom: "1px solid var(--line)", marginBottom: 32, flexWrap: "wrap" }}>
            <span><strong style={{ color: "var(--navy)", fontWeight: 600 }}>{post.author_name}</strong></span>
            <span style={{ width: 1, height: 12, background: "var(--line)" }} />
            <span style={{ fontFamily: "var(--sans)" }}>{formatDateTime(post.created_at)}</span>
            <span style={{ width: 1, height: 12, background: "var(--line)" }} />
            <span>조회 {post.views}</span>
          </div>

          <RichText
            text={post.content}
            className="post-body"
          />

          {post.image_urls && post.image_urls.length > 0 && (
            <div style={{ marginTop: 32, display: "grid", gap: 16 }}>
              {post.image_urls.map((url: string, i: number) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer" title="새 탭에서 원본 보기" style={{ display: "block" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`첨부 ${i + 1}`} style={{ width: "100%", height: "auto", border: "1px solid var(--line)", display: "block" }} />
                </a>
              ))}
            </div>
          )}

          {board.comment_enabled ? (
            <Comments postId={postId} boardSlug={board.slug} comments={comments} admin={admin} />
          ) : (
            <p style={{ marginTop: 40, paddingTop: 28, borderTop: "1px solid var(--line)", color: "var(--mute)", fontSize: 13 }}>
              이 게시판은 댓글 기능이 꺼져 있습니다.
            </p>
          )}

          <nav style={{ marginTop: 40, borderTop: "1px solid var(--line)" }} aria-label="이전·다음 글">
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              <li style={{ display: "grid", gridTemplateColumns: "80px 1fr", padding: "14px 4px", borderBottom: "1px solid var(--line)", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 12, color: "var(--mute)", fontFamily: "var(--sans)", letterSpacing: ".05em" }}>↑ 다음 글</span>
                {nextRow ? (
                  <Link href={`${basePath}/${nextRow.id}`} className="a-link" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nextRow.title}</Link>
                ) : (
                  <span style={{ color: "var(--mute)" }}>최신 글입니다.</span>
                )}
              </li>
              <li style={{ display: "grid", gridTemplateColumns: "80px 1fr", padding: "14px 4px", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 12, color: "var(--mute)", fontFamily: "var(--sans)", letterSpacing: ".05em" }}>↓ 이전 글</span>
                {prevRow ? (
                  <Link href={`${basePath}/${prevRow.id}`} className="a-link" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{prevRow.title}</Link>
                ) : (
                  <span style={{ color: "var(--mute)" }}>가장 오래된 글입니다.</span>
                )}
              </li>
            </ul>
          </nav>

          <div style={{ marginTop: 24, paddingTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href={basePath} className="more-link">목록</Link>
            <Link href={`${basePath}/new`} className="more-link">글쓰기</Link>
            <Link href={`${basePath}/${postId}/edit`} className="more-link">수정</Link>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              {admin ? (
                <DeleteButton
                  action={async () => { "use server"; await deleteBoardPostAndGoList(board.slug, postId); }}
                  confirmMessage="이 게시글을 정말 삭제하시겠습니까? (관리자)"
                  className="more-link"
                  style={{ borderColor: "var(--burgundy)", color: "var(--burgundy)", background: "transparent" }}
                />
              ) : (
                <PasswordDeleteButton
                  action={async (pw) => { "use server"; await deleteBoardPostWithPassword(board.slug, postId, pw); }}
                  label="삭제"
                  promptMessage="글 삭제: 작성 시 입력한 비밀번호 4자리"
                  className="more-link"
                  style={{ borderColor: "var(--burgundy)", color: "var(--burgundy)", background: "transparent" }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
