# ROTEX e-commerce plan

Prepared: 16 November 2026. Updated for Sprint 1. Confirmed scope: **Syria first, guest cash on delivery, Arabic/RTL and English/LTR, fitted and adjustable caps, USD and new-denomination SYP**.

The goal is to turn the existing presentation storefront into a store that customers can order from and ROTEX staff can operate. Keep the current visual direction and approved product branding. Complete the shopping and fulfillment flow before adding growth features.

The original brief intentionally limited the current site to a prototype. Sprint 1 implements only F01 (the development foundation) and documentation alignment. Real catalog persistence, orders, checkout, and administration remain future work. See the [task checklist](ECOMMERCE_TASKS.md) and [Sprint 1 report](SPRINT_1_REPORT.md) for verified implementation status.

## 1. What exists and what needs attention

The review covers `app/`, `components/`, `lib/`, and project configuration. Sprint 1 verification is recorded separately; it does not establish measured performance scores, a visual design review, or production readiness. Current application behavior remains the source of truth.

| Area | Evidence in the current source | Required work |
| --- | --- | --- |
| Storefront | `app/page.tsx` renders one large client component in `components/rotex-storefront.tsx`. | Keep the layout; extract sections and isolate interactive components as real routes are introduced. |
| Catalog | `lib/products.ts` contains six fitted caps, one image and a sample price per product; its type currently allows only fitted caps. | Support both cap types in the first-release model/UI, with approved galleries, translations, real prices, actual color/size SKUs, and stock. |
| Currency | `Price()` changes `$58` to `58 SYP` without changing the amount. | Replace the label switch with explicit approved prices or a configured conversion policy. |
| Size selection | Product-card quick-add supplies `7¼`; every example size is selectable. | Require a deliberate size choice and use actual variant availability. |
| Cart | Cart and quantity updates use component state; refreshing clears the bag. The spotlight quantity limit does not constrain every add/update path. | Persist variant IDs and quantities; centralize limits and revalidate against the server before ordering. |
| Checkout | Continue displays a message saying checkout is disabled. | Add guest COD checkout backed by durable orders and stock reservations. This is an intentional prototype gap. |
| Brand compliance | Header and footer render `®`, contrary to the supplied brief; the wordmark is styled text. | Remove the invented registration symbol and use approved brand assets. |
| Navigation | Several links point to `#fitted`, but there is no matching element ID. | Fix existing links and replace shopping anchors with actual catalog routes. |
| Localization | Arabic copy and RTL styles exist, but language is component state while root HTML stays English. Product text, search data, and some labels remain English. | Use locale URLs, correct document language/direction, complete translations, and bilingual product search. |
| Accessibility | Dialog roles exist, but focus containment, Escape dismissal, and focus restoration are not implemented. Some inputs remove outlines, and much supporting text is 6–9px. | Complete dialog behavior, visible focus, readable text, and touch interactions. |
| Images and build | F01 passed its local checks: TypeScript error suppression removed, lint/typecheck commands and validated quality CI added. Hosted CI awaits a remote. Image optimization remains disabled; no automated test suite exists. | Production media and commerce tests remain F06/Q01; see the Sprint 1 report for verification limits and dependency findings. |
| Content and discovery | Newsletter, account, shipping, contact, and social interactions are demos/placeholders. Global metadata exists, but there are no dedicated product pages. | Add real support/policy pages, product metadata, and approved social links; hide unfinished optional features at launch. |

## 2. First-launch scope

Ship these capabilities:

- A premium, mobile-first home page using the current ROTEX design direction.
- A fitted-and-adjustable cap catalog with search, product-type/available-variant filtering, and useful sorting. Fitted caps use stocked color/size variants; adjustable caps usually use one-size variants with SKU/stock per color.
- Individual product pages with approved images, fit details, a real size guide, prices, and size availability.
- A persistent shopping bag and guest COD checkout for supported Syrian delivery areas.
- Arabic and English throughout browsing, checkout, confirmation, and support.
- An order confirmation with the exact amount and currency due on delivery, plus a private order-status view.
- A protected staff area for products, size inventory, orders, fulfillment, and COD collection records.
- Shipping/returns, privacy, terms, contact, and size-guide pages with owner-approved content.
- Production hosting, backups, error monitoring, and a tested release process.

