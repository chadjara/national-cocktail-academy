/**
 * Routes rendered to static HTML at build time. Pages that depend only on
 * bundled content belong here; pages driven by on-device data render their
 * loading shell and fill in after hydration.
 */
export function prerenderPaths(): string[] {
  return ["/", "/design-system"];
}
