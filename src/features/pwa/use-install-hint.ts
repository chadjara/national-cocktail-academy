import { useCallback, useEffect, useMemo, useState } from "react";

import { installHintRepository } from "~/lib/db/meta-repository";
import { isNativeApp } from "~/lib/platform";

import { resolveInstallPlatform, type InstallPlatform } from "./install-hint";
import { isRunningInstalled } from "./service-worker";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function useInstallHint(): {
  platform: InstallPlatform;
  install: () => Promise<void>;
  dismiss: () => Promise<void>;
} {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    installHintRepository
      .getDismissedAt()
      .then((value) => {
        if (active) setDismissed(value !== undefined);
      })
      .catch(() => {
        if (active) setDismissed(false);
      });

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => {
      active = false;
      window.removeEventListener("beforeinstallprompt", onPrompt);
    };
  }, []);

  // Until the dismissal flag has loaded from the device, show nothing; this
  // also keeps prerendered HTML and the first client render identical.
  const platform = useMemo<InstallPlatform>(
    () =>
      dismissed === null
        ? "none"
        : resolveInstallPlatform({
            userAgent: navigator.userAgent,
            maxTouchPoints: navigator.maxTouchPoints,
            isInstalled: isRunningInstalled(),
            isNativeApp: isNativeApp(),
            hasDeferredPrompt: deferred !== null,
            dismissed,
          }),
    [deferred, dismissed],
  );

  const install = useCallback(async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  }, [deferred]);

  const dismiss = useCallback(async () => {
    setDismissed(true);
    await installHintRepository.markDismissed();
  }, []);

  return { platform, install, dismiss };
}
