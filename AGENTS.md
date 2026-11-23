# AGENTS.md - guide for AI coding agents and new developers

Read this before changing code in this repository.

## Project
Express 4 + EJS website for Pimofy Digital (marketing pages, blog, admin). PostgreSQL via Sequelize. Deployed on Vercel from `main`. See ARCHITECTURE-ESSENTIALS.md first.

## Setup
```bash
npm install
cp .env.example .env   # fill in values
npm run db:migrate && npm run db:seed
npm run dev
npm test
```

## Golden rules
1. **Do not remove existing features** without explicit approval.
2. **Never commit secrets.** All config goes through `config/environment.js` and environment variables. Add new variables to `.env.example` and the README table.
3. **No raw SQL from user input.** Use Sequelize model methods with `where` objects. If raw SQL is unavoidable, use `replacements`/bind parameters.
4. **Escape output.** Use `<%= %>` in EJS. `<%- %>` is only allowed for `include()`, sanitized article HTML (`post.content`), and JSON-LD that escapes `<`.
5. **Sanitize rich HTML** with `sanitizeArticleContent` (sanitize-html allow-list) before saving.
6. **Strict CSP:** no inline `<script>` blocks (except JSON-LD), no `onclick=`/`onsubmit=` attributes, no `eval`. Put JS in `script.js` or `public/js/admin.js` and wire it with `data-*` attributes. Use `textContent`, not `innerHTML`, for dynamic text.
7. **Every state-changing request needs CSRF.** Forms include `<input type="hidden" name="_csrf" value="<%= csrfToken %>">`; multipart forms add `?_csrf=` to the action; fetch calls send `X-CSRF-Token` from the `csrf-token` meta tag.
8. **Admin routes** live in `routes/admin.js` behind `isAuthenticated` + `isAdmin`. User management also needs `isSuperAdmin`.
9. **Validate input** with express-validator in the route, and length-limit everything.
10. **Uploads** must go through `uploadImageToStorage` (magic-byte check, Supabase Storage). Never write uploads to the local filesystem and never allow SVG.
11. **Performance:** keep marketing pages free of database calls; use WebP with width/height; lazy-load below-the-fold images; keep scripts `defer`.
12. **Passwords** only through bcrypt with `config.security.bcryptRounds`.

## Code style
- 2-space indentation, single quotes, semicolons, `const`/`let` (no `var` in Node code).
- Controllers are classes with static async methods that `try/catch` and call `next(error)`.
- Small helper functions at the top of a file, documented with a one-line comment when the purpose is not obvious.
- Keep file and function names descriptive; comment the *why*, not the *what*.

## Before you push
- `npm test` passes and `node --check` succeeds on changed JS files.
- `npm run audit` shows no new high/critical issues.
- Manually load: home, contact (submit), blog, login, admin article edit, media upload.
- Update the relevant docs (README, ARCHITECTURE, SECURITY-AUDIT) when behaviour changes.

## Where things are
Routes `routes/`, handlers `controllers/`, models `models/`, templates `views/`, settings `config/environment.js`, security middleware `middleware/`, styles `styles.css`, front-end JS `script.js` and `public/js/admin.js`.
