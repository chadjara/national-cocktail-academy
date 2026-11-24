# National Cocktail Academy

A professional bartending academy that runs entirely on the student's phone. It is free, works
offline, needs no account and does no tracking. It takes students from first pour to running the well
through a structured program, a spec library, a practice engine, in-app assessments and a
certificate of completion.

> **National Cocktail Academy (NCA)** is an independent training app, not an accredited school or
> a government body, and the app says so wherever the name could suggest otherwise. The name lives
> in `src/config/app.config.ts` and `public/manifest.webmanifest`; a test keeps the two in sync.

## How it works

- **An iPhone app.** NCA ships only as an iOS app: Capacitor wraps a React bundle that lives
  entirely inside the binary, so it works with no signal behind the bar
  ([ADR 0009](docs/adr/0009-native-ios-capacitor.md), [ADR 0010](docs/adr/0010-app-only-distribution.md)).
- **Data stays on the device.** Progress lives in IndexedDB. There are no servers, accounts,
  analytics or third-party requests, and the Content Security Policy enforces that.
- **Content is code.** Curriculum and specs are typed files, validated in CI.

Why it is built this way: [docs/adr](docs/adr/README.md).

## Getting started

Requires Node 22 and pnpm 10 (`corepack enable`).

```bash
pnpm install
```

```bash
pnpm dev
```

| Command          | What it does                                                          |
| ---------------- | --------------------------------------------------------------------- |
| `pnpm dev`       | Dev server with hot reload                                            |
| `pnpm build`     | Production build (one single-page bundle), then CSP hashing           |
| `pnpm preview`   | Serves the build the way the app loads it, at `http://localhost:4173` |
| `pnpm typecheck` | Route type generation and strict TypeScript                           |
| `pnpm lint`      | ESLint (type-aware, a11y, hooks) with zero warnings allowed           |
| `pnpm test`      | Vitest unit tests, including WCAG contrast checks on every token pair |
| `pnpm e2e`       | Playwright on phone and desktop: offline, axe, keyboard (build first) |

Git hooks run lint-staged on commit and typecheck plus tests on push.

## Project layout

```
src/
  app/              routes (thin), root layout, navigation
  config/           app.config.ts: name, age gate, units, pass mark (Zod-validated)
  design-system/    tokens, components, patterns; documented live at /design-system
  features/         one folder per feature: components, hooks, services, repositories
  lib/              database, shared utilities
scripts/            postbuild (CSP), preview server, icon generator, iOS smoke test
e2e/                Playwright specs
docs/               product spec, architecture, data model, roadmap, ADRs
```

Rules the linter enforces:

- No `any`.
- No TODO comments; open an issue instead.
- Components and routes never import the database; they go through feature hooks.

## Design system

Visit `/design-system` in the running app. It documents color, type, space, motion, icons, every
component in every state, and the voice. Screens use only these components and tokens.

## iOS app and TestFlight

The iPhone app wraps the same build in Capacitor ([ADR 0009](docs/adr/0009-native-ios-capacitor.md)).
GitHub Actions builds and signs it on macOS, so no Mac is needed.

**One-time setup.** The account holder does this in Apple's and GitHub's web UIs.

1. **App Store Connect → Apps → + → New App.**
   - Platform: iOS
   - Name: National Cocktail Academy
   - Bundle ID: `com.cjaratech.nationalcocktailacademy` (register it under developer.apple.com → Identifiers if it isn't
     listed)
   - SKU: `nca-ios`
2. **App Store Connect → Users and Access → Integrations → App Store Connect API → Team Keys → +.**
   - Role: **Admin**. Cloud signing needs it.
   - Download the `.p8` file, which is offered only once.
   - Note the Key ID and Issuer ID.
3. **GitHub → Settings → Secrets and variables → Actions.** Add:
   - `ASC_API_KEY_P8`: the full text of the `.p8` file
   - `ASC_KEY_ID`
   - `ASC_ISSUER_ID`
   - `APPLE_TEAM_ID`: shown at developer.apple.com → Membership

4. **Privacy policy URL.** Use the official copy, `https://cjaratech.com/national-cocktail-academy/privacy`,
   in two places:
   - **App Information → Privacy Policy URL**, for the App Store
   - **TestFlight → Test Information → Privacy Policy URL**, required for external testers

   The app's built-in `/privacy` page mirrors that text word for word
   (`src/features/legal/privacy-policy.ts`); change both together.

**Ship a build.**

1. Go to **Actions → TestFlight → Run workflow**, or push a tag matching the `package.json` version
   (`git tag v0.2.0 && git push origin v0.2.0`).
2. After Apple processes it (5–30 minutes), go to **App Store Connect → TestFlight**, add yourself as
   an internal tester, and install with the TestFlight app.

**Every PR that touches the app** is built for the iOS simulator and launched by `ios.yml`. A
screenshot of the launch is attached to the run.

To work on the native project locally (macOS only):

```bash
pnpm ios:sync
```

```bash
pnpm exec cap open ios
```

## Documentation

- [Product spec and user stories](docs/product-spec.md)
- [Architecture and route map](docs/architecture.md)
- [Data model](docs/data-model.md)
- [Content style guide](docs/content-style-guide.md)
- [Roadmap](docs/roadmap.md)
- [Decisions (ADRs)](docs/adr/README.md)

## The program

15 courses. **Foundations:** Bar Tools (all sixteen tools on a professional station),
Glassware & Ice, Technique, Spirits & Products, Garnishes, and Service & Responsibility (with
branching Responsible Service scenarios). **Drink families:** Sours,
Martinis & Manhattans, Old Fashioneds, Highballs, Fizzes & Collinses, Juleps & Smashes, Tiki &
Tropical, Sparkling & Wine, and After-Dinner Drinks. Teaching is authored; spec questions are
generated from the Library, so a lesson and its spec can never disagree
([ADR 0011](docs/adr/0011-curriculum-from-library-data.md)).

## Exams

Every course ends with a 10-question exam drawn from that course. It unlocks once the course's
lessons are finished, and the pass mark is 80%. Results break the score down by lesson, link
back to anything missed, and explain every missed question. Retakes are immediate, with new
questions ([ADR 0012](docs/adr/0012-exams-and-scenarios.md)).

## Practice

- **Daily Review:** spaced repetition with FSRS. Each drink you learn becomes three cards (spec;
  glass, ice and garnish; method), scheduled to return just before you'd forget them.
- **Speed Round:** five tickets built from memory against the clock, with personal bests.
- **Pour Trainer:** a calibrated free-pour count drill, and a water-and-jigger log for home.
- **Bar Math:** pour cost, menu pricing, batching, dilution, bottles and par levels, with worked
  solutions.

## Spec library

105 specs, including the 87 drinks on the current IBA official list (imported from the MIT-licensed
[rasmusab/iba-cocktails](https://github.com/rasmusab/iba-cocktails) dataset). The other 18 are
modern classics, each cross-checked against two or more professional sources (PUNCH, Imbibe,
Difford's Guide, the creators' bars). Every spec page shows its sources. How content is sourced,
written and classified: [docs/content-style-guide.md](docs/content-style-guide.md).

## Content and legal

Responsible Service material is education. It does not replace state-mandated alcohol-server
certification. Certificates are certificates of completion and are not verifiable credentials
([ADR 0006](docs/adr/0006-unverifiable-certificates.md)).
