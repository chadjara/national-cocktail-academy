import { appConfig } from "~/config/app.config";
import { getScenePhoto, scenePhotoSrc } from "~/content/photos";
import { listCourses } from "~/content/curriculum";
import { PageHeader } from "~/design-system";
import { CourseList } from "~/features/learn/components/course-list";

import type { Route } from "./+types/learn";

export const meta: Route.MetaFunction = () => [
  { title: `Learn · ${appConfig.academy.name}` },
  {
    name: "description",
    content:
      "Courses on bar tools, glassware, technique, garnishes, service and every family of classic cocktails.",
  },
];

const lessonCount = listCourses().reduce((sum, course) => sum + course.lessons.length, 0);

const scene = getScenePhoto("learn");
const heroImage = scene
  ? { src: scenePhotoSrc(scene.id), alt: scene.alt, tone: "charcoal" as const }
  : undefined;

export default function LearnRoute() {
  return (
    <>
      <PageHeader
        {...(heroImage ? { image: heroImage } : {})}
        eyebrow="Learn"
        title="The bartending program"
        lede={`${String(listCourses().length)} courses and ${String(lessonCount)} lessons, from your first pour to the classics by heart. Start with the foundations, then work through the drink families.`}
      />
      <CourseList />
    </>
  );
}
