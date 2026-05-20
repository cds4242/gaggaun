export function PageHeader({
  title,
  subtitle,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}) {
  return (
    <section className="page-head">
      <div className="inner">
        {eyebrow && (
          <div className="eyebrow">
            <span className="line" />
            <span>{eyebrow}</span>
          </div>
        )}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  );
}
