import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { getCocktail, listCocktails, listIngredients } from "~/content";
import { ingredientColors } from "~/content/ingredient-colors";
import { DrinkIllustration } from "~/design-system";

import { drinkArt, garnishSprites } from "./drink-art";

describe("drink illustrations", () => {
  it("every ingredient has a color", () => {
    for (const ingredient of listIngredients()) {
      expect(ingredientColors[ingredient.id], ingredient.id).toBeDefined();
    }
  });

  it("every drink's garnish turns into something to draw", () => {
    for (const cocktail of listCocktails()) {
      if (cocktail.garnish === null) continue;
      expect(
        garnishSprites(cocktail.garnish).length,
        `${cocktail.id}: ${cocktail.garnish}`,
      ).toBeGreaterThan(0);
    }
  });

  it("renders every drink without errors, with its glass and a valid color", () => {
    const html = renderToStaticMarkup(
      <div>
        {listCocktails().map((c) => (
          <DrinkIllustration key={c.id} art={drinkArt(c)} label={c.name} />
        ))}
      </div>,
    );
    expect(html.match(/<svg/g)).toHaveLength(listCocktails().length);
    for (const cocktail of listCocktails())
      expect(drinkArt(cocktail).liquid.color).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("reads the spec: Negroni is red with an orange slice; Espresso Martini has crema and beans", () => {
    const negroni = drinkArt(getCocktail("negroni") ?? (undefined as never));
    const [r, g, b] = [1, 3, 5].map((i) =>
      Number.parseInt(negroni.liquid.color.slice(i, i + 2), 16),
    ) as [number, number, number];
    expect(r).toBeGreaterThan(g + 40);
    expect(r).toBeGreaterThan(b + 40);
    expect(negroni.garnishes).toContainEqual({ kind: "half-slice", fruit: "orange" });
    expect(negroni.ice).toBe("cubes");

    const espresso = drinkArt(getCocktail("espresso-martini") ?? (undefined as never));
    expect(espresso.foam).toBeDefined();
    expect(espresso.garnishes).toContainEqual({ kind: "coffee-beans" });

    expect(garnishSprites("Lemon peel or a green olive")).toEqual([
      { kind: "twist", fruit: "lemon" },
    ]);
    expect(garnishSprites("Half salt rim (optional)")).toEqual([{ kind: "rim", texture: "salt" }]);
    expect(drinkArt(getCocktail("gin-and-tonic") ?? (undefined as never)).bubbles).toBe(true);
  });
});
