import { useEffect } from "react";

import { finishLaunch } from "~/lib/native";

/** Ends the iOS launch screen once the first screen has rendered. Mount once. */
export function useAppLaunch(): void {
  useEffect(() => {
    finishLaunch();
  }, []);
}
