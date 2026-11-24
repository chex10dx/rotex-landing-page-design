# ROTEX implementation tasks

Companion to [the e-commerce plan](ECOMMERCE_PLAN.md). Scope: Syria first, guest cash on delivery, Arabic/RTL and English/LTR, fitted and adjustable caps, USD and new-denomination SYP only. Architecture: one Next.js App Router/TypeScript/Tailwind application with PostgreSQL, Prisma ORM, Server Components, Server Actions/Route Handlers, server-only business services and a DAL; GitHub version control/CI and Codex development.

Checkboxes reflect verified implementation only; a documented requirement does not mean a feature exists. Original Sprint 1 was limited to F01 and documentation alignment; see its [historical report](SPRINT_1_REPORT.md). The separately authorized 18 November Phase 1 implements compatible security updates and F03; see the [Phase 1 report](PHASE_1_REPORT.md). Owner roles: **ROTEX** = business/content/operations; **Dev** = engineering. P0 = required for launch; P1 = optional after a safe first release. Dependencies are task IDs.

## M0 — Confirm launch inputs

- [ ] **D01 · P0 · Confirm catalog and approved brand assets** — ROTEX. Depends: none.
  Deliver names/SKUs, original logos, approved galleries, fitted measurements and actual color/size stock, adjustable one-size/color stock, and verified adjustment details. Preserve side RT monogram/inside branding and back badge except approved special editions; front artwork varies. Done when every launch variant has an approved catalog row. Both types are in first-release scope; never publish products missing approved images, prices, or inventory.
- [ ] **D02 · P0 · Confirm prices, currency units, and charges** — ROTEX. Depends: none.
  Support USD and new SYP only, with no old-SYP data support/migration. Record configurable precision separately for each currency, settlement currency, approved prices/conversion policy, rounding, rate source/effective date when relevant, and taxes/fees. Done when exact-arithmetic examples for one item, multiple items, and delivery totals are approved without sample amounts, invented rates, or relabeling as conversion.
- [ ] **D03 · P0 · Confirm delivery and daily operations** — ROTEX. Depends: none.
  Supply serviceable areas, courier/fees/estimates, phone/address requirements, order-confirmation owner, reservation expiry, cancellations, returns, and COD collection/remittance procedures. Done when staff can describe and cost a normal order, a cancellation, and a refused delivery.
- [ ] **D04 · P0 · Confirm service availability and release ownership** — ROTEX + Dev. Depends: none.
  Validate hosting, database, media, staff authentication, and any notification provider for the actual business and target networks; agree costs, domain ownership, backups, and maintenance responsibility. Done when the selected services have been trialed and the deployment approach is documented. COD does not depend on an online payment provider.

## M1 — Finish the prototype foundation

- [x] **F01 · P0 · Establish reproducible local checks** — Dev. Depends: none.
  Document pinned Node/pnpm, install/dev/build commands, and environment names; add real lint/typecheck commands and GitHub quality CI. Remove TypeScript build-error suppression and fix failures. Prepare optional PostgreSQL Compose (environment credentials, named volume, health check), `AGENTS.md`, `.env.example`, and ignores. Review official compatibility/advisories; initialize local Git if absent without committing/pushing. Done when a clean frozen install passes lint/typecheck/build, the demo renders without a database, and available Docker validation passes; report unavailable tools/hosted CI honestly. Prisma/schema/DAL implementation remains C01.
  Verified 16 November 2026 with Node 24.22.3/pnpm 12.3.4: final frozen install in a new local checkout; lint/typecheck/build; HTTP and headless Chrome cart/Arabic smoke checks; PostgreSQL startup, health, SQL and volume persistence; actionlint; unchanged application/asset hashes and empty staging area. No automated test suite is configured. Hosted CI awaits a GitHub remote. Audit: one moderate/one low finding, no high/critical. Evidence: [Sprint 1 report](SPRINT_1_REPORT.md).
- [ ] **F02 · P0 · Correct branding and navigation** — Dev. Depends: D01 for final assets.
  Remove `®` unless registration/use is verified and authorized, use approved wordmarks/icons without altering permanent marks, and fix `#fitted`/other dead links. Align collection navigation/copy with fitted and adjustable first-release support while keeping unapproved products unpublished. Done when branding/destinations match approved assets, including documented special-edition back-badge exceptions.
