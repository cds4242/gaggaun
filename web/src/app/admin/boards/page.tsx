import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { DeleteButton } from "@/components/delete-button";
import { deleteBoard } from "./actions";

export const metadata = { title: "게시판 관리 | 가까운 서광교회" };

type Row = {
  id: number;
  slug: string;
  name: string;
  category: string | null;
  write_permission: string;
  comment_enabled: boolean;
  secret_enabled: boolean;
  image_upload_enabled: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

const PERM_LABEL: Record<string, string> = { anyone: "전체", member: "회원", admin: "관리자" };

export default async function Page() {
  await requireAdmin("/admin/boards");
  const supabase = await createClient();
  const { data: boards } = await supabase
    .from("boards")
    .select("id, slug, name, category, write_permission, comment_enabled, secret_enabled, image_upload_enabled, sort_order, is_active, created_at")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  // 보드별 글 수 카운트 (간단히 N+1, 보드 수는 적음)
  const rows = (boards ?? []) as Row[];
  const counts = new Map<number, number>();
  await Promise.all(
    rows.map(async (b) => {
      const { count } = await supabase
        .from("board_posts")
        .select("*", { count: "exact", head: true })
        .eq("board_id", b.id);
      counts.set(b.id, count ?? 0);
    }),
  );

  return (
    <>
      <div className="admin-page-head">
        <div className="title-side">
          <span className="eyebrow">Boards</span>
          <h1>게시판 관리</h1>
        </div>
        <Link href="/admin/boards/new" className="btn-primary">+ 새 게시판</Link>
      </div>

      <div className="admin-card">
        <div className="ac-head">
          <h3>전체 게시판 ({rows.length})</h3>
          <Link href="/board" target="_blank" style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--navy)" }}>
            사이트에서 보기 ↗
          </Link>
        </div>
        <div className="ac-body" style={{ padding: 0 }}>
          {rows.length === 0 ? (
            <div className="admin-empty">
              <div className="empty-state">
                <div className="msg">등록된 게시판이 없습니다.</div>
                <Link href="/admin/boards/new" className="empty-cta">새 게시판 만들기</Link>
              </div>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 50 }}>순서</th>
                  <th>이름 / slug</th>
                  <th style={{ width: 90 }}>분류</th>
                  <th style={{ width: 80 }}>쓰기</th>
                  <th style={{ width: 120 }}>옵션</th>
                  <th style={{ width: 70 }}>글 수</th>
                  <th style={{ width: 70 }}>상태</th>
                  <th style={{ width: 130 }}>생성일</th>
                  <th style={{ width: 140 }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((b) => {
                  const opts: string[] = [];
                  if (b.comment_enabled) opts.push("댓글");
                  if (b.secret_enabled) opts.push("비밀글");
                  if (b.image_upload_enabled) opts.push("이미지");
                  return (
                    <tr key={b.id} style={!b.is_active ? { opacity: 0.55 } : undefined}>
                      <td data-label="순서" className="muted">{b.sort_order}</td>
                      <td data-label="이름">
                        <Link href={`/board/${b.slug}`} className="a-link" target="_blank">{b.name}</Link>
                        <div style={{ fontSize: 12, color: "var(--mute)", fontFamily: "var(--sans)" }}>/{b.slug}</div>
                      </td>
                      <td data-label="분류" className="muted">{b.category ?? "—"}</td>
                      <td data-label="쓰기">{PERM_LABEL[b.write_permission] ?? b.write_permission}</td>
                      <td data-label="옵션" style={{ fontSize: 12, color: "var(--mute)" }}>
                        {opts.length > 0 ? opts.join(" · ") : "—"}
                      </td>
                      <td data-label="글 수" className="muted">{counts.get(b.id) ?? 0}</td>
                      <td data-label="상태">
                        <span className={"pill " + (b.is_active ? "news" : "notice")}>
                          {b.is_active ? "활성" : "비활성"}
                        </span>
                      </td>
                      <td data-label="생성일" className="muted">{formatDate(b.created_at)}</td>
                      <td data-label="관리">
                        <div className="actions">
                          <Link href={`/admin/boards/${b.id}/edit`}>편집</Link>
                          <DeleteButton
                            action={async () => { "use server"; await deleteBoard(b.id); }}
                            confirmMessage={`'${b.name}' 게시판을 삭제하시겠습니까? (글이 남아있으면 삭제되지 않습니다)`}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
