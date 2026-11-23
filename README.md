# Little Acre & Co. frontend

A React + Vite farm-stand storefront with login, signup, and a protected member page.

## Run locally

1. Copy `.env.example` to a file named exactly `.env` in the project root (next to `package.json`).
2. Set `VITE_API_URL` to the backend origin, including its port if needed, for example `http://localhost:5000`. Do not add quotes or an endpoint path to this value.
3. Adjust the `VITE_AUTH_*_PATH` values if your API uses different routes.
4. Start or restart the Vite dev server with `npm run dev`. Vite reads `.env` at startup; changes are not applied to an already-running server.

The frontend sends JSON `POST` requests to the configured login and signup routes.
Login sends `{ "email": "...", "password": "..." }`; signup sends
`{ "name": "...", "email": "...", "password": "..." }`. Successful responses may
The backend sets the JWT in an HttpOnly cookie; the frontend does not read or
store the JWT. Requests automatically include cookies. On startup, the frontend
calls `VITE_AUTH_ME_PATH` to check whether the cookie represents a valid login;
the endpoint should return the current user (for example, `{ "user": { "name":
"...", "email": "..." } }`). Signing out sends a `POST` to
`VITE_AUTH_LOGOUT_PATH`, which should clear the cookie. The member page is a
frontend route guard for testing the flow, not a substitute for authorization
checks in your backend.

For cross-origin API requests, configure CORS to allow the exact frontend
origin and credentials (not `*`), and configure the cookie's `SameSite` and
`Secure` attributes for your development/production origins. The API URL is
compiled into the frontend by Vite, so set the appropriate value before
building for production.

## Deploying with Vercel and Render

- In Vercel, set `VITE_API_URL` to the Render service's public origin, such as
  `https://your-service.onrender.com`. Do not include `/--`, `/api`, or any
  other path. Redeploy after changing this variable.
- Set `VITE_GOOGLE_CLIENT_ID` to your Google OAuth web client ID. In that
  client's authorized JavaScript origins, add
  `https://organic-harvest-ecommerce-frontend.vercel.app` (without a trailing
  slash; add `http://localhost:5173` for local development). Set the same
  client ID as `GOOGLE_CLIENT_ID` in Render.
- Set `NODE_ENV=production` in Render. The backend then sets cross-site
  cookies with `SameSite=None; Secure`; the backend CORS allowlist must also
  contain the exact Vercel origin.

## Scripts

- `npm run dev` — start the Vite development server
- `npm run build` — build for production
- `npm run lint` — run Oxlint
- `npm run preview` — preview a production build
