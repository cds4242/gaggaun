import { createClient } from "@/lib/supabase/server";
import { BoardForm } from "./board-form";

export const metadata = { title: "글쓰기 | 가까운교회 게시판" };

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">글쓰기</h1>
      <BoardForm
        defaultAuthor={data.user?.email?.split("@")[0]}
        defaultEmail={data.user?.email ?? undefined}
      />
    </div>
  );
}
