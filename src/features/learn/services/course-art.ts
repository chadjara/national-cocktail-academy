import { drinkPhotoSrc, getDrinkPhoto, getScenePhoto, scenePhotoSrc } from "~/content/photos";
import type { Course } from "~/content/curriculum";
import { familyTones } from "~/content/taxonomy";
import type { Tone } from "~/design-system";

export type CourseArt = { tone: Tone; photo?: { src: string; alt: string } };

/** Foundations courses get a scene; drink-family courses get their signature drink. */
const COVERS: Record<string, { tone: Tone; scene?: string; drink?: string }> = {
  "bar-tools": { tone: "charcoal", scene: "bar-tools" },
  "glassware-and-ice": { tone: "slate", scene: "glassware-and-ice" },
  technique: { tone: "charcoal", scene: "technique" },
  spirits: { tone: "amber", scene: "spirits" },
  garnishes: { tone: "emerald", scene: "garnishes" },
  service: { tone: "oxblood", scene: "service" },
  sours: { tone: "citrus", drink: "clover-club" },
  "martinis-and-manhattans": { tone: "crimson", drink: "manhattan" },
  "old-fashioneds": { tone: "amber", drink: "old-fashioned" },
  highballs: { tone: "copper", drink: "cuba-libre" },
  "fizzes-and-collinses": { tone: "slate", drink: "ramos-fizz" },
  "juleps-and-smashes": { tone: "emerald", drink: "mojito" },
  tiki: { tone: "teal", scene: "tiki" },
  sparkling: { tone: "champagne", drink: "spritz" },
  "after-dinner": { tone: "mocha", drink: "espresso-martini" },
};

export function courseArt(course: Course): CourseArt {
  const cover = COVERS[course.id];
  const tone = cover?.tone ?? (course.family ? familyTones[course.family] : "charcoal");
  if (cover?.scene) {
    const scene = getScenePhoto(cover.scene);
    if (scene) return { tone, photo: { src: scenePhotoSrc(scene.id, "small"), alt: scene.alt } };
  }
  if (cover?.drink && getDrinkPhoto(cover.drink)) {
    return { tone, photo: { src: drinkPhotoSrc(cover.drink), alt: "" } };
  }
  return { tone };
}

/** Courses whose cover is a photo, for the integrity test. */
export const coveredCourseIds = Object.keys(COVERS);
