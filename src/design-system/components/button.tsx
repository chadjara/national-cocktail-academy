import { Slot } from "radix-ui";
import type { ComponentPropsWithRef, ReactNode } from "react";

import { cn } from "../cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "md" | "lg";

const base =
  "inline-flex select-none items-center justify-center gap-1 rounded-base font-medium whitespace-nowrap " +
  "transition-[background-color,border-color,color,transform] duration-(--duration-fast) ease-(--ease-out) " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-48 " +
  "aria-disabled:pointer-events-none aria-disabled:opacity-48";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-hover",
  secondary:
    "border border-line-strong bg-raised text-ink hover:border-ink-subtle hover:bg-surface",
  ghost: "text-ink hover:bg-sunken",
  danger: "bg-danger text-canvas hover:opacity-90",
};

const sizes: Record<ButtonSize, string> = {
  md: "h-5.5 px-2 text-sm",
  lg: "h-6.5 px-3 text-base",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
}: {
  variant?: ButtonVariant | undefined;
  size?: ButtonSize | undefined;
  fullWidth?: boolean | undefined;
} = {}): string {
  return cn(base, variants[variant], sizes[size], fullWidth && "w-full");
}

type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: ButtonVariant | undefined;
  size?: ButtonSize | undefined;
  fullWidth?: boolean | undefined;
  /** Render the child element (e.g. a router Link) with button styling. */
  asChild?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

/**
 * The only button in the product. `md` is 44px tall (the minimum comfortable
 * touch target); `lg` is 52px for primary actions used one-handed behind a bar.
 */
export function Button({
  variant,
  size,
  fullWidth,
  asChild = false,
  leadingIcon,
  trailingIcon,
  className,
  children,
  type,
  ...props
}: ButtonProps) {
  const classes = cn(buttonClasses({ variant, size, fullWidth }), className);

  if (asChild) {
    return (
      <Slot.Root className={classes} {...props}>
        {children}
      </Slot.Root>
    );
  }

  return (
    <button type={type ?? "button"} className={classes} {...props}>
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
}
