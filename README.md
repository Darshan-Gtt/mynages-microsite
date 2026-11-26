# Mynages Microsite — Interactive Prototype (Phase 1)

**Live demo:** https://darshan-gtt.github.io/mynages-microsite/ (deployed automatically by GitHub Actions on every push to `main`)

Demo-ready frontend prototype of the public Mynages website (PRD v2.1 §11.2, §17.1).
Dummy data only; no backend. Everything a visitor submits is stored in the browser (localStorage) and survives refresh.

## Run locally

Requires Node.js 18+.

```bash
cd prototypes/microsite
npm install
npm run dev        # http://localhost:5101  (hot reload)
# or a production build:
npm run build && npm run preview   # http://localhost:5101
```

Deep links (e.g. `/plans?for=business`, `/invite/SHARMA7K`) work on refresh with both `dev` and `preview`.
If you host `dist/` elsewhere, configure the server to fall back to `index.html` for unknown paths.

## Demo cheat-sheet

Open the yellow **Demo** button (bottom-left) for the full guide and the captured data.

| Scenario | How |
|---|---|
| Any OTP | `123456` (anything else shows the wrong-OTP error) |
| Individual sign-up → plan → trial / pay | Any new 10-digit mobile starting 6–9 |
| Pending family invite is detected, plan step skipped | Sign up with `9822012345` |
| Mobile already has an account | `9876543210` |
| Failed payment / mandate | UPI ID `fail@upi` |
| Business web address taken | `acme`, `kaveri-foods`, `vrindavan-infra` (reserved: `www`, `admin`, `app`…) |
| Owner email already owns a company | `owner@acmeengg.in` |
| Invite landing states | `/invite/SHARMA7K` valid · `/invite/MEHTA4X` expired · `/invite/KULK9Q` joined · `/invite/NOPE` invalid |
| Track a privacy request | `PR-2026-0318` |
| Reset everything | Demo panel → Demo guide → Reset demo data |

## Sitemap coverage (PRD §17.1)

| Sitemap item | Route | What works |
|---|---|---|
| Home (banners, value proposition, app store links) | `/` | Rotating banners (families / business) with pause, product tour modal, interactive Asset 360° preview, categories, plans teaser, FAQ teaser, store badges |
| About Us | `/about` | Mission, product principles, brand identity |
| Features → For Individuals / For Business | `/features/individuals`, `/features/business` | Grouped features; unbuilt P1/P2 items marked **Coming soon** (SRS FR-033) |
| Use Cases → Personal / Business (incl. multi-branch) | `/use-cases/personal`, `/use-cases/business` | Selectable case studies |
| Plans (B2C and B2B) | `/plans`, `/plans?for=business` | Audience + monthly/yearly toggles, yearly saving, comparison table, loading skeleton, deep links into sign-up / sales |
| FAQs | `/faqs` | Topic filter (URL-backed), search with highlighting, empty state |
| Contact Us | `/contact` | Enquiry form (enquiries table fields), validation, simulated captcha, auto-saved draft, prefill from links, reference number |
| Sign up → Choose Individual / Business | `/signup` | |
| Individual Sign-up (mobile OTP, email optional) → Choose Plan → Start Trial / Pay | `/signup/individual` | Mobile + optional email OTP, resend timer, existing-account and pending-invite detection, plan choice, UPI autopay / card / net banking, optional GSTIN, failure state, success summary; step survives refresh |
| Business Sign-up (email + mobile OTP) | `/signup/business` | Live web-address availability + suggestions, GSTIN check, dual OTP, one-company-per-Owner-email rule, provisioning progress, workspace URL |
| OTP Verification | inside both flows | |
| Family Invite Landing | `/invite/:code`, `/invite` | Valid / expired / joined / declined / invalid states, open-app simulation, decline with confirmation, web sign-up with mobile prefilled |
| Footer: Privacy Policy, Terms of Use, Trust & Security | `/privacy`, `/terms`, `/trust-security` | Table of contents with scroll tracking |
| Footer: Privacy Request | `/privacy-request` | Export / correct / delete / other, OTP verification, reference, status tracking |
| Footer: Cookie Consent | `/cookies` + banner + footer link | Accept / reject / customise; insert-only consent log |
| Footer: App Store Links | footer, home, sign-up success | QR + "send link by SMS" modal |
| (extra) 404 | any unknown path | |

**Demo data panel** (prototype-only tool, stands in for what the Admin Console will receive): view, search, change status and delete sign-up requests, accounts, enquiries, privacy requests and invites; create new invite links; view the cookie log; reset.

## Intentionally simulated

- OTP sending/verification (fixed code `123456`), captcha, SMS/WhatsApp/email delivery.
- Payment gateway, UPI autopay mandate, GST invoice number.
- Company provisioning (database, template, subdomain) — animated steps only.
- "Open in the app" deep link and the App Store / Play Store listings.
- Banners and FAQs are static data here; in the product they come from Admin Console → Microsite Content.

## Assumptions and open points to confirm

These are not defined in the PRD (or are listed there as open), so the prototype uses placeholders:

1. **B2C prices** — PRD §10.2 says "To decide". Shown as *indicative*: Individual ₹99/₹990, Family ₹199/₹1,990, Family Plus ₹349/₹3,490 (monthly/yearly).
2. **GST** — inclusive vs exclusive is open (§10.7). Prototype shows prices exclusive of 18% GST.
3. **Trial start** — whether a payment method / UPI mandate is required to start the trial is open (§10.6). Prototype captures one.
4. **B2B plan tiers** — PRD says plans are assigned by contract but gives no tier names. "Business Starter / Growth / Enterprise" and their limits are placeholders.
5. **Privacy request due date** — the legal due date is open; prototype uses 30 days.
6. **Microsite has no sign-in** (per §17.1). The sign-up page explains where existing users sign in (app or company URL).
7. **Contact details** (`hello@mynages.com`, support hours) and all legal page text are placeholders pending legal review.
8. **Reference images** — only the combined design-system image was provided; per-app reference images were not in `docs/`.

## Structure

```
src/
  components/      Layout (header, footer), Logo, mockups, Asset 360° showcase, modals, demo panel, cookie consent
    ui/            Reusable Form, Modal/Drawer/Confirm, Toast, Accordion, Tabs, Stepper, Segmented, Empty
  data/            Plans (plan master), content (banners, FAQs, categories, industries), seed records
  lib/             Types (match PRD Appendix A.4), localStorage store, validation, utilities
  pages/           One file per page; signup/ holds the three sign-up screens
  styles/          tokens.css (brand), base, components, layout, pages
```
