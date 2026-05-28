import { createPublicClient } from "@/lib/supabase/public";

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

// 상위 메뉴 라벨 목록. boards.category가 이 중 하나와 정확히 일치할 때만
// 해당 드롭다운에 보드가 자동 노출된다. /admin/boards 폼의 셀렉터에서도 같은 값 사용.
export const TOP_CATEGORIES = [
  "교회소개",
  "예배안내",
  "설교말씀",
  "교회소식",
  "공동체",
] as const;
export type TopCategory = typeof TOP_CATEGORIES[number];

export const NAV: NavItem[] = [
  {
    label: "교회소개",
    href: "/about",
    children: [
      { label: "인사말", href: "/about/greeting" },
      { label: "비전과 사명", href: "/about/vision" },
      { label: "교회 연혁", href: "/about/history" },
      { label: "오시는 길", href: "/about/location" },
    ],
  },
  {
    label: "예배안내",
    href: "/worship",
    children: [
      { label: "주일예배", href: "/worship/sunday" },
      { label: "수요예배", href: "/worship/wednesday" },
      { label: "새벽예배", href: "/worship/dawn" },
      { label: "금요철야", href: "/worship/friday" },
    ],
  },
  {
    label: "설교말씀",
    href: "/media/sermon",
    children: [
      { label: "설교 영상", href: "/media/sermon" },
      { label: "갤러리", href: "/media/gallery" },
    ],
  },
  {
    label: "교회소식",
    href: "/notices",
    children: [
      { label: "공지사항", href: "/notices" },
      { label: "갤러리", href: "/media/gallery" },
      // 자유게시판 등 게시판은 boards 테이블에서 동적으로 주입됨 (lib/boards-nav.ts).
    ],
  },
  {
    label: "공동체",
    href: "/community",
    children: [
      { label: "구역모임", href: "/community/cell" },
      { label: "남선교회", href: "/community/men" },
      { label: "여전도회", href: "/community/women" },
      { label: "청년부", href: "/ministry/youth" },
      { label: "주일학교", href: "/ministry/children" },
    ],
  },
];

// site_settings의 nav.tree(JSON 문자열) → NavItem[].
// DB가 없거나 키가 없거나 파싱 실패하면 정적 NAV로 fallback.
export async function getNavFromDb(): Promise<NavItem[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "nav.tree")
      .maybeSingle();
    if (error || !data) return NAV;
    const parsed = JSON.parse((data as { value: string }).value);
    if (!Array.isArray(parsed)) return NAV;
    // 최소 검증 — 각 항목이 label/href를 가지는지
    const valid = parsed.every((x) => x && typeof x.label === "string" && typeof x.href === "string");
    if (!valid) return NAV;
    return parsed as NavItem[];
  } catch {
    return NAV;
  }
}
