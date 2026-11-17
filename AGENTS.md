# ROTEX project instructions

## Architecture and status

ROTEX is one full-stack Next.js App Router application using TypeScript and Tailwind CSS. PostgreSQL and Prisma ORM are selected for future persistence. Use Server Components by default, small Client Components for interaction, and Server Actions/Route Handlers as transport boundaries. Business services and the Data Access Layer (DAL) belong on the server.

The current storefront is a demo backed by `lib/products.ts`. Planning documents describe future work, not implemented behavior. Preserve its layout, assets, content, and existing interactions unless the assigned task explicitly changes them. Do not build ASP.NET Core, NestJS, separate backend services, microservices, RabbitMQ, or Kubernetes.

## Folder conventions

- `app/`: route entry points, layouts, metadata, and global styles. Future locale routes live in `app/[locale]/`; staff routes in `app/admin/`.
- `components/`: reusable UI; `components/ui/` holds existing primitives. Extract feature/layout components only within a relevant task.
- `lib/products.ts`: current demo data. Future catalog contracts/adapters belong in `lib/catalog/`.
- `lib/server/services/`: future business operations such as pricing, inventory, and order handling. Mark server modules with `import 'server-only'`.
- `lib/server/dal/`: future Prisma access and persistence queries; never import into client components.
- `lib/server/auth/`: future server-side staff session/authorization helpers.
- `lib/money/`, `lib/i18n/`: future shared money primitives and locale dictionaries/helpers.
- `prisma/`: schema and migrations starting with C01. Prisma dependencies, schema, migrations, and database connections are not part of Sprint 1.
- `public/`: approved static brand/product assets; preserve permanent logo geometry.
- `docs/`: plan, task status, setup details, and verification evidence. `.github/workflows/`: quality CI.

These future boundaries are conventions, not instructions to scaffold empty modules or refactor the storefront early.

## Toolchain and coding style

Use the Node version in `.node-version` and pnpm version in `package.json#packageManager`; retain `pnpm-lock.yaml`. On Windows with Corepack installed, `corepack pnpm <command>` avoids PowerShell `.ps1` execution-policy problems. Do not mix npm/yarn/bun lockfiles or change the system execution policy.

Match the existing TypeScript style: two spaces, single quotes, no unnecessary semicolons, explicit domain types, and the `@/` path alias. Keep strict TypeScript checks and ESLint enabled; fix problems instead of adding blanket suppressions. Check official compatibility and advisories before dependency changes. Keep lockfile updates focused.

## Security and business rules

- Keep secrets in ignored local environment files or hosting secret storage; document names and example placeholders in `.env.example`. Never commit credentials, tokens, real customer data, or local database dumps.
- Never expose credentials or database URLs through `NEXT_PUBLIC_`, client imports, logs, or analytics. The demo must run without a database or environment file.
- Validate public input on the server. Treat Server Actions and Route Handlers as callable entry points; check staff identity and authorization on every protected read/mutation, not only in layouts or navigation.
- Future checkout must recalculate prices, stock, zone eligibility, and fees from trusted data. Reserve stock and create the order together with Prisma transactions and conditional stock updates/appropriate locking. Include idempotency, bounded retries, reservation expiry, and safe stock release; never hold a transaction open across external network calls.
- Syria is the initial market, with guest COD checkout limited to configured delivery zones. No real checkout, production orders, admin implementation, customer auth, payments, or deployment in Sprint 1.
- Both fitted and adjustable caps are first-release requirements. Fitted caps have closed backs, no plastic adjustment strap, and a unique SKU/stock per actual color/size. Example sizes are 7, 7⅛, 7¼, 7⅜, 7½, 7⅝, 7¾; availability comes from inventory. Adjustable caps usually have one-size variants and unique SKU/stock per color, with verified snapback/strapback details where applicable. Never invent missing variants or publish products without approved imagery, prices, and stock records.

## Currency, localization, and branding

- Support USD and **new-denomination SYP only**. Historical old SYP data and migrations are out of first-release scope.
- Use integer amounts with explicit currency precision, or another exact representation where required; never floating-point money totals. Do not assume USD and SYP have the same minor-unit precision.
- Currency precision, pricing/conversion policy, rounding, rate source/effective date when applicable, and settlement currency must be configurable and approved before orders are enabled. Never invent a rate or relabel an unchanged amount as conversion. Preserve immutable order money snapshots.
- Plan for the full purchase journey in Arabic/RTL and English/LTR, including form errors, labels, prices, sizes, and confirmation.
- Preserve the RT side monogram and inside ROTEX branding. Preserve the back ROTEX badge except documented, approved special editions. Front artwork varies by product; do not redesign permanent marks or introduce unlicensed artwork.
- Do not add `®` unless registration has been verified and use authorized. Existing violations remain documented for F02 when outside the assigned scope.

## Testing, scope, and Definition of Done

1. Inspect the current code and task dependencies before editing. Do not infer completion from a plan.
2. Implement only the assigned task. Sprint 1 is F01 plus documentation alignment; application edits are allowed only to fix failures in its checks. Explain each such edit.
3. Run `corepack pnpm install --frozen-lockfile` from a clean state where feasible, then `corepack pnpm lint`, `corepack pnpm typecheck`, and `corepack pnpm build`. Run tests when a real test script exists; do not create fake/no-op tests. Use focused tests for meaningful behavior as features are added.
4. For foundation changes, smoke-check the existing storefront using a local server. Validate Compose configuration and container health when Docker is usable. Never substitute a claimed pass for unavailable tooling or a failed check.
5. Review the diff and staged filenames for scope and secrets. Do not commit, push, provision cloud services, or deploy automatically.
6. Update `docs/ECOMMERCE_TASKS.md` only after the task's acceptance criteria are verified. Record exact commands, outcomes, and unresolved limits in the sprint report; keep unrelated checkboxes pending.
7. A task is done when its behavior and required checks pass, existing storefront behavior is preserved, setup/docs are accurate, and limitations are stated. Follow explicit user scope over inferred work from this file.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
