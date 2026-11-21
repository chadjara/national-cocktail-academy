import { liveQuery } from "dexie";
import { useEffect, useState } from "react";

export type LiveQueryState<T> =
  { status: "loading" } | { status: "ready"; data: T } | { status: "error"; error: Error };

/**
 * Subscribes to an IndexedDB query and re-renders when its result changes.
 *
 * The query only runs inside an effect, so prerendered HTML always shows the
 * loading state and hydration never mismatches. Hooks in features wrap this;
 * components never call it with raw table access.
 */
export function useLiveQuery<T>(
  query: () => Promise<T>,
  deps: readonly unknown[],
): LiveQueryState<T> {
  const [state, setState] = useState<LiveQueryState<T>>({ status: "loading" });

  useEffect(() => {
    const subscription = liveQuery(query).subscribe({
      next: (data) => setState({ status: "ready", data }),
      error: (error: unknown) =>
        setState({
          status: "error",
          error: error instanceof Error ? error : new Error(String(error)),
        }),
    });
    return () => subscription.unsubscribe();
    // The caller owns the dependency list, exactly as with useEffect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
