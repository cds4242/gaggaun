import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { listActiveBoards } from "@/lib/boards";

export const metadata = { title: "게시판 | 가까운교회" };
export const revalidate = 60;

export default async function BoardIndexPage() {
  const boards = await listActiveBoards();

  // 활성 보드가 1개면 그 보드 목록으로 바로 이동 (UX: 인덱스 한 단계 스킵)
  if (boards.length === 1) {
    redirect(`/board/${boards[0].slug}`);
  }

  return (
    <>
      <PageHeader title="게시판" eyebrow="COMMUNITY BOARDS" subtitle="성도들의 따뜻한 나눔 공간" />
      <section className="block">
        <div className="wrap">
          {boards.length === 0 ? (
            <div className="empty-state" style={{ padding: "60px 20px", textAlign: "center" }}>
              <div className="msg" style={{ color: "var(--mute)" }}>
                아직 운영 중인 게시판이 없습니다.
              </div>
            </div>
          ) : (
            <div className="idx-grid">
              {boards.map((b) => (
                <Link key={b.id} href={`/board/${b.slug}`} className="idx-card">
                  <span className="eyebrow" style={{ fontFamily: "var(--display)", fontSize: 13, letterSpacing: ".08em", color: "var(--gold)" }}>
                    {(b.category ?? "BOARD").toUpperCase()}
                  </span>
                  <h3 style={{ marginTop: 6, fontFamily: "var(--serif)", color: "var(--navy)", fontSize: 20 }}>
                    {b.name}
                  </h3>
                  {b.description && (
                    <p style={{ marginTop: 8, color: "var(--mute)", fontSize: 14, lineHeight: 1.6 }}>
                      {b.description}
                    </p>
                  )}
                  <span style={{ marginTop: 14, display: "inline-block", fontFamily: "var(--sans)", fontSize: 13, color: "var(--navy)" }}>
                    들어가기 →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
