# Pimofy Digital website

Marketing site, blog and admin panel for **Pimofy Digital**, a Nairobi-based dedicated data operations provider for SaaS and Ecommerce companies (serving the UK, Europe and the USA).

Live site: https://pimofydigital.com (hosted on Vercel)

## Features

- Public marketing pages: home, solutions, Data Operations Pod, Free Operations Capacity Audit, industries, about, privacy, terms
- Contact / booking form with server-side validation, arithmetic human check, SMTP delivery and auto-reply
- Blog ("Resources") with categories, tags, search, related posts, reading time and view counts
- Admin panel: dashboard, article editor (sanitized rich text), CSV import, media library (Supabase Storage), category/tag manager, user management (superadmin only)
- SEO: dynamic `sitemap.xml`, `robots.txt`, canonical, Open Graph, Twitter and JSON-LD schema
- Production security hardening (see [SECURITY-AUDIT.md](SECURITY-AUDIT.md))

## Tech stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20+ |
| Web framework | Express 4, EJS templates |
| Database | PostgreSQL (Supabase) via Sequelize 6 |
| Sessions | express-session + connect-session-sequelize (stored in Postgres) |
| Storage | Supabase Storage (media uploads) |
| Email | Nodemailer (SMTP) |
| Security | helmet, express-rate-limit, express-validator, sanitize-html, bcryptjs, custom CSRF + CORS middleware |
| Hosting | Vercel serverless function (`api/index.js`) |

## Quick start (local)

```bash
git clone https://github.com/pimofydigital/pimofy-site.git
cd pimofy-site
npm install
cp .env.example .env     # then fill in real values (never commit .env)
npm run db:migrate
npm run db:seed          # creates the first superadmin from SUPER_ADMIN_* vars
npm run dev              # http://localhost:3000
```

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Start the server (`server.js`) |
| `npm run dev` | Start with auto-reload (nodemon) |
| `npm test` | Run unit tests (`node --test`) |
| `npm run audit` | Check production dependencies for known vulnerabilities |
| `npm run db:migrate` | Apply database migrations |
| `npm run db:seed` | Seed the superadmin and sample blog posts |
| `npm run optimize:images` | Re-generate WebP versions of images in `assets/` |
| `npm run generate:critical` | Generate critical CSS from a running local server |

## Environment variables

All secrets come from environment variables. Nothing sensitive is hard-coded. Set these in `.env` locally and in **Vercel > Project > Settings > Environment Variables** for production.

| Variable | Required | Purpose |
|---|---|---|
| `NODE_ENV` | yes (prod) | `production` enables HTTPS redirect, HSTS, secure cookies, view cache |
| `APP_URL` | yes (prod) | Canonical origin, e.g. `https://pimofydigital.com`. Used for canonical/OG tags, sitemap, CORS |
| `DATABASE_URL` | yes* | Postgres connection string (Supabase pooler). *Or set `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` |
| `DB_SSL` | recommended | `true` to require TLS to the database (forced on in production) |
| `DB_SSL_REJECT_UNAUTHORIZED` | optional | `true` to verify the DB certificate (recommended when a CA is available) |
| `DB_POOL_MODE`, `DB_POOL_MAX`, `DB_POOL_MIN`, `DB_POOL_ACQUIRE_MS`, `DB_POOL_IDLE_MS`, `DB_IP_FAMILY` | optional | Connection pool tuning |
| `SESSION_SECRET` | yes | Random string, **at least 32 characters** in production (`openssl rand -hex 32`) |
| `SESSION_IDLE_MINUTES` | optional | Idle sign-out, default `60` |
| `SESSION_ABSOLUTE_HOURS` | optional | Maximum login length, default `12` |
| `BCRYPT_ROUNDS` | optional | Password hashing cost, default `12` (10-15) |
| `CORS_ALLOWED_ORIGINS` | optional | Extra trusted origins, comma separated. Leave empty unless needed |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | yes (contact form) | Outgoing mail for the contact form |
| `CONTACT_EMAIL`, `ADMIN_EMAIL` | optional | Where contact requests are delivered |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | yes (media) | Supabase Storage for blog/media uploads. **Server-side only, never expose to the browser** |
| `SUPABASE_STORAGE_BUCKET`, `SUPABASE_MEDIA_FOLDER` | optional | Defaults `media` / `blog-posts` |
| `MAX_FILE_SIZE`, `ALLOWED_MIME_TYPES` | optional | Upload limits. SVG is never allowed |
| `SUPER_ADMIN_NAME`, `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD` | seeding only | Used once by `npm run db:seed`; remove from the host afterwards |
| `SITE_NAME`, `SITE_DESCRIPTION`, `SITE_KEYWORDS` | optional | SEO defaults |

## Deployment (Vercel)

1. Push to `main`. The Vercel project connected to this repo builds and deploys automatically.
2. `vercel.json` routes every request that is not a static file to `api/index.js` (the Express app) and sets long cache headers for `/assets`, `/fonts` and `/favicons`.
3. Run migrations against the production database from a trusted machine: `NODE_ENV=production npm run db:migrate`.
4. After deploying, check https://pagespeed.web.dev/ and https://securityheaders.com/ for pimofydigital.com.

## Project structure

```
api/index.js          Vercel entry point (exports the Express app)
app.js                Express app: security, static files, sessions, routes, errors
server.js             Local/long-running server entry (DB check + listen)
config/               environment.js (all settings), database.js (Sequelize), taxonomy.json
controllers/          Page, Blog, Contact, Auth, Admin request handlers
middleware/           auth (sessions/roles), csrf, cors, validation
models/               Sequelize models: User, BlogPost
migrations/, seeders/ Database schema and seed data
routes/               URL to controller mapping
views/                EJS templates (layouts, partials, pages, blog, admin, auth)
assets/               Images (JPEG + WebP)
public/               Favicons, fonts, admin.js
styles.css, script.js Site-wide stylesheet and front-end script
scripts/              Image optimisation and critical-CSS tools
tests/                Unit tests
```

More detail: [ARCHITECTURE.md](ARCHITECTURE.md), [ARCHITECTURE-ESSENTIALS.md](ARCHITECTURE-ESSENTIALS.md), [PRD.md](PRD.md), [AGENTS.md](AGENTS.md), [SECURITY-AUDIT.md](SECURITY-AUDIT.md).

## Contact

info@pimofydigital.com | +254 722 412676 | +254 703 201241
