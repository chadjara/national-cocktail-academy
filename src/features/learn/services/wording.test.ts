import { describe, expect, it } from "vitest";

import { inSentence, withArticle } from "./wording";

describe("wording", () => {
  it("picks a or an", () => {
    expect(withArticle("Daiquiri")).toBe("a Daiquiri");
    expect(withArticle("Americano")).toBe("an Americano");
    expect(withArticle("Old Fashioned")).toBe("an Old Fashioned");
  });

  it("keeps proper names capitalized and drops notes in parentheses", () => {
    expect(inSentence("Fresh lime juice")).toBe("fresh lime juice");
    expect(inSentence("London dry gin")).toBe("London dry gin");
    expect(inSentence("Triple sec (e.g. Cointreau)")).toBe("triple sec");
    expect(inSentence("Green Chartreuse")).toBe("green Chartreuse");
    expect(inSentence("Irish coffee glass")).toBe("Irish coffee glass");
  });
});
