import { redirect } from "next/navigation";
import { listActiveBoards } from "@/lib/boards";

// 호환 라우트: 기존 /board/new 링크는 활성 보드 인덱스로 보냅니다.
// 보드가 1개면 그 보드의 글쓰기, 여러개면 인덱스로.
export const dynamic = "force-dynamic";

export default async function LegacyNewPostRedirect() {
  const boards = await listActiveBoards();
  if (boards.length === 1) redirect(`/board/${boards[0].slug}/new`);
  redirect("/board");
}
