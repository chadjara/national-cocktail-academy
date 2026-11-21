import type { ComponentPropsWithRef, ReactNode } from "react";

import { cn } from "../cn";

type IconButtonProps = Omit<ComponentPropsWithRef<"button">, "children" | "aria-label"> & {
  /** Required: an icon-only control must have an accessible name. */
  label: string;
  icon: ReactNode;
  variant?: "ghost" | "secondary" | undefined;
};

export function IconButton({
  label,
  icon,
  variant = "ghost",
  className,
  type,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type ?? "button"}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-5.5 shrink-0 items-center justify-center rounded-base text-ink",
        "transition-colors duration-(--duration-fast) ease-(--ease-out)",
        "disabled:pointer-events-none disabled:opacity-48",
        variant === "ghost" && "hover:bg-sunken",
        variant === "secondary" && "border border-line-strong bg-raised hover:bg-surface",
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  );
}
