# Architecture

## 1. Overview

```
Browser
  |  HTTPS
  v
Vercel edge (TLS, static files, cache headers from vercel.json)
  |
  v
api/index.js  ->  app.js (Express)
                    |-- routes/      URL mapping
                    |-- controllers/ request handling
                    |-- models/      Sequelize (Postgres)
                    |-- views/       EJS templates
                    |
                    |-- PostgreSQL (Supabase): users, blog_posts, sessions
                    |-- Supabase Storage: media uploads
                    '-- SMTP: contact form mail
```

## 2. Directory layout

| Path | Responsibility |
|---|---|
| `api/index.js` | Vercel entry; re-exports the Express app |
| `server.js` | Local entry: checks DB, syncs session table, listens on `PORT`, graceful shutdown |
| `app.js` | Builds the Express app: middleware order, static assets, sessions, layouts, routes, error handlers |
| `config/environment.js` | Reads and validates all environment variables; single source of settings |
| `config/database.js` | Sequelize connection settings per environment, pooling, SSL, Supabase pooler handling |
| `config/taxonomy.json` | Saved category/tag lists for the admin taxonomy manager |
| `middleware/auth.js` | `isAuthenticated`, `isAdmin`, `isSuperAdmin`, session absolute timeout, periodic user refresh |
| `middleware/csrf.js` | CSRF token creation and verification |
| `middleware/cors.js` | Same-origin CORS policy |
| `middleware/validation.js` | Turns express-validator errors into flash messages or JSON |
| `controllers/PageController.js` | Static marketing pages, sitemap, robots.txt |
| `controllers/BlogController.js` | Blog list, post, category, tag, search |
| `controllers/ContactController.js` | Contact page, human-check challenge, email sending |
| `controllers/AuthController.js` | Login / logout |
| `controllers/AdminController.js` | Dashboard, articles, CSV import, media, taxonomy, users |
| `models/` | `User`, `BlogPost` and their association |
| `migrations/`, `seeders/` | Schema and seed data (sequelize-cli) |
| `views/layouts/` | `main.ejs` (public) and `admin.ejs` |
| `views/partials/` | Header, footer, admin navigation |
| `views/pages/`, `views/blog/`, `views/admin/`, `views/auth/` | Page templates |
| `assets/` | Images (JPEG fallback + WebP) |
| `public/` | Favicons, self-hosted font, `admin.js` |
| `styles.css`, `script.js` | Site-wide CSS and JS |
| `scripts/` | Image optimisation, critical CSS generation |
| `tests/` | Unit tests (`node --test`) |

## 3. Middleware order (app.js)

1. `trust proxy` (production/Vercel) and `x-powered-by` off
2. HTTP to HTTPS redirect (production)
3. helmet: CSP, HSTS, referrer policy, etc. + `Permissions-Policy`
4. compression
5. Static files: `/public`, `/assets`, `/styles.css`, `/script.js` (served before sessions and rate limits, long cache)
6. Body parsers with size limits
7. CORS policy
8. Global rate limit
9. express-session (Postgres store, rolling idle cookie)
10. `enforceSessionLifetime`, `refreshSessionUser`
11. View locals (user, canonical URL, asset versions)
12. CSRF token + verification
13. Layout wrapper for `res.render`
14. Routes: `/`, `/blog`, `/auth`, `/contact`, `/admin`
15. 404 and error handlers

## 4. Routes

| Method | Path | Access | Handler |
|---|---|---|---|
| GET | `/`, `/solutions`, `/data-operations`, `/capacity-audit`, `/industries`, `/about`, `/privacy`, `/terms` | public | PageController |
| GET | `/resources` | public | redirect to `/blog` |
| GET | `/sitemap.xml`, `/robots.txt` | public | PageController |
| GET | `/blog`, `/blog/category/:category`, `/blog/tag/:tag`, `/blog/search`, `/blog/:slug` | public | BlogController |
| GET/POST | `/contact` | public (POST rate limited, CSRF, validated) | ContactController |
| GET | `/contact/challenge` | public | new human-check question |
| GET/POST | `/auth/login` | public (POST rate limited) | AuthController |
| POST | `/auth/logout` | signed in | AuthController |
| GET/POST | `/admin/...` articles, import, media, taxonomy | admin | AdminController |
| GET/POST | `/admin/users...` | superadmin | AdminController |

## 5. Data model

**users**: `id` UUID, `name`, `email` (unique), `password` (bcrypt hash), `role` (`superadmin`/`admin`), `active`, timestamps.

**blog_posts**: `id` UUID, `title`, `slug` (unique), `excerpt`, `content` (sanitized HTML), `featured_image`, `category`, `tags` JSON, `seo_title`, `meta_description`, `keywords`, `schema_markup` JSON, `published`, `publish_date`, `views`, `author_id` FK users, timestamps.

**sessions**: managed by connect-session-sequelize.

## 6. Security architecture

See [SECURITY-AUDIT.md](SECURITY-AUDIT.md). In short: helmet + strict CSP, HTTPS/HSTS, CSRF, same-origin CORS, layered rate limits, bcrypt cost 12, server-side sessions with idle + absolute timeouts and live user re-validation, validated and sanitized input, magic-byte checked uploads to external storage, parameterized queries only, generic errors in production, secrets only in environment variables.

## 7. Performance architecture

- Marketing pages do not query the database, so they render quickly even on a cold start.
- gzip compression; EJS view cache in production.
- `styles.css` and `script.js` URLs carry a content hash (`?v=`) and are cached for a year; changing the file changes the URL.
- Images, fonts and favicons have long-lived cache headers (Express and `vercel.json`).
- Self-hosted variable Inter font (one 48 KB WOFF2, preloaded, `font-display: swap`), no Google Fonts round trips.
- LCP hero image preloaded with `fetchpriority="high"`; WebP with JPEG fallback; explicit width/height to avoid layout shift.
- Scripts are `defer`red.

## 8. Known limitations

- `config/taxonomy.json` is written to disk by the taxonomy manager. Vercel's filesystem is read-only/ephemeral, so saved lists can be lost between deployments. Moving taxonomy into a database table is the recommended next step.
- Rate-limit counters are per serverless instance (see SECURITY-AUDIT.md).
