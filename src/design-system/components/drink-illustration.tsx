import { useId, type ReactNode } from "react";

import type { GlassShape } from "./glass-icon";

/** What to draw. Built from a spec by features/library/services/drink-art.ts. */
export type GarnishSprite =
  | {
      kind: "wheel" | "half-slice" | "wedge" | "twist" | "spiral";
      fruit: "lemon" | "lime" | "orange" | "grapefruit";
    }
  | { kind: "rim"; texture: "salt" | "sugar" }
  | { kind: "herb"; herb: "mint" | "basil" }
  | { kind: "berries"; berry: "raspberry" | "blackberry" }
  | {
      kind:
        | "cherry"
        | "olive"
        | "pineapple"
        | "celery"
        | "coffee-beans"
        | "dust"
        | "bitters-drops"
        | "chili"
        | "ginger";
    };

export type DrinkArt = {
  glass: GlassShape;
  liquid: { color: string; opacity: number };
  foam?: { color: string; height: number };
  topLayer?: string;
  bottomLayer?: string;
  ice: "none" | "cubes" | "large-cube" | "crushed";
  bubbles: boolean;
  garnishes: GarnishSprite[];
};

type Rim = { l: number; r: number; y: number };
type Geometry = {
  outline: string;
  interior: string;
  /** Where the liquid starts and ends. */
  top: number;
  bottom: number;
  rim: Rim;
  stem?: string;
  handle?: string;
  /** Metal vessels: the drink is only seen at the top. */
  metal?: "copper" | "silver";
};

const STEM = "M50 70 L50 113 M33 115 Q50 109 67 115";

const glasses: Record<GlassShape, Geometry> = {
  cocktail: {
    outline: "M15 26 L85 26 L50 70 Z",
    interior: "M19 28 L81 28 L50 66 Z",
    top: 33,
    bottom: 66,
    rim: { l: 15, r: 85, y: 26 },
    stem: STEM,
  },
  coupe: {
    outline: "M13 30 Q13 64 50 64 Q87 64 87 30 Z",
    interior: "M16.5 32 Q16.5 61 50 61 Q83.5 61 83.5 32 Z",
    top: 37,
    bottom: 61,
    rim: { l: 13, r: 87, y: 30 },
    stem: "M50 64 L50 113 M33 115 Q50 109 67 115",
  },
  rocks: {
    outline: "M21 54 L79 54 L76 118 L24 118 Z",
    interior: "M24.5 56 L75.5 56 L73 108 L27 108 Z",
    top: 66,
    bottom: 108,
    rim: { l: 21, r: 79, y: 54 },
  },
  highball: {
    outline: "M28 22 L72 22 L70 120 L30 120 Z",
    interior: "M31.5 24 L68.5 24 L66.8 112 L33.2 112 Z",
    top: 31,
    bottom: 112,
    rim: { l: 28, r: 72, y: 22 },
  },
  collins: {
    outline: "M32 12 L68 12 L67 120 L33 120 Z",
    interior: "M35.5 14 L64.5 14 L63.6 113 L36.4 113 Z",
    top: 21,
    bottom: 113,
    rim: { l: 32, r: 68, y: 12 },
  },
  flute: {
    outline: "M37 12 L63 12 Q64 64 55 78 L45 78 Q36 64 37 12 Z",
    interior: "M40 14 L60 14 Q61 62 53 75 L47 75 Q39 62 40 14 Z",
    top: 22,
    bottom: 75,
    rim: { l: 37, r: 63, y: 12 },
    stem: "M50 78 L50 114 M35 116 Q50 110 65 116",
  },
  wine: {
    outline: "M25 20 L75 20 Q79 66 50 70 Q21 66 25 20 Z",
    interior: "M28 22 L72 22 Q75.5 63 50 67 Q24.5 63 28 22 Z",
    top: 34,
    bottom: 67,
    rim: { l: 25, r: 75, y: 20 },
    stem: "M50 70 L50 114 M33 116 Q50 110 67 116",
  },
  "copper-mug": {
    outline: "M23 42 L73 42 L71 120 L25 120 Z",
    interior: "M23 42 L73 42 L73 47 L23 47 Z",
    top: 42,
    bottom: 47,
    rim: { l: 23, r: 73, y: 42 },
    handle: "M72 55 Q91 57 89 80 Q87 101 71 102",
    metal: "copper",
  },
  "julep-cup": {
    outline: "M27 40 L73 40 L69 120 L31 120 Z",
    interior: "M27 40 L73 40 L73 44 L27 44 Z",
    top: 40,
    bottom: 44,
    rim: { l: 27, r: 73, y: 40 },
    metal: "silver",
  },
  hurricane: {
    outline:
      "M30 14 Q22 38 33 56 Q42 70 36 88 Q33 101 46 104 L54 104 Q67 101 64 88 Q58 70 67 56 Q78 38 70 14 Z",
    interior:
      "M32.5 16 Q25 38 35.5 55.5 Q44.5 70 38.5 88 Q36 99 47 101.5 L53 101.5 Q64 99 61.5 88 Q55.5 70 64.5 55.5 Q75 38 67.5 16 Z",
    top: 24,
    bottom: 101.5,
    rim: { l: 30, r: 70, y: 14 },
    stem: "M50 104 L50 114 M35 116 Q50 110 65 116",
  },
  "irish-coffee": {
    outline: "M29 28 L71 28 L67 88 Q50 95 33 88 Z",
    interior: "M32 30 L68 30 L64.5 86 Q50 92 35.5 86 Z",
    top: 34,
    bottom: 90,
    rim: { l: 29, r: 71, y: 28 },
    handle: "M69 38 Q86 40 84 57 Q82 72 66 74",
    stem: "M50 92 L50 111 M35 113 Q50 107 65 113",
  },
};

