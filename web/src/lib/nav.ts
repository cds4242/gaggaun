import { createPublicClient } from "@/lib/supabase/public";

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

// 상위 메뉴 라벨 목록. boards.category가 이 중 하나와 정확히 일치할 때만
// 해당 드롭다운에 보드가 자동 노출된다. /admin/boards 폼의 셀렉터에서도 같은 값 사용.
export const TOP_CATEGORIES = [
  "교회 소개",
  "예배와 말씀",
  "교회 소식",
  "선교봉사",
  "다음 세대",
  "찬양",
] as const;
export type TopCategory = typeof TOP_CATEGORIES[number];

export const NAV: NavItem[] = [
  {
    label: "교회 소개",
    href: "/about",
    children: [
      { label: "인사말", href: "/about/greeting" },
      { label: "비전과 사명", href: "/about/vision" },
      { label: "연혁", href: "/about/history" },
      { label: "섬기는 사람들", href: "/about/people" },
      { label: "오시는 길", href: "/about/location" },
    ],
  },
  {
    label: "예배와 말씀",
    href: "/worship",
    children: [
      { label: "주일 예배", href: "/worship/sunday" },
      { label: "삼일 오전예배", href: "/worship/wednesday" },
      { label: "금요 기도회", href: "/worship/friday" },
      { label: "새벽 예배", href: "/worship/dawn" },
    ],
  },
  {
    label: "교회 소식",
    href: "/notices",
    children: [
      { label: "공지사항", href: "/notices" },
      { label: "주보", href: "/notices/bulletin" },
      { label: "앨범", href: "/media/gallery" },
      { label: "새신자 소개", href: "/notices/new-member" },
    ],
  },
  {
    label: "선교봉사",
    href: "/missions",
    children: [
      { label: "국내 선교", href: "/missions/domestic" },
      { label: "해외 선교", href: "/missions/global" },
      { label: "지역 섬김", href: "/missions/local" },
    ],
  },
  {
    label: "다음 세대",
    href: "/next-gen",
    children: [
      { label: "유치부", href: "/next-gen/kindergarten" },
      { label: "유초등부", href: "/next-gen/children" },
      { label: "중고등부", href: "/next-gen/youth" },
      { label: "청년부", href: "/next-gen/college" },
    ],
  },
  {
    label: "찬양",
    href: "/praise",
    children: [
      { label: "할렐루야 성가대", href: "/praise/hallelujah" },
      { label: "호산나 성가대", href: "/praise/hosanna" },
      { label: "피스티스 찬양팀", href: "/praise/pistis" },
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
