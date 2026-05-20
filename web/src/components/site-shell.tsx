"use client";

import { usePathname } from "next/navigation";
import { UtilBar } from "@/components/util-bar";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function SiteShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail?: string | null;
}) {
  const pathname = usePathname() ?? "/";
  const bare = pathname.startsWith("/admin") || pathname.startsWith("/login");

  if (bare) {
    return <>{children}</>;
  }

  return (
    <>
      <UtilBar userEmail={userEmail} />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
