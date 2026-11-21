import { Tabs as RadixTabs } from "radix-ui";
import type { ReactNode } from "react";

import { cn } from "../cn";

export type TabItem = { value: string; label: ReactNode; content: ReactNode };

export function Tabs({
  label,
  items,
  defaultValue,
  className,
}: {
  label: string;
  items: readonly TabItem[];
  defaultValue?: string;
  className?: string;
}) {
  const initial = defaultValue ?? items[0]?.value;
  return (
    <RadixTabs.Root
      {...(initial !== undefined ? { defaultValue: initial } : {})}
      className={className}
    >
      <RadixTabs.List
        aria-label={label}
        className="flex [scrollbar-width:none] gap-3 overflow-x-auto border-b border-line"
      >
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            className={cn(
              "-mb-px inline-flex h-5.5 shrink-0 items-center border-b-2 border-transparent text-sm font-medium text-ink-muted",
              "transition-colors duration-(--duration-fast) ease-(--ease-out) hover:text-ink",
              "data-[state=active]:border-accent data-[state=active]:text-ink",
            )}
          >
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {items.map((item) => (
        <RadixTabs.Content key={item.value} value={item.value} className="pt-3">
          {item.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}
