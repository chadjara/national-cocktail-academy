import { appConfig } from "~/config/app.config";
import { getScenePhoto, scenePhotoSrc } from "~/content/photos";
import { PageHeader } from "~/design-system";
import { PracticeHome } from "~/features/practice/components/practice-home";

import type { Route } from "./+types/practice";

export const meta: Route.MetaFunction = () => [
  { title: `Practice · ${appConfig.academy.name}` },
  {
    name: "description",
    content: "Daily spec review, Speed Round tickets, a free-pour trainer and bar math.",
  },
];

const scene = getScenePhoto("practice");
const heroImage = scene
  ? { src: scenePhotoSrc(scene.id), alt: scene.alt, tone: "copper" as const }
  : undefined;

export default function PracticeRoute() {
  return (
    <>
      <PageHeader
        {...(heroImage ? { image: heroImage } : {})}
        eyebrow="Practice"
        title="Keep your specs sharp"
        lede="A few minutes a day: review what you've learned, build tickets against the clock, train your pour and run the numbers."
      />
      <PracticeHome />
    </>
  );
}
