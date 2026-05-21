import Link from "next/link";

type Props = {
  basePath: string;
  page: number;
  totalPages: number;
  searchParams?: Record<string, string | undefined>;
};

function build(basePath: string, page: number, extra?: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  if (extra) for (const [k, v] of Object.entries(extra)) if (v) sp.set(k, v);
  if (page > 1) sp.set("page", String(page));
  const qs = sp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function Pagination({ basePath, page, totalPages, searchParams }: Props) {
  if (totalPages <= 1) return null;
  const windowSize = 5;
  const start = Math.max(1, Math.min(page - 2, totalPages - windowSize + 1));
  const end = Math.min(totalPages, start + windowSize - 1);
  const pages: number[] = [];
  for (let i = start; i <= end; i++) pages.push(i);
  const prevHref = page > 1 ? build(basePath, page - 1, searchParams) : null;
  const nextHref = page < totalPages ? build(basePath, page + 1, searchParams) : null;
  const firstHref = page > 1 ? build(basePath, 1, searchParams) : null;
  const lastHref = page < totalPages ? build(basePath, totalPages, searchParams) : null;

  return (
    <nav className="pagination" aria-label="페이지 네비게이션">
      {firstHref ? <Link href={firstHref} aria-label="처음" prefetch>«</Link> : <span className="disabled" aria-disabled>«</span>}
      {prevHref ? <Link href={prevHref} aria-label="이전" prefetch>‹</Link> : <span className="disabled" aria-disabled>‹</span>}
      {pages.map((p) => (
        p === page ? (
          <span key={p} className="current" aria-current="page">{p}</span>
        ) : (
          // 가까운 페이지(±1)는 prefetch 활성, 멀리 있는 페이지는 호버 prefetch만
          <Link key={p} href={build(basePath, p, searchParams)} prefetch={Math.abs(p - page) <= 1}>{p}</Link>
        )
      ))}
      {nextHref ? <Link href={nextHref} aria-label="다음" prefetch>›</Link> : <span className="disabled" aria-disabled>›</span>}
      {lastHref ? <Link href={lastHref} aria-label="마지막" prefetch>»</Link> : <span className="disabled" aria-disabled>»</span>}
    </nav>
  );
}
