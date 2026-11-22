import type { ReactNode } from "react";

import { ICON_STROKE } from "./icon";

export type GlassShape =
  | "cocktail"
  | "coupe"
  | "rocks"
  | "highball"
  | "collins"
  | "flute"
  | "wine"
  | "copper-mug"
  | "julep-cup"
  | "hurricane"
  | "irish-coffee";

/**
 * Line drawings of bar glassware, drawn on Lucide's 24px grid at the same
 * stroke so they sit with the rest of the icon set. These stand in for
 * photography: honest, consistent, and they teach the glass.
 */
const shapes: Record<GlassShape, ReactNode> = {
  cocktail: (
    <>
      <path d="M4 4h16l-8 9z" />
      <path d="M12 13v7M8 20h8" />
    </>
  ),
  coupe: (
    <>
      <path d="M4 5h16c0 4.4-3.6 7-8 7s-8-2.6-8-7z" />
      <path d="M12 12v8M8 20h8" />
    </>
  ),
  rocks: (
    <>
      <path d="M5 8h14l-1 12H6z" />
      <path d="M6.6 13h10.8" />
    </>
  ),
  highball: (
    <>
      <path d="M7 3h10l-1 18H8z" />
      <path d="M7.6 9h8.8" />
    </>
  ),
  collins: (
    <>
      <path d="M8 2h8v20H8z" />
      <path d="M8 8h8" />
    </>
  ),
  flute: (
    <>
      <path d="M9.5 2h5c0 6-1 9-2.5 10-1.5-1-2.5-4-2.5-10z" />
      <path d="M12 12v8M9 20h6" />
    </>
  ),
  wine: (
    <>
      <path d="M7 3h10c0 5-2 8-5 8s-5-3-5-8z" />
      <path d="M12 11v9M8.5 20h7" />
    </>
  ),
  "copper-mug": (
    <>
      <path d="M5 6h11v14H5z" />
      <path d="M16 9h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2" />
    </>
  ),
  "julep-cup": (
    <>
      <path d="M6 5h12l-1.5 15h-9z" />
      <path d="M6.4 9h11.2" />
    </>
  ),
  hurricane: (
    <>
      <path d="M8.5 2h7c-.4 3-2 5-2 7 0 2.4 2.5 4 2.5 6.5 0 2-1.8 3.5-4 3.5s-4-1.5-4-3.5C8 13 10.5 11.4 10.5 9c0-2-1.6-4-2-7z" />
      <path d="M12 19v2M9.5 21.5h5" />
    </>
  ),
  "irish-coffee": (
    <>
      <path d="M6 4h10v8a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4z" />
      <path d="M16 6h1.5a2.5 2.5 0 0 1 0 5H16M11 16v4M8 20h6" />
    </>
  ),
};

export function GlassIcon({
  glass,
  size = 24,
  label,
  className,
}: {
  glass: GlassShape;
  size?: number;
  /** Pass a label when the icon carries meaning on its own; omit when text sits beside it. */
  label?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={ICON_STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...(label !== undefined ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      {shapes[glass]}
    </svg>
  );
}
