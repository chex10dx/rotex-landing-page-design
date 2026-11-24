# ROTEX project review

Reviewed: 17 November 2026. Request: inspect the existing project and plan a complete e-commerce website with a staff dashboard and backend. This review changes documentation only. The [implementation plan](ECOMMERCE_PLAN.md) describes the target; the [task checklist](ECOMMERCE_TASKS.md) remains the source of verified task status.

Implementation follow-up, 18 November: Next.js/Next ESLint plugin are now 16.4.6, TypeScript ESLint is 8.73.0, and F03 size/currency/quantity corrections are implemented. The findings and failed browser attempt below describe the 17 November snapshot; use the [Phase 1 report](PHASE_1_REPORT.md) for current tests, successful browser verification, and remaining development-only audit findings. This historical review is not a new implementation checklist.

## Assessment

ROTEX has a storefront prototype and a documented development foundation. It does not yet have a commerce backend. Keep the current home-page layout and branding direction, then build catalog storage, shopping routes, order handling, and staff operations around it. A dashboard becomes useful when its screens operate on the same durable products, stock, and orders as the customer website.

The selected architecture already suits this goal: one Next.js App Router application, TypeScript, Tailwind CSS, server-only business services, PostgreSQL, and Prisma. The backend will live inside this application. Prisma, its schema, and database connectivity are future work; the existing Compose file prepares optional local PostgreSQL only.

## Findings from the current repository

| Area | Observed evidence | Consequence and planned task |
| --- | --- | --- |
| Routes and UI | `app/page.tsx` renders `components/rotex-storefront.tsx`, a 407-line client component. There are no shop, product, checkout, admin, or API route files. | Keep the home design; introduce feature components and real routes under F05, C02, C04, C05, O03, and A01–A03. |
| Product catalog | `lib/products.ts` contains six records. The type permits only `Fitted`, with one remote image and a sample numeric price per record. No SKU, stock, publication state, or translations exist in this model. | C01 must represent actual fitted color/size and adjustable color/one-size variants. Approved assets and stock are required before publication. |
| Size selection | Both size states and `openQuickView()` default to `7¼`; product-card quick-add passes that size directly. Every sample size is offered. | F03 must require explicit fitted-size selection. C05 then uses only real stocked variants. |
| Bag | Lines contain entire demo product objects in `useState`. There is no browser persistence or server reconciliation. The spotlight caps quantity at nine, but add/update functions do not enforce that cap. | Centralize quantity rules in F03. C06 persists variant references and quantities and reconciles with trusted catalog data. |
| Money | `Price()` prints the same amount with either a dollar sign or `SYP`. Product prices contain no currency or precision. | F03 removes misleading demo switching. C03 adds approved USD/new-SYP pricing, exact arithmetic, and independently configured precision. |
| Checkout and persistence | Continue only sets a disabled-checkout notice. No Prisma dependency, schema, order service, or database access exists. | C01 and O01–O04 implement persistence, quoting, atomic orders, guest checkout, and private status. |
| Staff dashboard | No `app/admin/`, staff authentication, permissions, or audit trail exists. | A01–A04 implement protected operations, product/stock management, fulfillment, and COD reconciliation. |
| Localization | English/Arabic dictionaries and an RTL wrapper exist inside the component; `app/layout.tsx` keeps `<html lang="en">`. Search uses English product fields. | C02 introduces locale routes and complete translated content; C04 adds bilingual search. |
| Accessibility | Custom bag/quick-view/account overlays have dialog roles but no implemented Escape handler or focus containment/restoration. CSS removes some input/select outlines and uses very small supporting text. | F04 addresses keyboard, focus, touch, and readability; Q02 verifies the full purchase journey. |
| Branding/navigation | Header/footer render an unverified registration symbol. Several links use `#fitted`, which has no matching ID. Adjustable copy still says it is a future release. | F02 fixes branding/navigation and aligns copy with both cap types being required for launch. |
| Images and fonts | Product boards are remote Vercel Blob URLs; image optimization is disabled in `next.config.mjs`. Arabic fonts load through a Google Fonts CSS import. | F06 establishes approved media ownership, responsive image delivery, and reliable font loading. Provider availability remains D04. |
| Support and optional features | Account, newsletter, shipping, and some contact/social destinations are demonstrations or placeholders. | A05 supplies real bilingual support/policies and hides unfinished optional features at launch. |
| Quality foundation | Strict TypeScript, ESLint, route type generation, production build, a GitHub workflow, version pins, and optional PostgreSQL Compose are present. There is no test script. | Preserve F01. Add meaningful commerce tests alongside the relevant features and consolidate them under Q01. |
| Current dependency check | A fresh audit reports two moderate findings: `next` and `minimatch`. The first production-build attempt exits 1 with a Next.js security reminder; retry exits 0 while retaining the warning. | Prioritize a focused dependency security follow-up before feature work. A successful retry does not resolve the advisory. |
| Toolchain consistency | `.node-version` specifies 24.22.3; the default shell reports 24.14.0. Both `pnpm-lock.yaml` and `package-lock.json` are tracked. | Use the pinned runtime for checks. In a focused setup follow-up, remove the redundant npm lockfile and retain pnpm as the single dependency workflow. No lockfile is changed by this review. |
| Git/CI | The initial working tree is clean and Git has an `init` commit. No remote is configured. | Hosted CI has not been demonstrated by this review. Connecting the intended repository remains a separate action. |

