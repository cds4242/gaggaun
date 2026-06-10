import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getNavFromDb } from "@/lib/nav";
import { NavEditor } from "./nav-editor";
import { resetNavToDefault } from "./actions";

export const metadata = { title: "상단 메뉴 관리 | 가까운 서광교회" };
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ saved?: string; reset?: string }> }) {
  await requireAdmin("/admin/nav");
  const sp = await searchParams;
  const initial = await getNavFromDb();

  return (
    <>
      <div className="admin-page-head">
        <div className="title-side">
          <span className="eyebrow">Navigation</span>
          <h1>상단 메뉴 관리</h1>
        </div>
        <Link href="/" target="_blank" style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--mute)" }}>
          홈에서 미리보기 ↗
        </Link>
      </div>

      <div className="admin-card">
        <div className="ac-head">
          <h3>메인 메뉴 트리</h3>
          {sp.saved && <span style={{ fontSize: 13, color: "var(--ok, #2e7d4f)" }}>저장되었습니다 ✓</span>}
          {sp.reset && <span style={{ fontSize: 13, color: "var(--mute)" }}>기본값으로 되돌렸습니다</span>}
        </div>
        <div className="ac-body">
          <p style={{ margin: "0 0 16px", fontSize: 14, color: "var(--mute)" }}>
            저장하면 사이트 헤더가 즉시 갱신됩니다. 게시판은 <Link href="/admin/boards" style={{ color: "var(--navy)" }}>게시판 관리</Link>에서
            카테고리를 설정하면 해당 메뉴 아래에 자동으로 들어갑니다 (여기서는 편집할 필요 없음).
          </p>
          <NavEditor initial={initial} />
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: 20 }}>
        <div className="ac-head"><h3>기본값으로 되돌리기</h3></div>
        <div className="ac-body">
          <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--mute)" }}>
            메뉴가 꼬였을 때 시드 값(코드에 정의된 기본 NAV)으로 되돌립니다.
          </p>
          <form action={resetNavToDefault}>
            <button type="submit" className="btn-line">기본값으로 되돌리기</button>
          </form>
        </div>
      </div>
    </>
  );
}
