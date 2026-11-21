import { Check, ChevronDown } from "lucide-react";
import { Select as RadixSelect } from "radix-ui";

import { cn } from "../cn";
import { useControlAria } from "./field";
import { ICON_STROKE } from "./icon";

export type SelectOption = { value: string; label: string };

export function Select({
  value,
  onValueChange,
  options,
  placeholder,
  disabled,
  className,
}: {
  value: string | undefined;
  onValueChange: (value: string) => void;
  options: readonly SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  const aria = useControlAria();

  return (
    <RadixSelect.Root
      {...(value !== undefined ? { value } : {})}
      onValueChange={onValueChange}
      {...(disabled !== undefined ? { disabled } : {})}
    >
      <RadixSelect.Trigger
        {...aria}
        className={cn(
          "inline-flex h-5.5 w-full items-center justify-between gap-1 rounded-base border bg-raised px-2 text-left text-base text-ink",
          "transition-colors duration-(--duration-fast) ease-(--ease-out) hover:border-ink-subtle",
          "disabled:opacity-48 data-[placeholder]:text-ink-subtle",
          aria["aria-invalid"] ? "border-danger" : "border-line-strong",
          className,
        )}
      >
        <RadixSelect.Value {...(placeholder !== undefined ? { placeholder } : {})} />
        <RadixSelect.Icon>
          <ChevronDown aria-hidden size={18} strokeWidth={ICON_STROKE} className="text-ink-muted" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={4}
          className={cn(
            "z-50 max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width)",
            "animate-fade-in overflow-hidden rounded-base border border-line bg-raised shadow-overlay",
          )}
        >
          <RadixSelect.Viewport className="p-0.5">
            {options.map((option) => (
              <RadixSelect.Item
                key={option.value}
                value={option.value}
                className={cn(
                  "relative flex h-5 cursor-default items-center rounded-base pr-2 pl-4 text-base text-ink outline-none select-none",
                  "data-[highlighted]:bg-sunken data-[state=checked]:font-medium",
                )}
              >
                <RadixSelect.ItemIndicator className="absolute left-1 inline-flex">
                  <Check
                    aria-hidden
                    size={16}
                    strokeWidth={ICON_STROKE}
                    className="text-accent-text"
                  />
                </RadixSelect.ItemIndicator>
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
