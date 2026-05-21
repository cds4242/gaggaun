export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

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
      { label: "자유게시판", href: "/board" },
      { label: "갤러리", href: "/media/gallery" },
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
