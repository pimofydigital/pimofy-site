/**
 * CORS policy.
 *
 * The site and its admin are served from a single origin, so no cross-origin
 * access is granted by default. Extra trusted origins can be allowed with
 * CORS_ALLOWED_ORIGINS (comma separated, exact match).
 *
 * - Requests without an Origin header (normal navigation) pass through.
 * - Same-origin and allow-listed origins get matching CORS headers.
 * - Any other origin is refused for state-changing methods and preflights.
 */
const config = require('../config/environment');

const SAFE_METHODS = new Set(['GET', 'HEAD']);

function normalizeOrigin(value) {
  try {
    return new URL(value).origin;
  } catch (error) {
    return '';
  }
}

const allowedOrigins = new Set(
  [config.app.url, ...config.security.corsAllowedOrigins].map(normalizeOrigin).filter(Boolean)
);

function isAllowed(origin, req) {
  if (allowedOrigins.has(origin)) {
    return true;
  }
  // Same host as the current request (covers preview deployments).
  const host = req.get('host');
  return Boolean(host) && normalizeOrigin(origin) === `${req.protocol}://${host}`;
}

function corsPolicy(req, res, next) {
  const origin = req.get('origin');
  if (!origin) {
    return next();
  }

  res.vary('Origin');

  if (isAllowed(origin, req)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,POST');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-CSRF-Token,X-Requested-With');
      res.setHeader('Access-Control-Max-Age', '600');
      return res.sendStatus(204);
    }
    return next();
  }

  if (req.method === 'OPTIONS' || !SAFE_METHODS.has(req.method)) {
    return res.status(403).json({ error: 'Cross-origin request blocked' });
  }

  return next();
}

module.exports = { corsPolicy };
