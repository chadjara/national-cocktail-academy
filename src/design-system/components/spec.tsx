import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

import { cn } from "../cn";
import { ICON_STROKE } from "./icon";

/**
 * One drink in a list. The whole row is the link target, sized for a thumb.
 */
export function SpecCard({
  to,
  title,
  meta,
  leading,
  trailing,
}: {
  to: string;
  title: string;
  meta: string;
  leading: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "group flex min-h-8 items-center gap-2 rounded-base px-1.5 py-1.5",
        "transition-colors duration-(--duration-fast) ease-(--ease-out) hover:bg-surface",
      )}
    >
      <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-base border border-line bg-surface text-ink-muted">
        {leading}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-display-optical text-heading-md text-ink">{title}</span>
        <span className="truncate text-sm text-ink-subtle">{meta}</span>
      </span>
      {trailing}
      <ChevronRight
        aria-hidden
        size={20}
        strokeWidth={ICON_STROKE}
        className="shrink-0 text-ink-subtle transition-transform duration-(--duration-fast) ease-(--ease-out) group-hover:translate-x-0.5"
      />
    </Link>
  );
}

export type SpecRow = {
  quantity: string;
  unit: string;
  name: string;
  note?: string | undefined;
  optional?: boolean | undefined;
};

/**
 * The recipe itself, set like a well-printed menu: amounts in a tabular
 * column so a bartender's eye runs straight down the jigger sizes.
 */
export function SpecSheet({ rows, caption }: { rows: readonly SpecRow[]; caption: string }) {
  return (
    <table className="w-full border-collapse">
      <caption className="sr-only">{caption}</caption>
      <thead className="sr-only">
        <tr>
          <th scope="col">Amount</th>
          <th scope="col">Ingredient</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={`${row.name}-${String(index)}`} className="border-b border-line last:border-b-0">
            <td className="w-[38%] py-1.5 pr-2 text-right align-baseline whitespace-nowrap sm:w-[30%]">
              <span className="text-lg font-semibold text-ink tabular">{row.quantity}</span>
              {row.quantity !== "" && " "}
              <span className="text-sm text-ink-muted">{row.unit}</span>
            </td>
            <td className="py-1.5 align-baseline">
              <span className="text-base text-ink">{row.name}</span>
              {row.optional === true && (
                <span className="text-sm text-ink-subtle"> (optional)</span>
              )}
              {row.note !== undefined && (
                <span className="block text-sm text-ink-subtle">{row.note}</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** A labelled fact about a drink: glass, ice, method, garnish. */
export function SpecFact({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-1.5">
      {icon !== undefined && <span className="mt-0.5 shrink-0 text-ink-muted">{icon}</span>}
      <dl className="flex flex-col">
        <dt className="eyebrow text-ink-subtle">{label}</dt>
        <dd className="text-base text-ink">{value}</dd>
      </dl>
    </div>
  );
}
