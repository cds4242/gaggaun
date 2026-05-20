import Link from "next/link";
export const metadata = { title: "등록 감사 | 가까운교회" };
export default function Page() {
  return (
    <div className="bg-paper min-h-[70vh] flex items-center pt-20">
      <div className="container-narrow text-center">
        <div className="eyebrow mb-8">— Welcome</div>
        <h1 className="h-display text-5xl text-ink">환영합니다</h1>
        <div className="my-10 flex items-center justify-center gap-4">
          <span className="rule" />
          <span className="text-[11px] tracking-[0.3em] text-muted">THE NEAR CHURCH</span>
          <span className="rule" />
        </div>
        <p className="text-muted text-[14px] leading-[1.95]">
          새가족 등록이 완료되었습니다.<br />
          담당자가 곧 따뜻하게 연락드리겠습니다.
        </p>
        <Link href="/" className="btn-ink mt-12">홈으로</Link>
      </div>
    </div>
  );
}
