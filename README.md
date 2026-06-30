<p align="center">
  <img src="/public/img/campfire_logo_dark.png" alt="Campfire Store" width="220"/>
</p>
<br/>

**Campfire Store** is the customer-facing storefront for the [Campfire Store API](https://github.com/kstarostin/campfire-store-api) demo project.

It is a single-page app for browsing outdoor gear, managing a cart and wishlist, checking out, and viewing orders. The UI talks to the REST API over HTTPS and supports English/German plus USD/EUR.

## Storefront features

1. Localized routes under `/{lang}/…` (`en`, `de`) with language and currency preferences persisted in the browser.
2. Product catalog with category navigation, search, filters, sorting, and pagination.
3. Product detail pages with gallery, related products, and quick add-to-cart / wishlist actions.
4. JWT sign-in and registration; protected cart, checkout, account, and order flows.
5. Account area for profile, addresses, orders, and a server-backed wishlist.
6. Responsive layout with mobile navigation, sticky checkout bars, and accessible dialogs.

## Requirements

- [Node.js](https://nodejs.org/) 20 or newer
- A running [Campfire Store API](https://github.com/kstarostin/campfire-store-api) instance (local or deployed)

## Configuration

Copy `.env.example` to `.env` and point the app at your API:

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | API base path, e.g. `http://localhost:3000/api/v1` |
| `VITE_API_ORIGIN` | API origin for images and assets, e.g. `http://localhost:3000` |

If these are omitted, development defaults to `localhost:3000` and production builds default to the hosted API on Render.

## Build and start

Install dependencies:

```
npm install
```

Run the dev server (Vite, default port `5173`):

```
npm run dev
```

Open the app at `http://localhost:5173/en` (or `/de`).

Create a production build:

```
npm run build
```

Preview the production build locally:

```
npm run preview
```

Lint:

```
npm lint
```

## Project structure

The app is built with **React**, **TypeScript**, and **Vite**.

| Area | Location |
|------|----------|
| Pages & routing | `src/pages/`, `src/router.tsx` |
| API client & types | `src/api/` |
| Data hooks (React Query) | `src/hooks/` |
| Global state (auth, cart, locale) | `src/store/` |
| UI components | `src/components/` |
| i18n (EN / DE) | `src/i18n/` |
| Styles (Tailwind CSS) | `src/index.css` |
| Static assets | `public/` |
| HTML mockups (reference) | `docs/mockups/` |

## Deploy to Netlify

This project includes a [`netlify.toml`](./netlify.toml) for static hosting on [Netlify](https://www.netlify.com).

1. Push the repository to GitHub or GitLab.
2. Create a new Netlify site from the repo; build command and publish directory are read from `netlify.toml`.
3. `VITE_API_BASE_URL` and `VITE_API_ORIGIN` are set in `netlify.toml` for the production API on Render. Override them in the Netlify UI if you use a different backend.
4. The SPA redirect rule (`/* → /index.html`) is required so client-side routes such as `/en/products` work on refresh.

> The free Render API tier may sleep after inactivity. The first catalog or auth request after a cold start can take 30–60 seconds; the storefront shows loading and retry states while the API wakes up.

## Related projects

- **API:** [campfire-store-api](https://github.com/kstarostin/campfire-store-api) — Express + MongoDB backend, Swagger docs at `/api/v1/api-docs/`
- **API docs (hosted):** [campfire-store-api.onrender.com/api/v1/api-docs/](https://campfire-store-api.onrender.com/api/v1/api-docs/)
