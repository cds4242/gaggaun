import { listActiveBoards } from "@/lib/boards";
import { getNavFromDb, TOP_CATEGORIES, type NavItem, type TopCategory } from "@/lib/nav";

// DB(site_settings.nav.tree) 기준 NAV와 활성 보드를 merge.
// DB가 비면 정적 NAV로 fallback (getNavFromDb 내부에서 처리).
//
// 보드 자동 주입: boards.category가 TOP_CATEGORIES와 정확히 일치하면 해당 드롭다운
// children 끝에 { label: board.name, href: '/board/[slug]' } 추가.
// 일치하지 않거나 비어있으면 메뉴에 노출되지 않는다 (URL로만 접근).
export async function buildNav(): Promise<NavItem[]> {
  const [baseNav, boards] = await Promise.all([
    getNavFromDb(),
    listActiveBoards(),
  ]);
  if (boards.length === 0) return baseNav;

  const validCats = new Set<string>(TOP_CATEGORIES);
  const byCategory = new Map<TopCategory, { label: string; href: string }[]>();
  for (const b of boards) {
    if (!b.category || !validCats.has(b.category)) continue;
    const arr = byCategory.get(b.category as TopCategory) ?? [];
    arr.push({ label: b.name, href: `/board/${b.slug}` });
    byCategory.set(b.category as TopCategory, arr);
  }
  if (byCategory.size === 0) return baseNav;

  return baseNav.map((item) => {
    const extras = byCategory.get(item.label as TopCategory);
    if (!extras || extras.length === 0) return item;
    return {
      ...item,
      children: [...(item.children ?? []), ...extras],
    };
  });
}
