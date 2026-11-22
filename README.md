# Proof Bartending Academy

A professional bartending academy that runs entirely on the student's phone. It is free, works
offline, needs no account and does no tracking. It takes students from first pour to running the well
through a structured program, a spec library, a practice engine, in-app assessments and a
certificate of completion.

> **Why "Proof":** it's bar vocabulary (alcohol proof) and it's what a student leaves with: proof
> they can do the job. The name is set in `src/config/app.config.ts` and
> `public/manifest.webmanifest`; a test keeps the two in sync.

## How it works

- **Static PWA.** Hosted on GitHub Pages. After the first visit the service worker caches the
  whole app, so it works with no signal behind the bar.
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

| Command          | What it does                                                           |
| ---------------- | ---------------------------------------------------------------------- |
| `pnpm dev`       | Dev server with hot reload                                             |
| `pnpm build`     | Production build, then CSP hashing, Pages fallback and service worker  |
| `pnpm preview`   | Serves the build the way GitHub Pages does, at `http://localhost:4173` |
| `pnpm typecheck` | Route type generation and strict TypeScript                            |
| `pnpm lint`      | ESLint (type-aware, a11y, hooks) with zero warnings allowed            |
| `pnpm test`      | Vitest unit tests, including WCAG contrast checks on every token pair  |
| `pnpm e2e`       | Playwright on phone and desktop: offline, axe, keyboard (build first)  |

Git hooks run lint-staged on commit and typecheck plus tests on push.

## Project layout

```
src/
  app/              routes (thin), root layout, navigation, prerender list
  config/           app.config.ts: name, age gate, units, pass mark (Zod-validated)
  design-system/    tokens, components, patterns; documented live at /design-system
  features/         one folder per feature: components, hooks, services, repositories
  lib/              database, shared utilities
scripts/            postbuild (CSP, Pages, service worker), preview server, icon generator
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

## Deploying

Pushing to `main` runs CI. When CI passes, `.github/workflows/deploy.yml` builds with the
repository's Pages base path and publishes it. One-time setup in the GitHub repo: **Settings →
Pages → Source: GitHub Actions**.

For a custom domain, add it in the Pages settings. The base path switches to `/` automatically.

## Documentation

- [Product spec and user stories](docs/product-spec.md)
- [Architecture and route map](docs/architecture.md)
- [Data model](docs/data-model.md)
- [Content style guide](docs/content-style-guide.md)
- [Roadmap](docs/roadmap.md)
- [Decisions (ADRs)](docs/adr/README.md)

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
