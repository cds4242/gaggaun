import Image from "next/image";

export function PageHeader({
  title,
  subtitle,
  eyebrow,
  image,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  image: string;
}) {
  return (
    <section className="relative h-[360px] sm:h-[420px] w-full overflow-hidden bg-[var(--navy-deep)]">
      <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-55" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(18,27,52,0.55) 0%, rgba(18,27,52,0.80) 100%)",
        }}
      />
      <div className="absolute inset-0 max-w-[1240px] mx-auto px-8 flex flex-col justify-center text-white">
        {eyebrow && (
          <div className="inline-flex items-center gap-3.5 mb-5 text-[var(--gold-2)] font-sans text-[13px] tracking-[0.18em]">
            <span className="hr-gold" />
            <span>{eyebrow}</span>
          </div>
        )}
        <h1 className="font-serif font-bold text-[44px] sm:text-[56px] leading-[1.2] tracking-[-0.045em]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-xl font-serif text-[16px] text-white/85 leading-[1.85]">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
