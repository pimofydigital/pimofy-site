const { User } = require('../models');
const bcryptjs = require('bcryptjs');
const config = require('../config/environment');

// Compared against when the email is unknown so response time does not reveal
// which email addresses have accounts (user enumeration).
const DUMMY_HASH = bcryptjs.hashSync('pimofy-dummy-password-for-timing', 10);

function hashRounds(hash) {
  const match = /^\$2[aby]\$(\d{2})\$/.exec(String(hash || ''));
  return match ? Number(match[1]) : 0;
}

class AuthController {
  static setAuthError(req, message = 'Invalid email or password') {
    req.session.errors = [{ field: 'form', message }];
  }

  // Show login page
  static async loginPage(req, res, next) {
    try {
      if (req.session.user) {
        return res.redirect('/admin');
      }

      res.render('auth/login', {
        title: 'Admin Login | Pimofy Digital',
        description: 'Login to your Pimofy Digital admin account',
        errors: req.session.errors || [],
      });

      // Clear errors after rendering
      req.session.errors = [];
    } catch (error) {
      next(error);
    }
  }

  // Handle login
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const normalizedEmail = String(email || '').trim().toLowerCase();

      const user = await User.findOne({ where: { email: normalizedEmail } });

      // Always run one bcrypt comparison so timing is the same for unknown
      // emails, disabled users and wrong passwords. One generic message.
      const passwordMatch = await bcryptjs.compare(String(password || ''), user ? user.password : DUMMY_HASH);

      if (!user || !user.active || !passwordMatch) {
        AuthController.setAuthError(req);
        return res.redirect('/auth/login');
      }

      // Transparently upgrade older, weaker hashes to the current cost factor.
      if (hashRounds(user.password) < config.security.bcryptRounds) {
        const upgraded = await bcryptjs.hash(String(password), config.security.bcryptRounds);
        await user.update({ password: upgraded });
      }

      return req.session.regenerate((regenerateError) => {
        if (regenerateError) {
          return next(regenerateError);
        }

        // New session ID after login prevents session fixation.
        req.session.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
        req.session.authenticatedAt = Date.now();
        req.session.userCheckedAt = Date.now();

        return req.session.save((saveError) => {
          if (saveError) {
            return next(saveError);
          }
          return res.redirect('/admin');
        });
      });
    } catch (error) {
      next(error);
    }
  }

  // Handle logout
  static async logout(req, res, next) {
    try {
      req.session.destroy((err) => {
        if (err) {
          return next(err);
        }
        res.clearCookie(config.app.isProduction ? '__Host-pimofy.sid' : 'pimofy.sid', { path: '/' });
        return res.redirect('/');
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
