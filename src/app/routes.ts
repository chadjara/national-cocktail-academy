import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/today.tsx"),
  route("learn", "routes/learn.tsx"),
  route("learn/:courseId", "routes/learn-course.tsx"),
  route("learn/:courseId/exam", "routes/learn-exam.tsx"),
  route("learn/:courseId/:lessonId", "routes/learn-lesson.tsx"),
  route("capstone", "routes/capstone.tsx"),
  route("certificate", "routes/certificate.tsx"),
  route("practice", "routes/practice.tsx"),
  route("practice/review", "routes/practice-review.tsx"),
  route("practice/speed-round", "routes/practice-speed-round.tsx"),
  route("practice/pour", "routes/practice-pour.tsx"),
  route("practice/math", "routes/practice-math.tsx"),
  route("library", "routes/library.tsx"),
  route("library/:cocktailId", "routes/library-cocktail.tsx"),
  route("my-bar", "routes/my-bar.tsx"),
  route("settings", "routes/settings.tsx"),
  route("credits", "routes/credits.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("design-system", "routes/design-system.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
