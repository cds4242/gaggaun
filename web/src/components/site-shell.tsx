"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { UtilBar } from "@/components/util-bar";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FlashMessage } from "@/components/flash-message";

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
    return (
      <>
        <Suspense fallback={null}><FlashMessage /></Suspense>
        {children}
      </>
    );
  }

  return (
    <>
      <Suspense fallback={null}><FlashMessage /></Suspense>
      <UtilBar userEmail={userEmail} />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
