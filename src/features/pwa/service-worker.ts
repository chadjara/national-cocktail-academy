/**
 * Registers the precaching service worker generated at build time
 * (scripts/postbuild.mjs). Updates never activate behind the student's back:
 * a waiting worker is surfaced, and activates only when they choose to reload.
 */
export function registerServiceWorker(onUpdateReady: (activate: () => void) => void): void {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;

  const base = import.meta.env.BASE_URL;
  let reloading = false;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (reloading) return;
    reloading = true;
    window.location.reload();
  });

  const offer = (worker: ServiceWorker) => {
    onUpdateReady(() => worker.postMessage({ type: "SKIP_WAITING" }));
  };

  navigator.serviceWorker
    .register(`${base}sw.js`, { scope: base })
    .then((registration) => {
      if (registration.waiting && navigator.serviceWorker.controller) {
        offer(registration.waiting);
      }
      registration.addEventListener("updatefound", () => {
        const installing = registration.installing;
        if (!installing) return;
        installing.addEventListener("statechange", () => {
          if (installing.state === "installed" && navigator.serviceWorker.controller) {
            offer(installing);
          }
        });
      });
    })
    .catch(() => {
      // Registration fails in some private-browsing modes. The app still works
      // online; it just won't be available offline.
    });
}

export function isRunningInstalled(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

/**
 * Asks the browser not to evict on-device data. Only requested once the app
 * is installed: browsers grant it silently then, and Firefox would otherwise
 * show a permission prompt out of context.
 */
export async function requestPersistentStorage(): Promise<boolean> {
  // `storage` is missing in older Safari despite what lib.dom says.
  if (!("storage" in navigator) || !isRunningInstalled()) return false;
  if (await navigator.storage.persisted()) return true;
  return navigator.storage.persist();
}
