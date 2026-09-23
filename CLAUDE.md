# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

React 19 + TypeScript + Vite storefront for the Campfire demo shop. It is a pure client-side SPA — all data comes from the REST API in the sibling repo `campfire-store-api`. Supports English/German and USD/EUR.

## Commands

```bash
npm run dev       # vite, port 5173 — open /en or /de, NOT /
npm run build     # tsc -b && vite build
npm run preview
npm run lint      # eslint .
```

There is no test suite.

## Configuration

Copy `.env.example` to `.env`. Two variables, both consumed only in `src/api/config.ts`:

- `VITE_API_BASE_URL` — API root, e.g. `http://localhost:3000/api/v1`
- `VITE_API_ORIGIN` — origin for images and static assets

Both fall back to `localhost:3000` in dev and the hosted Render API in production builds, so the app runs with no `.env` at all. Production values for Netlify are set in `netlify.toml`, not `.env`.

## Architecture

### Locale-first routing

Every user-facing route is prefixed with the language: `/:lang/...`. `components/routing/LocaleRoute.tsx` validates the segment, syncs it into `localeStore`, and redirects to the stored language if it is missing or invalid. `RootRedirect` and `UnlocalizedPathRedirect` catch bare paths.

**Never hardcode an internal path.** Use `LocaleLink`, `useLocalePath`, or `useLocaleNavigate`, all of which route through `localizedPath()` in `lib/localePath.ts` (which correctly preserves query strings and hashes while swapping the prefix).

### Three-layer API access

Components must not call the API directly. The layers are:

1. **`src/api/endpoints.ts`** — one function per API route, returning raw response envelopes. `src/api/client.ts` is the fetch wrapper: it throws `ApiError`, builds query strings, and JSON-stringifies the `filter` param.
2. **`src/api/normalizers.ts`** — unwraps the API's envelopes and flattens localized fields. This is where `nameI18n: {en, de}` becomes a plain `name: string` for the active language.
3. **`src/hooks/*`** — React Query wrappers exposing view models to components.

The backend's envelopes are inconsistent (`data.documents` for lists, `data.document` for single, `data.data` for creates) and the normalizers exist to absorb that. When adding an endpoint, add a normalizer rather than letting envelope shapes reach components.

### Two separate translation systems

Do not confuse them:

- **Content** (product names, category descriptions) is localized **server-side**. The API returns only the requested locale; normalizers flatten `*I18n` maps.
- **UI chrome** (labels, buttons, errors) is localized **client-side** in `src/i18n/messages/{en,de}.ts`, accessed via `useTranslation()`/`translate()`. Keys are dot-paths, typed through `NestedKeyOf<Messages>`, with `{placeholder}` interpolation. This is hand-rolled — there is no i18n library.

### Locale is a cache dimension

Because the API returns locale-specific content, **`language` and `currency` must be part of every query key** for locale-dependent data. `lib/queryKeys.ts` lists the locale-sensitive key roots, and `components/routing/LocaleQuerySync.tsx` invalidates exactly those when the user switches language or currency. A new locale-dependent query needs its root added to `LOCALE_SENSITIVE_ROOTS` or it will serve stale content after a switch.

Default staleness lives in `lib/queryClient.ts`: `CATALOG_STALE_TIME_MS` (5 min) is the global default, `SESSION_STALE_TIME_MS` (30 s) is used for user-scoped data.

### State split

Zustand stores (`src/store/`, all persisted to localStorage) hold **only session and identity**, never server data:

- `authStore` — token + user
- `localeStore` — language + currency
- `cartStore` / `wishlistStore` — **just the id**, nothing else
- `toastStore` — transient UI

Everything else is React Query. Cart and wishlist contents are always fetched.

### Cart and wishlist bootstrap

Because the API nests these under `/users/:userId/...` and the client only persists an id, both hooks follow the same three-step fallback: use the stored id → if that request fails, clear it and list the user's carts/wishlists → if none exist, create one (`ensureWishlist` in `useWishlist.ts`). Preserve this pattern when touching either hook; a stale id from localStorage is an expected state, not an error.

### Catalog URL state

For catalog, category and search pages the **URL search params are the source of truth** — not component state. `lib/catalogUrlState.ts` parses and serializes filters, sort and page; `lib/productCatalogFilters.ts` maps the UI sort options onto the API's `sort` field, which is currency-dependent (`priceI18n.USD` / `-priceI18n.EUR`). This keeps filtered views shareable and back-button-correct.

The account page uses the same idea more simply: panels are selected by `?panel=` via `lib/accountPanel.ts`.

### Images

API image paths are relative. Always resolve them through `imageUrl()` / `productImageUrl()` / `userPhotoUrl()` in `lib/imageUrl.ts`, which prefix `API_ORIGIN` and pass absolute URLs through untouched.

## Conventions

- **`@/` is an alias for `src/`**, configured in both `vite.config.ts` and `tsconfig.app.json`. Use it for all non-relative imports.
- **Tailwind v4** via `@tailwindcss/vite`. There is **no `tailwind.config.js`** — design tokens are CSS custom properties in an `@theme` block at the top of `src/index.css`, which is a single large (~4.5k line) stylesheet holding both tokens and component classes. Add colors/spacing there as tokens rather than hardcoding hex values in components.
- TypeScript is strict and uses project references (`tsconfig.app.json` for `src`, `tsconfig.node.json` for the Vite config), with `verbatimModuleSyntax` and `erasableSyntaxOnly` on — type-only imports must be written `import type`.
- Components are named exports, one per file, grouped by feature under `src/components/`.

## Reference material

`docs/requirements/FRONTEND_UI_REQUIREMENTS.md` plus static HTML mockups per page in `docs/mockups/` — the existing UI was built against these, so consult them before redesigning a page.

## Deployment

Netlify, configured entirely in `netlify.toml` (build command, publish dir, production API URLs, security headers, asset caching). The `/*  →  /index.html` redirect rule is required for client-side routes such as `/en/products` to survive a refresh — do not remove it.

The API is hosted on Render's free tier and sleeps after inactivity; the first request after a cold start can take 30–60 seconds, which is why loading and retry states matter throughout the app.
