# Security audit - Pimofy Digital website

**Date:** 23 November 2026
**Scope:** Entire repository `pimofydigital/pimofy-site` (Express app, views, front-end scripts, config, dependencies, Vercel config) plus the public production site https://pimofydigital.com.
**Method:** Manual code review against the OWASP Top 10 and ASVS, dependency audit (`npm audit`), and live checks of the production headers and file exposure.

## Summary

The project already had a solid base: helmet, bcrypt password hashing, parameterized Sequelize queries, server-side validation, a custom CSRF layer, HTML sanitization of blog content and session regeneration on login. The review found **20 issues** (2 high, 9 medium, 9 low). All were fixed in this change without removing any feature.

| # | Severity | Area | Issue | Status |
|---|---|---|---|---|
| 1 | High | Bot protection | `/contact/challenge` and the contact page sent the **answer** of the human check to the browser, so bots could read it and bypass the check | Fixed |
| 2 | High | Dependencies | 61 known vulnerabilities (2 critical, 41 high), mostly from the `vercel` CLI shipped as a runtime dependency, plus `multer` 1.x | Fixed |
| 3 | Medium | Broken authentication | Disabling a user or changing their role did not affect their existing session (they stayed logged in up to 24h) | Fixed |
| 4 | Medium | Session expiry | Fixed 24h cookie, no idle timeout, no absolute limit | Fixed |
| 5 | Medium | Broken authentication | Login timing revealed which emails had accounts (no bcrypt work for unknown emails) | Fixed |
| 6 | Medium | Brute force | Login rate limit was per IP only | Fixed |
| 7 | Medium | Insecure file upload | Upload type trusted the browser MIME type; SVG (can contain JavaScript) was allowed; CSV upload had no type filter | Fixed |
| 8 | Medium | XSS | JSON-LD `schemaMarkup` was printed unescaped inside `<script>`; a `</script>` in a title could break out | Fixed |
| 9 | Medium | CSP | `script-src 'unsafe-inline'` allowed any injected inline script | Fixed |
| 10 | Medium | Data exposure | Global error handler showed raw `err.message` (SQL, paths, stack info) to visitors in production | Fixed |
| 11 | Medium | Host header | Canonical/OG URLs were built from `X-Forwarded-Host`, allowing host-header poisoning | Fixed |
| 12 | Low | CSRF | CSRF token accepted in the query string on every request | Restricted to multipart uploads only |
| 13 | Low | Rate limiting | Global limit (100/15 min) counted images/CSS, so normal browsing could hit it; it was off outside production | Fixed |
| 14 | Low | CORS | No explicit policy | Explicit same-origin policy added |
| 15 | Low | Password policy | Admin-created passwords: length only, cost factor 10 | Complexity rules + cost 12 + auto-upgrade on login |
| 16 | Low | Input handling | Search accepted unlimited length and `%`/`_` wildcards; negative page numbers caused DB errors | Fixed |
| 17 | Low | Data exposure | Author email addresses loaded for public blog pages | Fixed |
| 18 | Low | XSS hardening | Front-end built error messages with `innerHTML` | Replaced with `textContent` |
| 19 | Low | Caching | Admin pages could be cached by browsers/proxies | `Cache-Control: no-store` + `noindex` |
| 20 | Low | Config | Weak `SESSION_SECRET` accepted; no `.env.example` | Startup warning below 32 chars in production; template added |

## Fixes in detail

### 1. Human check answer no longer sent to the browser
- **Before:** the contact page had a hidden input with the answer, and `GET /contact/challenge` returned `{question, answer}`.
- **Now:** only the question is sent. The answer lives in the server session and is checked in `routes/contact.js`. The browser only checks that a value was entered. Endpoint responses are `no-store`.

### 2. Dependencies
- Removed `vercel` (a deploy CLI, not needed at runtime) and the unused `postgres` driver / `db.js`.
- Upgraded `multer` 1.x to 2.x (fixes known DoS issues).
- Added `npm run audit`. Re-run monthly and after every dependency change. See "Regular dependency updates" below.

### 3 and 4. Sessions: refresh, idle timeout, absolute timeout (`middleware/auth.js`, `app.js`)
- `refreshSessionUser` re-loads the signed-in user from the database every 60 seconds. Disabled or deleted users are signed out; role changes apply immediately.
- **Idle timeout:** rolling cookie, default 60 minutes (`SESSION_IDLE_MINUTES`).
- **Absolute timeout:** sign-out after 12 hours no matter what (`SESSION_ABSOLUTE_HOURS`), enforced server-side by `enforceSessionLifetime`.
- Cookie is `HttpOnly`, `Secure` (production), `SameSite=Lax`, and uses the `__Host-` prefix in production, so it cannot be set by subdomains or sent over HTTP. Session ID is regenerated on login (prevents fixation); logout destroys the session and clears the cookie.

### 5 and 6. Login hardening (`controllers/AuthController.js`, `routes/auth.js`)
- One bcrypt comparison always runs (against a dummy hash for unknown emails), and a single generic error is shown for every failure. This stops user enumeration.
- Two limiters: 10 attempts per IP and 5 failed attempts per email every 15 minutes.

