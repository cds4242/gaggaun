import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { updateNotice, deleteNotice } from "../../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdmin(`/admin/notices/${id}/edit`);
  const supabase = await createClient();
  const { data: notice } = await supabase
    .from("notices")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!notice) notFound();

  const noticeId = notice.id;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">공지사항 수정</h1>
      <form action={async (fd) => { "use server"; await updateNotice(noticeId, fd); }} className="space-y-4">
        <div>
          <Label htmlFor="title">제목</Label>
          <Input id="title" name="title" defaultValue={notice.title} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="content">내용</Label>
          <Textarea id="content" name="content" rows={10} defaultValue={notice.content} required className="mt-1" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="pinned" defaultChecked={notice.pinned} /> 상단 고정 (공지)
        </label>
        <div className="flex gap-2 pt-4">
          <Button type="submit">저장</Button>
        </div>
      </form>
      <form action={async () => { "use server"; await deleteNotice(noticeId); }} className="mt-8">
        <Button type="submit" variant="destructive">삭제</Button>
      </form>
    </div>
  );
}
