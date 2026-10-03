import { Link } from "react-router";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  lede,
}: {
  title: string;
  lede?: string;
}) {
  return (
    <header className="space-y-1">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {lede ? <p className="text-muted">{lede}</p> : null}
    </header>
  );
}

export function EmptyState({
  title,
  body,
  ctaLabel,
  ctaTo,
}: {
  title: string;
  body: string;
  ctaLabel?: string;
  ctaTo?: string;
}) {
  return (
    <div className="panel space-y-3">
      <h2 className="font-semibold">{title}</h2>
      <p className="text-sm text-muted">{body}</p>
      {ctaLabel && ctaTo ? (
        <Link to={ctaTo} className="btn btn-primary">
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function MetaLine({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted">{children}</p>;
}
