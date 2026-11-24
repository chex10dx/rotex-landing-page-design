# ROTEX Sprint 1 report

Date: 16 November 2026. Scope: F01 development foundation and architecture/business documentation alignment.

Historical record: the report below describes the original Sprint 1 only. The separately authorized 18 November dependency/F03 implementation, current audit results, tests, and next task are recorded in the [Phase 1 report](PHASE_1_REPORT.md).

## A. Summary

F01 is complete against its local acceptance criteria. The final dependency graph installs from a frozen lockfile in a fresh local checkout; lint, route-aware typecheck, production build, storefront smoke checks, workflow validation, and local PostgreSQL checks pass. Only F01 is checked complete.

No application TSX, CSS, product-data, or asset edits were needed. SHA-256 comparison against the starting snapshot confirms all 16 original files under `app/`, `components/`, `lib/`, and `public/` are unchanged. Existing demo limitations remain assigned to their own tasks.

## B. Files changed

Created:

- `.node-version`: exact Node 24.22.3 development/CI pin.
- `eslint.config.mjs`: ESLint 10 flat config with official Next recommended/Core Web Vitals, TypeScript recommended, and React Hooks recommended rules.
- `.env.example`: optional local PostgreSQL placeholders and future server-only `DATABASE_URL`.
- `.gitattributes`: consistent text line endings across Windows and CI.
- `.github/workflows/ci.yml`: frozen installation, lint, typecheck, conditional real tests, and build; actions pinned to verified v6 commit SHAs.
- `compose.yaml`: optional PostgreSQL 17.12 development service, loopback-only port, environment credentials, named volume, and health check.
- `README.md`: toolchain, local commands, environment handling, optional database operations, and architecture boundaries.
- `AGENTS.md`: architecture, folders, coding/security/testing rules, brand/currency constraints, scope control, Definition of Done, and verified task-status requirements.
- `docs/SPRINT_1_REPORT.md`: this record.

Modified:

- `package.json`: engine requirements, real lint/typecheck scripts, five pinned lint dependencies, and a compatible shadcn 4 update.
- `pnpm-lock.yaml`: retained the existing lockfile/format version; pnpm 12 added missing package-manager metadata and updated the tool/security graph.
- `pnpm-workspace.yaml`: enforce the selected manager/Node engine; remove inherited mismatch ignoring and release-age exemptions.
- `next.config.mjs`: remove `typescript.ignoreBuildErrors`; existing images/headers stay within their later task scopes.
- `.gitignore`: ignore local environment files, keys, caches, build/typecheck outputs, and future test outputs; retain `.env.example`.
- `docs/ECOMMERCE_PLAN.md` and `docs/ECOMMERCE_TASKS.md`: finalized architecture/business decisions and verified status.

Initialized Git on `main` because the export contained no repository. No files were staged, no commits were created, no remote was invented, and nothing was pushed or deployed. Temporary downloads, clean-checkout copies, and smoke harnesses are under ignored `.cache/`; they are verification artifacts, not application modules or an automated test suite.

## C. Architecture

Selected: one Next.js App Router application with TypeScript, Tailwind, Server Components, appropriate Server Actions/Route Handlers, PostgreSQL, and Prisma ORM. GitHub provides version control/quality CI; Codex follows `AGENTS.md`.

```text
app/                         Current routes, layout, metadata, global CSS
components/                  Storefront and existing UI primitives
lib/products.ts              Demo catalog; no database connection
lib/utils.ts                 Shared UI utility
public/                      Existing static assets
docs/                        Plan, tasks, verification
.github/workflows/ci.yml      Quality workflow
compose.yaml                 Optional local PostgreSQL
```

Future documented boundaries: `app/[locale]/`, `app/admin/`, `lib/catalog/`, `lib/server/services/`, `lib/server/dal/`, `lib/server/auth/`, `lib/money/`, `lib/i18n/`, and `prisma/`. Services own business operations; the DAL owns Prisma persistence; callable actions/handlers validate input and enforce server authorization. These folders are not scaffolded early. Prisma installation, modeling, migrations, and connectivity remain C01. No separate backend or extra infrastructure was introduced.

## D. Commands

