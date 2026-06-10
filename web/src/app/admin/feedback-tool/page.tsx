import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "피드백 도구 | 가까운 서광교회" };

export default async function Page() {
  await requireAdmin("/admin/feedback-tool");

  return (
    <>
      <div className="admin-page-head">
        <div className="title-side">
          <span className="eyebrow">Feedback Tool</span>
          <h1>홈페이지 피드백 도구</h1>
        </div>
        <a
          href="/edit-tool/"
          target="_blank"
          rel="noopener"
          style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--mute)" }}
        >
          새 창으로 열기 ↗
        </a>
      </div>

      <div className="admin-card">
        <div className="ac-head">
          <h3>사용 안내</h3>
        </div>
        <div className="ac-body">
          <p style={{ margin: "0 0 8px", fontSize: 14, color: "var(--ink)" }}>
            홈페이지의 텍스트와 사진, 문구 톤 등 변경 요청을 정리해서 담당자에게 전달하는 도구입니다.
          </p>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: "var(--mute)", lineHeight: 1.7 }}>
            <li>아래 편집기에서 바꾸고 싶은 항목에 새 글자/사진/코멘트를 입력하세요.</li>
            <li>다 하셨으면 좌측 <b>“내보내기 (JSON 저장)”</b> 버튼을 눌러 파일을 받아 담당자에게 보내주세요.</li>
            <li>작업한 내용은 이 브라우저에 자동 저장됩니다 (도중에 닫아도 이어서 작업 가능).</li>
            <li>
              매주 바뀌는 정보(금주 주일·예배 시간 등)는{" "}
              <a href="/admin/this-week" style={{ color: "var(--navy)" }}>금주 정보</a>에서,
              상단 메뉴는 <a href="/admin/nav" style={{ color: "var(--navy)" }}>상단 메뉴</a>에서 바로 편집하실 수 있습니다.
            </li>
          </ul>
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: 16, padding: 0, overflow: "hidden" }}>
        <iframe
          src="/edit-tool/"
          title="홈페이지 피드백 도구"
          style={{
            width: "100%",
            height: "calc(100vh - 200px)",
            minHeight: 600,
            border: 0,
            display: "block",
            background: "var(--ivory, #fbfaf7)",
          }}
        />
      </div>
    </>
  );
}
