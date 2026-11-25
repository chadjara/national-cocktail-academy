import { Check, Circle, Download, PenLine } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import { appConfig } from "~/config/app.config";
import { listCourses } from "~/content/curriculum";
import {
  Button,
  Card,
  Field,
  Heading,
  ICON_STROKE,
  Input,
  ProgressBar,
  Skeleton,
  Text,
  useToast,
} from "~/design-system";
import { useExamStatuses } from "~/features/learn/hooks/use-exams";
import { useCapstoneStatus } from "~/features/practice/hooks/use-capstone";
import type { CertificateRecord } from "~/lib/db/records";
import { saveFile } from "~/lib/files";
import { tapFeedback } from "~/lib/native";

import { useCertificate } from "../hooks/use-certificate";
import {
  CERTIFICATE_DISCLAIMER,
  CERTIFICATE_STATEMENT,
  certificateDateFormat,
  issueCertificate,
} from "../services/certificate";
import { certificateEligibility, type Eligibility } from "../services/eligibility";

/** The certificate as it prints, laid out to mirror the PDF. */
function CertificatePreview({ certificate }: { certificate: CertificateRecord }) {
  return (
    <figure
      aria-label="Certificate preview"
      className="flex flex-col items-center gap-1.5 rounded-base border-2 border-accent bg-raised p-1 text-center"
    >
      <div className="flex w-full flex-col items-center gap-1.5 rounded-base border border-brass px-2 py-4">
        <p className="text-caption font-semibold tracking-(--text-caption--letter-spacing) text-accent-text uppercase">
          {appConfig.academy.name}
        </p>
        <p className="font-display-optical text-display-sm text-ink">Certificate of Completion</p>
        <p className="text-sm text-ink-muted italic">This certifies that</p>
        <p className="border-b border-brass px-2 pb-0.5 font-display-optical text-display-sm text-ink">
          {certificate.displayName}
        </p>
        <p className="max-w-60 text-base text-ink">{CERTIFICATE_STATEMENT}</p>
        <p className="pt-1 text-sm text-ink">
          Issued {certificateDateFormat.format(new Date(certificate.issuedAt))}
        </p>
        <p className="text-caption text-ink-muted tabular">
          Certificate ID {certificate.certificateId} · App version {certificate.appVersion}
        </p>
        <figcaption className="max-w-70 pt-1 text-caption text-ink-subtle">
          {CERTIFICATE_DISCLAIMER}
        </figcaption>
      </div>
    </figure>
  );
}

