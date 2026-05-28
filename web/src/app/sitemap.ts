import type { MetadataRoute } from "next";
import { createPublicClient } from "@/lib/supabase/public";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gaggaun.vercel.app";

const STATIC_ROUTES: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }> = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about/greeting", changeFrequency: "monthly", priority: 0.6 },
  { path: "/about/vision", changeFrequency: "monthly", priority: 0.6 },
  { path: "/about/history", changeFrequency: "monthly", priority: 0.5 },
  { path: "/about/location", changeFrequency: "monthly", priority: 0.8 },
  { path: "/worship", changeFrequency: "monthly", priority: 0.7 },
  { path: "/worship/sunday", changeFrequency: "monthly", priority: 0.8 },
  { path: "/worship/wednesday", changeFrequency: "monthly", priority: 0.6 },
  { path: "/worship/friday", changeFrequency: "monthly", priority: 0.6 },
  { path: "/worship/dawn", changeFrequency: "monthly", priority: 0.6 },
  { path: "/ministry", changeFrequency: "monthly", priority: 0.6 },
  { path: "/ministry/children", changeFrequency: "monthly", priority: 0.6 },
  { path: "/ministry/youth", changeFrequency: "monthly", priority: 0.6 },
  { path: "/ministry/mission", changeFrequency: "monthly", priority: 0.5 },
  { path: "/ministry/praise", changeFrequency: "monthly", priority: 0.5 },
  { path: "/community", changeFrequency: "monthly", priority: 0.6 },
  { path: "/community/cell", changeFrequency: "monthly", priority: 0.5 },
  { path: "/community/men", changeFrequency: "monthly", priority: 0.5 },
  { path: "/community/women", changeFrequency: "monthly", priority: 0.5 },
  { path: "/media", changeFrequency: "weekly", priority: 0.6 },
  { path: "/media/sermon", changeFrequency: "weekly", priority: 0.8 },
  { path: "/media/gallery", changeFrequency: "weekly", priority: 0.6 },
  { path: "/notices", changeFrequency: "daily", priority: 0.9 },
  { path: "/board", changeFrequency: "daily", priority: 0.8 },
  { path: "/new-member", changeFrequency: "monthly", priority: 0.8 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const dynamicEntries: MetadataRoute.Sitemap = [];
  try {
    const sb = createPublicClient();
    const [notices, posts, sermons, boards] = await Promise.all([
      sb.from("notices").select("id, updated_at, created_at").order("created_at", { ascending: false }).limit(500),
      sb.from("board_posts").select("id, board_id, updated_at, created_at").order("created_at", { ascending: false }).limit(500),
      sb.from("sermons").select("id, updated_at, created_at").order("created_at", { ascending: false }).limit(500),
      sb.from("boards").select("id, slug, is_active"),
    ]);
    const boardRows = (boards.data as Array<{ id: number; slug: string; is_active: boolean }> | null) ?? [];
    const slugByBoardId = new Map(boardRows.map((b) => [b.id, b.slug] as const));
    for (const b of boardRows.filter((x) => x.is_active)) {
      dynamicEntries.push({
        url: `${SITE_URL}/board/${b.slug}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.6,
      });
    }
    for (const n of (notices.data ?? []) as Array<{ id: number; updated_at: string | null; created_at: string }>) {
      dynamicEntries.push({
        url: `${SITE_URL}/notices/${n.id}`,
        lastModified: new Date(n.updated_at ?? n.created_at),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
    for (const p of (posts.data ?? []) as Array<{ id: number; board_id: number; updated_at: string | null; created_at: string }>) {
      const slug = slugByBoardId.get(p.board_id);
      if (!slug) continue;
      dynamicEntries.push({
        url: `${SITE_URL}/board/${slug}/${p.id}`,
        lastModified: new Date(p.updated_at ?? p.created_at),
        changeFrequency: "weekly",
        priority: 0.5,
      });
    }
    for (const s of (sermons.data ?? []) as Array<{ id: number; updated_at: string | null; created_at: string }>) {
      dynamicEntries.push({
        url: `${SITE_URL}/media/sermon/${s.id}`,
        lastModified: new Date(s.updated_at ?? s.created_at),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  } catch {
    // Supabase 미설정/오류 시 정적만 반환
  }

  return [...staticEntries, ...dynamicEntries];
}
