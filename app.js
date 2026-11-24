/**
 * Express application factory.
 *
 * Order matters here:
 *   1. Proxy/HTTPS + security headers
 *   2. Static assets (served before rate limiting and sessions so they stay fast)
 *   3. Body parsing, CORS policy, rate limiting
 *   4. Sessions, auth refresh, CSRF
 *   5. Layout rendering, routes, error handlers
 */
const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const config = require('./config/environment');
const { csrfTokenMiddleware, csrfProtectionMiddleware } = require('./middleware/csrf');
const { enforceSessionLifetime, refreshSessionUser } = require('./middleware/auth');
const { corsPolicy } = require('./middleware/cors');
const { sequelize } = require('./models');

// --------------------------------------------
// Helpers
// --------------------------------------------
function resolveRuntimePath(...segments) {
  const fromCwd = path.join(process.cwd(), ...segments);
  return fs.existsSync(fromCwd) ? fromCwd : path.join(__dirname, ...segments);
}

/**
 * Base URL used for canonical links. In production we always trust APP_URL so a
 * forged Host / X-Forwarded-Host header cannot poison canonical or OG tags.
 */
function getRequestBaseUrl(req) {
  if (config.app.isProduction && config.app.url) {
    return config.app.url.replace(/\/+$/, '');
  }
  const host = req.get('host');
  return host ? `${req.protocol}://${host}` : config.app.url;
}

function buildCanonicalUrl(req) {
  try {
    const url = new URL(req.path || '/', getRequestBaseUrl(req));
    return url.toString();
  } catch (error) {
    return config.app.url;
  }
}

/**
 * Version string used to cache-bust /styles.css and /script.js.
 * On Vercel the deploy's git commit is used, so every serverless instance of
 * the same deployment produces the same URL. Locally a content hash is used.
 */
function fileVersion(relativePath) {
  const commit = process.env.VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_DEPLOYMENT_ID || '';
  if (commit) {
    return commit.slice(0, 10);
  }
  try {
    const content = fs.readFileSync(resolveRuntimePath(relativePath));
    return crypto.createHash('sha1').update(content).digest('hex').slice(0, 10);
  } catch (error) {
    return 'dev';
  }
}

const app = express();

// Vercel and most hosts terminate TLS at a proxy in front of the app.
if (config.app.isProduction || config.app.isVercel) {
  app.set('trust proxy', 1);
}
app.disable('x-powered-by');

// ============================================
// HTTPS EVERYWHERE
// ============================================
if (config.app.isProduction) {
  app.use((req, res, next) => {
    if (req.secure) {
      return next();
    }
    const target = new URL(req.originalUrl, config.app.url);
    target.protocol = 'https:';
    return res.redirect(301, target.toString());
  });
}

// ============================================
// SECURITY HEADERS
// ============================================
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        formAction: ["'self'"],
        scriptSrc: ["'self'"],
        scriptSrcAttr: ["'none'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'", 'data:'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
        connectSrc: ["'self'"],
        upgradeInsecureRequests: config.app.isProduction ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: config.app.isProduction
      ? { maxAge: 63072000, includeSubDomains: true, preload: true }
      : false,
  })
);

app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  next();
});

app.use(compression());

// ============================================
// VIEW ENGINE
// ============================================
app.set('view engine', 'ejs');
app.set('views', resolveRuntimePath('views'));
if (config.app.isProduction) {
  app.set('view cache', true);
}

// ============================================
// STATIC FILES (before sessions + rate limits)
// ============================================
const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;
const staticOptions = {
  maxAge: config.app.isProduction ? ONE_YEAR : 0,
  immutable: config.app.isProduction,
  dotfiles: 'deny',
  index: false,
};

app.use(express.static(resolveRuntimePath('public'), staticOptions));
app.get('/favicon.ico', (req, res) => res.redirect(301, '/favicons/favicon.ico'));
app.use('/assets', express.static(resolveRuntimePath('assets'), staticOptions));

const assetVersions = {
  styles: fileVersion('styles.css'),
  script: fileVersion('script.js'),
};
app.locals.assetVersions = assetVersions;
const { postImage, postSocialImage } = require('./utils/blogImage');
app.locals.postImage = postImage;
app.locals.postSocialImage = postSocialImage;

/**
 * styles.css / script.js live at the repo root for backwards compatibility.
 * Requests that carry the current ?v= hash are cached for a year; anything
 * else revalidates.
 */
