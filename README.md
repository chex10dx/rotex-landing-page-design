# ROTEX storefront

Premium headwear storefront built with Next.js App Router, TypeScript, React, and Tailwind CSS. The current home page is an interactive **prototype** using six fitted-cap mock records. Prices, bag, account, newsletter, and checkout are demo behavior.

The selected architecture is one Next.js application with PostgreSQL, Prisma ORM, server-only business services, and a Data Access Layer. Prisma/database modeling starts in C01; the storefront currently has no database dependency. Both fitted and adjustable caps belong in the first-release catalog and UI. Launch market: Syria, guest cash on delivery, Arabic and English, USD and new-denomination SYP only.

## Prerequisites and version pins

- **Node.js 24.22.3**, pinned in `.node-version`; `package.json#engines` permits security updates in the same 24.x line from that version onward. Use a Windows-compatible version manager such as fnm, or the [official Node installer](https://nodejs.org/en/download). Switch to the pinned version before installing dependencies.
- **pnpm 12.3.4**, pinned in `package.json#packageManager` and enforced by workspace settings. Preserve `pnpm-lock.yaml`.
- Git for local history. GitHub is the selected remote host; connecting the owner's repository is separate from local setup.
- Optional: Docker Desktop with Linux containers and Docker Compose v2+ for local PostgreSQL preparation.

Node 24.22.3 is an [LTS security release](https://nodejs.org/en/blog/release/v24.22.3); the inspected machine initially had 24.14.0. No system-wide Node upgrade is performed by this repository. `.node-version` works with fnm and is read by CI's Node setup action.

## Run locally on Windows

With the pinned Node version and Corepack installed, run these commands from the project root:

```powershell
node --version
corepack pnpm --version
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

Open <http://localhost:3000>. Stop the server with Ctrl+C. No environment file, PostgreSQL, Prisma setup, or credentials are required for the demo.

Corepack is a launcher for the pinned pnpm version, not a second package manager. If Corepack is unavailable, install the same pnpm with `npm.cmd install --global pnpm@12.3.4`, then use `pnpm.cmd` in place of `corepack pnpm`. This does not create an npm lockfile. The `.cmd`/Corepack forms work when Windows blocks `.ps1` wrappers; do not change PowerShell's execution policy for this project.

## Quality and production commands

```powershell
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
corepack pnpm start
```

- `lint`: real ESLint checks, failing on warnings as well as errors.
- `typecheck`: `next typegen` followed by strict `tsc --noEmit`, so a clean checkout generates route types before checking them.
- `build`: production compilation, TypeScript validation, and prerendering. TypeScript errors are not suppressed.
- `start`: serves the completed production build on port 3000. Run `build` first.

`test` runs eight focused storefront-rule tests with Node's built-in runner and native TypeScript stripping, using the pinned Node version. They cover explicit sizes, adjustable one-size fixtures, unavailable options, quantity limits, variant merging/removal, integer-cent totals, and disabled SYP pricing. CI detects this script and runs it alongside frozen installation, lint, typecheck, and production build on pull requests, pushes to `main`/`develop`, and manual dispatch. These checks require no secrets or database. Full commerce/integration coverage remains Q01.

Phase 1 uses Next.js/Next ESLint plugin 16.4.6 and TypeScript ESLint 8.73.0. The production-only audit is clean; the full audit retains one high and one moderate finding in development tools. See the [Phase 1 report](docs/PHASE_1_REPORT.md) for exact evidence, compatibility, Windows installation details, and remaining limits. Use pnpm only; the redundant npm lockfile has been removed.

ESLint uses the [official Next.js plugin directly](https://nextjs.org/docs/app/api-reference/config/eslint#using-the-plugin-directly), with its recommended/Core Web Vitals rules, TypeScript recommended rules, and React Hooks recommended rules. This keeps the lint toolchain on supported ESLint 10 without pulling the broader preset's legacy plugin peer ranges. Next.js 16 uses the ESLint CLI; `next lint` is not available. [Type generation](https://nextjs.org/docs/app/api-reference/cli/next#next-typegen-options) is separate from compilation.

## Optional local PostgreSQL

The Compose file prepares a local database only. It does not create an e-commerce schema, run Prisma, or connect the storefront.

```powershell
Copy-Item -LiteralPath .env.example -Destination .env
# Edit .env: replace the example password and match DATABASE_URL to the values.
docker compose config --quiet
docker compose up -d --wait postgres
docker compose ps
docker compose exec postgres sh -c 'pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
docker compose stop postgres
# Remove the project's containers/network while retaining the development data:
docker compose down
```

Copy the example only if `.env` does not already exist; preserve any existing local values. The example file is also usable for syntax-only validation without creating a local environment: `docker compose --env-file .env.example config --quiet`.

The image is pinned to `postgres:17.12-alpine3.23`, an [official PostgreSQL image](https://hub.docker.com/_/postgres). Port 5432 binds only to `127.0.0.1`; set `POSTGRES_PORT` if the port is occupied. Compose manages a named `postgres_data` volume under the `rotex-development` project. `stop` and `down` preserve it. Do not use `down --volumes` unless intentionally deleting this project's development database. Initial database/user/password values apply when the volume is first initialized; editing `.env` alone does not update an existing database password.

Environment names (all server/development-only):

| Name | Purpose |
| --- | --- |
| `POSTGRES_USER` | Local PostgreSQL user. |
| `POSTGRES_PASSWORD` | Local password; replace the committed example placeholder. |
| `POSTGRES_DB` | Local database name. |
| `POSTGRES_PORT` | Host port; defaults to 5432. |
| `DATABASE_URL` | Future Prisma connection string. Keep user/password/database/port aligned and URL-encode credentials. Currently unused by the app. |

Never prefix database variables with `NEXT_PUBLIC_`. `.env` and other local environment files are ignored; `.env.example` contains names and disposable examples only. No real credentials or production URLs belong in source control. Next.js manages `NODE_ENV`; do not set it in the example.

## Directory responsibilities

```text
app/                         Existing routes, layout, metadata, global CSS
components/                  Current storefront and reusable UI primitives
lib/products.ts              Current mock catalog
lib/utils.ts                 Existing shared UI utility
public/                      Existing icons and static assets
docs/                        Roadmap, task checklist, sprint verification
.github/workflows/ci.yml      GitHub quality checks
compose.yaml                 Optional local PostgreSQL infrastructure
```

F03 adds `lib/storefront-rules.ts` for demo size/cart/quantity rules and `lib/money/demo.ts` for integer-cent USD demo formatting and disabled new-SYP selection. Future task-owned boundaries: `app/[locale]/` for localized routes; `app/admin/` for staff pages; `lib/catalog/` for catalog interfaces; `lib/server/services/`, `lib/server/dal/`, and `lib/server/auth/` for business logic, Prisma access, and authorization; approved multi-currency rules in `lib/money/` and language support in `lib/i18n/`; `prisma/` for schema/migrations in C01. These future modules are not scaffolded early. See [AGENTS.md](AGENTS.md) for coding, scope, security, brand, currency, and verification rules.

## Planning and next work

- [Project review and proposed build order](docs/PROJECT_ANALYSIS.md)
- [E-commerce plan](docs/ECOMMERCE_PLAN.md)
- [Implementation tasks and dependencies](docs/ECOMMERCE_TASKS.md)
- [Sprint 1 verification report](docs/SPRINT_1_REPORT.md)
- [Phase 1 implementation and verification](docs/PHASE_1_REPORT.md)

Approved product assets/inventory, actual prices, new-SYP precision/rounding/conversion rules, settlement currency, courier zones/fees, and store policies remain owner decisions. Keep demo labeling and checkout disabled until later implementation and launch checks are complete. F03 corrects currency relabeling, implicit fitted sizes, and inconsistent quantity limits; unverified `®` and dialog/navigation gaps remain assigned to F02/F04.
