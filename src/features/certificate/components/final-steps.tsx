import { ArrowRight, Award, Timer } from "lucide-react";
import { Link } from "react-router";

import { Button, Card, Eyebrow, Heading, ICON_STROKE, Text } from "~/design-system";
import { useCapstoneStatus } from "~/features/practice/hooks/use-capstone";

import { useCertificate } from "../hooks/use-certificate";

/**
 * What the continue card shows once every lesson is finished and every exam
 * passed: the Service Sim, then the certificate.
 */
export function FinalSteps() {
  const capstone = useCapstoneStatus();
  const { certificate } = useCertificate();
  if (capstone.status !== "ready" || certificate.status !== "ready") return null;

  if (!capstone.data.passed) {
    return (
      <Card
        as="section"
        aria-labelledby="continue-heading"
        className="flex flex-col gap-2 border-accent"
      >
        <div className="flex items-start gap-2">
          <Timer
            aria-hidden
            size={28}
            strokeWidth={ICON_STROKE}
            className="shrink-0 text-accent-text"
          />
          <div className="flex flex-col gap-0.5">
            <Eyebrow tone="accent">Capstone</Eyebrow>
            <Heading as="h2" size="md" id="continue-heading">
              Work the Service Sim
            </Heading>
            <Text size="sm" tone="muted">
              Every course exam passed. One simulated shift stands between you and your certificate.
            </Text>
          </div>
        </div>
        <Button asChild className="self-start">
          <Link to="/capstone">
            Start the shift
            <ArrowRight aria-hidden size={18} strokeWidth={ICON_STROKE} />
          </Link>
        </Button>
      </Card>
    );
  }

  const issued = certificate.data !== undefined;
  return (
    <Card
      as="section"
      aria-labelledby="continue-heading"
      className="flex flex-col gap-2 border-brass"
    >
      <div className="flex items-start gap-2">
        <Award aria-hidden size={28} strokeWidth={ICON_STROKE} className="shrink-0 text-brass" />
        <div className="flex flex-col gap-0.5">
          <Eyebrow>Program complete</Eyebrow>
          <Heading as="h2" size="md" id="continue-heading">
            {issued ? "Your certificate" : "Your certificate is ready"}
          </Heading>
          <Text size="sm" tone="muted">
            {issued
              ? "Save or share it any time. Keep your specs sharp with Daily Review and the Speed Round."
              : "You've passed every exam and the Service Sim. Add your name to issue it."}
          </Text>
        </div>
      </div>
      <Button asChild className="self-start">
        <Link to="/certificate">{issued ? "View your certificate" : "Get your certificate"}</Link>
      </Button>
    </Card>
  );
}
