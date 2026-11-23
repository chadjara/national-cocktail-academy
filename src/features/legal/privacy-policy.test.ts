import { describe, expect, it } from "vitest";

import { appConfig } from "~/config/app.config";

import { policyLastUpdated, policySections, policySummary, storedOnDevice } from "./privacy-policy";

describe("privacy policy content", () => {
  it("is dated", () => {
    expect(Number.isNaN(Date.parse(policyLastUpdated))).toBe(false);
  });

  it("has a summary and a non-empty body for every section", () => {
    expect(policySummary.length).toBeGreaterThan(0);
    expect(new Set(policySections.map((s) => s.id)).size).toBe(policySections.length);
    for (const section of policySections) {
      expect(section.blocks.length, section.id).toBeGreaterThan(0);
    }
  });

  it("lists everything NCA stores on the device today", () => {
    const today = storedOnDevice.filter((entry) => entry.when === "now").map((e) => e.item);
    expect(today).toEqual(expect.arrayContaining(["Saved specs", "Bottles marked in My Bar"]));
  });

  it("keeps the official copy's address in one place", () => {
    expect(appConfig.academy.privacyPolicyUrl).toBe(
      "https://cjaratech.com/national-cocktail-academy/privacy",
    );
  });

  it("points people to the configured contact page", () => {
    const contact = policySections.find((s) => s.id === "contact");
    const links = (contact?.blocks ?? []).flatMap((b) => (b.kind === "link" ? [b.link.href] : []));
    expect(links).toEqual([appConfig.academy.contactUrl]);
  });

  it("only links out over https", () => {
    for (const section of policySections) {
      for (const block of section.blocks) {
        if (block.kind === "link") expect(block.link.href).toMatch(/^https:\/\//);
      }
    }
  });
});
