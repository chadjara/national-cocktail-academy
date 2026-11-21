import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";
import { z } from "zod";

import { appConfig } from "./app.config";

const manifest = z
  .object({ name: z.string(), short_name: z.string(), description: z.string() })
  .parse(JSON.parse(readFileSync(resolve(process.cwd(), "public/manifest.webmanifest"), "utf8")));

describe("app config", () => {
  it("keeps the installable app's name in step with the config", () => {
    expect(manifest.name).toBe(appConfig.academy.name);
    expect(manifest.short_name).toBe(appConfig.academy.shortName);
    expect(manifest.description).toBe(appConfig.academy.tagline);
  });

  it("uses the US drinking age by default", () => {
    expect(appConfig.ageGate).toMatchObject({ mode: "confirm-age", minimumAge: 21 });
  });
});
