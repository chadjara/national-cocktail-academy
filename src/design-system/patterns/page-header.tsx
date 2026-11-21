import type { ReactNode } from "react";

import { cn } from "../cn";
import { Display, Eyebrow } from "../components/typography";

export function PageHeader({
  eyebrow,
  title,
  lede,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-2 pb-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="flex max-w-80 flex-col gap-1">
        {eyebrow !== undefined && <Eyebrow tone="accent">{eyebrow}</Eyebrow>}
        <Display size="lg">{title}</Display>
        {lede !== undefined && <p className="text-lg text-ink-muted">{lede}</p>}
      </div>
      {actions !== undefined && <div className="flex shrink-0 gap-1">{actions}</div>}
    </header>
  );
}