### 7. Uploads (`routes/admin.js`, `controllers/AdminController.js`)
- Allowed types: JPEG, PNG, WebP, GIF, AVIF. **SVG blocked.**
- The real type is detected from the file's magic bytes; the stored extension and `Content-Type` come from the detected type, not from the user.
- One file per request, size limits kept (5 MB featured image, 10 MB media, 3 MB CSV). CSV uploads must be `.csv` with a CSV/text MIME type.
- Files go to Supabase Storage (separate origin), never to the app filesystem, so uploaded files cannot be executed by the server.

### 8 and 9. XSS and Content Security Policy
- JSON-LD output escapes `<` as `\u003c`.
- CSP now uses `script-src 'self'` with `script-src-attr 'none'`. No inline scripts or inline event handlers remain. The admin "Disable user" confirm moved from `onsubmit` to a `data-confirm-delete` attribute handled in `admin.js`.
- Google Fonts were replaced with a self-hosted font, so the CSP no longer allows third-party style/font hosts.
- Existing protections kept: EJS escapes all `<%= %>` output; blog HTML is sanitized with an allow-list (`sanitize-html`) before saving; links opened in new tabs get `rel="noopener noreferrer"`.

### 10. Error handling
- Production visitors see a generic message for 5xx errors. Full details are logged server-side only.

### 11. Host header poisoning
- In production, canonical, Open Graph and sitemap URLs always use `APP_URL`.

### 12. CSRF (`middleware/csrf.js`)
- Per-session secret with HMAC-signed nonces and timing-safe comparison (unchanged).
- Token accepted from the form body or `X-CSRF-Token` header. The query string is accepted **only** for `multipart/form-data` uploads (body parsed later by multer). `Referrer-Policy: strict-origin-when-cross-origin` keeps that URL from leaking.
- Cross-origin POSTs are also blocked by the CORS policy (defence in depth), and cookies are `SameSite=Lax`.

### 13. Rate limiting
| Scope | Limit |
|---|---|
| All pages (static files excluded) | 300 requests / 15 min / IP |
| Login | 10 / 15 min / IP and 5 failed / 15 min / email |
| Contact form | 8 / 15 min / IP |
| Admin write actions | 200 / 15 min |

Note: on Vercel each serverless instance keeps its own counters. For strict global limits, add a shared store (Upstash Redis or Postgres) to `express-rate-limit`, or enable Vercel Firewall rate-limit rules.

### 14. CORS (`middleware/cors.js`)
- Same-origin only. Extra origins only via `CORS_ALLOWED_ORIGINS` (exact match).
- Disallowed origins get `403` for preflights and any state-changing request. No wildcard `*` with credentials anywhere.

### 15. Password hashing
- bcrypt, cost 12 by default (`BCRYPT_ROUNDS`, 10-15). Older hashes are re-hashed automatically at the next successful login.
- Admin-created passwords: 12-128 characters with upper-case, lower-case and a number.

### 16. SQL / NoSQL injection
- All database access goes through Sequelize model methods, which bind values as parameters. No raw SQL built from user input exists in the codebase (verified by search for `sequelize.query`, `literal`, string-built SQL).
- LIKE wildcards in search are escaped and search input is capped at 100 characters. Results are capped at 50.
- Page numbers are clamped to 1-1000. Route parameters such as tags are length-limited.
- The app has no NoSQL database. JSON bodies are size-limited (100 KB) and URL-encoded parsing uses `extended: false`, which blocks nested-object (prototype pollution style) payloads.

### HTTPS everywhere
- Production redirects any HTTP request to HTTPS (301).
- HSTS: 2 years, `includeSubDomains`, `preload` (from both Express and `vercel.json`).
- `upgrade-insecure-requests` in the CSP.
- Database: TLS is forced in production. Set `DB_SSL_REJECT_UNAUTHORIZED=true` when the database CA is available so the certificate is verified.

### Security headers (production)
`Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options` / `frame-ancestors 'none'`, `Referrer-Policy`, `Permissions-Policy` (camera, microphone, geolocation, payment, usb disabled), `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`, `Origin-Agent-Cluster`. `X-Powered-By` removed.

### Environment variables / secrets
- No keys, passwords or tokens are hard-coded (verified by repository-wide search). `.env*` is git-ignored; `.env.example` documents every variable without values.
- `SESSION_SECRET` should be at least 32 random characters; the app logs a security warning in production if it is shorter.
- `SUPABASE_SERVICE_ROLE_KEY` is only used server-side and is never sent to templates or the browser.

## Regular dependency updates
1. Monthly: `npm outdated` and `npm run audit`.
2. Apply patch/minor updates, run `npm test`, smoke-test the admin, deploy.
3. Enable **GitHub Dependabot** alerts and security updates for the repository (Settings > Code security).
4. Remaining advisory after this change: a moderate `uuid` advisory inherited from `sequelize` 6 (only affects `uuid` buffer APIs the app does not use). Track the Sequelize release that updates it.

## Recommendations outside the code
1. **Rotate secrets** that may have been shared during development: `SESSION_SECRET`, database password, SMTP password, Supabase service-role key. Rotating `SESSION_SECRET` signs everyone out, which is expected.
2. Remove `SUPER_ADMIN_PASSWORD` from Vercel after seeding.
3. Turn on 2-factor authentication for GitHub, Vercel, Supabase, the domain registrar and cPanel.
4. The old cPanel account (`/public_html`) contains an unused WordPress install. Back it up and delete it, or at least remove its plugins and themes; it is a common attack target even when unused.
5. Consider adding TOTP 2-factor login for the admin panel.
6. Re-check https://securityheaders.com and https://observatory.mozilla.org after each deploy.
