import type { Config } from "@react-router/dev/config";

/**
 * NCA ships only as an app (ADR 0010). With SSR and prerendering off, React
 * Router emits a single index.html that renders any route on the device,
 * which is exactly how Capacitor loads it.
 */
export default {
  appDirectory: "src/app",
  ssr: false,
  routeDiscovery: { mode: "initial" },
} satisfies Config;
