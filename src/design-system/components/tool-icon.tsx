import type { ReactNode } from "react";

import { ICON_STROKE } from "./icon";

export type ToolShape =
  | "jigger"
  | "boston-shaker"
  | "cobbler-shaker"
  | "hawthorne-strainer"
  | "julep-strainer"
  | "fine-strainer"
  | "barspoon"
  | "mixing-glass"
  | "muddler"
  | "peeler"
  | "channel-knife"
  | "paring-knife"
  | "speed-pourer"
  | "ice-scoop"
  | "bar-mat"
  | "citrus-press";

/**
 * Line drawings of bar tools on Lucide's 24px grid at the shared stroke, to
 * sit alongside the glassware drawings.
 */
const shapes: Record<ToolShape, ReactNode> = {
  jigger: (
    <>
      <path d="M7 3h10l-3.5 8.5h-3z" />
      <path d="M10.5 12.5h3L17 21H7z" />
    </>
  ),
  "boston-shaker": (
    <>
      <path d="M6 8h12l-1.4 13H7.4z" />
      <path d="M8.5 3h7l-.6 5H9.1z" />
    </>
  ),
  "cobbler-shaker": (
    <>
      <path d="M7 10h10l-1.2 11H8.2z" />
      <path d="M7.5 10c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" />
      <path d="M10.5 3h3v3h-3z" />
    </>
  ),
  "hawthorne-strainer": (
    <>
      <circle cx="10" cy="11" r="6" />
      <path d="M16 11h6" />
      <path d="M5.5 14.5c1 .8 2 .8 3 0s2-.8 3 0 2 .8 3 0" />
    </>
  ),
  "julep-strainer": (
    <>
      <ellipse cx="9" cy="12" rx="6" ry="4.5" />
      <path d="M15 12h7" />
      <path d="M7 11h.01M10 11h.01M8.5 13.5h.01M11.5 13.5h.01" />
    </>
  ),
  "fine-strainer": (
    <>
      <path d="M4 7h12l-6 11z" />
      <path d="M16 7h6" />
      <path d="M7 10h6M8.5 13h3" />
    </>
  ),
  barspoon: (
    <>
      <path d="M12 2v14" />
      <ellipse cx="12" cy="19" rx="2" ry="2.5" />
      <path d="M11 5.5l2 1M11 8.5l2 1M11 11.5l2 1" />
    </>
  ),
  "mixing-glass": (
    <>
      <path d="M6 5h12v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z" />
      <path d="M6 5 4.5 3.5" />
      <path d="M9.5 8v10M14.5 8v10" />
    </>
  ),
  muddler: (
    <>
      <path d="M10.5 2h3v13h-3z" />
      <path d="M9 15h6v6H9z" />
    </>
  ),
  peeler: (
    <>
      <path d="M12 13v9" />
      <path d="M12 13 7 4M12 13l5-9" />
      <path d="M7 4h10" />
    </>
  ),
  "channel-knife": (
    <>
      <path d="M3 21l8-8" />
      <path d="M11 13l5-5a2.5 2.5 0 0 1 3.5 3.5l-5 5z" />
      <path d="M16.5 10.5h.01" />
    </>
  ),
  "paring-knife": (
    <>
      <path d="M3 21l5-5" />
      <path d="M8 16 19 5c1.5 2.5.5 5-1.5 7L12 17.5z" />
    </>
  ),
  "speed-pourer": (
    <>
      <path d="M9.5 22v-8h5v8" />
      <path d="M11 14 13.5 3l.5 11" />
    </>
  ),
  "ice-scoop": (
    <>
      <path d="M3 8h11l3 4-3 4H3z" />
      <path d="M17 12h5" />
    </>
  ),
  "bar-mat": (
    <>
      <rect x="3" y="7" width="18" height="10" rx="1" />
      <path d="M7 10h.01M11 10h.01M15 10h.01M9 14h.01M13 14h.01M17 14h.01" />
    </>
  ),
  "citrus-press": (
    <>
      <path d="M3 11h10a5 5 0 0 1-10 0z" />
      <path d="M13 11h8M13 9h8" />
      <path d="M5.5 11l1-2.5M8 11V8M10.5 11l-1-2.5" />
    </>
  ),
};

export function ToolIcon({
  tool,
  size = 24,
  label,
  className,
}: {
  tool: ToolShape;
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
      {shapes[tool]}
    </svg>
  );
}
