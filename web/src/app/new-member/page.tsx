import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { registerNewMember } from "./actions";
import { IMG } from "@/lib/images";

export const metadata = { title: "새가족 등록 | 가까운교회" };

export default function Page() {
  return (
    <div className="bg-paper">
      <PageHeader title="새가족 등록" eyebrow="— New family" subtitle="가까운교회에 오신 것을 환영합니다" image={IMG.newMember} />

      <div className="container-narrow section">
        <p className="text-center text-muted text-[14px] leading-[1.95] mb-16">
          작성해주신 정보는 새가족 부서에서만 확인하며,<br />
          환영 안내 및 등반 안내에만 사용됩니다.
        </p>
        <form action={registerNewMember} className="space-y-10">
          <div className="grid gap-8 sm:grid-cols-2">
            <Field name="name" label="이름" required />
            <Field name="phone" label="연락처" placeholder="010-0000-0000" required />

            <div>
              <Label>성별</Label>
              <div className="mt-3 flex gap-6 text-[14px]">
                <label className="flex items-center gap-2"><input type="radio" name="gender" value="M" /> 남</label>
                <label className="flex items-center gap-2"><input type="radio" name="gender" value="F" /> 여</label>
              </div>
            </div>

            <Field name="birth_date" label="생년월일" type="date" />

            <div>
              <Label htmlFor="marital_status">결혼 여부</Label>
              <select id="marital_status" name="marital_status"
                className="mt-2 flex h-12 w-full border-0 border-b border-[var(--line-soft)] bg-transparent px-0 text-[15px] focus:outline-none focus:border-ink">
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

          <div>
            <Label htmlFor="introduction">자기소개</Label>
            <Textarea id="introduction" name="introduction" rows={3} className="mt-2 rounded-none border-0 border-b border-[var(--line-soft)] bg-transparent px-0 focus-visible:ring-0 focus-visible:border-ink" />
          </div>
          <div>
            <Label htmlFor="prayer_request">기도 제목</Label>
            <Textarea id="prayer_request" name="prayer_request" rows={3} className="mt-2 rounded-none border-0 border-b border-[var(--line-soft)] bg-transparent px-0 focus-visible:ring-0 focus-visible:border-ink" />
          </div>

          <div className="pt-8 text-center">
            <button type="submit" className="btn-ink">등록하기</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ name, label, type = "text", required, placeholder }: { name: string; label: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <Label htmlFor={name}>{label}{required && <span className="text-ink"> *</span>}</Label>
      <Input id={name} name={name} type={type} required={required} placeholder={placeholder}
        className="mt-2 rounded-none border-0 border-b border-[var(--line-soft)] bg-transparent px-0 h-12 focus-visible:ring-0 focus-visible:border-ink" />
    </div>
  );
}
