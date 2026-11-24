# ROTEX Phase 1 implementation report

Date: 18 November 2026. Scope: compatible dependency security fixes and F03 storefront correctness, explicitly authorized after the original Sprint 1. This is an implementation/verification record, not a new project plan.

## Actual changes

- Upgraded Next.js and its official ESLint plugin from 16.4.3 to 16.4.6. Updated TypeScript ESLint from 8.72.2 to 8.73.0, which uses patched minimatch 11 in its parser dependency graph. Kept the pinned Node/pnpm workflow and existing pnpm lockfile.
- Moved shadcn to development dependencies: its CLI and imported Tailwind CSS are build/development inputs, not storefront request handlers. Its CSS import and the existing UI primitive remain intact. This classification does not fix or hide its remaining findings in the full audit.
- Removed the redundant tracked npm lockfile. The old installed directory was an npm-style tree and did not match the pnpm lock exactly; the fresh pnpm installation now follows `pnpm-lock.yaml`, including React/React DOM 19.2.4, unchanged from that lockfile.
- Fitted quick-add now opens quick view with no chosen size. Quick view resets selection whenever opened; spotlight also starts unselected. Add buttons require an allowed, explicitly chosen size. The selected size is shown with pressed-state semantics and text, with numeric size direction isolated in Arabic.
- Added shared selection/quantity/cart rules. Repeated additions merge a product/size line; different sizes remain separate. Additions and cart controls enforce safe integer quantities from 1 to 9 per line, including the cumulative existing quantity. Decrementing the last unit removes the line, preserving the demo interaction.
- Product types and selection UI accept adjustable caps and a localized one-size choice. Optional explicit size options can disable unavailable choices or provide an empty selection list. Only the existing six fitted demo products are published; adjustable examples exist only in tests. No SKU or stock records were invented.
- Replaced ambiguous whole-price numbers with integer USD cents (`5800` still displays as `$58`). Bag totals use integer arithmetic with safe-range checks; formatting uses integer/BigInt units to preserve the last cent even at the safe-number limit. Formatting and currency-selection rules live together; SYP is disabled in both selectors with a localized explanation until approved new-SYP prices/rules exist. No exchange rate, SYP precision, or conversion was invented.
- Added eight real tests using Node's built-in test runner and native type stripping, without a new application test dependency. Existing CI automatically detects and runs the new `test` script.

The six product IDs/names/descriptions/colors/images and visible USD sample prices are preserved. The home layout, logos, permanent marks, navigation destinations, account/newsletter demos, and disabled checkout are unchanged. The only CSS addition styles disabled size/quantity/add controls. F04/F05 and all catalog/order/admin work remain outside this implementation.

## Dependency review and remaining findings

