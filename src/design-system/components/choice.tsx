import { Check, Minus } from "lucide-react";
import {
  Checkbox as RadixCheckbox,
  RadioGroup as RadixRadioGroup,
  Switch as RadixSwitch,
} from "radix-ui";
import { useId, type ReactNode } from "react";

import { cn } from "../cn";

function ChoiceLabel({
  htmlFor,
  label,
  description,
}: {
  htmlFor: string;
  label: ReactNode;
  description?: ReactNode | undefined;
}) {
  return (
    <span className="flex flex-col">
      <label htmlFor={htmlFor} className="text-base text-ink">
        {label}
      </label>
      {description !== undefined && <span className="text-sm text-ink-subtle">{description}</span>}
    </span>
  );
}

export function Checkbox({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}: {
  label: ReactNode;
  description?: ReactNode;
  checked: boolean | "indeterminate";
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex min-h-5.5 items-start gap-1.5 py-1">
      <RadixCheckbox.Root
        id={id}
        checked={checked}
        onCheckedChange={(state) => onCheckedChange(state === true)}
        {...(disabled !== undefined ? { disabled } : {})}
        className={cn(
          "mt-0.5 inline-flex size-2.5 shrink-0 items-center justify-center rounded-base border border-line-strong bg-raised",
          "transition-colors duration-(--duration-fast) ease-(--ease-out)",
          "data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=checked]:text-on-accent",
          "data-[state=indeterminate]:border-accent data-[state=indeterminate]:bg-accent data-[state=indeterminate]:text-on-accent",
          "disabled:opacity-48",
        )}
      >
        <RadixCheckbox.Indicator>
          {checked === "indeterminate" ? (
            <Minus aria-hidden size={14} strokeWidth={2.5} />
          ) : (
            <Check aria-hidden size={14} strokeWidth={2.5} />
          )}
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      <ChoiceLabel htmlFor={id} label={label} description={description} />
    </div>
  );
}

export type RadioOption = { value: string; label: ReactNode; description?: ReactNode };

export function RadioGroup({
  label,
  value,
  onValueChange,
  options,
  labelSize = "sm",
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: readonly RadioOption[];
  /** "lg" sets the label as a question, for exams. */
  labelSize?: "sm" | "lg";
}) {
  const id = useId();
  return (
    <fieldset className="flex flex-col">
      <legend
        className={cn(
          "text-ink",
          labelSize === "sm"
            ? "mb-0.5 text-sm font-medium"
            : "mb-1.5 text-heading-md font-semibold",
        )}
      >
        {label}
      </legend>
      <RadixRadioGroup.Root value={value} onValueChange={onValueChange} className="flex flex-col">
        {options.map((option) => {
          const optionId = `${id}-${option.value}`;
          return (
            <div key={option.value} className="flex min-h-5.5 items-start gap-1.5 py-1">
              <RadixRadioGroup.Item
                id={optionId}
                value={option.value}
                className={cn(
                  "mt-0.5 inline-flex size-2.5 shrink-0 items-center justify-center rounded-full border border-line-strong bg-raised",
                  "transition-colors duration-(--duration-fast) ease-(--ease-out) data-[state=checked]:border-accent",
                )}
              >
                <RadixRadioGroup.Indicator className="size-1.25 rounded-full bg-accent" />
              </RadixRadioGroup.Item>
              <ChoiceLabel
                htmlFor={optionId}
                label={option.label}
                description={option.description}
              />
            </div>
          );
        })}
      </RadixRadioGroup.Root>
    </fieldset>
  );
}

export function Switch({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}: {
  label: ReactNode;
  description?: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex min-h-5.5 items-center justify-between gap-2 py-1">
      <ChoiceLabel htmlFor={id} label={label} description={description} />
      <RadixSwitch.Root
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        {...(disabled !== undefined ? { disabled } : {})}
        className={cn(
          "relative inline-flex h-3.5 w-5.5 shrink-0 items-center rounded-full border border-line-strong bg-sunken p-0.25",
          "transition-colors duration-(--duration-base) ease-(--ease-out)",
          "disabled:opacity-48 data-[state=checked]:border-accent data-[state=checked]:bg-accent",
        )}
      >
        <RadixSwitch.Thumb
          className={cn(
            "block size-2.75 rounded-full bg-raised shadow-overlay",
            "transition-transform duration-(--duration-base) ease-(--ease-out)",
            "data-[state=checked]:translate-x-2",
          )}
        />
      </RadixSwitch.Root>
    </div>
  );
}
