import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { UtilBar } from "@/components/util-bar";
import { createClient, isAdminEmail } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "가까운교회 | 김포 한강신도시 운양동",
  description: "김포 한강신도시 운양동에 위치한 가까운교회 공식 홈페이지입니다.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let userEmail: string | null = null;
  let admin = false;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    userEmail = data.user?.email ?? null;
    admin = await isAdminEmail(userEmail);
  } catch {}

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
      <body className="min-h-screen flex flex-col">
        <UtilBar userEmail={userEmail} />
        <SiteHeader userEmail={userEmail} isAdmin={admin} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
