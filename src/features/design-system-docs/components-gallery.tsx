import {
  AlertTriangle,
  ArrowRight,
  Bookmark,
  Filter,
  Martini,
  RotateCcw,
  Timer,
  type LucideIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { getCocktail } from "~/content";
import { listTools } from "~/content/curriculum";
import { drinkArt } from "~/features/library/services/drink-art";
import { glassLabels } from "~/content/taxonomy";
import {
  Badge,
  Button,
  Callout,
  Card,
  Checkbox,
  CoverImage,
  DrinkIllustration,
  ChipGroup,
  ChoiceQuestion,
  Dialog,
  EmptyState,
  ErrorState,
  Field,
  GlassIcon,
  Heading,
  ICON_STROKE,
  IconButton,
  Input,
  KeyPoints,
  LoadingRegion,
  ProgressBar,
  RadioGroup,
  SearchField,
  SegmentedControl,
  Select,
  Sheet,
  Skeleton,
  SpecCard,
  SpecFact,
  SpecSheet,
  StepList,
  Switch,
  Tabs,
  Text,
  Textarea,
  TicketCard,
  ToolIcon,
  useToast,
  type GlassShape,
} from "~/design-system";

import { DocSection } from "./foundations";

function Specimen({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-col">
        <Heading as="h3" size="sm">
          {title}
        </Heading>
        {note !== undefined && (
          <Text size="sm" tone="subtle">
            {note}
          </Text>
        )}
      </div>
      <div className="rounded-base border border-line bg-canvas p-3">{children}</div>
    </div>
  );
}

const icon = (Icon: LucideIcon) => <Icon aria-hidden size={20} strokeWidth={ICON_STROKE} />;

function Buttons() {
  return (
    <Specimen
      title="Button"
      note="Four variants, two sizes. One primary action per screen. Medium is 44px; large is 52px for actions used one-handed."
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-1">
          <Button>Start review</Button>
          <Button variant="secondary">Skip for now</Button>
          <Button variant="ghost">View spec</Button>
          <Button variant="danger">Reset progress</Button>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <Button size="lg" trailingIcon={icon(ArrowRight)}>
            Continue lesson
          </Button>
          <Button variant="secondary" leadingIcon={icon(RotateCcw)}>
            Retake
          </Button>
          <Button disabled>Exam locked</Button>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <IconButton label="Save to favorites" icon={icon(Bookmark)} />
          <IconButton label="Filter specs" variant="secondary" icon={icon(Filter)} />
        </div>
      </div>
    </Specimen>
  );
}

function Fields() {
  const [name, setName] = useState("");
  const [glass, setGlass] = useState<string | undefined>(undefined);
  return (
    <Specimen
      title="Field, Input, Textarea, Select"
      note="Every control has a visible label. Hints sit below; errors replace guesswork with the fix."
    >
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Name on certificate" hint="Exactly as you want employers to read it.">
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
          />
        </Field>
        <Field label="Pour cost target" error="Enter a percentage between 10 and 40.">
          <Input defaultValue="64" inputMode="decimal" />
        </Field>
        <Field label="Glassware">
          <Select
            value={glass}
            onValueChange={setGlass}
            placeholder="Choose a glass"
            options={[
              { value: "coupe", label: "Coupe" },
              { value: "nick-and-nora", label: "Nick & Nora" },
              { value: "rocks", label: "Rocks" },
              { value: "highball", label: "Highball" },
              { value: "collins", label: "Collins" },
            ]}
          />
        </Field>
        <Field label="Tasting notes" hint="Optional.">
          <Textarea placeholder="Dry, bright, a little saline from the olive brine." />
        </Field>
      </div>
    </Specimen>
  );
}

function Choices() {
  const [ice, setIce] = useState("cubes");
  const [checked, setChecked] = useState(true);
  const [haptics, setHaptics] = useState(false);
  const [unit, setUnit] = useState<"oz" | "ml">("oz");
  return (
    <Specimen title="Checkbox, Radio, Switch, Segmented control">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="flex flex-col">
          <Checkbox
            label="Responsible Service complete"
            description="Required before certification."
            checked={checked}
            onCheckedChange={setChecked}
          />
          <Checkbox label="Campari" checked={false} onCheckedChange={() => undefined} />
          <Switch
            label="Keep screen awake during drills"
            checked={haptics}
            onCheckedChange={setHaptics}
          />
        </div>
        <div className="flex flex-col gap-2">
          <RadioGroup
            label="Ice"
            value={ice}
            onValueChange={setIce}
            options={[
              { value: "cubes", label: "Cubes", description: "Standard 1¼-inch, for shaking" },
              {
                value: "large",
                label: "Large format",
                description: "One 2-inch cube, for serving",
              },
              { value: "crushed", label: "Crushed", description: "Juleps, swizzles, tiki" },
            ]}
          />
          <SegmentedControl
            label="Units"
            value={unit}
            onValueChange={setUnit}
            options={[
              { value: "oz", label: "oz" },
              { value: "ml", label: "ml" },
            ]}
          />
        </div>
      </div>
    </Specimen>
  );
}

function Navigation() {
  return (
    <Specimen title="Tabs">
      <Tabs
        label="Spec details"
        items={[
          {
            value: "method",
            label: "Method",
            content: (
              <Text size="sm">
                Add all ingredients to a mixing glass. Stir with ice for 30 seconds. Strain into a
                chilled rocks glass over one large cube.
              </Text>
            ),
          },
          {
            value: "history",
            label: "History",
            content: (
              <Text size="sm">
                Usually credited to Count Camillo Negroni in Florence around 1919, who asked for his
                Americano made stronger, with gin in place of soda.
              </Text>
            ),
          },
          {
            value: "variations",
            label: "Variations",
            content: (
              <Text size="sm">Boulevardier, Old Pal, Negroni Sbagliato, White Negroni.</Text>
            ),
          },
        ]}
      />
    </Specimen>
  );
}

function Overlays() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const toast = useToast();
  return (
    <Specimen
      title="Dialog, Sheet, Toast"
      note="Dialogs confirm. Sheets hold secondary detail and filters, from the bottom on phones. Toasts report, and never carry the only path to an action."
    >
      <div className="flex flex-wrap gap-1">
        <Button variant="secondary" onClick={() => setDialogOpen(true)}>
          Open dialog
        </Button>
        <Button variant="secondary" onClick={() => setSheetOpen(true)}>
          Open sheet
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.show({
              tone: "success",
              title: "Review complete",
              description: "Next review due tomorrow.",
            })
          }
        >
          Show toast
        </Button>
      </div>
      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Leave the exam?"
        description="Your answers so far will be discarded and the attempt counts toward your cooldown."
        actions={
          <>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>
              Keep going
            </Button>
            <Button variant="danger" onClick={() => setDialogOpen(false)}>
              Leave exam
            </Button>
          </>
        }
      >
        <Text size="sm" tone="muted">
          You have answered 14 of 40 questions.
        </Text>
      </Dialog>
      <Sheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title="Filter specs"
        actions={
          <Button fullWidth onClick={() => setSheetOpen(false)}>
            Show 24 specs
          </Button>
        }
      >
        <div className="flex flex-col">
          {["Gin", "Whiskey", "Rum", "Agave", "Brandy", "Vodka"].map((spirit) => (
            <Checkbox
              key={spirit}
              label={spirit}
              checked={spirit === "Gin"}
              onCheckedChange={() => undefined}
            />
          ))}
        </div>
      </Sheet>
    </Specimen>
  );
}

