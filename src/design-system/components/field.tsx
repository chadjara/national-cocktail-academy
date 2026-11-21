import { Label as RadixLabel } from "radix-ui";
import {
  createContext,
  useContext,
  useId,
  type ComponentPropsWithRef,
  type ReactNode,
} from "react";

import { cn } from "../cn";

type FieldContextValue = {
  controlId: string;
  hintId: string;
  errorId: string;
  hasHint: boolean;
  error: string | undefined;
};

const FieldContext = createContext<FieldContextValue | null>(null);

function useFieldContext(): FieldContextValue | null {
  return useContext(FieldContext);
}

/**
 * Wires a label, optional hint and optional error to a single control with
 * the right ids and aria attributes. Inputs inside pick these up
 * automatically.
 */
export function Field({
  label,
  hint,
  error,
  className,
  children,
}: {
  label: string;
  hint?: string | undefined;
  error?: string | undefined;
  className?: string;
  children: ReactNode;
}) {
  const id = useId();
  const value: FieldContextValue = {
    controlId: `${id}-control`,
    hintId: `${id}-hint`,
    errorId: `${id}-error`,
    hasHint: hint !== undefined,
    error,
  };

  return (
    <FieldContext.Provider value={value}>
      <div className={cn("flex flex-col gap-1", className)}>
        <RadixLabel.Root htmlFor={value.controlId} className="text-sm font-medium text-ink">
          {label}
        </RadixLabel.Root>
        {children}
        {hint !== undefined && (
          <p id={value.hintId} className="text-sm text-ink-subtle">
            {hint}
          </p>
        )}
        {error !== undefined && (
          <p id={value.errorId} className="text-sm font-medium text-danger">
            {error}
          </p>
        )}
      </div>
    </FieldContext.Provider>
  );
}

const controlBase =
  "w-full rounded-base border bg-raised px-2 text-base text-ink placeholder:text-ink-subtle " +
  "transition-colors duration-(--duration-fast) ease-(--ease-out) " +
  "hover:border-ink-subtle focus-visible:border-focus disabled:opacity-48";

function useControlAria(): Record<string, string | boolean | undefined> {
  const field = useFieldContext();
  if (!field) return {};
  const describedBy = [field.hasHint ? field.hintId : null, field.error ? field.errorId : null]
    .filter(Boolean)
    .join(" ");
  return {
    id: field.controlId,
    "aria-describedby": describedBy || undefined,
    "aria-invalid": field.error ? true : undefined,
  };
}

export function Input({ className, ...props }: ComponentPropsWithRef<"input">) {
  const aria = useControlAria();
  return (
    <input
      className={cn(
        controlBase,
        "h-5.5",
        aria["aria-invalid"] ? "border-danger" : "border-line-strong",
        className,
      )}
      {...aria}
      {...props}
    />
  );
}

export function Textarea({ className, rows = 4, ...props }: ComponentPropsWithRef<"textarea">) {
  const aria = useControlAria();
  return (
    <textarea
      rows={rows}
      className={cn(
        controlBase,
        "py-1.5 leading-relaxed",
        aria["aria-invalid"] ? "border-danger" : "border-line-strong",
        className,
      )}
      {...aria}
      {...props}
    />
  );
}

export { useControlAria };
