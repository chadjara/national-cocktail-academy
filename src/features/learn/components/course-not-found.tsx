import { SearchX } from "lucide-react";
import { Link } from "react-router";

import { Button, EmptyState, ICON_STROKE } from "~/design-system";

export function CourseNotFound() {
  return (
    <EmptyState
      headingLevel="h1"
      icon={<SearchX aria-hidden size={24} strokeWidth={ICON_STROKE} />}
      title="That lesson isn't in the program"
      description="It may have been renamed. Pick a course from the full program."
      action={
        <Button asChild>
          <Link to="/learn">See all courses</Link>
        </Button>
      }
    />
  );
}