function DataDisplay() {
  return (
    <Specimen title="Card, Badge, Progress">
      <div className="grid gap-3 md:grid-cols-2">
        <Card className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-0.5">
              <Heading as="h4" size="md">
                The Sour Family
              </Heading>
              <Text size="sm" tone="muted">
                Module 3 · 6 lessons · 45 min
              </Text>
            </div>
            <Badge tone="warning">2 due</Badge>
          </div>
          <ProgressBar label="Module progress" value={4} max={6} showValue />
        </Card>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-1">
            <Badge>Stirred</Badge>
            <Badge tone="accent">New</Badge>
            <Badge tone="success">Passed</Badge>
            <Badge tone="warning">Due today</Badge>
            <Badge tone="danger">Failed</Badge>
            <Badge tone="brass">Certified</Badge>
          </div>
          <ProgressBar label="Exam readiness" value={72} tone="success" showValue />
          <ProgressBar label="Program complete" value={100} tone="brass" showValue />
        </div>
      </div>
    </Specimen>
  );
}

function SpecComponents() {
  const [query, setQuery] = useState("");
  const [bases, setBases] = useState<string[]>(["gin"]);
  return (
    <Specimen
      title="Spec components"
      note="The library's building blocks. Glassware is drawn on the icon grid instead of photographed, so every drink reads the same way."
    >
      <div className="flex flex-col gap-3">
        <ul className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
          {(Object.keys(glassLabels) as GlassShape[]).map((glass) => (
            <li
              key={glass}
              className="flex flex-col items-center gap-1 rounded-base border border-line py-2 text-ink"
            >
              <GlassIcon glass={glass} size={28} />
              <span className="text-center text-caption text-ink-muted">{glassLabels[glass]}</span>
            </li>
          ))}
        </ul>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <SearchField
              label="Search specs (example)"
              placeholder="Name or ingredient"
              value={query}
              onValueChange={setQuery}
            />
            <ChipGroup
              label="Base spirit (example)"
              value={bases}
              onValueChange={setBases}
              options={[
                { value: "gin", label: "Gin" },
                { value: "whiskey", label: "Whiskey" },
                { value: "agave", label: "Tequila & mezcal" },
              ]}
            />
            <ul className="-mx-1.5">
              <li>
                <SpecCard
                  to="/library/negroni"
                  title="Negroni"
                  meta="Gin · Built · Rocks glass"
                  leading={<GlassIcon glass="rocks" />}
                />
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <Card padding="sm" className="px-2">
              <SpecSheet
                caption="Daiquiri spec (example)"
                rows={[
                  { quantity: "2", unit: "oz", name: "White rum" },
                  { quantity: "⅔", unit: "oz", name: "Fresh lime juice" },
                  { quantity: "2", unit: "barspoons", name: "White cane sugar", note: "superfine" },
                ]}
              />
            </Card>
            <div className="grid grid-cols-2 gap-2">
              <SpecFact
                label="Glass"
                value="Cocktail glass"
                icon={<GlassIcon glass="cocktail" size={20} />}
              />
              <SpecFact label="Garnish" value="None" />
            </div>
          </div>
        </div>
      </div>
    </Specimen>
  );
}

