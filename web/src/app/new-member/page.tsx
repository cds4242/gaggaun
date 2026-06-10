import { PageHeader } from "@/components/page-header";
import { PhoneInput } from "@/components/phone-input";
import { registerNewMember } from "./actions";

export const metadata = { title: "새가족 등록 | 가까운 서광교회" };

export default function Page() {
  return (
    <>
      <PageHeader title="새가족 등록" eyebrow="WELCOME · NEW FAMILY" subtitle="가까운 서광교회에 오신 것을 환영합니다" />
      <section className="block">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <p style={{ textAlign: "center", color: "var(--mute)", marginBottom: 40, lineHeight: 1.9 }}>
            작성해주신 정보는 새가족 부서에서만 확인하며,<br />환영 안내 및 등반 안내에만 사용됩니다.
          </p>
          <form action={registerNewMember} className="form-card">
            <div className="grid2">
              <Field name="name" label="이름" required />
              <div className="form-row">
                <label htmlFor="phone">연락처<span className="req">*</span></label>
                <PhoneInput id="phone" name="phone" required />
              </div>
              <div className="form-row">
                <label>성별</label>
                <div className="radios">
                  <label><input type="radio" name="gender" value="M" /> 남</label>
                  <label><input type="radio" name="gender" value="F" /> 여</label>
                </div>
              </div>
              <Field name="birth_date" label="생년월일" type="date" />
              <div className="form-row">
                <label htmlFor="marital_status">결혼 여부</label>
                <select id="marital_status" name="marital_status">
                  <option value="">선택</option>
                  <option value="single">미혼</option>
                  <option value="married">기혼</option>
                  <option value="other">기타</option>
                </select>
              </div>
              <Field name="visited_at" label="첫 방문일" type="date" />
            </div>
            <Field name="address" label="주소" />
            <Field name="invited_by" label="초청자 / 인도자" />
            <div className="form-row">
              <label htmlFor="introduction">자기소개</label>
              <textarea id="introduction" name="introduction" rows={3} />
            </div>
            <div className="form-row">
              <label htmlFor="prayer_request">기도 제목</label>
              <textarea id="prayer_request" name="prayer_request" rows={3} />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">등록하기</button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

function Field({ name, label, type = "text", required, placeholder }: { name: string; label: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div className="form-row">
      <label htmlFor={name}>{label}{required && <span className="req">*</span>}</label>
      <input id={name} name={name} type={type} required={required} placeholder={placeholder} />
    </div>
  );
}