const FRUIT: Record<"lemon" | "lime" | "orange" | "grapefruit", { peel: string; flesh: string }> = {
  lemon: { peel: "#e8c21c", flesh: "#f7e88a" },
  lime: { peel: "#5f9e2f", flesh: "#c9e27f" },
  orange: { peel: "#ee8418", flesh: "#f9bf6a" },
  grapefruit: { peel: "#ec6a4a", flesh: "#f7a58f" },
};

/** A tiny deterministic scatter so bubbles and crushed ice look the same every render. */
function scatter(count: number, seed: number): [number, number][] {
  let s = seed;
  const next = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return Array.from({ length: count }, () => [next(), next()] as [number, number]);
}

function Ice({ g, kind }: { g: Geometry; kind: DrinkArt["ice"] }) {
  const { l, r } = g.rim;
  const width = r - l;
  const cube = (x: number, y: number, s: number, key: string) => (
    <rect
      key={key}
      x={x}
      y={y}
      width={s}
      height={s}
      rx={s * 0.18}
      fill="#ffffff"
      fillOpacity={0.38}
      stroke="#ffffff"
      strokeOpacity={0.7}
      strokeWidth={0.8}
    />
  );
  if (kind === "cubes") {
    const s = width * 0.3;
    return (
      <g>
        {cube(l + width * 0.14, g.top - s * 0.25, s, "a")}
        {cube(l + width * 0.5, g.top + s * 0.15, s, "b")}
        {cube(l + width * 0.24, g.top + s * 0.95, s, "c")}
        {g.bottom - g.top > s * 3 && cube(l + width * 0.48, g.top + s * 1.7, s, "d")}
      </g>
    );
  }
  if (kind === "large-cube") {
    const s = width * 0.56;
    return cube(l + (width - s) / 2, g.top - s * 0.12, s, "big");
  }
  if (kind === "crushed") {
    return (
      <g fill="#ffffff" fillOpacity={0.5}>
        {scatter(46, 7).map(([px, py], i) => (
          <circle
            key={i}
            cx={l + 3 + px * (width - 6)}
            cy={g.top - 4 + py * (g.bottom - g.top + 4)}
            r={1.4 + (i % 3)}
          />
        ))}
      </g>
    );
  }
  return null;
}

