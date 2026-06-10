import type { MetadataRoute } from "next";
import pwa from "@/lib/pwa-assets.json";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "가까운 서광교회",
    short_name: "가까운 서광교회",
    description: "김포 한강신도시 운양동 가까운 서광교회 — 매주 예배, 공지, 게시판, 갤러리, 설교 영상",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f3e8",
    theme_color: "#121b34",
    lang: "ko",
    icons: [
      { src: pwa.icon192, sizes: "192x192", type: "image/svg+xml", purpose: "any" },
      { src: pwa.icon512, sizes: "512x512", type: "image/svg+xml", purpose: "any" },
      { src: pwa.icon512, sizes: "512x512", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
