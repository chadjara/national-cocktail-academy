import { appConfig } from "~/config/app.config";
import { getCourse } from "~/content/curriculum";
import { CourseNotFound } from "~/features/learn/components/course-not-found";
import { ExamView } from "~/features/learn/components/exam-view";

import type { Route } from "./+types/learn-exam";

export const meta: Route.MetaFunction = ({ params }) => {
  const course = getCourse(params.courseId);
  if (!course) return [{ title: `Not on the menu · ${appConfig.academy.name}` }];
  return [
    { title: `${course.title} exam · ${appConfig.academy.name}` },
    { name: "description", content: `The ${course.title} course exam.` },
  ];
};

export default function LearnExamRoute({ params }: Route.ComponentProps) {
  const course = getCourse(params.courseId);
  return course ? <ExamView key={course.id} course={course} /> : <CourseNotFound />;
}
