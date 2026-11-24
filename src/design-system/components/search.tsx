import { Search, X } from "lucide-react";
import { ToggleGroup } from "radix-ui";
import type { ReactNode } from "react";

import { cn } from "../cn";
import { ICON_STROKE } from "./icon";

/** Search input with a leading icon and a clear button. */
export function SearchField({
  label,
  value,
  onValueChange,
  placeholder,
  className,
}: {
  /** Accessible name; the placeholder alone isn't a label. */
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search
        aria-hidden
        size={20}
        strokeWidth={ICON_STROKE}
        className="pointer-events-none absolute top-1/2 left-1.5 -translate-y-1/2 text-ink-subtle"
      />
      <input
        type="search"
        aria-label={label}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onValueChange(event.target.value)}
        enterKeyHint="search"
        autoComplete="off"
        className={cn(
          "h-5.5 w-full rounded-base border border-line-strong bg-raised pr-5.5 pl-5 text-base text-ink placeholder:text-ink-subtle",
          "transition-colors duration-(--duration-fast) ease-(--ease-out) hover:border-ink-subtle focus-visible:border-focus",
          "[&::-webkit-search-cancel-button]:hidden",
        )}
      />
      {value !== "" && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onValueChange("")}
          className="absolute top-1/2 right-0.5 inline-flex size-4.5 -translate-y-1/2 items-center justify-center rounded-base text-ink-muted hover:bg-sunken"
        >
          <X aria-hidden size={16} strokeWidth={ICON_STROKE} />
        </button>
      )}
    </div>
  );
}

export type ChipOption<V extends string> = { value: V; label: ReactNode };

/**
 * Multi-select filter chips in one scrollable row. Each chip is a toggle
 * button announced as pressed or not.
 */
export function ChipGroup<V extends string>({
  label,
  value,
  onValueChange,
  options,
  layout = "scroll",
  className,
}: {
  label: string;
  value: readonly V[];
  onValueChange: (value: V[]) => void;
  options: readonly ChipOption<V>[];
  /** "scroll" keeps filters on one swipeable row on phones; "wrap" shows every chip at once. */
  layout?: "scroll" | "wrap";
  className?: string;
}) {
  return (
    <ToggleGroup.Root
      type="multiple"
      aria-label={label}
      value={[...value]}
      onValueChange={(next) =>
        onValueChange(options.filter((option) => next.includes(option.value)).map((o) => o.value))
      }
      className={cn(
        layout === "scroll"
          ? "-mx-2 flex [scrollbar-width:none] gap-1 overflow-x-auto px-2 pb-0.5 sm:mx-0 sm:flex-wrap sm:px-0"
          : "flex flex-wrap gap-1",
        className,
      )}
    >
      {options.map((option) => (
        <ToggleGroup.Item
          key={option.value}
          value={option.value}
          className={cn(
            "inline-flex h-5 shrink-0 items-center rounded-base border border-line-strong bg-raised px-1.5 text-sm font-medium whitespace-nowrap text-ink-muted",
            "transition-colors duration-(--duration-fast) ease-(--ease-out) hover:text-ink",
            "data-[state=on]:border-accent data-[state=on]:bg-accent data-[state=on]:text-on-accent",
          )}
        >
          {option.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
