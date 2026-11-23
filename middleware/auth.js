/**
 * Authentication and authorization middleware.
 */
const config = require('../config/environment');

// How often (ms) a signed-in session is re-checked against the database.
const USER_REFRESH_INTERVAL_MS = 60 * 1000;

function denyAccess(res) {
  return res.status(403).render('pages/403', {
    title: 'Access Denied',
    description: 'You do not have permission to access this resource.',
  });
}

/**
 * Absolute session lifetime. The cookie idle timeout is handled by
 * express-session (rolling cookie); this caps the total length of a login
 * so a stolen cookie cannot be kept alive forever.
 */
function enforceSessionLifetime(req, res, next) {
  const session = req.session;
  if (!session || !session.user) {
    return next();
  }

  const startedAt = Number(session.authenticatedAt) || 0;
  if (!startedAt || Date.now() - startedAt > config.session.absoluteTimeoutMs) {
    return session.regenerate(() => {
      req.session.errors = [{ field: 'form', message: 'Your session expired. Please sign in again.' }];
      next();
    });
  }

  return next();
}

/**
 * Re-load the signed-in user periodically so that disabling a user, deleting
 * them, or changing their role takes effect on their existing session.
 */
async function refreshSessionUser(req, res, next) {
  const session = req.session;
  if (!session || !session.user) {
    return next();
  }

  const lastCheck = Number(session.userCheckedAt) || 0;
  if (Date.now() - lastCheck < USER_REFRESH_INTERVAL_MS) {
    return next();
  }

  try {
    // Required lazily to avoid a circular import with app.js.
    const { User } = require('../models');
    const user = await User.findByPk(session.user.id, { attributes: ['id', 'name', 'email', 'role', 'active'] });

    if (!user || !user.active) {
      return session.regenerate(() => next());
    }

    session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    session.userCheckedAt = Date.now();
    return next();
  } catch (error) {
    return next(error);
  }
}

function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  return next();
}

function isAdmin(req, res, next) {
  const role = req.session.user && req.session.user.role;
  if (role !== 'admin' && role !== 'superadmin') {
    return denyAccess(res);
  }
  return next();
}

function isSuperAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'superadmin') {
    return denyAccess(res);
  }
  return next();
}

module.exports = {
  enforceSessionLifetime,
  refreshSessionUser,
  isAuthenticated,
  isAdmin,
  isSuperAdmin,
};
