import { useEffect } from "react";

import { useToast } from "~/design-system";

import { registerServiceWorker, requestPersistentStorage } from "./service-worker";

/** Wires offline support and the "new version ready" prompt. Mount once. */
export function useAppUpdates(): void {
  const toast = useToast();

  useEffect(() => {
    registerServiceWorker((activate) => {
      toast.show({
        title: "A new version is ready",
        description:
          "Reload to get the latest lessons and fixes. Your progress stays on this device.",
        duration: Number.POSITIVE_INFINITY,
        action: { label: "Reload", altText: "Reload to update the app", onAction: activate },
      });
    });
    void requestPersistentStorage();
  }, [toast]);
}
