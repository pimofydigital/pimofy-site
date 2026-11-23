# Architecture essentials

The one-page version. Full detail: [ARCHITECTURE.md](ARCHITECTURE.md).

- **What it is:** one Express 4 app (EJS server-rendered pages) for the Pimofy Digital marketing site, blog and admin panel.
- **Where it runs:** Vercel. `api/index.js` exports the app as a single serverless function; `vercel.json` rewrites every non-static path to it. `server.js` is for local/long-running hosting.
- **Data:** PostgreSQL (Supabase) via Sequelize. Tables: `users`, `blog_posts`, `sessions`.
- **Files:** media uploads go to Supabase Storage, never the local disk.
- **Email:** contact form via SMTP (Nodemailer).
- **Request flow:** HTTPS redirect > security headers > compression > static files > body parsing > CORS > rate limit > session > session lifetime + user refresh > CSRF > route > controller > model > EJS view inside a layout.
- **Auth:** email + bcrypt password, server-side sessions in Postgres, roles `admin` and `superadmin`. Every `/admin` route requires `isAuthenticated` + `isAdmin`; user management also requires `isSuperAdmin`.
- **Config:** all settings in `config/environment.js`, all secrets from environment variables.
- **Front-end:** one stylesheet (`styles.css`) and one script (`script.js`), both content-hashed via `?v=`; admin uses `public/js/admin.js`. No inline scripts (strict CSP).
- **Rules of thumb:** never build SQL strings, never render user HTML without `sanitize-html`, never add inline `<script>` or `on*=` handlers, never commit secrets, keep marketing pages free of database calls so they stay fast.
