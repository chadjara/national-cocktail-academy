/** Small helpers so generated questions read like a person wrote them. */

/** "a Daiquiri", "an Americano". */
export function withArticle(name: string): string {
  return `${/^[aeiou]/i.test(name) ? "an" : "a"} ${name}`;
}

/** First words of ingredient names that stay capitalized mid-sentence. */
const PROPER = new Set([
  "London",
  "Old",
  "Jamaican",
  "Martinique",
  "Demerara",
  "Bermuda",
  "Cuban",
  "Islay",
  "Irish",
  "Cognac",
  "Calvados",
  "Bénédictine",
  "Drambuie",
  "Galliano",
  "Campari",
  "Aperol",
  "Amaro",
  "Fernet-Branca",
  "Punt",
  "Lillet",
  "Champagne",
  "Prosecco",
  "Angostura",
  "Peychaud's",
  "Donn's",
  "Worcestershire",
  "Tabasco",
]);

/** An ingredient name as it reads inside a sentence: "fresh lime juice", "London dry gin", "triple sec". */
export function inSentence(name: string): string {
  const plain = name.replace(/\s*\([^)]*\)/g, "");
  const first = plain.split(" ")[0] ?? "";
  return PROPER.has(first) ? plain : plain.charAt(0).toLowerCase() + plain.slice(1);
}