- [x] **F03 · P0 · Fix demo size, currency, and quantity behavior** — Dev. Depends: none.
  Make fitted quick-add open an explicit size choice instead of adding `7¼`; use one-size selection for actual adjustable variants as catalog support arrives. Centralize quantity bounds across all add/update paths. Replace misleading currency relabeling with clearly separate demo prices or disable unsupported options until C03. Done when no fitted size is silently chosen or unchanged amount relabeled as conversion; demo labels and disabled checkout remain until launch criteria pass.
  Verified 18 November 2026: explicit/reset fitted selections, optional disabled size choices, adjustable one-size types/UI with test-only fixtures, shared integer quantity bounds and variant merging, exact USD demo cents, disabled unapproved SYP selection, and preserved demo checkout. Frozen installs, lint/typecheck/build, eight native tests, HTTP smoke, and headless Chrome interactions at desktop/phone widths in English/Arabic pass. Dependency follow-up: Next.js/Next ESLint 16.4.6 and TypeScript ESLint 8.73.0; full audit retains one high/one moderate development-only finding, production audit zero. Evidence: [Phase 1 report](PHASE_1_REPORT.md). F04/F05/C01 and later tasks remain pending.
- [ ] **F04 · P0 · Complete accessible mobile interactions** — Dev. Depends: none.
  Use an established dialog primitive or native modal dialog for quick view, bag, and account information; support focus entry/containment/return and Escape. Restore visible input/select focus, improve tiny essential text and touch targets, and respect reduced motion in scripted scrolling. Done when keyboard and touch users can complete all demo interactions in English and Arabic without losing focus or encountering hidden controls.
- [ ] **F05 · P0 · Separate sections, data, and shared rules** — Dev. Depends: F01.
  Extract header/footer, home sections, product cards, bag, and dialog components; define a catalog access contract with a mock adapter. Move shared money/variant/quantity rules and translations out of the main component; keep interactive boundaries small. Done when the same demo works with catalog data supplied through the contract and editorial sections do not require the entire page to be a client component.
- [ ] **F06 · P0 · Prepare production media and typography** — Dev. Depends: D01, D04, F05.
  Use approved galleries/media paths, configure image optimization and the exact remote allowlist or loader, set accurate responsive sizes, and optimize English/Arabic font delivery. Done when representative mobile images load at appropriate dimensions, missing-image behavior is clear, and logos/product proportions are preserved.

## M2 — Build the real catalog and bag

- [ ] **C01 · P0 · Implement catalog and inventory storage** — Dev. Depends: D01, D02, D04, F05.
  Install compatible stable Prisma dependencies and implement PostgreSQL schema/migrations, server-only DAL/services, and repeatable imports for both product types, translations, galleries, approved prices, SKU stock/reservations/movements. Fitted caps have closed backs/no plastic adjustment strap and SKU/stock per actual color/size; adjustable caps usually use one-size with SKU/stock per color and verified adjustment details. Done when invalid/duplicate SKUs are rejected, missing sizes are not invented, both types use the catalog contract, and unapproved products remain unpublished.
- [ ] **C02 · P0 · Add locale routes and complete translations** — Dev. Depends: F05.
  Introduce `/ar` and `/en` routes with validated locale parameters and root document `lang`/`dir`; move all customer-facing strings, labels, errors, and product text into translated content. Done when direct links/refresh preserve locale, language switching preserves the destination and bag, and mixed Arabic/Latin sizes, phone numbers, and prices remain readable.
- [ ] **C03 · P0 · Implement approved money rules** — Dev. Depends: D02, F03, C01.
  Replace `Price()` with USD/new-SYP locale-aware formatting and trusted price lookup. Configure precision per currency, pricing/conversion/rounding rules, approved rates when relevant, and settlement currency; use exact arithmetic and preserve amount/currency/precision/policy snapshots. Exclude old-SYP support/migration. Done when approved examples match every product/bag/checkout view, with no invented conversions or shared-precision assumption; ordering stays disabled until configuration is approved.
