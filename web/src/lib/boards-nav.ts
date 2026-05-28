import { listActiveBoards } from "@/lib/boards";
import { NAV, TOP_CATEGORIES, type NavItem, type TopCategory } from "@/lib/nav";

// 정적 NAV와 활성 보드를 merge.
// boards.category가 TOP_CATEGORIES와 정확히 일치하면 해당 드롭다운 children 끝에
// { label: board.name, href: '/board/[slug]' } 형태로 추가한다.
// 일치하지 않거나 비어있으면 메뉴에 노출되지 않는다 (URL로만 접근).
export async function buildNav(): Promise<NavItem[]> {
  const boards = await listActiveBoards();
  if (boards.length === 0) return NAV;

  const validCats = new Set<string>(TOP_CATEGORIES);
  const byCategory = new Map<TopCategory, { label: string; href: string }[]>();
  for (const b of boards) {
    if (!b.category || !validCats.has(b.category)) continue;
    const arr = byCategory.get(b.category as TopCategory) ?? [];
    arr.push({ label: b.name, href: `/board/${b.slug}` });
    byCategory.set(b.category as TopCategory, arr);
  }
  if (byCategory.size === 0) return NAV;

  return NAV.map((item) => {
    const extras = byCategory.get(item.label as TopCategory);
    if (!extras || extras.length === 0) return item;
    return {
      ...item,
      children: [...(item.children ?? []), ...extras],
    };
  });
}
