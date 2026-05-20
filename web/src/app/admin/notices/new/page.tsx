import { requireAdmin } from "@/lib/auth";
import { createNotice } from "../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default async function Page() {
  await requireAdmin("/admin/notices/new");
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">공지사항 작성</h1>
      <form action={createNotice} className="space-y-4">
        <div>
          <Label htmlFor="title">제목</Label>
          <Input id="title" name="title" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="content">내용</Label>
          <Textarea id="content" name="content" rows={10} required className="mt-1" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="pinned" /> 상단 고정 (공지)
        </label>
        <div className="flex gap-2 pt-4">
          <Button type="submit">등록</Button>
        </div>
      </form>
    </div>
  );
}
