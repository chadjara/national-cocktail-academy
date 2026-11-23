import { describe, expect, it } from "vitest";

import { getCocktail } from "~/content";

import { buildShareText } from "./share-text";

describe("buildShareText", () => {
  it("writes the spec the way a bartender would text it", () => {
    const negroni = getCocktail("negroni");
    if (!negroni) throw new Error("negroni missing");
    expect(buildShareText(negroni, "oz")).toEqual({
      title: "Negroni",
      text: "Negroni: 1 oz London dry gin, 1 oz Campari, 1 oz Sweet vermouth. Built, rocks glass. Garnish: half orange slice.",
      url: "https://chadjara.github.io/proof-bartending-academy/library/negroni/",
    });
  });

  it("respects the unit choice and leaves out optional lines", () => {
    const sour = getCocktail("whiskey-sour");
    if (!sour) throw new Error("whiskey-sour missing");
    const { text } = buildShareText(sour, "ml");
    expect(text).toContain("45 ml Bourbon");
    expect(text).not.toContain("Egg white");
  });
});
