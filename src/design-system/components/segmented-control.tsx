import { ToggleGroup } from "radix-ui";
import type { ReactNode } from "react";

import { cn } from "../cn";

export type SegmentOption<V extends string> = { value: V; label: ReactNode };

/**
 * A small set of mutually exclusive options shown side by side: oz / ml,
 * System / Light / Dark. Always has a value; it cannot be deselected.
 */
export function SegmentedControl<V extends string>({
  label,
  value,
  onValueChange,
  options,
  className,
}: {
  /** Accessible name for the group. */
  label: string;
  value: V;
  onValueChange: (value: V) => void;
  options: readonly SegmentOption<V>[];
  className?: string;
}) {
  return (
    <ToggleGroup.Root
      type="single"
      aria-label={label}
      value={value}
      onValueChange={(next) => {
        const match = options.find((option) => option.value === next);
        if (match) onValueChange(match.value);
      }}
      className={cn(
        "inline-flex h-5 w-fit items-stretch gap-0.5 rounded-base border border-line bg-sunken p-0.5",
        className,
      )}
    >
      {options.map((option) => (
        <ToggleGroup.Item
          key={option.value}
          value={option.value}
          className={cn(
            "inline-flex min-w-5 items-center justify-center rounded-base px-1.5 text-sm font-medium text-ink-muted",
            "transition-colors duration-(--duration-fast) ease-(--ease-out) hover:text-ink",
            "data-[state=on]:bg-raised data-[state=on]:text-ink data-[state=on]:shadow-[0_0_0_1px_var(--line)]",
          )}
        >
          {option.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
