import { appConfig } from "~/config/app.config";
import { ReviewSession } from "~/features/practice/components/review-session";

import type { Route } from "./+types/practice-review";

export const meta: Route.MetaFunction = () => [
  { title: `Daily Review · ${appConfig.academy.name}` },
  {
    name: "description",
    content: "Review the specs you've learned, scheduled just before you'd forget them.",
  },
];

export default function RouteReviewSession() {
  return <ReviewSession />;
}
