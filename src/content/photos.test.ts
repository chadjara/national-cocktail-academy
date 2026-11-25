import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { getCocktail } from "./index";
import { drinkPhotos, photoCreditSchema, scenePhotos, scenePhotoSchema } from "./photos";

const publicDir = join(__dirname, "../../public");

describe("photos", () => {
  it("every entry is valid, credited and licensed for use in an app", () => {
    for (const photo of drinkPhotos) {
      expect(photoCreditSchema.safeParse(photo).success, photo.id).toBe(true);
      expect(getCocktail(photo.id), `${photo.id} is a drink`).toBeDefined();
      if (photo.license !== "Owner's photo") expect(photo.licenseUrl, photo.id).toBeDefined();
    }
    for (const photo of scenePhotos)
      expect(scenePhotoSchema.safeParse(photo).success, photo.id).toBe(true);
  });

  it("every entry has its files, and every file has an entry", () => {
    for (const photo of drinkPhotos) {
      for (const file of [`${photo.id}.webp`, `${photo.id}-thumb.webp`]) {
        expect(existsSync(join(publicDir, "images/drinks", file)), file).toBe(true);
      }
    }
    for (const photo of scenePhotos) {
      for (const file of [`${photo.id}.webp`, `${photo.id}-small.webp`]) {
        expect(existsSync(join(publicDir, "images/scenes", file)), file).toBe(true);
      }
    }
    const drinkIds = new Set(drinkPhotos.map((p) => p.id));
    for (const file of readdirSync(join(publicDir, "images/drinks"))) {
      expect(
        drinkIds.has(file.replace(/(-thumb)?\.webp$/, "")),
        `${file} has no credit entry`,
      ).toBe(true);
    }
    const sceneIds = new Set(scenePhotos.map((p) => p.id));
    for (const file of readdirSync(join(publicDir, "images/scenes"))) {
      expect(
        sceneIds.has(file.replace(/(-small)?\.webp$/, "")),
        `${file} has no credit entry`,
      ).toBe(true);
    }
  });
});
