import { getCocktail } from "../../index";
import { glassLabels, iceLabels, methodLabels } from "../../taxonomy";
import { points, text } from "../helpers";
import type { CourseInput, DrillFacet, LessonInput } from "../schema";

/** One drink taught in a family course, with the one thing to take away from it. */
export type CoreDrink = { id: string; focus: string };

type FamilyCourseDefinition = Omit<CourseInput, "group" | "lessons"> & {
  intro: LessonInput;
  drinks: readonly CoreDrink[];
};

const DRINK_FACETS: DrillFacet[] = ["amount", "method", "glass", "ice", "garnish"];
const REVIEW_FACETS: DrillFacet[] = ["ingredient", "glass", "amount", "garnish", "method", "ice"];

/**
 * A drink-family course: an authored introduction to the family, one lesson
 * per core drink (the live spec plus questions generated from it), and a
 * review across every drink. Because the lessons read the Library spec, the
 * course and the Library can never disagree.
 */
export function familyCourse({ intro, drinks, ...course }: FamilyCourseDefinition): CourseInput {
  const drinkLessons = drinks.map(({ id, focus }): LessonInput => {
    const cocktail = getCocktail(id);
    if (!cocktail) throw new Error(`Course ${course.id} teaches an unknown cocktail: ${id}`);
    return {
      id,
      title: cocktail.name,
      summary: `${methodLabels[cocktail.method]} · ${glassLabels[cocktail.glass].toLowerCase()} · ${iceLabels[cocktail.ice].toLowerCase()}`,
      blocks: [
        text(focus),
        { kind: "cocktail", cocktailId: id },
        { kind: "drill", cocktailIds: [id], facets: DRINK_FACETS },
      ],
    };
  });

  const names = drinks.map(({ id }) => getCocktail(id)?.name ?? id);
  const review: LessonInput = {
    id: "review",
    title: `${course.title} review`,
    summary: `Specs, glasses and garnishes across all ${drinks.length} drinks.`,
    blocks: [
      text(
        `One question for each drink in the course, drawn from its spec. Get them all right and you can make every one of them from memory.`,
      ),
      points(names, "In this review"),
      {
        kind: "drill",
        cocktailIds: drinks.map(({ id }) => id),
        facets: REVIEW_FACETS,
        mode: "rotate",
      },
    ],
  };

  return { ...course, group: "families", lessons: [intro, ...drinkLessons, review] };
}
