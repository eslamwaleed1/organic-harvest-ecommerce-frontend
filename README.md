# Organic Harvest Frontend

## Architecture

The frontend is a component-based React single-page application built with Vite.
`src/App.jsx` defines the React Router routes and public, member, and admin route
guards. Shared UI is composed from `src/components/`, while route-level screens
are grouped in `src/pages/public/` and `src/pages/protected/`. Reusable state and
data behavior lives in hooks, context providers, and the API client.

Styling is deliberately divided into small, focused files:

- Page and component CSS Modules in `src/styles/` keep styles local to their
  corresponding UI.
- Shared styles are split by concern (global foundations, storefront, catalog,
  cart/orders, auth, profile, chrome, and admin) and imported through
  `src/index.css`.
- `responsive.css` holds shared breakpoints and responsive adjustments.

This keeps presentation, route screens, shared components, and data behavior
separate while letting the app share a consistent visual system.

## Overview

A React + Vite farm-stand storefront with login, signup, and protected member
and admin pages.

## Run locally

1. Copy `.env.example` to a file named exactly `.env` in the project root (next to `package.json`).
2. Set `VITE_API_URL` to the backend origin, including its port if needed, for example `http://localhost:5000`. Do not add quotes or an endpoint path to this value.
3. Adjust the `VITE_AUTH_*_PATH` values if your API uses different routes.
4. Start or restart the Vite dev server with `npm run dev`. Vite reads `.env` at startup; changes are not applied to an already-running server.

The frontend sends JSON `POST` requests to the configured login and signup routes.
Login sends `{ "email": "...", "password": "..." }`; signup sends
`{ "name": "...", "email": "...", "password": "..." }`. On successful
authentication, the backend sets the JWT in an HttpOnly cookie and a short-lived,
client-readable login marker; the frontend does not read or store the JWT.
Requests automatically include cookies. On startup, the frontend calls
`VITE_AUTH_ME_PATH` only when the login marker exists, to check whether the JWT
represents a valid login;
the endpoint should return the current user (for example, `{ "user": { "name":
"...", "email": "..." } }`). Signing out sends a `POST` to
`VITE_AUTH_LOGOUT_PATH`, which should clear the cookie. The member page is a
frontend route guard for testing the flow, not a substitute for authorization
checks in your backend.

For local cross-origin API requests, configure CORS to allow the exact frontend
origin and credentials (not `*`). Production API requests are sent through the
Vercel rewrite, so they are same-origin with the frontend.

## Deploying with Vercel and Render

- The Vercel rewrite in `vercel.json` forwards `/api/*` requests to the Render
  service. Remove `VITE_API_URL` from Vercel if it is set; production uses the
  Vercel origin automatically. Keep `VITE_API_URL=http://localhost:5000` in the
  local `.env` for development.
- Set `VITE_GOOGLE_CLIENT_ID` to your Google OAuth web client ID. In that
  client's authorized JavaScript origins, add
  `https://organic-harvest-ecommerce-frontend.vercel.app` (without a trailing
  slash; add `http://localhost:5173` for local development). Set the same
  client ID as `GOOGLE_CLIENT_ID` in Render.
- Set `NODE_ENV=production` in Render. The backend then sets cross-site
  cookies with `SameSite=None; Secure`; the backend CORS allowlist must also
  contain the exact Vercel origin.
- Set `FRONTEND_URL=https://organic-harvest-ecommerce-frontend.vercel.app` in
  Render (without a trailing slash). Stripe uses this frontend origin for its
  successful and cancelled checkout redirects; the local backend example uses
  `http://localhost:5173`.
- Configure the Stripe webhook endpoint as
  `https://organic-harvest-ecommerce-backend.onrender.com/api/payments/webhook`
  and subscribe it to `checkout.session.completed`,
  `checkout.session.async_payment_succeeded`,
  `checkout.session.async_payment_failed`, and `checkout.session.expired`.
  Set the endpoint signing secret as `STRIPE_WEBHOOK_SECRET` in Render.

## Scripts

- `npm run dev` — start the Vite development server
- `npm run build` — build for production
- `npm run lint` — run Oxlint
- `npm run preview` — preview a production build
