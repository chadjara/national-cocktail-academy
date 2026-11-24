import type { ComponentPropsWithRef, ReactNode } from "react";

import { cn } from "../cn";

/**
 * A bordered surface. Cards never carry shadows; elevation is reserved for
 * things that float above the page (menus, dialogs, toasts).
 */
export function Card({
  as: Tag = "div",
  padding = "md",
  interactive = false,
  className,
  children,
  ...labelling
}: {
  as?: "div" | "section" | "article" | "li";
  /** Names a section or article card for assistive tech. */
  "aria-labelledby"?: string;
  "aria-label"?: string;
  padding?: "none" | "sm" | "md" | "lg";
  /** Adds hover and focus-within affordances for cards that wrap a link. */
  interactive?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      {...labelling}
      className={cn(
        "rounded-base border border-line bg-surface",
        padding === "sm" && "p-2",
        padding === "md" && "p-3",
        padding === "lg" && "p-4",
        interactive &&
          "relative transition-colors duration-(--duration-fast) ease-(--ease-out) hover:border-line-strong hover:bg-raised has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-focus",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger" | "brass";

const badgeTones: Record<BadgeTone, string> = {
  neutral: "bg-sunken text-ink-muted",
  accent: "bg-accent-subtle text-accent-text",
  success: "bg-success-subtle text-success",
  warning: "bg-warning-subtle text-warning",
  danger: "bg-danger-subtle text-danger",
  brass: "bg-brass-subtle text-brass",
};

export function Badge({
  tone = "neutral",
  icon,
  children,
  className,
}: {
  tone?: BadgeTone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-3 items-center gap-0.5 rounded-base px-1 text-caption font-semibold whitespace-nowrap",
        badgeTones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-line", className)} />;
}

export function TextLink({ className, children, ...props }: ComponentPropsWithRef<"a">) {
  return (
    <a
      className={cn(
        "font-medium text-accent-text underline decoration-1 underline-offset-[3px] hover:decoration-2",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
