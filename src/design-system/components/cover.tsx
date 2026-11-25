import type { ReactNode } from "react";

import { cn } from "../cn";
import { toneVar, type Tone } from "./tone";

/**
 * A picture with a family tone behind it: a photo when there is one, otherwise
 * whatever is passed as `fallback` (usually a drink illustration) centered on
 * the tone. With `shade`, a dark gradient rises from the bottom so text laid
 * over it stays readable.
 */
export function CoverImage({
  src,
  alt = "",
  tone,
  fallback,
  aspect = "16/9",
  shade = false,
  rounded = true,
  priority = false,
  className,
  children,
}: {
  src?: string | undefined;
  /** Empty when the picture is decorative and a heading names it. */
  alt?: string;
  tone: Tone;
  fallback?: ReactNode;
  /** "auto" lets content and min-height set the size, for heroes with text over them. */
  aspect?: "16/9" | "4/3" | "3/2" | "1/1" | "auto";
  shade?: boolean;
  rounded?: boolean;
  /** Load eagerly: for the first image on a screen. */
  priority?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn("relative isolate overflow-hidden", rounded && "rounded-base", className)}
      style={{
        ...(aspect === "auto" ? {} : { aspectRatio: aspect }),
        backgroundColor: toneVar(tone),
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 -z-10 size-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 -z-10 flex items-center justify-center text-on-image/80"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 40%, rgb(255 255 255 / 0.16), transparent 65%)`,
          }}
        >
          {fallback}
        </div>
      )}
      {shade && (
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `linear-gradient(to top, rgb(14 11 9 / 0.88) 0%, rgb(14 11 9 / 0.55) 45%, rgb(14 11 9 / 0.05) 100%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}