The six fitted caps are current demo data, subject to owner confirmation. Both fitted and adjustable types are required in the first-release model and interface. Publish only products with approved images, prices, and inventory records; do not invent products while assets are pending. Fitted caps have structured crowns, closed backs, and no plastic adjustment strap. Example fitted sizes are 7, 7⅛, 7¼, 7⅜, 7½, 7⅝, 7¾; each actual color/size combination has a unique SKU and stock, and not every size exists for every product. Adjustable caps usually use one-size variants with unique SKU/stock per color and verified snapback/strapback details where applicable.

Support **USD and new-denomination SYP only**; historical old-SYP data support and migration are excluded from the first release. Currency precision, pricing/conversion policy, rounding, and settlement currency are configurable, owner-approved inputs. Do not assume USD and SYP have the same minor-unit precision or invent exchange rates.

Preserve the permanent RT side monogram and inside ROTEX branding. Preserve the back badge except documented approved special editions; front artwork varies by product. Do not redesign permanent marks or add `®` without verified registration and authorization.

Defer online payments, international delivery, customer accounts, wishlists, loyalty programs, reviews, automated social feeds, and complex promotions. Staff authentication is required at launch even though customer accounts are deferred. Newsletter signup can be added when a usable provider is selected; otherwise hide the form on the live store.

## 3. Business decisions needed before checkout implementation

These are required inputs to implementation, not reasons to delay prototype cleanup:

| Decision | Required output | Owner |
| --- | --- | --- |
| Products and branding | Names/SKUs and approved galleries for both types; original logos and approved special-edition exceptions; actual fitted color/size and adjustable one-size/color stock; fit measurements and adjustment details. | ROTEX |
| Money | Approved USD/new-SYP prices; separate precision for each currency; settlement currency; pricing/conversion policy, rounding, and rate source/effective date if applicable. No invented rates or historical old-SYP migration. | ROTEX / accounting |
| Delivery | Supported governorates/cities/areas, courier agreement, fees, COD handling fees, delivery estimates, failed-delivery handling, and how cash is remitted. | ROTEX / courier |
| Order handling | Who confirms orders, reservation expiry, cancellation rules, packing/shipping workflow, return handling, and daily COD reconciliation. | ROTEX operations |
| Customer information | Real contact details, support hours, social URLs, and approved shipping, returns, privacy, and terms text. Confirm applicable tax/fee treatment. | ROTEX |
| Services and maintenance | Hosting/database/media and staff-auth services usable by the actual business, cost limits, backup requirements, and who maintains the store. Validate availability from Syria and actual target networks before committing. | ROTEX / engineering |

Choose and record a single settlement currency for the first release. If a secondary currency is displayed, label it clearly and show the payable currency and total throughout checkout. Until approved money rules are supplied, keep sample pricing and ordering disabled.

## 4. Customer journey and pages

