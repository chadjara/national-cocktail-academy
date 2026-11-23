import { describe, expect, it } from "vitest";

import { appConfig } from "./app.config";

describe("app config", () => {
  it("uses the US drinking age by default", () => {
    expect(appConfig.ageGate).toMatchObject({ mode: "confirm-age", minimumAge: 21 });
  });

  it("states that NCA is independent, not an accredited institution", () => {
    expect(appConfig.academy.disclaimer).toMatch(/not an accredited/);
  });
});
