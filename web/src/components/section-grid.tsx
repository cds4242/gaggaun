import Link from "next/link";

export function SectionGrid({ items }: { items: { label: string; en: string; href: string; desc?: string }[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((i) => (
        <Link
          key={i.href}
          href={i.href}
          className="group relative bg-white border border-[var(--line)] p-9 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] hover:border-[var(--gold-soft)]"
        >
          <span className="absolute left-0 top-0 right-0 h-[3px] bg-[var(--gold)] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
          <div className="font-display italic text-[15px] text-[var(--gold)] tracking-[0.04em]">{i.en}</div>
          <h3 className="mt-4 font-serif font-bold text-[22px] text-[var(--navy)] tracking-[-0.03em]">{i.label}</h3>
          {i.desc && <p className="mt-3 text-[15px] text-[var(--mute)] leading-[1.7]">{i.desc}</p>}
          <span className="mt-6 inline-flex items-center gap-1.5 font-serif text-[14px] text-[var(--gold)] font-semibold">
            바로가기 →
          </span>
        </Link>
      ))}
    </div>
  );
}

export function ProseSection({ title, eyebrow, children }: { title?: string; eyebrow?: string; children: React.ReactNode }) {
  return (
    <div className="max-w-[880px] mx-auto px-8 py-20">
      {eyebrow && (
        <span className="font-display italic text-[18px] text-[var(--gold)] tracking-[0.08em] block mb-4">
          {eyebrow}
        </span>
      )}
      {title && (
        <h2 className="font-serif font-bold text-[32px] sm:text-[40px] text-[var(--navy)] tracking-[-0.04em] leading-[1.3] mb-8">
          {title}
        </h2>
      )}
      <div className="flex items-center gap-3 mb-10 text-[var(--gold)]">
        <span className="hr-gold" />
        <span className="w-2 h-2 bg-[var(--gold)] rotate-45" />
        <span className="hr-gold" />
      </div>
      <div className="prose-quiet">{children}</div>
    </div>
  );
}