function Garnish({ sprite, g }: { sprite: GarnishSprite; g: Geometry }) {
  const { l, r, y } = g.rim;
  const cx = (l + r) / 2;
  switch (sprite.kind) {
    case "wheel": {
      const f = FRUIT[sprite.fruit];
      return (
        <g transform={`translate(${r - 3} ${y - 2})`}>
          <circle r={10} fill={f.peel} />
          <circle r={8} fill={f.flesh} />
          {[0, 45, 90, 135].map((a) => (
            <line
              key={a}
              x1={-7}
              y1={0}
              x2={7}
              y2={0}
              stroke={f.peel}
              strokeOpacity={0.45}
              strokeWidth={0.7}
              transform={`rotate(${a})`}
            />
          ))}
        </g>
      );
    }
    case "half-slice": {
      const f = FRUIT[sprite.fruit];
      return (
        <g transform={`translate(${r - 6} ${y + 1}) rotate(-20)`}>
          <path d="M-11 0 A11 11 0 0 1 11 0 Z" fill={f.peel} />
          <path d="M-9 0 A9 9 0 0 1 9 0 Z" fill={f.flesh} />
        </g>
      );
    }
    case "wedge": {
      const f = FRUIT[sprite.fruit];
      return (
        <g transform={`translate(${r - 2} ${y - 1}) rotate(25)`}>
          <path d="M-9 0 Q0 -12 9 0 Z" fill={f.peel} />
          <path d="M-7 -0.5 Q0 -9 7 -0.5 Z" fill={f.flesh} />
        </g>
      );
    }
    case "twist": {
      const f = FRUIT[sprite.fruit];
      return (
        <path
          d={`M${r - 9} ${y - 5} q6 -4 9 1 q3 5 -2 9 q-5 4 1 8`}
          fill="none"
          stroke={f.peel}
          strokeWidth={3}
          strokeLinecap="round"
        />
      );
    }
    case "spiral": {
      const f = FRUIT[sprite.fruit];
      const x = r - 8;
      const h = Math.min(48, g.bottom - y);
      const d = Array.from({ length: 6 }, (_, i) => `q${i % 2 ? -7 : 7} ${h / 12} 0 ${h / 6}`).join(
        " ",
      );
      return (
        <path
          d={`M${x} ${y - 6} ${d}`}
          fill="none"
          stroke={f.peel}
          strokeWidth={2.4}
          strokeLinecap="round"
        />
      );
    }
    case "rim":
      return (
        <line
          x1={l + 1}
          y1={y + 0.5}
          x2={sprite.texture === "salt" ? cx : r - 1}
          y2={y + 0.5}
          stroke="#ffffff"
          strokeWidth={3}
          strokeDasharray="1.2 1.2"
          strokeLinecap="round"
          opacity={0.95}
        />
      );
    case "cherry":
      return (
        <g
          transform={`translate(${g.metal ? cx + 6 : cx + 8} ${g.metal ? y - 6 : Math.min(g.top + 4, g.bottom - 6)})`}
        >
          <path d="M0 -4 Q2 -12 8 -15" fill="none" stroke="#5b3a1a" strokeWidth={1} />
          <circle r={4.2} fill="#8f0b1d" />
          <circle cx={-1.3} cy={-1.3} r={1.1} fill="#ffffff" fillOpacity={0.6} />
        </g>
      );
    case "olive":
      return (
        <g>
          <line
            x1={r + 2}
            y1={y - 12}
            x2={cx - 8}
            y2={g.bottom - 6}
            stroke="#9b8a6a"
            strokeWidth={1}
          />
          {[0.55, 0.8].map((t) => {
            const ox = r + 2 + (cx - 8 - (r + 2)) * t;
            const oy = y - 12 + (g.bottom - 6 - (y - 12)) * t;
            return (
              <g key={t}>
                <ellipse cx={ox} cy={oy} rx={4} ry={3.2} fill="#7d8f2a" />
                <circle cx={ox + 1.6} cy={oy - 0.4} r={1.1} fill="#c0392b" />
              </g>
            );
          })}
        </g>
      );
    case "herb": {
      const color = sprite.herb === "mint" ? "#3f8f3a" : "#2f7d32";
      return (
        <g transform={`translate(${l + 9} ${y - 2})`}>
          <path d="M0 6 L0 -10" stroke="#2e6b2a" strokeWidth={1} />
          {[
            [-5, -8, -35],
            [5, -10, 30],
            [-4, -2, -20],
            [5, -3, 25],
            [0, -14, 0],
          ].map(([x, yy, a], i) => (
            <ellipse
              key={i}
              cx={x}
              cy={yy}
              rx={3.4}
              ry={5.2}
              fill={color}
              transform={`rotate(${a} ${x} ${yy})`}
            />
          ))}
        </g>
      );
    }
    case "pineapple":
      return (
        <g transform={`translate(${r - 4} ${y - 2}) rotate(18)`}>
          <path d="M-8 3 L8 3 L0 -10 Z" fill="#f2c94c" />
          <path
            d="M-2 -10 L-5 -19 M0 -10 L0 -21 M2 -10 L5 -19"
            stroke="#3c8d40"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </g>
      );
    case "celery":
      return (
        <g>
          <rect x={l + 8} y={y - 22} width={5} height={g.bottom - y + 16} rx={2.5} fill="#a5d06b" />
          <path
            d={`M${l + 10.5} ${y - 22} l-5 -7 M${l + 10.5} ${y - 22} l5 -8 M${l + 10.5} ${y - 22} l0 -9`}
            stroke="#5f9e2f"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </g>
      );
    case "coffee-beans":
      return (
        <g fill="#3b2314">
          {[-6, 0, 6].map((dx) => (
            <ellipse key={dx} cx={cx + dx} cy={g.top + 1.5} rx={2.4} ry={1.6} />
          ))}
        </g>
      );
    case "dust":
      return (
        <g fill="#8a5a2b">
          {scatter(14, 3).map(([px, py], i) => (
            <circle key={i} cx={cx - 12 + px * 24} cy={g.top + 0.5 + py * 3} r={0.6} />
          ))}
        </g>
      );
    case "bitters-drops":
      return (
        <g fill="#8c1c13">
          {[-8, 0, 8].map((dx) => (
            <circle key={dx} cx={cx + dx} cy={g.top + 2} r={1.6} />
          ))}
        </g>
      );
    case "berries": {
      const fill = sprite.berry === "raspberry" ? "#c2185b" : "#2b1033";
      return (
        <g transform={`translate(${r - 6} ${y - 4})`} fill={fill}>
          {[
            [0, 0],
            [3, 2],
            [-3, 2],
            [0, 4],
          ].map(([x, yy], i) => (
            <circle key={i} cx={x} cy={yy} r={2.2} />
          ))}
        </g>
      );
    }
    case "chili":
      return <path d={`M${r - 10} ${y - 3} q8 -6 14 4 q-6 0 -14 -4 Z`} fill="#c62828" />;
    case "ginger":
      return (
        <g>
          <line x1={r + 2} y1={y - 12} x2={cx} y2={g.top + 4} stroke="#9b8a6a" strokeWidth={1} />
          <rect x={r - 8} y={y - 9} width={6} height={6} rx={1} fill="#d9a441" />
        </g>
      );
  }
}