- [ ] **C04 · P0 · Build catalog browsing and bilingual search** — Dev. Depends: C01, C02, C03.
  Add the shop page with URL-backed search, fitted/adjustable type and available-variant filters, sorting, and empty/loading/error states. Search localized names/descriptions and normalize common Arabic input variations. Done when URLs reproduce results, both types are discoverable when published, sold-out state is accurate, and the catalog works without a separate search service.
- [ ] **C05 · P0 · Build product detail pages and fit guidance** — Dev. Depends: C01, C02, C03, F04, F06.
  Add product URLs, approved galleries/thumbnails, verified fitted/adjustment details, actual color variants and stock, quantity, and fit guidance. Done when fitted caps require a stocked size, adjustable caps use their real one-size/color SKU without fitted-size controls, unpublished/unknown slugs return not-found, and neither fictional availability nor unverified claims remain.
- [ ] **C06 · P0 · Persist and reconcile the shopping bag** — Dev. Depends: C03, C05.
  Persist only variant IDs/quantities in browser storage, share one bag between drawer and cart page, and reconcile deleted variants, sold-out sizes, price changes, and quantity limits. Done when refresh/language changes retain the bag and unavailable items produce clear recovery choices. Browser prices and stock are never trusted by checkout.

## M3 — Accept cash-on-delivery orders

- [ ] **O01 · P0 · Implement delivery zones and a server quote** — Dev. Depends: D02, D03, C01, C03.
  Store supported locations, fees, applicable charges, and delivery estimates. Validate contact/address and recalculate line items/delivery on the server. Done when supported/unsupported areas and all approved pricing examples produce the expected quote, with no compulsory email or unnecessary postal-code field.
- [ ] **O02 · P0 · Implement atomic order creation and reservations** — Dev. Depends: O01, C01.
  Validate active SKUs/quantities, reject stale totals with an updated review, and reserve stock/save immutable order/line money snapshots in one Prisma transaction. Use conditional stock updates/appropriate locking, bounded conflict retries, idempotency, payload consistency, reservation expiry, and safe release. Avoid external calls within the transaction. Done when forged prices cannot affect totals, concurrent last-item requests accept one order, and retries/cancellations cannot duplicate orders or double-reserve/release stock.
- [ ] **O03 · P0 · Build guest checkout and honest confirmation** — Dev. Depends: O02, C02, C06, F04.
  Add contact, local address, delivery selection, review, and a clear COD submit action. Handle validation, unsupported areas, stock/price changes, loading, and ambiguous network failures; rate-limit submissions and validate request origin. Done when both languages complete the flow without an account, success appears only after persistence, and confirmation shows the exact amount/currency due without claiming payment.
- [ ] **O04 · P0 · Add private order status and recovery** — Dev. Depends: O02, O03.
  Issue unguessable access tokens; expose only necessary status/order details, with rate limits, no indexing, no shared caching, and no token logging/analytics. Provide a support route for lost confirmations. Done when an unrelated visitor cannot access orders by guessing a sequential number or another customer's phone number.

## M4 — Operate the store

- [ ] **A01 · P0 · Protect staff access and record changes** — Dev. Depends: D04, C01.
  Add established staff authentication, secure sessions, role boundaries, and audit events. Authorize every protected read/write in server-only services/DAL access and every callable Server Action/Route Handler; layouts/UI checks alone are insufficient. Done when unauthenticated/insufficient-role page and direct calls fail, with no secrets/customer records in public client payloads.
- [ ] **A02 · P0 · Add product and size-inventory management** — Dev. Depends: A01, C01, F06.
  Let authorized staff edit/publish products, manage approved images/translations/prices, and adjust each SKU's stock with a reason. Validate uploads and invalidate public catalog caches. Done when staff can prepare the next drop without editing code and inventory history reconciles with available/reserved stock.
- [ ] **A03 · P0 · Add order fulfillment and COD reconciliation** — Dev. Depends: A01, O02, D03.
  Add order search/filter/detail, allowed status transitions, packing information, courier reference, cancellation/expiry, failed delivery, inspected returns, and collection/remittance records. Done when one order can run through delivery and cash reconciliation, another through cancellation, and another through return; repeated actions cannot double-release stock or mark unpaid COD as paid.