Prerequisite: use Node **24.22.3** from `.node-version` and pnpm **12.3.4** from `package.json`. The system Node was 24.14.0; verification used a project-local Node 24.22.3 binary from the official distribution with SHA-256 verification. No system-wide upgrade was performed. Switch/install the pin before ordinary development; see the [Node release](https://nodejs.org/en/blog/release/v24.22.3) and [README](../README.md).

From the project root with Corepack installed:

```powershell
corepack pnpm install --frozen-lockfile
corepack pnpm dev
# Open http://localhost:3000 ; stop with Ctrl+C
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm build
corepack pnpm start
```

If Corepack is absent, install the exact pnpm with `npm.cmd install --global pnpm@12.3.4`, then substitute `pnpm.cmd` for `corepack pnpm`. Do not create another lockfile or change the machine's PowerShell execution policy.

Optional database; the demo does not need it:

```powershell
# Copy only if .env does not exist; edit the local password and matching URL.
Copy-Item -LiteralPath .env.example -Destination .env
docker compose config --quiet
docker compose up -d --wait postgres
docker compose ps
docker compose stop postgres
docker compose down
```

Stopping/removing the development containers retains the named volume. Do not remove volumes unless intentionally deleting that project's development data.

## E. Verification results

| Command/check | Result | Evidence/limits |
| --- | --- | --- |
| Frozen install in `.cache/clean-final` | PASS | New source copy with no dependencies, build output, or environment files. `corepack pnpm --dir .cache/clean-final install --frozen-lockfile --store-dir <project-cache>` installed 338 packages; final lock matches the main project byte-for-byte. |
| `corepack pnpm lint` | PASS | ESLint exits 0; warnings fail the check. |
| `corepack pnpm typecheck` | PASS | `next typegen` and strict `tsc --noEmit` exit 0. |
| `corepack pnpm build` | PASS | Next 16.4.3 compiles, checks TypeScript, and prerenders `/` and the not-found route. |
| Automated unit/integration `test` | NOT CONFIGURED | No framework or fake/no-op script added. CI detects a future real test script and runs it when present. Commerce tests remain Q01. |
| `corepack pnpm start --hostname 127.0.0.1 --port 3210` and HTTP smoke | PASS | Home 200; all six demo products and demo labeling present; nine compiled assets return 200; unknown route returns 404. No database/env file required. |
| Headless Chrome at 390x844 | PASS | Six products, hydrated add-to-bag/cart drawer, checkout remains disabled, Arabic RTL retains bag, no horizontal overflow or JavaScript exceptions in this smoke. Not a full visual/accessibility/performance audit. |
| `docker compose --env-file .env.example config --quiet` | PASS | Syntax/interpolation validated without local `.env`. |
| Isolated Compose startup, SQL, recreation | PASS | Healthy PostgreSQL, successful SQL, probe row survives container/network recreation through named volume. Only isolated `rotex-sprint1-verify` resources were removed afterward; no commerce schema or normal development database created. |
| `actionlint .github/workflows/ci.yml` | PASS | Maintainer release 1.7.12, downloaded with checksum verification, exits 0. |
| GitHub action references | PASS | Three pinned SHAs verified against official repositories' v6 tags. |
| GitHub-hosted workflow | NOT RUN | No GitHub remote exists. Workflow is prepared and statically validated; no hosted green run claimed. |
| Source/diff/secret review | PASS | 16 application/assets match baseline; config/doc diffs reviewed; staging empty; local env/cache paths ignored and `.env.example` not ignored. |
| `corepack pnpm audit --json` | FINDINGS REMAIN | Exit 1: one moderate/one low finding; no high/critical. See section G. |

The first frozen install caught missing pnpm 12 metadata in the export; updating the same lockfile resolved it. Windows would not rename the existing dependency directory, including outside the sandbox; the clean-install proof therefore uses a new local source copy. The browser harness initially awaited the same connection event twice; fixing the harness produced the successful final check. No application edits were needed for these corrections.

## F. Documentation alignment

The plan/task documents preserve milestone structure and IDs and now require:

- One Next.js + PostgreSQL + **Prisma** application with server-only services/DAL and authorization on every protected operation.
- Both fitted caps (stocked color/size SKU combinations) and adjustable caps (usually one-size/color SKUs) in the first-release model/UI. Unapproved products stay unpublished.
- USD and **new SYP only**, no historical old-SYP support/migration, independently configurable precision, exact arithmetic, approved conversion/rounding/settlement rules, and immutable monetary snapshots.
- Syria-only guest COD, Arabic RTL/English LTR, transactional inventory/orders, idempotency, bounded conflict retries, and safe reservation release.
- Permanent RT side/inside branding and back badge except approved special editions; variable front artwork; no unauthorized registration symbol.

Only F01 is complete. Both product types are requirements for future implementation; demo data is not expanded or connected to PostgreSQL in this sprint.

## G. Remaining issues and owner decisions

Dependency findings fell from 31 to two by updating shadcn 4.19.0 to 4.23.0, baseline-browser-mapping within Next's accepted range, and Zod/Zod-validation-error within React Hooks' accepted ranges. Existing Next, React, Tailwind, and TypeScript versions are preserved. No forced unsupported upgrades or blanket overrides were used.

| Remaining dependency | Finding | Follow-up |
| --- | --- | --- |
| `minimatch` 10.2.5 through TypeScript/shadcn tooling | Moderate [advisory](https://github.com/advisories/GHSA-g3hv-75wg-m249); patched range starts at 11.0.1. | Track compatible upstream updates; do not force a major under packages that constrain it to 10. |
| `deepmerge` 4.3.1 through shadcn tooling | Low [advisory](https://github.com/advisories/GHSA-gcqx-w48m-w2h4). | Track an upstream compatible fix and rerun audit after changes. |

The audit is not clean. Findings/severities are recorded; exploitability of every transitive tool has not been independently assessed. Reassess remaining findings before production release.

Owner inputs remain under D01–D04: approved assets/variants/stock for both types; actual USD/new-SYP prices and precision/rounding/conversion/settlement rules; courier areas/fees/COD procedures; policies/contact details; service availability and maintenance ownership. A GitHub repository/remote is needed for hosted CI. Switch the machine-wide Node version to the project pin for normal commands, or use the verified project-local runtime for this session.

No real checkout, orders, admin dashboard, customer auth, payments, product schema, major refactor, deployment, commit, or push was performed. Existing prototype issues (quick-add sizing, currency relabeling, `®`, dialogs, and anchors) remain on their own tasks.

## H. Next task

Start **F03 — Fix demo size, currency, and quantity behavior**. It has no business-input dependency and improves shopping correctness while checkout remains disabled. Then F04/F05 can proceed while D01–D04 inputs are gathered. Database modeling stays in C01 after its dependencies are met.
