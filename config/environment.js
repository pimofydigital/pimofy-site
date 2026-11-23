/**
 * Central configuration. Every secret comes from environment variables;
 * nothing sensitive is hard-coded. See README.md for the full variable list.
 */
require('dotenv').config();

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
const nodeEnv = process.env.NODE_ENV || 'development';
// Vercel production deployments count as production even if NODE_ENV was
// left unset or set differently in the dashboard, so caching, HTTPS and
// secure-cookie protections are always on for the live site.
const isProduction = nodeEnv === 'production' || process.env.VERCEL_ENV === 'production';

const requiredEnvVars = [
  ...(hasDatabaseUrl ? ['DATABASE_URL'] : ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD']),
  'SESSION_SECRET',
];

const missingEnvVars = requiredEnvVars.filter((name) => !process.env[name]);
if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error('Set them in your local .env file or in the hosting dashboard.');
  process.exit(1);
}

// A short or guessable session secret makes session cookies forgeable.
// Warn loudly instead of exiting so an existing deployment is not taken down.
if (isProduction && String(process.env.SESSION_SECRET).length < 32) {
  console.warn('SECURITY WARNING: SESSION_SECRET should be at least 32 random characters. Rotate it in the hosting dashboard.');
}

function toInt(value, fallback) {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function toList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

const isVercel = ['1', 'true'].includes(String(process.env.VERCEL || '').toLowerCase());

module.exports = {
  database: {
    url: process.env.DATABASE_URL || '',
    host: process.env.DB_HOST,
    port: toInt(process.env.DB_PORT, 5432),
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: process.env.DB_DIALECT || 'postgres',
  },
  session: {
    secret: process.env.SESSION_SECRET,
    // Idle timeout: signed out after this many minutes without activity.
    idleTimeoutMs: toInt(process.env.SESSION_IDLE_MINUTES, 60) * 60 * 1000,
    // Absolute timeout: signed out after this many hours no matter what.
    absoluteTimeoutMs: toInt(process.env.SESSION_ABSOLUTE_HOURS, 12) * 60 * 60 * 1000,
  },
  security: {
    bcryptRounds: Math.min(Math.max(toInt(process.env.BCRYPT_ROUNDS, 12), 10), 15),
    corsAllowedOrigins: toList(process.env.CORS_ALLOWED_ORIGINS),
  },
  app: {
    url: (process.env.APP_URL || (isProduction ? 'https://pimofydigital.com' : 'http://localhost:3000')).replace(/\/+$/, ''),
    nodeEnv,
    port: toInt(process.env.PORT, 3000),
    isDevelopment: nodeEnv === 'development',
    isProduction,
    isVercel,
  },
  email: {
    smtpHost: process.env.SMTP_HOST,
    smtpPort: toInt(process.env.SMTP_PORT, 587),
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    contactEmail: process.env.CONTACT_EMAIL,
    adminEmail: process.env.ADMIN_EMAIL,
  },
  upload: {
    maxFileSize: toInt(process.env.MAX_FILE_SIZE, 5 * 1024 * 1024),
    allowedMimeTypes: toList(process.env.ALLOWED_MIME_TYPES || 'image/jpeg,image/png,image/webp,image/gif,image/avif'),
  },
  seo: {
    siteName: process.env.SITE_NAME || 'Pimofy Digital',
    siteDescription: process.env.SITE_DESCRIPTION || 'Dedicated data operations for SaaS and Ecommerce companies',
    siteKeywords: process.env.SITE_KEYWORDS || 'data operations, bpo, saas, ecommerce',
  },
};