/**
 * A drink, drawn from its spec: the right glass, the color its ingredients
 * mix to, foam and layers, the ice it's served on, and its garnish. Shown
 * wherever a drink has no photo, and always accurate to the recipe.
 */
export function DrinkIllustration({
  art,
  label,
  backdrop,
  className,
}: {
  art: DrinkArt;
  /** Pass a label when the image stands alone; omit when the drink's name is beside it. */
  label?: string;
  /** A color for the soft circle behind the glass, e.g. the drink family's color. */
  backdrop?: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const g = glasses[art.glass];
  const { liquid } = art;
  const range = g.bottom - g.top;
  const foamHeight = art.foam ? Math.max(3, art.foam.height * range) : 0;

  let vessel: ReactNode;
  if (g.metal) {
    const fill = g.metal === "copper" ? `url(#${id}-copper)` : `url(#${id}-silver)`;
    vessel = (
      <>
        <path
          d={g.outline}
          fill={fill}
          stroke={g.metal === "copper" ? "#8a4b22" : "#9aa1a6"}
          strokeWidth={1.2}
        />
        {g.handle && (
          <path
            d={g.handle}
            fill="none"
            stroke={g.metal === "copper" ? "#a65a2a" : "#b8bec2"}
            strokeWidth={5}
            strokeLinecap="round"
          />
        )}
        <ellipse
          cx={(g.rim.l + g.rim.r) / 2}
          cy={g.rim.y + 1.5}
          rx={(g.rim.r - g.rim.l) / 2 - 1}
          ry={2.6}
          fill={liquid.color}
          fillOpacity={Math.max(0.5, liquid.opacity)}
        />
        {art.ice === "crushed" ? (
          <path
            d={`M${g.rim.l} ${g.rim.y + 1} Q${g.rim.l + 8} ${g.rim.y - 16} 50 ${g.rim.y - 15} Q${g.rim.r - 8} ${g.rim.y - 16} ${g.rim.r} ${g.rim.y + 1} Z`}
            fill="#ffffff"
            fillOpacity={0.92}
            stroke="#dfe6ea"
            strokeWidth={0.8}
          />
        ) : (
          art.ice !== "none" && (
            <g fill="#ffffff" fillOpacity={0.8} stroke="#dfe6ea" strokeWidth={0.6}>
              <rect x={g.rim.l + 8} y={g.rim.y - 7} width={11} height={10} rx={2} />
              <rect x={g.rim.l + 22} y={g.rim.y - 9} width={11} height={11} rx={2} />
            </g>
          )
        )}
        <path
          d={`M${g.rim.l + 5} ${g.rim.y + 10} L${g.rim.l + 7} 112`}
          stroke="#ffffff"
          strokeOpacity={0.35}
          strokeWidth={2}
          strokeLinecap="round"
        />
      </>
    );
  } else {
    vessel = (
      <>
        <clipPath id={`${id}-clip`}>
          <path d={g.interior} />
        </clipPath>
        <path d={g.outline} fill="currentColor" fillOpacity={0.05} />
        <g clipPath={`url(#${id}-clip)`}>
          {/* A light base so the drink's own color shows, whatever is behind the glass. */}
          <rect x={0} y={g.top} width={100} height={range + 2} fill="#fbf8f1" fillOpacity={0.92} />
          <rect
            x={0}
            y={g.top}
            width={100}
            height={range + 2}
            fill={art.bottomLayer ? `url(#${id}-layer)` : liquid.color}
            fillOpacity={liquid.opacity}
          />
          {art.topLayer && (
            <rect
              x={0}
              y={g.top}
              width={100}
              height={Math.max(4, range * 0.12)}
              fill={art.topLayer}
              fillOpacity={0.95}
            />
          )}
          {art.foam && (
            <rect x={0} y={g.top - 0.5} width={100} height={foamHeight} fill={art.foam.color} />
          )}
          <Ice g={g} kind={art.ice} />
          {art.bubbles &&
            scatter(16, 11).map(([px, py], i) => (
              <circle
                key={i}
                cx={g.rim.l + 4 + px * (g.rim.r - g.rim.l - 8)}
                cy={g.top + foamHeight + 3 + py * (range - foamHeight - 6)}
                r={0.7 + (i % 2) * 0.4}
                fill="#ffffff"
                fillOpacity={0.7}
              />
            ))}
        </g>
        <path
          d={g.outline}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.55}
          strokeWidth={1.3}
          strokeLinejoin="round"
        />
        {g.stem && (
          <path
            d={g.stem}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.55}
            strokeWidth={1.3}
            strokeLinecap="round"
          />
        )}
        {g.handle && (
          <path
            d={g.handle}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.55}
            strokeWidth={3}
            strokeLinecap="round"
          />
        )}
        <path
          d={`M${g.rim.l + 5} ${g.rim.y + 6} L${g.rim.l + 7} ${g.rim.y + Math.min(30, range)}`}
          stroke="#ffffff"
          strokeOpacity={0.55}
          strokeWidth={1.6}
          strokeLinecap="round"
        />
      </>
    );
  }

  return (
    <svg
      viewBox="0 0 100 130"
      className={className}
      {...(label !== undefined ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      <defs>
        <linearGradient id={`${id}-layer`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.45" stopColor={liquid.color} />
          <stop offset="1" stopColor={art.bottomLayer ?? liquid.color} />
        </linearGradient>
        <linearGradient id={`${id}-copper`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c8713a" />
          <stop offset="0.45" stopColor="#e39a62" />
          <stop offset="1" stopColor="#9a5128" />
        </linearGradient>
        <linearGradient id={`${id}-silver`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c9cfd3" />
          <stop offset="0.45" stopColor="#f2f5f7" />
          <stop offset="1" stopColor="#aab1b6" />
        </linearGradient>
      </defs>
      {backdrop && <circle cx={50} cy={70} r={46} fill={backdrop} fillOpacity={0.16} />}
      <ellipse cx={50} cy={121} rx={24} ry={2.5} fill="currentColor" fillOpacity={0.08} />
      {vessel}
      {art.garnishes.map((sprite, i) => (
        <Garnish key={i} sprite={sprite} g={g} />
      ))}
    </svg>
  );
}
