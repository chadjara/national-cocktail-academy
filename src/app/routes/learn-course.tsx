import { appConfig } from "~/config/app.config";
import { getCourse } from "~/content/curriculum";
import { CourseNotFound } from "~/features/learn/components/course-not-found";
import { CourseView } from "~/features/learn/components/course-view";

import type { Route } from "./+types/learn-course";

export const meta: Route.MetaFunction = ({ params }) => {
  const course = getCourse(params.courseId);
  if (!course) return [{ title: `Not on the menu · ${appConfig.academy.name}` }];
  return [
    { title: `${course.title} · ${appConfig.academy.name}` },
    { name: "description", content: course.summary },
  ];
};

export default function LearnCourseRoute({ params }: Route.ComponentProps) {
  const course = getCourse(params.courseId);
  return course ? <CourseView course={course} /> : <CourseNotFound />;
}
