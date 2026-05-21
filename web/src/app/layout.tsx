import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://gaggaun.vercel.app"),
  title: {
    default: "가까운교회 | 김포 한강신도시 운양동",
    template: "%s",
  },
  description: "김포 한강신도시 운양동에 위치한 가까운교회 공식 홈페이지입니다. 매주 주일·수요·새벽 예배와 다음 세대 사역, 따뜻한 공동체를 소개합니다.",
  openGraph: {
    type: "website",
    siteName: "가까운교회",
    title: "가까운교회 | 김포 한강신도시 운양동",
    description: "이웃과 가까이, 하나님과 가까이. 가까운교회 공식 홈페이지.",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary",
    title: "가까운교회",
    description: "김포 한강신도시 운양동 가까운교회.",
  },
  robots: { index: true, follow: true },
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
      </body>
    </html>
  );
}
