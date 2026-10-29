<!--
  Copy this file to the ROOT of the `retailer_web` repo as README.md
  (replace the existing Vite starter README).
-->

# Enterprise Portal (`retailer_web`)

Retailer-facing web portal for the Smart Credit Solution / SmartCredit fintech platform. A single-page
React app that lets a retailer (and their sub-users) run money-movement products — **AEPS,
DMT, BBPS / Bill Payment, Recharge, Payout, Payment Gateway, Credit Card, MPOS** — plus
wallet **Funding**, **Manage User**, **Reports**, and a **Dashboard**.

It is **white-label / multi-tenant**: one deployment serves many branded customers, each on
their own domain, with branding resolved at runtime from the request hostname.

> `API_Customer_Portal` is a reduced clone of this repo for API-integration partners — the
> code shape is identical, fewer products/menus are enabled.

---

## Table of contents

1. [Tech stack](#tech-stack)
2. [Quick start](#quick-start)
3. [Environment variables](#environment-variables)
4. [npm scripts](#npm-scripts)
5. [Project structure](#project-structure)
6. [Application bootstrap & the branding gate](#application-bootstrap--the-branding-gate)
7. [Routing & access control](#routing--access-control)
8. [State management (Redux)](#state-management-redux)
9. [API layer](#api-layer)
10. [Encryption](#encryption)
11. [White-label / multi-tenant](#white-label--multi-tenant)
12. [The Products module](#the-products-module)
13. [Build system](#build-system)
14. [Deployment](#deployment)
15. [Branch model](#branch-model)
16. [Troubleshooting](#troubleshooting)
17. [Known gaps / tech debt](#known-gaps--tech-debt)

---

## Tech stack

| Area | Choice |
|------|--------|
| Framework | **React 18** + **TypeScript**, bundled with **Vite 5** |
| UI | **Mantine 7** (primary), **MUI 7** (secondary), **Tailwind CSS 3** |
| State | **Redux Toolkit** + **redux-persist** (localStorage, key `root`) |
| Data fetching | **axios** (single configured instance with interceptors) |
| Forms | **Formik** + **Yup** |
| Realtime | **@stomp/stompjs** + **sockjs-client** (STOMP over SockJS) for notifications |
| Crypto | **crypto-js** (AES) — login payloads + at-rest Redux data |
| Routing | **react-router-dom v6** |
| Charts / misc | recharts, @mantine/charts, xlsx, papaparse, react-to-print, i18next |
| Lint / format | ESLint, Prettier, Husky pre-commit |
| Deploy target | Static files served by **nginx** (production) or **Apache Tomcat** (UAT, via `app.war`) |

The app is a **pure static SPA** — there is no backend in this repo. Everything dynamic is a
REST call to the Spring Boot backend (separate team/repo).

---

## Quick start

```bash
# Node >= 18 (Node 20 LTS recommended), npm >= 8
git clone https://github.com/AmitMalu/retailer_web.git
cd retailer_web
git checkout DEV

# place .env.development / .env.uat / .env.production in the repo root
# (they are git-ignored; get them from the handover bundle or the team)

npm ci --legacy-peer-deps      # peer-dep conflicts require this flag
npm run dev                     # http://localhost:5173
```

The app is mounted under `VITE_APP_BASE_PATH`, so the real local URL is e.g.
`http://localhost:5173/enterprise-portal/login`.

---

## Environment variables

Vite exposes only vars prefixed `VITE_`. The active file is chosen by `--mode`
(`development` / `uat` / `production`) → loads `.env.<mode>`. `.env.example` is the committed
template; the real files are git-ignored.

| Var | Purpose |
|-----|---------|
| `VITE_SERVER_URL` | Backend REST base URL (e.g. `https://admin1.utsabpay.com/enterprises`) |
| `VITE_APP_BASE_PATH` | URL sub-path the app is mounted at. **Must match the nginx `location` / Tomcat context path.** Feeds both `vite.config.ts` `base` and the router `basename`. e.g. prod = `/enterprise`, uat = `/enterprise-portal`. |
| `VITE_SECRET_KEY` | Key used to AES/PBKDF2-encrypt username+password on the login call. **Must match the backend's value.** |
| `VITE_DMT_PAYSPRINT_LIVE_ENC_KEY` | AES key (exactly 16 chars) — encrypts Paysprint DMT Remitter eKYC PID data |
| `VITE_DMT_PAYSPRINT_LIVE_ENC_IV` | AES IV (exactly 16 chars) — same flow |
| `VITE_AEPS_FINGPAY_LIVE_WADH` | AEPS Fingpay WADH value for biometric (eKYC) capture |
| `VITE_DMT_PAYSPRINT_LIVE_WADH` | DMT Paysprint WADH value for biometric (eKYC) capture |

`.env.<mode>` files include commented-out `VITE_SERVER_URL` lines for various dev-machine IPs
— uncomment one to point at a local backend.

---

## npm scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Vite dev server, mode `development`, host `0.0.0.0`, port `5173` |
| `npm run dev:uat` / `dev:prod` | dev server with `uat` / `production` env |
| `npm run build` | `rimraf dist` → `tsc -b` (typecheck) → `vite build --mode production` → `copy-webxml` |
| `npm run build:uat` | same, `--mode uat` |
| `npm run war` / `war:uat` | `build` (or `build:uat`) then package `dist/` into `app.war` |
| `npm run preview` | serve the built `dist/` locally to sanity-check |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |

**Prebuild hook** (`prebuild` / `prebuild:uat`): runs `scripts/generateBuildInfo.cjs`, which
writes `src/buildInfo.ts` = `{ version, builtAt }` (git-ignored, shown as a build badge in the UI).

**Helper scripts** (`.cjs` because `package.json` sets `"type": "module"`):
`generateBuildInfo.cjs`, `copyWebXml.cjs` (copies `deploy-resources/WEB-INF` into `dist/` for
Tomcat SPA fallback), `createWar.cjs` (zips `dist/` → `app.war`).

---

## Project structure

```
src/
├── main.tsx                 Bootstrap: ErrorBoundary → ReduxProvider → BrowserRouter(basename=VITE_APP_BASE_PATH) → <App/>
├── App/
│   ├── index.tsx            Providers (Mantine, MUI theme, Notifications) + the branding gate
│   ├── Routes.tsx           The route table (~1000 lines): all routes + lazy imports
│   └── ProtectedRoutes.tsx  <ProtectedRoute>: auth + role / sub-role permission checks
├── pages/
│   ├── Auth/                Login, ForgotPassword, Otp, SetPassword, SignUp
│   └── Home/
│       ├── Dashboard.tsx
│       ├── Products/        AEPS · DMT · BillPayment (BBPS: AtoZ / BillAvenue) · Recharge ·
│       │                    Payout · PG · CreditCard · MPOS   — see "The Products module"
│       ├── Funding/         WalletToBank, FundTransfer, FundReversal, WalletToWallet (+ receipts)
│       ├── ManageUser/      CreateUser, ViewUser, DebitAndCreditUser
│       ├── Reports/         ~20 report screens
│       ├── Settings/        MyProfile, Subuser, ChangeTPIN, Certificate, LowBalanceAlert, IdCard
│       ├── Support/         Ticketing, ContactUs, TopUp, AddMoney, PaymentRequest, BioMetricDevice
│       └── chatbot/         In-app chatbot (currently disabled in App/index.tsx)
├── components/
│   ├── Atoms / Molecules / Organism / Templates    reusable UI (loosely atomic-design)
│   ├── layouts/             MainLayout (sidebar + header shell for authed pages)
│   ├── navigation/          sidebar / menu rendering
│   ├── notifications/       toast/notification provider
│   └── providers/           ReduxProvider
├── Redux/
│   ├── Store/index.ts       configureStore + redux-persist (key "root")
│   ├── Reducers/            ui, settings, apiResponse, navigation, pagination, location,
│   │                        reportState, chat, notifications
│   ├── Actions/             plain action creators
│   └── hooks.ts             typed useAppSelector / useAppDispatch  (use these)
├── Services/
│   ├── index.ts             the axios instance + request/response interceptors  ← read first
│   ├── api.ts               all API call functions
│   ├── apiRoutes.tsx        endpoint URL constants (grouped by product)
│   └── websocketService.ts  STOMP/SockJS client for realtime notifications
├── Config/
│   ├── menuItems.ts         sidebar menu definition (labels, paths, icons, role flags)
│   ├── branding.ts          default (SmartCredit) branding + useBranding() hook
│   └── botConfig.ts         chatbot config
├── Common/interface.ts      shared TypeScript types (UserRole, ProtectedRouteProps, …)
├── Utils/
│   ├── helper.tsx           encryption (crypto-js), decryptData, redirectTo, role maps, misc
│   ├── CustomLogout.ts      clears state + cookie + redirects
│   ├── locationCache.ts     in-memory lat/lng/ip cache used by the axios interceptor
│   └── CustomHooks/         e.g. useTransactionCooldown (duplicate-txn guard)
├── theme/                   MUI + Mantine theme option builder (getThemeOptions)
├── hooks/                   app-wide hooks (useWebSocket, …)
├── assets/                  images, svg, lottie
├── buildInfo.ts             AUTO-GENERATED each build. Git-ignored.
└── index.css                Tailwind entry + globals

deploy-resources/WEB-INF/web.xml   Tomcat SPA-fallback config (copied into dist/ at build time)
scripts/*.cjs                       build helpers (see npm scripts)
.env.example                        env template (committed)
app.war                             a previously built WAR artifact
```

Path alias: **`@/` → `src/`** (in `vite.config.ts` + `tsconfig`).
`vite.config.ts` also sets `define: { global: 'window' }` (required by `sockjs-client`).

---

## Application bootstrap & the branding gate

`main.tsx`: `ErrorBoundary` → `ReduxProvider` → `BrowserRouter basename={VITE_APP_BASE_PATH}` → `<App/>`.

`App/index.tsx` does one critical thing before rendering routes — it **waits for the tenant
branding config** (`apiResponse.responses.brandingLoaded` in Redux, populated by
`<BrandingInitializer/>`):

- loading → full-screen `<Loader/>`
- branding API **failed** → `<ServiceUnavailable/>` (it deliberately does **not** fall back to
  default SmartCredit branding — on a white-label domain that would show the wrong brand)
- success → builds the MUI theme from `brandingData.primaryColor / secondaryColor`, renders routes

> A blank/loader screen on a white-label domain almost always means the tenant-config backend
> call is failing for that hostname.

---

## Routing & access control

- **`App/Routes.tsx`** — one big `<Routes>` tree. Public: `/login`, `/forgot-password`,
  `/otp`, `/set-password`, `/signup`. Everything else is under `<MainLayout>` and wrapped in
  `<ProtectedRoute>`. Screens are `React.lazy()` + `<Suspense fallback={<Loader/>}>`.
- **`App/ProtectedRoutes.tsx`** — `<ProtectedRoute allowedRoles={[...]} requireAuth>`:
  1. not authenticated (`loginData` absent) → redirect `/login`
  2. `allowedRoles` set and user's `role` not in it → redirect `/dashboard`
  3. role **`RU`** (retailer sub-user): checks a **`role_id`** string (row of `"0"`/`"1"`
     flags, one per menu section) and a **`sub_role_id`** list (comma-separated `"x.y"`
     per-screen sub-permissions). Maps `MENU_PATH_TO_ROLE_PATTERN` and `subRouteMapping` in
     `Utils/helper.tsx` translate a URL path → the flag index it needs.
- Menu (`Config/menuItems.ts`) is filtered against the same flags.
- Role codes seen: `RT` (retailer), `RU` (retailer sub-user); user-creation routes reference
  `WL`, `SD`, `PT`, `DT`. Confirm the full set with the backend team.

---

## State management (Redux)

- Redux Toolkit `combineReducers`, wrapped in **redux-persist** (`key: "root"`, localStorage).
- Dispatch `{ type: "RESET_APP" }` to wipe all state (used on logout).
- Slices: `ui` (dark mode), `settings` (theme option), **`apiResponse`** (generic cache
  bucket — holds `loginData`, `brandingData`, `brandingLoaded`, `brandingFailed`, product
  results…), `navigation`, `pagination`, `location`, `reportState`, `chat`, `notifications`.
- Use the typed hooks from `Redux/hooks.ts`, not raw react-redux.

---

## API layer

`Services/index.ts` exports a configured **axios instance**. Its request interceptor
automatically attaches:

| Header | Source |
|--------|--------|
| `Authorization: Bearer <token>` | cookie **`authToken`** |
| `Latitude`, `Longitude`, `IpAddress` | `Utils/locationCache.ts` (fallback: `persist:root` in localStorage) |
| `Medium: web` | constant |
| `X-Tenant-Domain: <window.location.hostname>` | **drives white-label** — backend resolves the tenant from it |
| `Content-Type` | `application/json`, or `multipart/form-data` when `config.isMultipart` |

- Base URL = `VITE_SERVER_URL`.
- `Services/api.ts` = call functions; `Services/apiRoutes.tsx` = URL constants (grouped by
  product: AEPS Fingpay / AEPS Instantpay / DMT / BBPS / BillAvenue / Recharge / Payout / PG /
  Verification / Funding / Reports …).
- Response interceptor logs errors and flags `statusCode === 401` (token expiry).

---

## Encryption

Two mechanisms, both in `Utils/helper.tsx`:

1. **Login credentials** — `encryptCredentials(username, password)`: PBKDF2 key from
   `VITE_SECRET_KEY` + random salt, AES-encrypts username & password, sends
   `{ salt, iv, encryptedUsername, encryptedPassword }`. Backend must use the same key.
2. **Local data at rest** — `encryptData` / `decryptData` use a **hard-coded** AES key + IV
   (constants at the top of `helper.tsx`). This protects values in the persisted Redux state
   (`loginData`, `brandingData`, …). Any component reading those calls `decryptData(...)`.

Biometric flows also use `encryptPidData(pid, key, iv)` (AES-CBC/PKCS7) with the Paysprint
`_ENC_KEY` / `_ENC_IV` env vars.

---

## White-label / multi-tenant

```
User opens https://<customer-domain>
  → Load Balancer routes it to the same nginx build as portal1.utsabpay.com
  → axios interceptor sends header  X-Tenant-Domain: <customer-domain>
  → backend returns that tenant's branding (logo, colours, favicon, title, policy PDFs)
  → <BrandingInitializer> stores it (encrypted) in Redux → App/index.tsx themes & renders
  → assets load from  https://<customer-domain>/wl-assets/<tenantCode>/<file>
```

- Default SmartCredit branding: `src/Config/branding.ts` (used only for `portal1.utsabpay.com`).
- `useBranding()` hook returns the decrypted tenant branding for use in components.
- Adding a customer needs **no code change** — LB rule + DNS + SSL cert + a backend
  `tenant_branding` DB row + asset uploads (done in Enterprise Admin).
- Assets are stored on the backend VM and NFS-synced to the frontend VM's
  `/var/www/white-label-assets/`; nginx serves them at `/wl-assets/`.

---

## The Products module

`src/pages/Home/Products/` is the largest and most complex area. Core patterns:

### `loginData.products` — the entitlement tree

After login the backend returns (encrypted) a `products[]` array. Each product has
`isVisible / blocked / active` and a `subProducts[]`, each sub-product carrying
`subProductId`, `subProductName`, `schemeCode`, **`vendorName`**, `maxAmount`, etc.
**Every screen in Products/ reads this to decide what to show and how to behave:**

| Condition | UI |
|-----------|----|
| `!isVisible` | placeholder (greyed) card |
| `blocked` | disabled card |
| `!active` | click → "currently inactive, contact support" |
| `subProducts.length < 1` | click → "No Scheme Found For You" |

### Navigation shape

`Products.tsx` (product grid) → `/products/<product>` → a sub-product screen (reusable
`ProductSubProductsScreen.tsx`) → the product's form/flow. `subProductId` travels in the URL
or `navigate(state)`; the form re-finds its sub-product in `loginData.products` to read
`vendorName` etc.

### Vendor switching

Each product may be served by different upstream vendors, and the flow/API differ per vendor.
`vendorName` decides which implementation runs:

- **AEPS** — formal registry: `AEPS/AepsVendorConfig.ts` maps `fingpay` / `instantpay` →
  `{ components, apiRoutes }`; `AepsVendorWrapper.tsx` renders the right screen;
  `callAepsApi(vendorName, type, data)` dispatches to the right endpoint.
- **BBPS / DMT** — inline `vendorName.includes("avenue")` branching
  (`BillPayment/WrapperFormPage.tsx`; DMT `vendorFlow` state).

### Biometric capture — `components/Organism/AEPS/BiometricCapture.tsx`

Talks to a **local RD-service** the retailer runs (`http://127.0.0.1:<port>/rd/capture`,
ports per device brand). Builds `PidOptions` XML — `wadh` is set for **eKYC**, empty for
**2FA**. Parses the response into `pidData`; consumers validate quality client-side
(`qScore`, `nmPoints`, `rdsID` allow-list, device-prefix match).

### Per-product summary

| Product | Entry route | Flow (short) | Key endpoints |
|---------|-------------|--------------|---------------|
| **AEPS** | `/products/aeps` | subproduct → geo-check → `status` (`checkStatus` → onboard/ekyc/service) → `ekyc` (OTP+bio) → `service` (pick) → `2fa` (once/24h) → `transaction` (cash withdrawal / balance / mini-statement) | `AEPS_*` (Fingpay `/aeps/*`, Instantpay `/instantpay/aeps/*`) |
| **DMT** | `/products/dmt` | subproduct → `SearchRemitterScreen` (`Find_Remitter`): exists → `RemitterInfo`; new → modal `profile→ekyc→otp→register`. `RemitterInfo`: add/verify beneficiary, send OTP + transfer | `FIND_REMITTER`, `REGISTER_REMITTER`, `REMITTER_KYC`, `*_BENEFICIARY`, `DMT_TRANSACTION` |
| **BBPS** | `/products/billPay`, `/products/credit-card` | `SubProductScreen` → `ServicesScreen` (`Get_Services_List`) → `WrapperFormPage` → `AtoZForm` or `AvenueForm` (dynamic form built from provider field config) → fetch bill → pay → receipt | `GET_SERVICES_LIST`, `GET_PROVIDER_CONFIG`, `FETCH_BILL_DETAILS`, `TRANSACTION`, `BILLAVENUE_*` |
| **Recharge** | `/products/recharge` | subproduct → `Recharge.tsx`: mobile (lookup auto-detects operator/circle) or DTH → plan drawer / amount → confirm → transact | `RECHARGE_MOBILE_LOOKUP`, `RECHARGE_PLANS`, `RECHARGE_DTH_CUSTOMER_INFO`, `RECHARGE_TRANSACTION` |
| **Payout** | `/products/payoutScreen` | `PayoutFormModal` add beneficiary → `/Info` list → send payout | `SAVE_BENEFICIARY`, `SEND_PAYOUT` (**shared with Funding Wallet-to-Bank**), `PAYOUT_SUCCESS_CALLBACK` |
| **PG** | `/products/pgScreen` | `PGFormModal`: card type → 6-digit BIN → `Fetch_Card_Bin_Detail` → card-holder details → `Validate_Transaction` → `Create_Order`. `isScsSubProduct` adds an extra dropdown. | `FETCH_CARD_TYPE`, `VALIDATE_TRANSACTION`, `CREATE_ORDER`, `SCS_SUB_PRODUCT_LIST` |

Shared helpers: `useTransactionCooldown` (120s duplicate guard, sessionStorage),
`useWalletBalance` (refetch after txn), per-product `*TransactionReceipt.tsx` + print CSS.

**Watch out for:** two BBPS "AtoZ" implementations exist (`BillPayment/AtoZ/` and
`BillPayment/BbpsAtoZ/` with a 9,300-line static `Config.ts`) — check `vendorName` /
`location.state.vendor` to see which one a live sub-product uses. `DMT/RemitterRegister.tsx`
submit is stubbed — the live path is the modal in `SearchRemitterScreen.tsx`.
`AepsTwoFactor.tsx` has hard-coded payload fallbacks. `BillAvenue/Form.tsx.backup` is a stray.

---

## Build system

`npm run build` → `rimraf dist` → `tsc -b` → `vite build --mode <mode>` → `copyWebXml.cjs`.
Output: `dist/` (`index.html` + `assets/[name].[hash].js|css` + `WEB-INF/web.xml`).

- `vite.config.ts` `base` = `VITE_APP_BASE_PATH` — asset URLs get that prefix, so it **must**
  match the serving path (nginx `location` / Tomcat context). Mismatch → 404 on `assets/*.js`.
- `npm run war` additionally zips `dist/` into `app.war` for Tomcat.
- Install with **`npm ci --legacy-peer-deps`** (peer-dependency conflicts).

---

## Deployment

The frontend VM is on a private `10.1.3.x` network — **connect the corporate VPN
(FortiClient) first**, then `ssh ciuser@10.1.3.4`. SSL is terminated at the load balancer;
the VM's nginx serves plain HTTP internally.

### Production (nginx static, `main` branch)

nginx on `10.1.3.4` serves this build from `/var/www/enterprise-portal/` on port **81**
(`portal1.utsabpay.com`, path `/enterprise/`). Two ways to deploy:

1. **Internal Deployment Console** — `https://admin1.utsabpay.com/internal/deployment-console/`
   → **Deploy Portal** → enter the deploy password. (A Node/PM2 service on `127.0.0.1:4001`
   validates the password and runs the script below.)
2. **Manual** —
   ```bash
   ssh ciuser@10.1.3.4
   /opt/scripts/deploy-enterprise-portal.sh            # deploys origin/main
   /opt/scripts/deploy-enterprise-portal.sh <branch>   # a specific branch
   ```

The script: `git fetch` + `reset --hard origin/<branch>` + `clean -fd` in
`/opt/deploy/enterprise-portal` → copy `/opt/envs/enterprise-portal/.env.prod` → `.env` →
`npm ci --legacy-peer-deps` → `npm run build` → back up current live folder to
`/var/www/backup/` → replace `/var/www/enterprise-portal/` with the new `dist/` →
`systemctl reload nginx` → keep last 3 backups.

**Rollback:** `/opt/scripts/rollback-enterprise-portal.sh` (restores the newest backup).

### UAT (Tomcat, `DEV` branch)

On the separate UAT server: `/opt/scripts/deploy-enterprise-portal.sh` (defaults to `DEV`) —
stops Tomcat, pulls, copies `.env.uat`, `npm ci`, `npm run build:uat`, copies `dist/*` into
`webapps/enterprise-portal/`, starts Tomcat. Serves `https://portal1.utsabpay.com/enterprises`.

> Full infra details (VPN credentials, server layout, PM2, nginx config, white-label NFS)
> are in the handover bundle handed to the manager — not in this repo.

---

## Branch model

`feature/*` → PR → **`DEV`** (auto-serves to UAT) → PR → **`main`** (deploy to production).
The many historical branches (`bugs-v5.x`, `fixes-vN`, `<name>-dev`, …) are old feature
branches — only `DEV` and `main` are current.

Commits follow Conventional Commits (`feat(...)`, `fix(...)`, `chore(...)`); Husky runs
lint/format on pre-commit.

---

## Troubleshooting

| Symptom | Cause / fix |
|--------|-------------|
| `ERESOLVE` / peer dep errors on install | use `npm ci --legacy-peer-deps` |
| Blank page, console 404s for `/assets/*.js` | `VITE_APP_BASE_PATH` doesn't match the URL path being loaded |
| `SECRET_KEY is undefined` at login | `.env.development` missing / missing `VITE_SECRET_KEY`; restart dev server after editing `.env` |
| Login OK but every API call 401s | wrong backend URL, or backend `VITE_SECRET_KEY` mismatch, or `authToken` cookie not set |
| White-label domain stuck on loader / "Service Unavailable" | backend tenant-config call failing for that hostname (`X-Tenant-Domain`) |
| Type errors only during `build` | `build` runs `tsc -b`; `dev` doesn't typecheck — run `npx tsc -b` while developing |
| AEPS/DMT "device not found" | retailer's local RD service not running, or browser blocking `http://127.0.0.1` — environmental, not a code bug |
| Env change not applied | Vite reads `.env` only at startup — restart `npm run dev` |

---