Use `/ar/...` and `/en/...` URLs with a locale-aware root layout. Arabic is the proposed initial default; switching language should preserve the page, selected product, and bag. Locale subpaths are supported by the [Next.js internationalization guide](https://nextjs.org/docs/app/guides/internationalization).

| Page | Purpose |
| --- | --- |
| `/{locale}` | Home, first drop, story, craftsmanship, and collection entry points. |
| `/{locale}/shop` | Browse/search/filter the actual catalog; preserve search and filters in the URL. |
| `/{locale}/products/{slug}` | Gallery, price, fit, size guide, available sizes, quantity, and add to bag. |
| `/{locale}/cart` | Edit quantities, remove items, see current prices, and enter checkout. |
| `/{locale}/checkout` | Contact, local delivery address, delivery fee, payable total, COD explanation, and order review. |
| `/{locale}/orders/{opaqueToken}` | Private confirmation/status view; show only necessary details and prevent indexing/caching. |
| `/{locale}/size-guide`, `/shipping-returns`, `/contact`, `/privacy`, `/terms` | Fit help, support, and approved store policies. Each path has the locale prefix. |
| `/admin/...` | Protected product, inventory, order, and collection management. |

Checkout should work without an account or mandatory email. Collect name, reachable phone, governorate/city/area, street/building, and useful delivery landmarks; make postal codes optional unless the chosen courier requires them. Preserve non-sensitive form progress during validation and network errors. Show shipping costs and the payable total before submission.

## 5. Technical direction

The finalized architecture is one full-stack **Next.js App Router + TypeScript + Tailwind CSS + PostgreSQL + Prisma ORM** application. Use Server Components, Server Actions/Route Handlers where appropriate, server-only business services, and a Data Access Layer (DAL). GitHub is selected for version control/CI and Codex for ongoing development. PostgreSQL and Prisma are finalized choices; production hosting/provider availability and maintenance ownership remain to be confirmed.

Sprint 1 prepares optional local PostgreSQL infrastructure only. Prisma installation, schema, migrations, and connected persistence begin in C01 after checking compatible stable versions. The demo continues to run without a database. Do not introduce ASP.NET Core, NestJS, separate backend services, microservices, RabbitMQ, or Kubernetes.

- Render catalog and editorial content on the server; use client components for selectors, search controls, the bag, and checkout interactions. This follows [Next.js guidance on limiting client boundaries](https://nextjs.org/docs/app/getting-started/server-and-client-components).
- Put business operations in server-only services and Prisma access in the DAL; Server Actions/Route Handlers validate inputs and call services. The mock catalog can implement the same catalog interface first. Keep credentials/customer data on the server and authorize every protected read/mutation, including direct calls; layouts/UI checks alone are insufficient. See the [Next.js data security guide](https://nextjs.org/docs/app/guides/data-security).
- Centralize money formatting, pricing, variant selection, quantity rules, and translations. Use exact integer amounts with separately configurable currency precision, never floating-point monetary totals. Preserve amount, currency, precision, rounding/conversion policy, and rate snapshot when applicable on orders.
- Treat local cart data as a convenience: persist only variant references and quantities. The server determines prices, stock, shipping, and the final payable total.
- Cache public catalog content deliberately and invalidate it after product updates. Recheck stock and prices on order submission; keep checkout, private order views, and admin responses uncached.
- Use approved media under ROTEX control. Enable image optimization with an explicit remote allowlist or an appropriate production loader; verify responsive sizes and hero loading. [Next.js Image documentation](https://nextjs.org/docs/app/api-reference/components/image) describes these options.
- Use established staff authentication with secure sessions and server-side authorization. Limit public order submissions and private-order lookup attempts; validate input and request origin. Keep addresses, phone numbers, and order tokens out of analytics/logs.

Suggested structure as features are built:

```text
app/[locale]/                 # Home, shop, products, cart, checkout, support
app/admin/                    # Staff pages and layouts
components/layout/            # Header, footer, navigation
components/home/              # Editorial home-page sections
components/catalog/           # Product cards, gallery, variant selection
components/cart/              # Bag drawer and cart controls
components/checkout/          # Contact/address/review UI
lib/catalog/                  # Catalog contract and mock adapter
lib/server/services/          # Server-only pricing, inventory, order operations
lib/server/dal/               # Server-only Prisma queries/persistence
lib/server/auth/              # Staff sessions and authorization
lib/money/                    # Currency units, pricing, formatting
lib/i18n/                     # English/Arabic dictionaries and locale helpers
prisma/                       # Schema/migrations starting in C01, not Sprint 1
```

Avoid a separate API service, microservices, a dedicated search engine, or additional state libraries until a concrete requirement justifies them.

## 6. Essential data and order rules

| Entity | Minimum information |
| --- | --- |
| Product | Stable ID/slug, localized name and description, collection, fitted/adjustable type, gallery, publication state, approved details. |
| Variant | Unique SKU, product, color, size code/display label, approved prices, active state. Fitted: stock/SKU per actual color/size; adjustable: usually one-size with stock/SKU per color. Both supported in the first release. |
| Inventory | Stock on hand, reserved quantity, and an auditable movement history per variant. |
| Delivery zone | Supported locations, fee, payable currency, active state, and approved estimate. |
| Order and lines | Internal ID, opaque access token, idempotency key, contact/address, locale, status, zone, and immutable item/price/fee/currency/precision/pricing-policy snapshots. |
| Staff and history | Staff identity/role and an audit trail of product, stock, order, and COD collection changes. |

An order submission validates active variants, quantities, trusted prices, coverage, and fees on the server. If the payable amount changed, return a revised review instead of silently accepting it. Reserve stock and save the order together in a Prisma transaction with conditional stock updates or appropriate PostgreSQL row locking. Handle conflicts with bounded retries, deterministic variant ordering, and idempotency; roll back the entire operation on failure. Never hold a transaction open across external courier/notification calls. PostgreSQL documents the relevant [row-level locking behavior](https://www.postgresql.org/docs/current/explicit-locking.html).

Use an idempotency key so retrying a timed-out submission returns the same order. Do not claim success until the order is durably saved. Notification failure must not erase an accepted order: staff can still see it in the dashboard and retry the notification.

Suggested fulfillment states: `pending_confirmation -> confirmed -> packed -> shipped -> delivered`. Allow cancellation/expiry before shipment, and track failed deliveries and returns explicitly. Reserve stock when an order is accepted; release it once on pre-shipment cancellation or expiry; deduct on-hand and reserved stock on shipment. Returned stock becomes sellable only after staff inspection. Validate all transitions and make repeated actions harmless.

Track COD separately from fulfillment: an order may be delivered while courier remittance is still outstanding. Record amount/currency due, collection/remittance status, and any return/refund adjustment. Placing an order must never mark it paid.

## 7. Delivery milestones

The companion [task checklist](ECOMMERCE_TASKS.md) defines dependencies and completion criteria. These are planning ranges for one developer with approved content and accessible services, not delivery promises.

| Milestone | Result | Indicative effort |
| --- | --- | --- |
| M0: Confirm launch inputs | Final catalog, money rules, courier scope, content, service availability. | 1–2 working days, plus external waiting time |
| M1: Finish the prototype foundation | Sprint 1: F01 setup/checks/CI and documentation alignment. F02–F06 retain branding, selection, accessibility, components, and media work for later tasks. | 3–5 working days for the full milestone |
| M2: Build the real catalog | Prisma fitted/adjustable catalog, actual SKU stock, locale routes, approved USD/new-SYP prices, product pages, persistent bag. | 5–8 working days |
| M3: Accept COD orders | Delivery pricing, validated checkout, atomic orders, confirmation/status. | 5–8 working days |
| M4: Run daily operations | Staff access, inventory/order tools, fulfillment, COD reconciliation, support content. | 4–7 working days |
| M5: Verify and launch | Critical tests, mobile/RTL review, SEO, deployment, restore test, staff rehearsal. | 3–5 working days |

Baseline: approximately **4–7 developer weeks**, excluding asset preparation, business decisions, and provider delays. Re-estimate after M0 and the first successful local build. M1 can start while business inputs are gathered. Do not open live ordering until M3–M5 are complete.

## 8. Launch acceptance criteria

- Both languages support the complete mobile purchase flow, including validation errors and order confirmation. Language switching and refresh preserve the bag.
- Both cap types can be browsed, selected, and ordered when approved. Fitted caps require an explicitly selected stocked size; adjustable one-size/color selection uses the correct SKU. Sold-out variants cannot be ordered; concurrent last-item requests/retries produce the correct stock and order count.
- Approved USD/new-SYP pricing uses exact arithmetic and separately configured precision, with no old-SYP migration. Payable currency, prices, delivery fees, charges, rounding, and totals agree across bag, checkout, immutable order snapshots, and staff view.
- A guest can order without email or account creation. A failed network request can be retried without creating duplicate orders.
- Staff can confirm, pack, ship, cancel, handle a return, and reconcile COD. Unauthorized requests cannot read customer records or modify stock/orders.
- Customers can find real contact details, fit guidance, and approved policies. Published claims, social links, imagery, and branding are approved.
- Dialogs support focus entry, contained keyboard navigation, Escape, and focus return, following the [WAI modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). Check visible focus, readable text, touch targets, reduced motion, zoom, and no horizontal overflow on representative phones.
- Typecheck, lint, production build, and critical commerce tests pass. Mobile lab results are recorded. Field targets after enough traffic: LCP <= 2.5s, INP <= 200ms, CLS <= 0.1 at the 75th percentile; these are targets, not measured scores. See [Web Vitals guidance](https://web.dev/articles/vitals).
- Staging is private/non-indexed, production secrets are isolated, error reporting works, database restoration has been demonstrated, and a staff member has rehearsed a complete order and cancellation/return.

## 9. After launch

First measure product views, size selection, add-to-bag, checkout starts, accepted orders, delivered orders, failed deliveries, and COD remittance. Exclude personal details from analytics and count successful orders from durable server records. For COD, placed-order conversion alone does not measure completed sales.

Use those results to prioritize fit guidance, delivery coverage, and checkout improvements. Consider online payments and international shipping only after validating merchant/provider eligibility, courier coverage, settlement currencies, fees, and the required customer policies for the actual business.