function LessonComponents() {
  return (
    <Specimen
      title="Lesson components"
      note="The pieces a course is built from. Questions teach rather than grade: a wrong pick is marked and the student tries again, and the explanation appears once they find the answer."
    >
      <div className="flex flex-col gap-3">
        <ul className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
          {listTools().map((tool) => (
            <li
              key={tool.id}
              className="flex flex-col items-center gap-1 rounded-base border border-line px-0.5 py-2 text-ink"
            >
              <ToolIcon tool={tool.id} size={28} />
              <span className="text-center text-caption text-ink-muted">{tool.name}</span>
            </li>
          ))}
        </ul>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Callout tone="tip" title="Fill to the rim">
              Measuring to just below the rim shorts every drink.
            </Callout>
            <Callout tone="warning" title="Point it away from guests">
              If the seal fails mid-shake, the drink flies away from people, not at them.
            </Callout>
            <Callout tone="success" title="Good call">
              Feedback on a safe choice in a Responsible Service scenario.
            </Callout>
            <Callout tone="danger" title="Unsafe">
              Feedback on an unsafe choice. The scenario has to be replayed.
            </Callout>
            <StepList
              title="A clean pour (example)"
              items={[
                "Hold the jigger level over the tin.",
                "Fill to the rim.",
                "Tip it in with a flick.",
              ]}
            />
            <KeyPoints
              title="Remember"
              items={["Shake citrus, cream and egg.", "Stir drinks that are all spirit."]}
            />
          </div>
          <div className="flex flex-col gap-3">
            <TicketCard label="Ticket 2 of 5" meta="0:42" title="Negroni (example)" />
            <ChoiceQuestion
              number="Question 1 of 1"
              prompt="Which strainer goes with a mixing glass? (example)"
              options={["Hawthorne strainer", "Julep strainer", "No strainer"]}
              answer={1}
              explanation="The julep strainer is shaped to sit inside a mixing glass."
            />
          </div>
        </div>
      </div>
    </Specimen>
  );
}

