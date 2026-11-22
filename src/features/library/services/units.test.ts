import { describe, expect, it } from "vitest";

import { formatAmount, mlToOz, totalMl } from "./units";

describe("mlToOz (30 ml = 1 oz bar convention)", () => {
  it.each([
    [7.5, "¼"],
    [10, "⅓"],
    [15, "½"],
    [20, "⅔"],
    [22.5, "¾"],
    [30, "1"],
    [40, "1⅓"],
    [45, "1½"],
    [50, "1⅔"],
    [52.5, "1¾"],
    [60, "2"],
    [90, "3"],
    [120, "4"],
  ])("%s ml reads %s oz", (ml, oz) => {
    expect(mlToOz(ml)).toBe(oz);
  });

  it("flags amounts that don't land on a jigger line", () => {
    expect(mlToOz(25)).toBe("≈ ⅞");
    expect(mlToOz(35)).toBe("≈ 1⅛");
  });

  it("rounds up to the next whole ounce instead of printing 1 and 8/8", () => {
    expect(mlToOz(59.5)).toBe("2");
  });
});

describe("formatAmount", () => {
  it("switches ml amounts between systems", () => {
    expect(formatAmount({ unit: "ml", value: 22.5 }, "oz")).toEqual({ quantity: "¾", unit: "oz" });
    expect(formatAmount({ unit: "ml", value: 22.5 }, "ml")).toEqual({
      quantity: "22.5",
      unit: "ml",
    });
  });

  it("keeps bar units the same in both systems and pluralizes them", () => {
    expect(formatAmount({ unit: "dash", value: 1 }, "oz")).toEqual({ quantity: "1", unit: "dash" });
    expect(formatAmount({ unit: "dash", value: 2 }, "ml")).toEqual({
      quantity: "2",
      unit: "dashes",
    });
    expect(formatAmount({ unit: "barspoon", value: 0.5 }, "oz")).toEqual({
      quantity: "½",
      unit: "barspoon",
    });
    expect(formatAmount({ unit: "piece", value: 6, label: "mint leaves" }, "oz")).toEqual({
      quantity: "6",
      unit: "",
    });
    expect(formatAmount({ unit: "top" }, "oz")).toEqual({ quantity: "", unit: "Top" });
  });
});

describe("totalMl", () => {
  it("adds only measured liquid", () => {
    expect(
      totalMl([
        { unit: "ml", value: 60 },
        { unit: "ml", value: 22.5 },
        { unit: "dash", value: 2 },
        { unit: "top" },
      ]),
    ).toBe(82.5);
  });
});
