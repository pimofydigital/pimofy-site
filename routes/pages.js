const express = require('express');
const router = express.Router();
const PageController = require('../controllers/PageController');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const ContactController = require('../controllers/ContactController');
const { validateArithmeticAnswer } = require('../utils/humanVerification');

const auditLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 6,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many audit requests. Please try again shortly.',
});

const AUDIT_FIELDS = ['name', 'email', 'company', 'website', 'offering', 'market', 'industry', 'competitors', 'buyer_question', 'phone', 'consent'];
const AUDIT_INDUSTRIES = ['SaaS', 'Ecommerce', 'Professional services', 'Local business', 'Non-profit', 'Other'];
const oneLine = (v) => !/[\r\n]/.test(v);

function normalizeWebsiteUrl(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

const auditValidation = [
  body('name').trim().notEmpty().withMessage('Full name is required').bail()
    .isLength({ min: 2, max: 80 }).withMessage('Full name must be between 2 and 80 characters').bail()
    .matches(/^[\p{L}\p{M} .,'-]+$/u).withMessage('Full name contains invalid characters'),
  body('email').trim().notEmpty().withMessage('Work email is required').bail()
    .isEmail().withMessage('Please provide a valid email address').bail()
    .normalizeEmail({ gmail_remove_dots: false, gmail_remove_subaddress: false, outlookdotcom_remove_subaddress: false, yahoo_remove_subaddress: false, icloud_remove_subaddress: false }),
  body('company').trim().notEmpty().withMessage('Company name is required').bail()
    .isLength({ min: 2, max: 120 }).withMessage('Company name must be between 2 and 120 characters').bail()
    .custom(oneLine).withMessage('Company name is invalid'),
  body('website').trim().notEmpty().withMessage('Website is required').bail()
    .isLength({ max: 2048 }).withMessage('Website URL is too long').bail()
    .customSanitizer(normalizeWebsiteUrl)
    .isURL({ protocols: ['http', 'https'], require_protocol: true, require_tld: true }).withMessage('Website must be a valid domain, for example example.com'),
  body('offering').trim().notEmpty().withMessage('Please tell us what you sell').bail()
    .isLength({ min: 3, max: 160 }).withMessage('What you sell must be between 3 and 160 characters').bail()
    .custom(oneLine).withMessage('What you sell is invalid'),
  body('market').trim().notEmpty().withMessage('Main market is required').bail()
    .isLength({ min: 2, max: 120 }).withMessage('Main market must be between 2 and 120 characters').bail()
    .custom(oneLine).withMessage('Main market is invalid'),
  body('industry').trim().isIn(AUDIT_INDUSTRIES).withMessage('Please choose an industry'),
  body('competitors').optional({ checkFalsy: true }).trim().isLength({ max: 300 }).withMessage('Competitors must be under 300 characters').bail().custom(oneLine).withMessage('Competitors is invalid'),
  body('buyer_question').optional({ checkFalsy: true }).trim().isLength({ max: 200 }).withMessage('Buyer question must be under 200 characters').bail().custom(oneLine).withMessage('Buyer question is invalid'),
  body('phone').optional({ checkFalsy: true }).trim().matches(/^[+0-9 ()-]{6,30}$/).withMessage('Please provide a valid phone or WhatsApp number'),
  body('consent').equals('yes').withMessage('Please agree to be contacted about your audit'),
  body('human_verification').trim().notEmpty().withMessage('Please answer the arithmetic check to continue').bail()
    .custom((value, { req }) => {
      const challenge = req.session?.contactChallenge;
      return !!challenge && validateArithmeticAnswer(value, challenge.question);
    }).withMessage('Your arithmetic answer is incorrect'),
];

function handleAuditErrors(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const seen = new Map();
  result.array().forEach((e) => {
    const field = e.path || e.param;
    if (!seen.has(field)) seen.set(field, { field, message: e.msg });
  });
  req.session.auditErrors = Array.from(seen.values());
  req.session.auditFormData = Object.fromEntries(AUDIT_FIELDS.map((k) => [k, String(req.body?.[k] || '').slice(0, 300)]));
  return res.redirect('/ai-visibility-audit?error=1#contact-feedback-anchor');
}

// Home page
router.get('/', PageController.home);

// Public pages
router.get('/solutions', PageController.solutions);
router.get('/data-operations', PageController.dataOperations);
router.get('/capacity-audit', PageController.capacityAudit);
router.get('/industries', PageController.industries);
router.get('/ai-services', PageController.aiServices);
router.get('/work', PageController.work);
router.get('/faq', PageController.faq);
router.get('/ai-visibility-audit', PageController.aiVisibilityAudit);
router.post('/ai-visibility-audit', auditLimiter, auditValidation, handleAuditErrors, ContactController.submitAudit);
router.get('/ai-services/:slug', PageController.aiService);
router.get('/about', PageController.about);
router.get('/resources', PageController.resources); // Redirect to blog listing

// Legal pages
router.get('/privacy', PageController.privacy);
router.get('/terms', PageController.terms);

// Dynamic sitemap
router.get('/sitemap.xml', PageController.sitemap);

// Robots.txt
router.get('/robots.txt', PageController.robots);
router.get('/llms.txt', PageController.llms);

module.exports = router;
