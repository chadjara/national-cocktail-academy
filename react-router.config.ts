import type { Config } from "@react-router/dev/config";

import { basePath } from "./build.config.mjs";
import { prerenderPaths } from "./src/app/prerender";

export default {
  appDirectory: "src/app",
  ssr: false,
  basename: basePath,
  routeDiscovery: { mode: "initial" },
  prerender: prerenderPaths,
} satisfies Config;
