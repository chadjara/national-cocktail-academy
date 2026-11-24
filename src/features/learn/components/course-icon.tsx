import type { Course } from "~/content/curriculum";
import { GlassIcon, ToolIcon } from "~/design-system";

/** The glass or tool drawn for a course, in a framed tile. */
export function CourseIcon({ icon, size = 28 }: { icon: Course["icon"]; size?: number }) {
  return (
    <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-base border border-line bg-raised text-accent-text">
      {icon.kind === "glass" ? (
        <GlassIcon glass={icon.glass} size={size} />
      ) : (
        <ToolIcon tool={icon.tool} size={size} />
      )}
    </span>
  );
}
