import type { ReactNode } from "react";

import { cn } from "../cn";

/**
 * A drink order as it prints at the bar: a narrow slip with a torn top edge,
 * the ticket number, and the drink in large type.
 */
export function TicketCard({
  label,
  meta,
  title,
  children,
  className,
}: {
  /** "Ticket 2 of 5". */
  label: string;
  /** Right-aligned detail such as a running clock. */
  meta?: ReactNode;
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-label={`${label}: ${title}`}
      className={cn(
        "relative flex flex-col gap-1 rounded-b-base border border-t-0 border-line bg-raised px-3 pt-3 pb-2",
        // The torn edge: a row of small notches along the top.
        "before:absolute before:inset-x-0 before:-top-1 before:h-1 before:bg-[radial-gradient(circle_at_6px_0,transparent_5px,var(--raised)_5.5px)] before:bg-size-[12px_8px] before:bg-repeat-x",
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-2 text-caption font-semibold tracking-(--text-caption--letter-spacing) text-ink-subtle uppercase">
        <span>{label}</span>
        {meta !== undefined && <span className="tabular">{meta}</span>}
      </div>
      <p className="font-display-optical text-display-sm text-ink">{title}</p>
      {children}
    </section>
  );
}