const TONES = [
  "oxblood",
  "charcoal",
  "citrus",
  "crimson",
  "amber",
  "copper",
  "slate",
  "emerald",
  "teal",
  "champagne",
  "mocha",
] as const;

function ImageryComponents() {
  const specimens = [
    "negroni",
    "margarita",
    "mint-julep",
    "espresso-martini",
    "tequila-sunrise",
    "moscow-mule",
  ].flatMap((id) => {
    const cocktail = getCocktail(id);
    return cocktail ? [cocktail] : [];
  });
  return (
    <Specimen
      title="Imagery"
      note="Family tones give each drink family its color. Drinks without a photo are drawn from their spec, so the glass, color, ice and garnish are always right."
    >
      <div className="flex flex-col gap-3">
        <ul className="grid grid-cols-4 gap-1 sm:grid-cols-6">
          {TONES.map((tone) => (
            <li key={tone} className="flex flex-col gap-0.5">
              <span
                className="h-5 rounded-base"
                style={{ backgroundColor: `var(--tone-${tone})` }}
              />
              <span className="text-caption text-ink-muted">{tone}</span>
            </li>
          ))}
        </ul>
        <ul className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
          {specimens.map((cocktail) => (
            <li key={cocktail.id} className="flex flex-col items-center gap-0.5">
              <DrinkIllustration art={drinkArt(cocktail)} className="h-15 text-ink" />
              <span className="text-caption text-ink-muted">{cocktail.name}</span>
            </li>
          ))}
        </ul>
        <div className="grid gap-1.5 sm:grid-cols-2">
          <CoverImage
            src="/images/scenes/garnishes-small.webp"
            tone="emerald"
            shade
            className="flex flex-col justify-end"
          >
            <p className="p-2 font-display-optical text-heading-lg text-on-image">
              Cover with shade
            </p>
          </CoverImage>
          <CoverImage
            tone="teal"
            fallback={(() => {
              const zombie = getCocktail("zombie");
              return zombie ? (
                <DrinkIllustration art={drinkArt(zombie)} className="h-[86%] text-on-image" />
              ) : null;
            })()}
          />
        </div>
      </div>
    </Specimen>
  );
}

function States() {
  return (
    <Specimen
      title="Loading, empty and error states"
      note="Skeletons match the shape of what's coming. Empty states say what to do next. Errors say what happened and how to recover."
    >
      <div className="grid gap-3 md:grid-cols-2">
        <LoadingRegion label="Loading your review queue">
          <Card className="flex flex-col gap-1.5">
            <Skeleton className="h-2.5 w-1/2" />
            <Skeleton className="h-2 w-3/4" />
            <Skeleton className="h-1 w-full" />
          </Card>
        </LoadingRegion>
        <EmptyState
          headingLevel="h4"
          icon={<Martini aria-hidden size={24} strokeWidth={ICON_STROKE} />}
          title="No favorites yet"
          description="Save the specs you're working on and they'll show up here for quick reference."
          action={<Button variant="secondary">Browse the library</Button>}
        />
        <EmptyState
          headingLevel="h4"
          icon={<Timer aria-hidden size={24} strokeWidth={ICON_STROKE} />}
          title="Nothing due"
          description="You're caught up. Your next review is tomorrow at 10:00."
        />
        <ErrorState
          headingLevel="h4"
          icon={<AlertTriangle aria-hidden size={24} strokeWidth={ICON_STROKE} />}
          title="That backup file can't be read"
          description="It may be from a newer version of the app, or it was edited. Nothing on this device was changed."
          action={<Button variant="secondary">Choose another file</Button>}
        />
      </div>
    </Specimen>
  );
}

export function ComponentsSection() {
  return (
    <DocSection
      id="components"
      title="Components"
      intro="Every screen is built from these. If a screen needs something that isn't here, it gets designed here first."
    >
      <div className="flex flex-col gap-4">
        <Buttons />
        <Fields />
        <Choices />
        <Navigation />
        <Overlays />
        <DataDisplay />
        <SpecComponents />
        <LessonComponents />
        <ImageryComponents />
        <States />
      </div>
    </DocSection>
  );
}