The [Sprint 1 report](SPRINT_1_REPORT.md) is historical evidence from 16 November. Its statements about no commits describe that session; this scan finds an initial commit now. Its dependency findings also differ from the fresh audit below. Preserve that report as a record of its own session and use current audit evidence for new work.

The official [Next.js advisory GHSA-mfr8-8qww-v76h](https://github.com/vercel/next.js/security/advisories/GHSA-mfr8-8qww-v76h) includes installed 16.4.3 in its affected range and lists 16.4.5 as patched. It concerns specific cache/root-parameter usage; this scan found no `use cache`, `unstable_cache`, or `cacheComponents` usage in the application source/config, and does not claim demonstrated exploitation. Upgrade to a compatible patched release after reviewing all current official advisories and matching Next tooling; rerun the frozen install, lint, typecheck, build, and smoke checks. The [minimatch advisory](https://github.com/advisories/GHSA-g3hv-75wg-m249) requires a compatible upstream resolution rather than a forced transitive major-version override. No dependency is upgraded during this planning task.

## Target experience

Customer: home → shop/search → product → choose a real variant → persistent bag → delivery quote → guest COD checkout → durable confirmation → private order status. Complete this journey in Arabic/RTL and English/LTR, including errors, mixed-script sizes, fees, and the amount due on delivery.

Staff: sign in → see orders needing action → confirm → pack → hand to courier → record delivery or failure/return → reconcile collected and remitted cash. Staff also prepare products, translations, images, prices, and individual SKU stock without editing source code. The detailed dashboard screen plan is in the implementation plan.

The first launch follows the scope already recorded in the project: Syria, configured delivery zones, guest COD, both fitted and adjustable caps, and USD/new-denomination SYP only. Real product, currency, courier, and policy inputs still require owner approval. Customer accounts, online payments, international delivery, loyalty, and reviews remain later work.

## Implementation order

These are proposed work packages, not completed sprints or automatic authorization to implement the entire store. Keep the existing task IDs and acceptance criteria.

| Order | Work and existing task IDs | Reviewable result |
| --- | --- | --- |
| 0 | Focused security/setup follow-up: patch affected Next.js and matching tooling after official compatibility review; resolve or document transitive findings; use the pinned Node runtime and retain only the pnpm lockfile. This is a newly identified prerequisite, not a task marked complete. | Reproducible checks and an accurate dependency-risk record before feature implementation. |
| 1 | F03, F04, then F05; collect D01–D04 alongside them. F02 can fix the symbol/anchors before final assets arrive. Record the toolchain cleanup separately. | Correct, accessible demo interactions; smaller components and a catalog contract; current visual layout preserved. Ordering stays disabled. |
| 2 | C02 after F05. Once D01/D02/D04 are satisfied, implement C01, then C03. Add the foundational money and catalog validation tests here. | Locale URLs and a database-backed fitted/adjustable catalog with real variants, stock, and approved prices. |
| 3 | A01, then A02 after its F06 media dependency. F06 itself follows D01/D04/F05. | Authorized staff can maintain products, approved media, translations, prices, and SKU inventory. Build this before staff must rely on real orders. |
| 4 | C04/C05, then C06, respecting their locale/money/media dependencies. | Real browsing and product pages, accurate fit/availability, and one persistent bag across languages and routes. |
| 5 | O01/O02, then A03 in private development/staging. Add transaction, concurrent-stock, duplicate-submission, and authorization tests as these operations are written. | Trusted quotes, atomic orders/reservations, and staff fulfillment/COD operations. Include a runnable reservation-expiry mechanism and retry-safe release. |
| 6 | O03/O04, A04/A05; build the dashboard overview from real records. | End-to-end guest ordering, private status, a durable staff work queue, reliable follow-up, and approved support pages. |
| 7 | Q01–Q04 after their dependencies. | Evidence from commerce tests, mobile/RTL/accessibility review, metadata checks, private staging, restore/rollback drills, and a staff rehearsal before launch. Deployment requires a separate explicit instruction. |

Milestones M2–M4 overlap: staff access and product management can begin once storage is ready, while storefront pages are being completed. Checkout must remain closed to public orders until staff operations and all launch checks pass. Q01 is the final combined test gate; it is not a reason to postpone tests until checkout is finished.

The existing plan estimates approximately 4–7 developer weeks for the overall first release, assuming one developer, approved inputs, and accessible services. This is an effort range, not a scheduled delivery date. Re-estimate after the launch-input decisions and the first catalog/admin work package; content, provider, and courier waiting time is additional.

## Inputs to gather

- D01: approved brand files and product galleries, names/descriptions in both languages, actual SKUs, colors, fitted sizes or adjustable details, and opening stock for both product types.
- D02: approved prices, independent USD/new-SYP precision, settlement currency, rounding, charges, and either explicit prices or an approved conversion policy with rate provenance.
- D03: delivery areas/fees, courier procedure, address requirements, order confirmation owner, reservation expiry, cancellations, returns, and cash remittance process.
- D04: usable hosting/database/media/staff-auth services, costs, domain ownership, backup requirements, and maintenance owner. No provider is selected or provisioned by this scan.
- Approved contact details, support hours, social links, and bilingual shipping/returns/privacy/terms content for A05.

Prototype cleanup and localization preparation can proceed while these inputs are gathered. Production catalog publication, payable totals, and real order acceptance depend on them.

## Verification for this review

Checks used existing installed dependencies and the project-local Node 24.22.3 runtime with cached Corepack/pnpm 12.3.4. The default shell still uses Node 24.14.0. The following is the exact launcher setup used for package commands; `corepack pnpm ...` is the ordinary README equivalent once the default Node runtime matches the pin:

```powershell
$taskNodeDir = (Resolve-Path '.cache/node/node-v24.22.3-win-x64').Path
$env:PATH = "$taskNodeDir;$env:PATH"
$env:COREPACK_HOME = (Resolve-Path '.cache/corepack').Path
& "$taskNodeDir/node.exe" 'C:/Program Files/nodejs/node_modules/corepack/dist/corepack.js' pnpm lint
& "$taskNodeDir/node.exe" 'C:/Program Files/nodejs/node_modules/corepack/dist/corepack.js' pnpm typecheck
$env:NEXT_TELEMETRY_DISABLED = '1'
& "$taskNodeDir/node.exe" 'C:/Program Files/nodejs/node_modules/corepack/dist/corepack.js' pnpm build
# The same build command was retried after the security reminder.
& "$taskNodeDir/node.exe" 'C:/Program Files/nodejs/node_modules/corepack/dist/corepack.js' pnpm audit --json
& "$taskNodeDir/node.exe" 'C:/Program Files/nodejs/node_modules/corepack/dist/corepack.js' pnpm start --hostname 127.0.0.1 --port 3210
```

| Command/check | Current result | Limit |
| --- | --- | --- |
| `corepack pnpm lint` through the pinned launcher above | PASS, exit 0. | Existing dependency installation. |
| `corepack pnpm typecheck` through the pinned launcher above | PASS, exit 0; route types generated and strict TypeScript passed. | Does not establish commerce behavior that has not been implemented. |
| `corepack pnpm build` through the pinned launcher above | First attempt: exit 1 after compilation/prerendering, with `SecurityFatalError`. Same-command retry: exit 0, `/` and not-found prerendered, security warning remains. | Dependency remediation remains open; do not treat retry success as a security fix. |
| `corepack pnpm audit --json` through the pinned launcher above | Exit 1: two moderate findings, `next` and `minimatch`; zero high/critical in this audit response. | Point-in-time registry report, not a complete exploitability assessment. Raw output is ignored at `.cache/project-review-audit.json`. |
| `pnpm start --hostname 127.0.0.1 --port 3210` through the pinned launcher, then `& '.cache/node/node-v24.22.3-win-x64/node.exe' '.cache/http-smoke.cjs'` | PASS: home 200, all six products/demo label, nine compiled assets 200, unknown route 404. | No environment file/database required. This is an HTTP smoke check, not a full visual review. |
| `& '.cache/node/node-v24.22.3-win-x64/node.exe' '.cache/project-review-browser-smoke.cjs'` | INCOMPLETE: headless Chrome connected, but the CDP `Page.enable` command timed out before navigation/page assertions. | The old ignored harness first exited without completing its checks; a temporary copy with a unique profile and referenced timeout made that failure explicit. No browser-interaction pass is claimed. |
| `docker compose --env-file .env.example config --quiet` | Exit 0; configuration validates. Docker prints access-denied warnings for the user-level Docker config file. | No container startup, SQL, health, or persistence check repeated in this documentation review. |
| `& '.cache/node/node-v24.22.3-win-x64/node.exe' '.cache/final-review.cjs'`; `git diff --check`; `git diff --cached --name-only` | PASS: all 16 original application/assets match the earlier baseline, local document links resolve, task IDs/status remain intact, lockfile unchanged, diff whitespace check passes, staging empty. | Only F01 remains checked complete. |

No fresh dependency installation was performed: this task changes documentation only and does not claim a new clean-install proof. There is no automated test script to run. Hosted CI, production behavior, real device coverage, measured performance, and database connectivity are not established by these checks. The review's local server was stopped after the smoke checks. No application, dependency, database, or infrastructure changes are part of this review. Task checkboxes and the historical Sprint 1 report remain unchanged. No commit, push, provisioning, or deployment was performed.
