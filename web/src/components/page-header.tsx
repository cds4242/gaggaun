export function PageHeader({
  title,
  subtitle,
  eyebrow,
  editSection,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  editSection?: string;
}) {
  return (
    <section className="page-head" data-edit-section={editSection ? `${editSection}.header` : undefined}>
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