Official Next.js [16.4.6 release](https://github.com/vercel/next.js/releases/tag/v16.4.6), installed package metadata, npm registry manifests, and [TypeScript ESLint compatibility guidance](https://typescript-eslint.io/users/dependency-versions/) were checked before changing dependencies. Node 24.22.3 satisfies the selected packages' engine requirements. React/React DOM 19.2.4 satisfy Next 16.4.6's React 19 peer range; React DOM's React peer matches. ESLint 10.15.0, TypeScript 5.7.3, React Hooks ESLint 7.1.1, and TypeScript ESLint 8.73.0 have compatible declared ranges. Frozen installation, lint, types, build, and browser hydration validate this combination locally.

| Finding | Before | After / decision |
| --- | --- | --- |
| Next.js [GHSA-mfr8-8qww-v76h](https://github.com/vercel/next.js/security/advisories/GHSA-mfr8-8qww-v76h) | Moderate, 16.4.3: root-parameter cache disclosure under the advisory's specific cache usage. | Fixed by 16.4.6; the advisory's patched 16.x version begins at 16.4.5. No such cache usage was found in this storefront. |
| Next.js [GHSA-vc7v-qv4w-wrv8](https://github.com/vercel/next.js/security/advisories/GHSA-vc7v-qv4w-wrv8) | Moderate, 16.4.3: nested cache disclosure through delayed metadata. | Fixed by 16.4.6; absent from the final audit. |
| minimatch [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) | Moderate, 10.2.5 through TypeScript ESLint and shadcn/ts-morph. | TypeScript ESLint path resolved by compatible 8.73.0 update. One 10.2.5 path remains through shadcn 4.23.0 → ts-morph 26 → @ts-morph/common. The caller constrains the older major; no compatible upstream fix was available. No forced override. Development tooling only. |
| picomatch [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf) | High, versions 2.3.2/4.0.4 in glob-related tool dependencies. The advisory was updated 17 November. | Remains through Next's ESLint plugin, TypeScript ESLint, and shadcn tooling. The official advisory lists no patched version; the registry's latest 4.0.7 is still affected. No unsupported replacement/override. Development tooling only. |

The full audit changed from **1 high + 3 moderate** to **1 high + 1 moderate**. The final production-only audit reports **zero findings**. The full audit is not clean. The remaining packages process tool/build-time glob patterns; they are not imported by storefront JavaScript or exposed as public handlers. Avoid running generators/lint/build against untrusted attacker-supplied patterns, and recheck compatible upstream releases. This is a dependency-path assessment, not proof that every possible tool execution is safe.

The other November Next advisories were also reviewed: [response forwarding](https://github.com/vercel/next.js/security/advisories/GHSA-pc58-hwjq-p385), [binary cache arguments](https://github.com/vercel/next.js/security/advisories/GHSA-rhh4-g77r-r9qj), [fallback-shell cache poisoning](https://github.com/vercel/next.js/security/advisories/GHSA-vvgp-ww4w-46vf), [SVG image rejection](https://github.com/vercel/next.js/security/advisories/GHSA-7qx7-33qx-rqx2), and [Edge HttpOnly response headers](https://github.com/vercel/next.js/security/advisories/GHSA-f3mh-rxg3-f5g2). The selected release is beyond their affected 16.x ranges. The app has no public handlers, Edge routes, or Cache Components setup, and image optimization remains disabled; no exploit of these paths was demonstrated or claimed.

## Windows dependency-folder investigation

At the start, `node_modules` was an ordinary directory with npm's `.package-lock.json`, no `.pnpm` directory or pnpm `.modules.yaml`, and installed React 19.3.1 rather than the pnpm-locked 19.2.4. No running Node processes were found in the initial check. Directory attributes/ACLs were inspected read-only.

The earlier rename/removal error did **not** reproduce in this session. After resolving both absolute paths and checking they stayed inside this project, `Move-Item` successfully preserved the complete old directory at ignored `.cache/phase1-original-node_modules`. A normal pnpm install then created a fresh directory with its expected `.pnpm` layout. No recursive delete, ownership/ACL change, execution-policy change, elevated workaround, machine-wide Node upgrade, or process killing was used. The historical failure's exact lock/permission cause cannot be established from this successful attempt; do not claim it was conclusively diagnosed.

For future dependency reinstalls, stop this project's servers/watchers, keep using pinned pnpm, and attempt ordinary installation first. Preserve a failing directory for diagnosis rather than force-deleting it or changing system permissions. The ignored backup remains available locally; it is not committed and is not used by the app.

## Commands and verification

The system Node remains 24.14.0. Checks used the existing project-local 24.22.3 binary and cached Corepack/pnpm 12.3.4. For this Windows session, the exact launcher setup was:

```powershell
$taskNodeDir = (Resolve-Path '.cache/node/node-v24.22.3-win-x64').Path
$env:PATH = "$taskNodeDir;$env:PATH"
$env:COREPACK_HOME = (Resolve-Path '.cache/corepack').Path
& "$taskNodeDir/node.exe" 'C:/Program Files/nodejs/node_modules/corepack/dist/corepack.js' pnpm install --store-dir .cache/pnpm-store
& "$taskNodeDir/node.exe" 'C:/Program Files/nodejs/node_modules/corepack/dist/corepack.js' pnpm install --frozen-lockfile --store-dir .cache/pnpm-store
& "$taskNodeDir/node.exe" 'C:/Program Files/nodejs/node_modules/corepack/dist/corepack.js' pnpm lint
& "$taskNodeDir/node.exe" 'C:/Program Files/nodejs/node_modules/corepack/dist/corepack.js' pnpm typecheck
& "$taskNodeDir/node.exe" 'C:/Program Files/nodejs/node_modules/corepack/dist/corepack.js' pnpm test
$env:NEXT_TELEMETRY_DISABLED = '1'
& "$taskNodeDir/node.exe" 'C:/Program Files/nodejs/node_modules/corepack/dist/corepack.js' pnpm build
& "$taskNodeDir/node.exe" 'C:/Program Files/nodejs/node_modules/corepack/dist/corepack.js' pnpm audit --json
& "$taskNodeDir/node.exe" 'C:/Program Files/nodejs/node_modules/corepack/dist/corepack.js' pnpm audit --prod --json
& "$taskNodeDir/node.exe" 'C:/Program Files/nodejs/node_modules/corepack/dist/corepack.js' pnpm start --hostname 127.0.0.1 --port 3210
```

On a machine already using the pinned Node version, the equivalent normal commands are `corepack pnpm install --frozen-lockfile`, `corepack pnpm lint`, `corepack pnpm typecheck`, `corepack pnpm test`, `corepack pnpm build`, and `corepack pnpm audit`.

| Check | Result | Evidence / limits |
| --- | --- | --- |
| Fresh main install, then frozen install | PASS | pnpm created a new dependency directory; final frozen command exits 0 with no lockfile changes. |
| Clean frozen installation | PASS | Copied only manifests/version/workspace/lock files into new `.cache/phase1-frozen-check`, with no initial `node_modules` or environment file. Pinned `pnpm --dir <absolute-check-directory> install --frozen-lockfile --store-dir <absolute-project-cache>` exits 0, installs 337 packages, and preserves the lockfile. Registry latency warnings occurred; no policy bypass was needed. |
| `pnpm lint` | PASS | Exit 0, zero allowed ESLint warnings. |
| `pnpm typecheck` | PASS | Route generation and strict TypeScript exit 0. |
| `pnpm test` | PASS | Eight tests: explicit fitted selection, unavailable sizes, adjustable fixtures, invalid quantities, repeated adds/merging, removal/bounds, exact cents/overflow, and unapproved currencies. Node prints an informational module-type detection warning when importing TS; no blanket warning suppression or fake test was added. |
| `pnpm build` | PASS | Next 16.4.6 compiles, typechecks, and prerenders `/` and not-found; no security reminder/error. |
| `pnpm audit --json` | FINDINGS REMAIN, exit 1 | One high/one moderate, both dev-only paths, described above. Raw before/after output is ignored at `.cache/phase1-audit-before.json` and `.cache/phase1-audit-after.json`. |
| `pnpm audit --prod --json` | PASS, exit 0 | Zero reported vulnerabilities. Not a complete security assessment. |
| Production HTTP smoke | PASS | Existing ignored `.cache/http-smoke.cjs`: home 200, six products/demo labels, nine compiled assets 200, unknown route 404; no database/env required. |
| Browser interaction smoke | PASS | Playwright Core 1.65.1 with installed headless Chrome, 1440×1000 and 390×844. All six products, no automatic fitted choice, disabled add until selected, selected label, reset on reopen, spotlight/quick-view merging, per-variant limit, separate sizes, decrement/removal, USD-only selectors, Arabic/English, disabled checkout, no horizontal overflow, zero page exceptions. |
| Visual/source scope | PASS | Existing product content/image URLs and permanent assets preserved. Screenshots reviewed for layout/RTL; no performance or full accessibility score claimed. |
| Compose syntax | Exit 0 | `docker compose --env-file .env.example config --quiet`; existing user-level Docker config access warnings remain. No Compose changes or container/SQL work in this phase. |
| Diff/staging/secret review | PASS | Six original products' content/image URLs/visible prices match; permanent assets and unrelated source are unchanged; CSS differs only by disabled-control styling; 32 task IDs retained with only F01/F03 checked; 24 local document links resolve; clean-install lock matches; whitespace passes; staging empty. No secrets introduced. |

Browser tooling was installed only into ignored `.cache/phase1-browser-tools` using pnpm; it is not an application dependency. Exact runner: `& '.cache/node/node-v24.22.3-win-x64/node.exe' '.cache/phase1-browser.cjs'`. HTTP runner: `& '.cache/node/node-v24.22.3-win-x64/node.exe' '.cache/http-smoke.cjs'`. Screenshots are `.cache/phase1-1440-ar.png` and `.cache/phase1-390-ar.png`. These temporary browser artifacts are local verification evidence, not a cross-browser or full accessibility test suite. Native unit tests are retained under `tests/` and run in CI.

## Files and task status

Application: `components/rotex-storefront.tsx`, `app/globals.css`, `lib/products.ts`; new `lib/storefront-rules.ts` and `lib/money/demo.ts`.

Dependencies/tests: `package.json`, `pnpm-lock.yaml`; removed `package-lock.json`; new `tests/storefront-rules.test.mjs`.

Documentation: this report, `README.md`, `docs/ECOMMERCE_TASKS.md`, and status alignment in the existing plan, analysis, and Sprint 1 report. Earlier uncommitted planning changes were preserved. `AGENTS.md` is unchanged.

F03 is checked complete after its acceptance criteria passed, including the final browser run after isolating numeric sizes for RTL. F01 remains historically complete. F04, F05, C01, and every later task remain pending. Next recommended task: **F04**, accessible dialogs, focus handling, readable essential text, and touch interactions. Compatible upstream dependency fixes should continue to be tracked.

The bag remains in memory and resets on refresh (C06). Approved SYP money rules/prices, real inventory, backend services, checkout, staff authentication, and dashboard remain future work. The default machine Node mismatch and two development dependency findings remain explicit limits. No database, production order, authentication, dashboard, brand redesign, commit, push, or deployment was introduced.
