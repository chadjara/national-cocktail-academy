import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const { version } = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8"),
) as {
  version: string;
};

export default defineConfig({
  // The app version, printed on certificates and backups so they record which content they came from.
  define: { __APP_VERSION__: JSON.stringify(version) },
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    target: "es2022",
  },
});
