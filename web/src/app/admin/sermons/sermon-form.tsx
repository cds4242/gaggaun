import Link from "next/link";

type Props = {
  action: (formData: FormData) => Promise<void>;
  initial?: {
    title?: string;
    preacher?: string;
    verse?: string;
    badge?: string;
    youtube_id?: string;
    duration?: string;
    summary?: string;
    preached_at?: string;
  };
  submitLabel: string;
  cancelHref: string;
};

export function SermonForm({ action, initial = {}, submitLabel, cancelHref }: Props) {
  return (
    <form action={action} className="admin-form">
      <div className="row">
        <label htmlFor="title">제목<span className="req">*</span></label>
        <input id="title" name="title" required maxLength={120} defaultValue={initial.title ?? ""} placeholder="예) 서로 사랑하라 — 새 계명의 자리" />
      </div>
      <div className="row">
        <label htmlFor="preacher">설교자<span className="req">*</span></label>
        <input id="preacher" name="preacher" required maxLength={40} defaultValue={initial.preacher ?? ""} placeholder="예) 김요한 담임목사" />
      </div>
      <div className="row">
        <label htmlFor="youtube">YouTube URL 또는 ID<span className="req">*</span></label>
        <input id="youtube" name="youtube" required defaultValue={initial.youtube_id ?? ""} placeholder="예) https://youtu.be/dQw4w9WgXcQ 또는 dQw4w9WgXcQ" />
        <small style={{ color: "var(--mute)", fontSize: 12, marginTop: 6, display: "block" }}>
          watch?v=, youtu.be/, /embed/, /shorts/ 어떤 형식이든 자동 추출합니다.
        </small>
      </div>
      <div className="row">
        <label htmlFor="verse">본문 (선택)</label>
        <input id="verse" name="verse" maxLength={80} defaultValue={initial.verse ?? ""} placeholder="예) 요한복음 13:34-35" />
      </div>
      <div className="row">
        <label htmlFor="badge">유형 (선택)</label>
        <input id="badge" name="badge" maxLength={20} defaultValue={initial.badge ?? ""} placeholder="예) 주일 2부 / 수요 강해" list="badge-list" />
        <datalist id="badge-list">
          <option value="주일 1부" />
          <option value="주일 2부" />
          <option value="수요 강해" />
          <option value="새벽 기도회" />
          <option value="금요 기도회" />
          <option value="특별 집회" />
        </datalist>
      </div>
      <div className="row">
        <label htmlFor="preached_at">설교일 (선택)</label>
        <input id="preached_at" name="preached_at" type="date" defaultValue={initial.preached_at ?? ""} />
      </div>
      <div className="row">
        <label htmlFor="duration">재생 시간 (선택)</label>
        <input id="duration" name="duration" maxLength={10} defaultValue={initial.duration ?? ""} placeholder="예) 38:21" />
      </div>
      <div className="row">
        <label htmlFor="summary">요약 (선택)</label>
        <textarea id="summary" name="summary" rows={5} maxLength={2000} defaultValue={initial.summary ?? ""} placeholder="설교의 핵심 메시지를 짧게 적어 주세요." />
      </div>
      <div className="actions">
        <button type="submit" className="btn-primary">{submitLabel}</button>
        <Link href={cancelHref} className="more-link">취소</Link>
      </div>
    </form>
  );
}