function sendVersionedAsset(file) {
  return (req, res) => {
    // Any ?v= URL is immutable: each deploy links to a new version string,
    // so browsers fetch fresh CSS/JS after every release and cache it after.
    const versioned = typeof req.query.v === 'string' && req.query.v.length > 0;
    res.setHeader(
      'Cache-Control',
      config.app.isProduction && versioned
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=0, must-revalidate'
    );
    res.sendFile(resolveRuntimePath(file));
  };
}

app.get(['/styles.css', '/css/styles.css'], sendVersionedAsset('styles.css'));
app.get(['/script.js', '/js/script.js'], sendVersionedAsset('script.js'));

// ============================================
// BODY PARSING (explicit size limits)
// ============================================
app.use(express.urlencoded({ extended: false, limit: '200kb', parameterLimit: 200 }));
app.use(express.json({ limit: '100kb' }));

// ============================================
// CORS (same-origin only, see middleware/cors.js)
// ============================================
app.use(corsPolicy);

// ============================================
// RATE LIMITING (pages only; static assets are excluded above)
// ============================================
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: config.app.isProduction ? 300 : 5000,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later.',
  })
);

// ============================================
// SESSIONS
// ============================================
const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: 'sessions',
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: config.session.absoluteTimeoutMs,
});

app.use(
  session({
    name: config.app.isProduction ? '__Host-pimofy.sid' : 'pimofy.sid',
    secret: config.session.secret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    rolling: true, // idle timer resets on every request
    proxy: config.app.isProduction || config.app.isVercel,
    cookie: {
      secure: config.app.isProduction,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: config.session.idleTimeoutMs,
    },
  })
);

app.locals.sessionStore = sessionStore;

app.use(enforceSessionLifetime);
app.use(refreshSessionUser);

// ============================================
// VIEW LOCALS
// ============================================
app.use((req, res, next) => {
  const user = req.session.user || null;
  res.locals.config = config;
  res.locals.user = user;
  res.locals.authUser = user;
  res.locals.isAuthenticated = Boolean(user);
  res.locals.currentYear = new Date().getFullYear();
  res.locals.currentPath = req.path;
  res.locals.taxonomySummary = res.locals.taxonomySummary || null;
  res.locals.siteUrl = getRequestBaseUrl(req);
  res.locals.canonicalUrl = buildCanonicalUrl(req);
  res.locals.assetVersions = assetVersions;
  next();
});

// ============================================
// CSRF
// ============================================
app.use(csrfTokenMiddleware);
app.use(csrfProtectionMiddleware);

// ============================================
// LAYOUT RENDERING
// ============================================
// Render all views through a layout unless `layout: false` is passed.
app.use((req, res, next) => {
  const defaultRender = res.render.bind(res);

  res.render = (view, options, callback) => {
    let renderOptions = options;
    let renderCallback = callback;

    if (typeof options === 'function') {
      renderCallback = options;
      renderOptions = {};
    }
    renderOptions = renderOptions || {};

    if (view.startsWith('layouts/') || renderOptions.layout === false) {
      return defaultRender(view, renderOptions, renderCallback);
    }

    const { layout, ...viewOptions } = renderOptions;
    const layoutTemplate = layout || res.locals.layout || 'layouts/main';

    return defaultRender(layoutTemplate, { ...viewOptions, template: `../${view}` }, renderCallback);
  };

  next();
});

// ============================================
// ROUTES
// ============================================
app.use('/', require('./routes/pages'));
app.use('/blog', require('./routes/blog'));
app.use('/auth', require('./routes/auth'));
app.use('/contact', require('./routes/contact'));
app.use('/admin', require('./routes/admin'));

// ============================================
// ERROR HANDLING
// ============================================
app.use((req, res) => {
  res.status(404).render('pages/404', {
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist.',
  });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = Number.isInteger(err.status) && err.status >= 400 && err.status < 600 ? err.status : 500;

  // Never leak internal error details (stack traces, SQL, file paths) to visitors.
  const publicMessage =
    status < 500 && err.expose !== false && err.message
      ? err.message
      : 'An unexpected error occurred. Please try again later.';

  console.error(`[Error ${status}] ${req.method} ${req.originalUrl}: ${err.message}`);
  if (!config.app.isProduction && err.stack) {
    console.error(err.stack);
  }

  if (res.headersSent) {
    return next(err);
  }

  return res.status(status).render('pages/error', {
    title: 'Error',
    description: config.app.isDevelopment ? err.message || publicMessage : publicMessage,
    status,
    error: config.app.isDevelopment ? err : {},
  });
});

module.exports = app;
