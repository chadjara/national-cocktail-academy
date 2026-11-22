import { useSyncExternalStore } from "react";

const subscribe = () => () => undefined;

/**
 * False in prerendered HTML and during the hydration render, true after.
 * Use it to defer anything the static HTML couldn't know, such as the URL's
 * query string, so hydration always matches the prerendered markup.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
