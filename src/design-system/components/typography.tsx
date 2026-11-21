import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";

import { cn } from "../cn";

export type DisplaySize = "xl" | "lg" | "md" | "sm";
export type HeadingSize = "lg" | "md" | "sm";

const displaySizes: Record<DisplaySize, string> = {
  xl: "text-display-lg md:text-display-xl",
  lg: "text-display-md md:text-display-lg",
  md: "text-display-sm md:text-display-md",
  sm: "text-heading-lg md:text-display-sm",
};

const headingSizes: Record<HeadingSize, string> = {
  lg: "font-display-optical text-heading-lg font-medium",
  md: "text-heading-md font-semibold tracking-[-0.01em]",
  sm: "text-heading-sm font-semibold",
};

type HeadingLevel = "h1" | "h2" | "h3" | "h4";

/** Serif display type. Used sparingly: page titles and editorial moments. */
export function Display({
  as: Tag = "h1",
  size = "lg",
  className,
  children,
}: {
  as?: HeadingLevel;
  size?: DisplaySize;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "font-display-optical font-normal tracking-[-0.02em] text-ink",
        displaySizes[size],
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Section and component headings. `lg` is serif; `md` and `sm` are sans. */
export function Heading({
  as: Tag = "h2",
  size = "md",
  className,
  children,
  id,
}: {
  as?: HeadingLevel;
  size?: HeadingSize;
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <Tag id={id} className={cn("text-ink", headingSizes[size], className)}>
      {children}
    </Tag>
  );
}

type TextProps<T extends ElementType> = {
  as?: T;
  size?: "lg" | "base" | "sm";
  tone?: "default" | "muted" | "subtle";
} & Omit<ComponentPropsWithRef<T>, "as">;

export function Text<T extends ElementType = "p">({
  as,
  size = "base",
  tone = "default",
  className,
  ...props
}: TextProps<T>) {
  const Tag: ElementType = as ?? "p";
  return (
    <Tag
      className={cn(
        size === "lg" && "text-lg",
        size === "base" && "text-base",
        size === "sm" && "text-sm",
        tone === "default" && "text-ink",
        tone === "muted" && "text-ink-muted",
        tone === "subtle" && "text-ink-subtle",
        className,
      )}
      {...props}
    />
  );
}

/** Small uppercase label that sits above a heading, like a menu section. */
export function Eyebrow({
  className,
  tone = "muted",
  children,
}: {
  className?: string;
  tone?: "muted" | "accent" | "brass";
  children: ReactNode;
}) {
  return (
    <p
      className={cn(
        "eyebrow",
        tone === "muted" && "text-ink-subtle",
        tone === "accent" && "text-accent-text",
        tone === "brass" && "text-brass",
        className,
      )}
    >
      {children}
    </p>
  );
}
