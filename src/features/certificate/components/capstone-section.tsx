import { Award, Timer, Trophy } from "lucide-react";
import { Link } from "react-router";

import { listCourses } from "~/content/curriculum";
import { Badge, Card, Heading, ICON_STROKE, ProgressBar, Text } from "~/design-system";
import { useExamStatuses } from "~/features/learn/hooks/use-exams";
import { useCapstoneStatus } from "~/features/practice/hooks/use-capstone";

import { useCertificate } from "../hooks/use-certificate";
import { certificateEligibility } from "../services/eligibility";

/** The Learn page's last group: the Service Sim and the certificate. */
export function CapstoneSection() {
  const exams = useExamStatuses();
  const capstone = useCapstoneStatus();
  const { certificate } = useCertificate();
  const ready =
    exams.status === "ready" && capstone.status === "ready" && certificate.status === "ready";
  const eligibility =
    exams.status === "ready" && capstone.status === "ready"
      ? certificateEligibility(listCourses(), exams.data, capstone.data)
      : undefined;
  const passed = capstone.status === "ready" && capstone.data.passed;
  const issued = certificate.status === "ready" && certificate.data !== undefined;

  return (
    <section aria-labelledby="group-capstone" className="flex flex-col gap-2">
      <div className="flex flex-col gap-0.5">
        <Heading as="h2" size="lg" id="group-capstone">
          Capstone
        </Heading>
        <Text tone="muted">Put it all together, then earn your Certificate of Completion.</Text>
      </div>
      <ul aria-labelledby="group-capstone" className="grid gap-1.5 sm:grid-cols-2">
        <Card as="li" interactive className="flex h-full flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <span className="inline-flex size-6 items-center justify-center rounded-base border border-line bg-raised text-accent-text">
              <Timer aria-hidden size={28} strokeWidth={ICON_STROKE} />
            </span>
            {ready && passed && (
              <Badge tone="brass" icon={<Trophy aria-hidden size={14} strokeWidth={ICON_STROKE} />}>
                Passed
              </Badge>
            )}
          </div>
          <Heading as="h3" size="md">
            <Link to="/capstone" className="after:absolute after:inset-0">
              Service Sim
            </Link>
          </Heading>
          <Text size="sm" tone="muted" className="flex-1">
            A simulated shift: eight tickets built from memory, with guest situations between them.
          </Text>
        </Card>
        <Card as="li" interactive className="flex h-full flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <span className="inline-flex size-6 items-center justify-center rounded-base border border-line bg-raised text-brass">
              <Award aria-hidden size={28} strokeWidth={ICON_STROKE} />
            </span>
            {ready && issued && <Badge tone="brass">Issued</Badge>}
          </div>
          <Heading as="h3" size="md">
            <Link to="/certificate" className="after:absolute after:inset-0">
              Certificate of Completion
            </Link>
          </Heading>
          <Text size="sm" tone="muted" className="flex-1">
            Pass every course exam and the Service Sim.
          </Text>
          {eligibility && !issued && (
            <ProgressBar
              label={`${String(eligibility.done)} of ${String(eligibility.total)} requirements`}
              value={eligibility.done}
              max={eligibility.total}
              tone="brass"
            />
          )}
        </Card>
      </ul>
    </section>
  );
}
