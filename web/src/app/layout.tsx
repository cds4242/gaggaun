import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SiteShell } from "@/components/site-shell";
import pwa from "@/lib/pwa-assets.json";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gaggaun.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "가까운교회 | 김포 한강신도시 운양동",
    template: "%s",
  },
  description:
    "김포 한강신도시 운양동에 위치한 가까운교회 공식 홈페이지입니다. 매주 주일·수요·새벽 예배와 다음 세대 사역, 따뜻한 공동체를 소개합니다.",
  applicationName: "가까운교회",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "가까운교회",
  },
  icons: {
    icon: [
      { url: pwa.icon192, sizes: "192x192", type: "image/svg+xml" },
      { url: pwa.icon512, sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [{ url: pwa.icon512, sizes: "512x512", type: "image/svg+xml" }],
    shortcut: pwa.icon192,
  },
  openGraph: {
    type: "website",
    siteName: "가까운교회",
    title: "가까운교회 | 김포 한강신도시 운양동",
    description: "이웃과 가까이, 하나님과 가까이. 가까운교회 공식 홈페이지.",
    locale: "ko_KR",
    url: SITE_URL,
    images: [
      {
        url: pwa.ogImage,
        width: 1200,
        height: 630,
        alt: "가까운교회 — 김포 한강신도시 운양동",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "가까운교회",
    description: "김포 한강신도시 운양동 가까운교회.",
    images: [pwa.ogImage],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#121b34",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Noto+Serif+KR:wght@400;500;600;700;900&family=Noto+Sans+KR:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteShell>{children}</SiteShell>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
