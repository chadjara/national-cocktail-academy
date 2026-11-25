import { DatabaseBackup, FileUp, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router";

import {
  Button,
  Card,
  Dialog,
  Heading,
  ICON_STROKE,
  SegmentedControl,
  Text,
  useToast,
} from "~/design-system";
import { useUnits } from "~/features/library/hooks/use-units";
import type { UnitSystem } from "~/features/library/services/units";
import { summarizeBackup, type Backup } from "~/lib/db/backup";
import { tapFeedback } from "~/lib/native";

import { useDataActions } from "../hooks/use-data-actions";

function plural(count: number, one: string, many: string): string {
  return `${String(count)} ${count === 1 ? one : many}`;
}

/**
 * Your data: units, and the student's own copy of their progress. Backups are
 * files they save where they choose; nothing is uploaded anywhere.
 */
export function YourData() {
  const { units, setUnits } = useUnits();
  const { saveBackup, readBackup, restore, erase } = useDataActions();
  const { show } = useToast();
  const fileInput = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<Backup | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [confirmErase, setConfirmErase] = useState(false);
  const [busy, setBusy] = useState(false);
  const summary = pending ? summarizeBackup(pending) : null;

  async function onBackup() {
    setBusy(true);
    const saved = await saveBackup();
    setBusy(false);
    if (!saved)
      show({ title: "The backup wasn't saved", description: "Try again.", tone: "danger" });
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setRestoreError(null);
    const parsed = await readBackup(file);
    if (fileInput.current) fileInput.current.value = "";
    if (parsed.ok) setPending(parsed.backup);
    else setRestoreError(parsed.reason);
  }

  return (
    <div className="flex max-w-80 flex-col gap-4">
      <section aria-labelledby="units-heading" className="flex flex-col gap-1">
        <Heading as="h2" size="lg" id="units-heading">
          Units
        </Heading>
        <Text tone="muted">How amounts are shown in specs, lessons and drills.</Text>
        <SegmentedControl<UnitSystem>
          label="Units"
          value={units}
          onValueChange={setUnits}
          options={[
            { value: "oz", label: "Ounces (oz)" },
            { value: "ml", label: "Milliliters (ml)" },
          ]}
        />
      </section>

      <section aria-labelledby="backup-heading" className="flex flex-col gap-1.5">
        <Heading as="h2" size="lg" id="backup-heading">
          Backup
        </Heading>
        <Text tone="muted">
          Your progress lives only on this phone. Save a backup file to keep a copy or move to a new
          phone. You choose where it goes; NCA never uploads it.
        </Text>
        <div className="flex flex-wrap gap-1">
          <Button
            disabled={busy}
            onClick={() => void onBackup()}
            leadingIcon={<DatabaseBackup aria-hidden size={18} strokeWidth={ICON_STROKE} />}
          >
            Save a backup
          </Button>
          <Button
            variant="secondary"
            onClick={() => fileInput.current?.click()}
            leadingIcon={<FileUp aria-hidden size={18} strokeWidth={ICON_STROKE} />}
          >
            Restore from a backup
          </Button>
          <input
            ref={fileInput}
            type="file"
            accept=".json,application/json"
            className="sr-only"
            tabIndex={-1}
            aria-label="Backup file"
            onChange={(event) => void onFile(event.target.files?.[0])}
          />
        </div>
        <p role="alert" className="min-h-0 text-sm font-medium text-danger">
          {restoreError}
        </p>
      </section>

      <section aria-labelledby="about-heading" className="flex flex-col gap-1">
        <Heading as="h2" size="lg" id="about-heading">
          About
        </Heading>
        <ul className="flex flex-col gap-0.5 text-base">
          <li>
            <Link
              to="/credits"
              className="inline-flex min-h-3 items-center text-accent-text underline decoration-1 underline-offset-[3px] hover:decoration-2"
            >
              Photo credits
            </Link>
          </li>
          <li>
            <Link
              to="/privacy"
              className="inline-flex min-h-3 items-center text-accent-text underline decoration-1 underline-offset-[3px] hover:decoration-2"
            >
              Privacy policy
            </Link>
          </li>
        </ul>
      </section>

      <Card
        as="section"
        aria-labelledby="erase-heading"
        className="flex flex-col gap-1.5 border-danger"
      >
        <Heading as="h2" size="md" id="erase-heading">
          Erase all progress
        </Heading>
        <Text size="sm" tone="muted">
          Clears finished lessons, review cards, practice scores, exams, the Service Sim and your
          certificate. Saved specs and My Bar are cleared too. Your units stay.
        </Text>
        <Button
          variant="danger"
          className="self-start"
          onClick={() => setConfirmErase(true)}
          leadingIcon={<Trash2 aria-hidden size={18} strokeWidth={ICON_STROKE} />}
        >
          Erase all progress
        </Button>
      </Card>

      <Dialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) setPending(null);
        }}
        title="Restore this backup?"
        description="Everything on this phone will be replaced with the backup."
        actions={
          <>
            <Button variant="secondary" onClick={() => setPending(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!pending) return;
                void restore(pending).then(() => {
                  tapFeedback();
                  setPending(null);
                  show({ title: "Backup restored", tone: "success" });
                });
              }}
            >
              Restore
            </Button>
          </>
        }
      >
        {summary && (
          <ul className="flex list-disc flex-col gap-0.5 pl-2.5 text-sm text-ink">
            <li>{plural(summary.lessons, "lesson finished", "lessons finished")}</li>
            <li>{plural(summary.exams, "exam passed", "exams passed")}</li>
            <li>{plural(summary.drinks, "drink in review", "drinks in review")}</li>
            <li>{summary.certificate ? "A certificate" : "No certificate yet"}</li>
          </ul>
        )}
      </Dialog>

      <Dialog
        open={confirmErase}
        onOpenChange={setConfirmErase}
        title="Erase all progress?"
        description="This can't be undone. Save a backup first if you might want it back."
        actions={
          <>
            <Button variant="secondary" onClick={() => setConfirmErase(false)}>
              Keep my progress
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                void erase().then(() => {
                  setConfirmErase(false);
                  show({ title: "All progress erased" });
                });
              }}
            >
              Erase everything
            </Button>
          </>
        }
      >
        {null}
      </Dialog>
    </div>
  );
}
