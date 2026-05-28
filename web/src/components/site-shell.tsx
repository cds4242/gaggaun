"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { UtilBar } from "@/components/util-bar";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FlashMessage } from "@/components/flash-message";
import type { NavItem } from "@/lib/nav";

export function SiteShell({ nav, children }: { nav: NavItem[]; children: React.ReactNode }) {
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
      <UtilBar />
      <SiteHeader nav={nav} />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
