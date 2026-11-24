import { appConfig } from "~/config/app.config";
import { getCourse, getLesson } from "~/content/curriculum";
import { CourseNotFound } from "~/features/learn/components/course-not-found";
import { LessonPlayer } from "~/features/learn/components/lesson-player";

import type { Route } from "./+types/learn-lesson";

export const meta: Route.MetaFunction = ({ params }) => {
  const course = getCourse(params.courseId);
  const lesson = getLesson(params.courseId, params.lessonId);
  if (!course || !lesson) return [{ title: `Not on the menu · ${appConfig.academy.name}` }];
  return [
    { title: `${lesson.title} · ${course.title} · ${appConfig.academy.name}` },
    { name: "description", content: lesson.summary },
  ];
};

export default function LearnLessonRoute({ params }: Route.ComponentProps) {
  const course = getCourse(params.courseId);
  const lesson = getLesson(params.courseId, params.lessonId);
  if (!course || !lesson) return <CourseNotFound />;
  // Keyed so moving to the next lesson starts the player fresh.
  return <LessonPlayer key={`${course.id}/${lesson.id}`} course={course} lesson={lesson} />;
}
