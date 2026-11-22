# Roadmap

Every milestone ends **deployed to GitHub Pages, tested and reported** (shipped / tested / known
issues / next).

| #         | Milestone                        | Ships                                                                                                                                                                                                                                                         | Key tests                                                                                                |
| --------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **M0** ✅ | Foundations                      | Repo, strict TS, lint/format/hooks, CI (typecheck, lint, test, build, axe, Lighthouse CI), Pages deploy workflow (first deploy pending a GitHub repo), PWA shell offline, Dexie v1, config + Zod, ADRs 0001–0008, `docs/data-model.md`                        | App installs and reloads offline (Playwright)                                                            |
| **M1** ✅ | Design system                    | Tokens (light/dark), type scale, Button, Input, Select, Checkbox, Radio, Tabs, Dialog, Sheet, Toast, Card, Badge, Progress, Skeleton, EmptyState, ErrorState, 404, `/design-system`. SpecCard moves to M2 and TicketCard to M4, where their data models land. | Visual pass in both themes, axe clean, keyboard pass                                                     |
| **M2** ✅ | Library + My Bar                 | SpecCard, content schema, ~100 specs, ingredients, glass/ice/family, search and filters, oz/ml, spec page, favorites, My Bar                                                                                                                                  | Unit conversion, filter/search, can-make logic, content validation                                       |
| **M3**    | Curriculum + Onboarding          | Age gate, lesson player (reading, technique, quiz blocks), progress, unlock rules; Foundations + Technique courses written                                                                                                                                    | E2E: onboarding → complete lesson → resume                                                               |
| **M4**    | Practice engine                  | TicketCard, FSRS review, Speed Round, pour trainer, bar math, `/progress` dashboard                                                                                                                                                                           | Scheduling wrapper, scoring, math generators (seeded), E2E speed round                                   |
| **M5**    | Assessment + Responsible Service | Exam engine (blueprints, seeded randomization, cooldown, topic breakdown), RS scenarios, Spirits / Classics / Service / Math courses written                                                                                                                  | Randomization determinism, grading, eligibility, E2E exam pass/fail                                      |
| **M6**    | Capstone + Certificate + Backup  | Service Sim, eligibility checklist, PDF certificate, backup/restore, reset                                                                                                                                                                                    | E2E full critical path: onboard → lesson → drill → exam → RS → capstone → certificate; backup round-trip |
| **M7**    | Content complete + launch        | Remaining content, **head-bartender review pass**, photography slots filled, Lighthouse ≥90 on key pages, WCAG 2.2 AA audit, README                                                                                                                           | Full regression, Lighthouse CI budgets                                                                   |

**Decisions:** see [docs/adr](adr/README.md).

## Definition of Done

- Typed end to end and Zod-validated at boundaries (content, config, backup import, forms)
- Unit plus E2E tests
- Responsive from 360px up, AA accessible, light and dark
- Loading, empty and error states handled
- Built from design-system parts only
- Documented

There is no server authorization to check, so the "authorized" item becomes "content and imports
validated; no untrusted HTML rendered".

---