function Requirements({ eligibility }: { eligibility: Eligibility }) {
  return (
    <section aria-labelledby="requirements-heading" className="flex flex-col gap-1.5">
      <Heading as="h2" size="lg" id="requirements-heading">
        Requirements
      </Heading>
      <ProgressBar
        label={`${String(eligibility.done)} of ${String(eligibility.total)} complete`}
        value={eligibility.done}
        max={eligibility.total}
        tone={eligibility.eligible ? "brass" : "accent"}
      />
      <ul
        aria-labelledby="requirements-heading"
        className="flex flex-col divide-y divide-line border-y border-line"
      >
        {eligibility.requirements.map((requirement) => (
          <li key={requirement.id} className="flex items-center gap-1.5 py-1">
            {requirement.done ? (
              <Check
                aria-hidden
                size={20}
                strokeWidth={ICON_STROKE}
                className="shrink-0 text-success"
              />
            ) : (
              <Circle
                aria-hidden
                size={20}
                strokeWidth={ICON_STROKE}
                className="shrink-0 text-ink-subtle"
              />
            )}
            <span className="flex-1 text-base text-ink">
              {requirement.done ? (
                requirement.label
              ) : (
                <Link
                  to={requirement.to}
                  className="underline decoration-1 underline-offset-[3px] hover:decoration-2"
                >
                  {requirement.label}
                </Link>
              )}
            </span>
            <span className="sr-only">{requirement.done ? "(done)" : "(not yet)"}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function NameForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial: string;
  submitLabel: string;
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState(initial);
  const [error, setError] = useState<string | undefined>(undefined);
  return (
    <form
      noValidate
      className="flex flex-col gap-1.5"
      onSubmit={(event) => {
        event.preventDefault();
        const trimmed = name.trim();
        if (trimmed === "") {
          setError("Enter the name to print on your certificate.");
          return;
        }
        if (trimmed.length > 80) {
          setError("Keep the name to 80 characters or fewer.");
          return;
        }
        setError(undefined);
        onSubmit(trimmed);
      }}
    >
      <Field
        label="Name on your certificate"
        hint="As you'd like it printed. It's stored only on this device."
        error={error}
      >
        <Input
          value={name}
          autoComplete="name"
          maxLength={80}
          onChange={(event) => setName(event.target.value)}
        />
      </Field>
      <Button type="submit" className="self-start">
        {submitLabel}
      </Button>
    </form>
  );
}

/**
 * The Certificate of Completion: the requirements while they're outstanding,
 * then a name, a preview, and a PDF made on the device.
 */
export function CertificateView() {
  const exams = useExamStatuses();
  const capstone = useCapstoneStatus();
  const { certificate, save } = useCertificate();
  const { show } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  if (
    exams.status === "loading" ||
    capstone.status === "loading" ||
    certificate.status === "loading"
  ) {
    return <Skeleton className="h-40" />;
  }
  if (exams.status === "error" || capstone.status === "error" || certificate.status === "error") {
    return (
      <Text tone="muted">
        Your progress couldn't be loaded. Close and reopen the app to try again.
      </Text>
    );
  }

  const eligibility = certificateEligibility(listCourses(), exams.data, capstone.data);
  const issued = certificate.data;

  async function issue(name: string) {
    tapFeedback();
    await save(issueCertificate(name, issued));
    setEditing(false);
  }

  async function savePdf(record: CertificateRecord) {
    setSaving(true);
    const { certificatePdf } = await import("../services/certificate-pdf");
    const bytes = await certificatePdf(record);
    const saved = await saveFile(
      `NCA-Certificate-${record.certificateId}.pdf`,
      bytes,
      "application/pdf",
    );
    setSaving(false);
    if (!saved)
      show({ title: "The certificate wasn't saved", description: "Try again.", tone: "danger" });
  }

  return (
    <div className="flex flex-col gap-4">
      {issued ? (
        <section aria-labelledby="your-certificate" className="flex flex-col gap-2">
          <Heading as="h2" size="lg" id="your-certificate">
            Your certificate
          </Heading>
          <CertificatePreview certificate={issued} />
          <div className="flex flex-wrap gap-1">
            <Button
              disabled={saving}
              onClick={() => void savePdf(issued)}
              leadingIcon={<Download aria-hidden size={18} strokeWidth={ICON_STROKE} />}
            >
              {saving ? "Preparing…" : "Save or share PDF"}
            </Button>
            {!editing && (
              <Button
                variant="ghost"
                onClick={() => setEditing(true)}
                leadingIcon={<PenLine aria-hidden size={18} strokeWidth={ICON_STROKE} />}
              >
                Correct the name
              </Button>
            )}
          </div>
          {editing && (
            <Card className="flex flex-col gap-1">
              <Text size="sm" tone="muted">
                The certificate keeps its ID and is reissued with today's date.
              </Text>
              <NameForm
                initial={issued.displayName}
                submitLabel="Reissue certificate"
                onSubmit={(n) => void issue(n)}
              />
            </Card>
          )}
        </section>
      ) : eligibility.eligible ? (
        <Card
          as="section"
          aria-labelledby="issue-heading"
          className="flex flex-col gap-1.5 border-brass"
        >
          <Heading as="h2" size="md" id="issue-heading">
            You've earned your certificate
          </Heading>
          <Text tone="muted">
            Every exam and the Service Sim, passed. Enter your name to issue it.
          </Text>
          <NameForm initial="" submitLabel="Issue certificate" onSubmit={(n) => void issue(n)} />
        </Card>
      ) : null}

      <Requirements eligibility={eligibility} />
    </div>
  );
}
