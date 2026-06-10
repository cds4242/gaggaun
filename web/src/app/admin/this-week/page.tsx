import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getSettingsByGroup } from "@/lib/site-settings";
import { updateThisWeek } from "./actions";

export const metadata = { title: "금주 정보 관리 | 가까운 서광교회" };
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin("/admin/this-week");
  const sp = await searchParams;
  const rows = await getSettingsByGroup("this_week");

  return (
    <>
      <div className="admin-page-head">
        <div className="title-side">
          <span className="eyebrow">This Week</span>
          <h1>금주 정보 관리</h1>
        </div>
        <Link href="/" target="_blank" style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--mute)" }}>
          홈에서 미리보기 ↗
        </Link>
      </div>

      <div className="admin-card">
        <div className="ac-head">
          <h3>홈 히어로 띠 (금주 정보)</h3>
          {sp.saved && <span style={{ fontSize: 13, color: "var(--ok, #2e7d4f)" }}>저장되었습니다 ✓</span>}
        </div>
        <div className="ac-body">
          <p style={{ margin: "0 0 20px", fontSize: 14, color: "var(--mute)" }}>
            매주 바뀌는 정보입니다. 여기서 저장하면 사이트 첫 화면에 바로 반영됩니다.
            (브라우저 캐시로 60초 이내 갱신)
          </p>

          {rows.length === 0 ? (
            <div className="admin-empty">
              site_settings 테이블이 아직 시드되지 않았습니다.
              Supabase에서 <code>web/supabase/schema.sql</code>을 다시 실행해주세요.
            </div>
          ) : (
            <form action={updateThisWeek} className="admin-form">
              {rows.map((r) => (
                <div className="row" key={r.key}>
                  <label htmlFor={r.key}>
                    {r.label}
                    {r.description && (
                      <span style={{ display: "block", fontSize: 12, color: "var(--mute)", fontWeight: 400, marginTop: 2 }}>
                        {r.description}
                      </span>
                    )}
                  </label>
                  <input
                    id={r.key}
                    name={r.key}
                    type="text"
                    defaultValue={r.value}
                    required
                  />
                </div>
              ))}
              <div className="actions">
                <button type="submit" className="btn-primary">저장</button>
                <Link href="/" target="_blank" className="more-link">
                  사이트 보기 ↗
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
