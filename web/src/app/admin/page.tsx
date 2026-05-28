import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "관리자 대시보드 | 가까운교회" };

type Recent = { id: number; title: string; created_at: string; pinned?: boolean };
type Pending = { id: number; name: string; phone: string; created_at: string };

export default async function AdminHome() {
  await requireAdmin("/admin");
  const supabase = await createClient();

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const [{ count: nc }, { count: bc }, { count: mc }, { count: mc7 }, gcRes, scRes, latestNotices, latestBoard, latestMembers, pendingMembersRes] = await Promise.all([
    supabase.from("notices").select("*", { count: "exact", head: true }),
    supabase.from("board_posts").select("*", { count: "exact", head: true }),
    supabase.from("new_members").select("*", { count: "exact", head: true }),
    supabase.from("new_members").select("*", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
    supabase.from("gallery_photos").select("*", { count: "exact", head: true }),
    supabase.from("sermons").select("*", { count: "exact", head: true }),
    supabase.from("notices").select("id, title, pinned, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("board_posts").select("id, title, author_name, created_at, board_id, boards(slug, name)").order("created_at", { ascending: false }).limit(5),
    supabase.from("new_members").select("id, name, phone, created_at").order("created_at", { ascending: false }).limit(5),
    // 등록 후 7일 이상 지났는데 아직 pending인 새가족
    supabase
      .from("new_members")
      .select("id, name, phone, created_at")
      .eq("status", "pending")
      .lte("created_at", sevenDaysAgo)
      .order("created_at", { ascending: true })
      .limit(20),
  ]);
  const gc = gcRes.error ? 0 : (gcRes.count ?? 0);
  const sc = scRes.error ? 0 : (scRes.count ?? 0);

  const notices = (latestNotices.data as Recent[]) ?? [];
  const boardRaw = (latestBoard.data as (Recent & { author_name: string; board_id: number; boards: { slug: string; name: string } | { slug: string; name: string }[] | null })[]) ?? [];
  const board = boardRaw.map((p) => ({
    ...p,
    boards: Array.isArray(p.boards) ? (p.boards[0] ?? null) : p.boards,
  }));
  const members = (latestMembers.data as { id: number; name: string; phone: string; created_at: string }[]) ?? [];
  const pendingMembers = (pendingMembersRes.data as Pending[]) ?? [];

  return (
    <>
      <div className="admin-page-head">
        <div className="title-side">
          <span className="eyebrow">Dashboard</span>
          <h1>관리자 대시보드</h1>
        </div>
        <div className="meta">{formatDate(new Date())} · 가까운교회</div>
      </div>

      <div className="stat-grid">
        <StatCard label="NOTICES" value={nc ?? 0} sub="공지사항" href="/admin/notices" />
        <StatCard label="BOARD POSTS" value={bc ?? 0} sub="자유 게시판" href="/admin/board" />
        <StatCard label="SERMONS" value={sc} sub="설교 영상" href="/admin/sermons" />
        <StatCard label="GALLERY" value={gc} sub="갤러리" href="/admin/gallery" />
        <StatCard label="NEW FAMILY" value={mc ?? 0} sub="새가족 등록" href="/admin/new-members" />
        <StatCard label="THIS WEEK" value={mc7 ?? 0} sub="최근 7일 신규" href="/admin/new-members" />
      </div>

      <div className="admin-card" style={{ marginTop: 20 }}>
        <div className="ac-head">
          <h3>홈 화면 — 금주 정보</h3>
          <Link href="/admin/this-week" style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--navy)" }}>
            편집 →
          </Link>
        </div>
        <div className="ac-body">
          <p style={{ margin: 0, fontSize: 13, color: "var(--mute)" }}>
            홈 히어로 띠에 표시되는 금주 주일·예배 시간·설교 본문·설교자를 코드 수정 없이 바로 바꿀 수 있습니다.
          </p>
        </div>
      </div>

      {pendingMembers.length > 0 && (
        <div className="admin-alert" role="region" aria-label="미응대 새가족">
          <div className="ah-head">
            <span className="ah-badge">{pendingMembers.length}</span>
            <div className="ah-text">
              <strong>미응대 새가족</strong>
              <small>등록 후 7일 이상 지났는데 아직 ‘미응대’ 상태인 분들입니다. 빠르게 연락드려 주세요.</small>
            </div>
            <Link href="/admin/new-members?status=pending" className="ah-cta">전체 보기 →</Link>
          </div>
          <ul className="ah-list">
            {pendingMembers.slice(0, 5).map((m) => {
              const days = Math.floor((Date.now() - new Date(m.created_at).getTime()) / (24 * 60 * 60 * 1000));
              return (
                <li key={m.id}>
                  <span className="nm">{m.name}</span>
                  <span className="ph">{m.phone}</span>
                  <span className="dt">등록 {days}일 전 · {formatDate(m.created_at)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <DashCard title="최근 공지" href="/admin/notices" all="공지 관리 →">
          {notices.length === 0 ? (
            <div className="admin-empty">아직 공지가 없습니다.</div>
          ) : (
            <table className="admin-table">
              <tbody>
                {notices.map((n) => (
                  <tr key={n.id}>
                    <td>
                      {n.pinned && <span className="pill notice" style={{ marginRight: 8 }}>공지</span>}
                      <Link href={`/notices/${n.id}`} className="a-link">{n.title}</Link>
                    </td>
                    <td className="muted" style={{ width: 110, textAlign: "right" }}>{formatDate(n.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </DashCard>

        <DashCard title="최근 게시글" href="/admin/board" all="게시판 관리 →">
          {board.length === 0 ? (
            <div className="admin-empty">아직 게시글이 없습니다.</div>
          ) : (
            <table className="admin-table">
              <tbody>
                {board.map((p) => {
                  const slug = p.boards?.slug;
                  return (
                    <tr key={p.id}>
                      <td>
                        {slug ? (
                          <Link href={`/board/${slug}/${p.id}`} className="a-link">{p.title}</Link>
                        ) : (
                          <span>{p.title}</span>
                        )}
                      </td>
                      <td className="muted" style={{ width: 90 }}>{p.author_name}</td>
                      <td className="muted" style={{ width: 100, textAlign: "right" }}>{formatDate(p.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </DashCard>

        <DashCard title="최근 새가족 등록" href="/admin/new-members" all="새가족 관리 →" full>
          {members.length === 0 ? (
            <div className="admin-empty">아직 새가족 등록이 없습니다.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>이름</th>
                  <th>연락처</th>
                  <th style={{ width: 140 }}>등록일</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id}>
                    <td style={{ color: "var(--navy)", fontWeight: 600 }}>{m.name}</td>
                    <td>{m.phone}</td>
                    <td className="muted">{formatDate(m.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </DashCard>
      </div>
    </>
  );
}

function StatCard({ label, value, sub, href }: { label: string; value: number; sub: string; href: string }) {
  return (
    <Link href={href} className="stat-card">
      <span className="lbl">{label}</span>
      <span className="val">{value}</span>
      <span className="sub">— {sub}</span>
    </Link>
  );
}

function DashCard({
  title,
  href,
  all,
  full,
  children,
}: {
  title: string;
  href: string;
  all: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="admin-card" style={full ? { gridColumn: "1 / -1" } : undefined}>
      <div className="ac-head">
        <h3>{title}</h3>
        <Link href={href} style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--navy)" }}>{all}</Link>
      </div>
      <div className="ac-body">{children}</div>
    </div>
  );
}
