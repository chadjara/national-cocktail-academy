import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { assertHomePageAtRoot, hoistBasePathOutput } from "./base-path.mjs";

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "base-path-"));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("hoistBasePathOutput", () => {
  it("moves pages prerendered under the base path to the root", async () => {
    await mkdir(join(dir, "proof-bartending-academy", "library", "negroni"), { recursive: true });
    await writeFile(join(dir, "proof-bartending-academy", "index.html"), "home");
    await writeFile(
      join(dir, "proof-bartending-academy", "library", "negroni", "index.html"),
      "negroni",
    );
    await writeFile(join(dir, "__spa-fallback.html"), "fallback");

    expect(await hoistBasePathOutput(dir, "/proof-bartending-academy/")).toBe(true);
    expect(await readFile(join(dir, "index.html"), "utf8")).toBe("home");
    expect(await readFile(join(dir, "library", "negroni", "index.html"), "utf8")).toBe("negroni");
    expect(await readFile(join(dir, "__spa-fallback.html"), "utf8")).toBe("fallback");
    await expect(assertHomePageAtRoot(dir)).resolves.toBeUndefined();
  });

  it("does nothing at the root base path", async () => {
    await writeFile(join(dir, "index.html"), "home");
    expect(await hoistBasePathOutput(dir, "/")).toBe(false);
  });

  it("refuses to overwrite a file that already exists at the root", async () => {
    await mkdir(join(dir, "app"), { recursive: true });
    await writeFile(join(dir, "app", "index.html"), "nested");
    await writeFile(join(dir, "index.html"), "existing");
    await expect(hoistBasePathOutput(dir, "/app/")).rejects.toThrow();
  });
});

describe("assertHomePageAtRoot", () => {
  it("fails the build when the home page is missing", async () => {
    await expect(assertHomePageAtRoot(dir)).rejects.toThrow(/404/);
  });
});
