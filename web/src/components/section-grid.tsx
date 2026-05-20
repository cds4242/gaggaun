import Link from "next/link";

export function SectionGrid({ items }: { items: { label: string; en: string; href: string; desc?: string }[] }) {
  return (
    <div className="idx-grid">
      {items.map((i) => (
        <Link key={i.href} href={i.href} className="idx-card">
          <span className="en">{i.en}</span>
          <span className="ko">{i.label}</span>
          {i.desc && <span className="desc">{i.desc}</span>}
          <span className="go">바로가기</span>
        </Link>
      ))}
    </div>
  );
}

export function ProseSection({ title, eyebrow, children }: { title?: string; eyebrow?: string; children: React.ReactNode }) {
  return (
    <section className="block">
      <div className="wrap" style={{ maxWidth: 880 }}>
        <div className="prose-box">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          {title && <h2>{title}</h2>}
          <div className="deco">
            <span className="line" />
            <span className="dot" />
            <span className="line" />
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