- [ ] **A04 · P0 · Make accepted orders visible and follow-up reliable** — Dev + ROTEX. Depends: A03, D04.
  Provide a durable queue of new orders in the staff dashboard and a documented confirmation/contact procedure. If a usable notification service is selected, record delivery failures and allow retries; do not require email or block order persistence on notification success. Done when staff can discover and handle an accepted order even during notification-provider failure.
- [ ] **A05 · P0 · Publish support, policies, and verified channels** — ROTEX + Dev. Depends: D01, D02, D03, C02.
  Supply and publish contact details, fit guidance, shipping/returns, privacy, and terms in both languages. Add only approved social links; remove live-store demo/account/newsletter affordances without working destinations. Done when every footer/support link opens useful approved content and policy terms match the actual courier/order flow.

## M5 — Verify and launch

- [ ] **Q01 · P0 · Test the commerce invariants** — Dev. Depends: C06, O04, A03.
  Add targeted tests for money/rounding, stock reservations/expiry, duplicate submission, tampered totals, unauthorized staff access, and private-order isolation. Exercise the full guest COD flow in both locales, cart refresh, sold-out recovery, and notification failure. Done when the checks pass against an isolated test database and failures leave no duplicate orders or incorrect stock.
- [ ] **Q02 · P0 · Review mobile, Arabic, accessibility, and speed** — Dev + ROTEX. Depends: F04, F06, C02, O04, A05.
  Check representative iOS/Android browsers and social-app entry links at phone widths, plus tablet/desktop, zoom, keyboard, and reduced motion. Record mobile lab measurements and add privacy-conscious field measurement for LCP/INP/CLS. Done when the buying flow is readable, focus works, no horizontal overflow blocks content, and measured regressions are resolved. Do not report unmeasured Lighthouse/Core Web Vitals scores.
- [ ] **Q03 · P0 · Finish search and sharing metadata** — Dev. Depends: C04, C05, A05, D04.
  Add the real canonical domain, localized titles/descriptions, locale alternates, sitemap, robots rules, branded icons, and approved Open Graph images. Add product structured data only for visible real prices/availability; exclude admin, checkout, and private order pages from indexing. Done when product links render useful social previews and metadata matches published content.
- [ ] **Q04 · P0 · Rehearse production operations and release** — Dev + ROTEX. Depends: all earlier P0 tasks.
  Deploy private staging and isolated production configuration; exercise error alerts, migrations, database backup restoration, and rollback/temporary order-disable procedures. Run staff rehearsals for acceptance, delivery/COD remittance, cancellation, failed delivery, and return. Done when all release checks pass, real launch content/stock are loaded, no demo orders remain in production, and the owner completes a production smoke order before public traffic is enabled.

## After launch — Prioritize using real orders

- [ ] **L01 · P1 · Measure the COD funnel** — Dev + ROTEX. Depends: Q04.
  Track product view, size selection, add-to-bag, checkout start, accepted order, delivery, and COD remittance without customer data in analytics. Use durable order records as the source of accepted-order counts. Review abandonment, refused deliveries, and remittance delays weekly before changing checkout or delivery coverage.
- [ ] **L02 · P1 · Connect a real newsletter or drop-alert service** — Dev + ROTEX. Depends: D04, A05.
  Validate provider availability, consent/unsubscribe behavior, and failure handling; add approved bilingual copy. Done when a subscription is actually stored and can be withdrawn. Keep the live form hidden until this works.
- [ ] **L03 · P1 · Evaluate online payments and international delivery** — ROTEX + Dev. Depends: Q04.
  Verify actual merchant eligibility, provider/courier coverage, supported currencies, settlement, refunds, landed costs, and required policies before choosing integrations. Create a separate scoped implementation plan based on those verified options.

## Start here

F01 and F03 are verified complete in their respective reports. Begin **F04** next, then F05 while gathering D01–D04. Track compatible upstream fixes for the remaining development dependency findings. F02 can remove the invented symbol/fix anchors before final assets arrive under its own scope. Keep checkout disabled and the prototype clearly labeled until the plan's launch acceptance criteria pass; F04/F05/C01 and later checkboxes remain pending.
