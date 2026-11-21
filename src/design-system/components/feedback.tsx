import { Progress as RadixProgress } from "radix-ui";
import type { ReactNode } from "react";

import { cn } from "../cn";

export function ProgressBar({
  label,
  value,
  max = 100,
  tone = "accent",
  showValue = false,
  className,
}: {
  label: string;
  value: number;
  max?: number;
  tone?: "accent" | "success" | "brass";
  showValue?: boolean;
  className?: string;
}) {
  const clamped = Math.min(Math.max(value, 0), max);
  const percent = max === 0 ? 0 : Math.round((clamped / max) * 100);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="text-ink-muted">{label}</span>
        {showValue && <span className="font-medium text-ink tabular">{percent}%</span>}
      </div>
      <RadixProgress.Root
        value={clamped}
        max={max}
        aria-label={label}
        className="relative h-1 overflow-hidden rounded-full bg-sunken"
      >
        <RadixProgress.Indicator
          className={cn(
            "h-full origin-left transition-transform duration-(--duration-slow) ease-(--ease-out)",
            tone === "accent" && "bg-accent",
            tone === "success" && "bg-success",
            tone === "brass" && "bg-brass",
          )}
          style={{ transform: `scaleX(${percent / 100})` }}
        />
      </RadixProgress.Root>
    </div>
  );
}

/**
 * Placeholder that matches the shape of the content it stands in for, so the
 * page doesn't jump when data arrives.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-shimmer rounded-base bg-sunken bg-[linear-gradient(90deg,transparent_0%,var(--line)_50%,transparent_100%)] bg-size-[200%_100%]",
        className,
      )}
    />
  );
}

/** Wraps skeletons so assistive tech hears one "Loading" instead of nothing. */
export function LoadingRegion({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

type StateProps = {
  /** Match the surrounding outline; defaults to a section-level heading. */
  headingLevel?: "h1" | "h2" | "h3" | "h4";
  icon: ReactNode;
  title: string;
  description: ReactNode;
  action?: ReactNode;
  className?: string;
};

/** Shown when there is nothing yet. Always says what to do next. */
export function EmptyState({
  headingLevel: Title = "h2",
  icon,
  title,
  description,
  action,
  className,
}: StateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-2 rounded-base border border-dashed border-line-strong p-4 sm:items-center sm:text-center",
        className,
      )}
    >
      <span className="inline-flex size-6 items-center justify-center rounded-base bg-sunken text-ink-muted">
        {icon}
      </span>
      <div className="flex max-w-60 flex-col gap-1">
        <Title className="text-heading-sm font-semibold text-ink">{title}</Title>
        <div className="text-sm text-ink-muted">{description}</div>
      </div>
      {action}
    </div>
  );
}

/** Shown when something failed. Says what happened and how to recover. */
export function ErrorState({
  headingLevel: Title = "h2",
  icon,
  title,
  description,
  action,
  className,
}: StateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-start gap-2 rounded-base border border-danger/40 bg-danger-subtle p-4",
        className,
      )}
    >
      <span className="inline-flex text-danger">{icon}</span>
      <div className="flex flex-col gap-1">
        <Title className="text-heading-sm font-semibold text-ink">{title}</Title>
        <div className="text-sm text-ink-muted">{description}</div>
      </div>
      {action}
    </div>
  );
}
