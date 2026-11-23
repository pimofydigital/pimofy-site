const nodemailer = require('nodemailer');
const { matchedData } = require('express-validator');
const config = require('../config/environment');
const { generateArithmeticChallenge } = require('../utils/humanVerification');

let transporter;

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getMailer() {
  if (transporter) {
    return transporter;
  }

  if (!config.email.smtpHost || !config.email.smtpUser || !config.email.smtpPass) {
    throw new Error('Email service is not configured. Missing SMTP settings.');
  }

  transporter = nodemailer.createTransport({
    host: config.email.smtpHost,
    port: config.email.smtpPort,
    secure: config.email.smtpPort === 465,
    requireTLS: config.email.smtpPort === 587,
    auth: {
      user: config.email.smtpUser,
      pass: config.email.smtpPass,
    },
  });

  return transporter;
}

class ContactController {
  // Show contact page
  static async page(req, res, next) {
    try {
      const successFromQuery =
        String(req.query.success || '').toLowerCase() === 'true' || String(req.query.success || '') === '1';
      const contactSuccess = successFromQuery || req.session.contactSuccess || false;
      const errors = req.session.errors || [];
      const formData = req.session.formData || {};
      const humanVerification = req.session.contactChallenge || generateArithmeticChallenge();

      req.session.contactSuccess = false;
      req.session.errors = [];
      req.session.formData = {};
      req.session.contactChallenge = humanVerification;

      res.render('pages/contact', {
        title: 'Book a Free Consultation | Pimofy Digital',
        description:
          'Talk to Pimofy Digital about AI Visibility & Growth or Data Operations. Book a free call, request an AI Visibility Audit or an Operations Capacity Audit.',
        contactSuccess,
        errors,
        formData,
        humanVerification,
      });
    } catch (error) {
      next(error);
    }
  }

  static async challenge(req, res, next) {
    try {
      const humanVerification = generateArithmeticChallenge();
      req.session.contactChallenge = humanVerification;
      res.setHeader('Cache-Control', 'no-store');
      // Only the question is sent; the answer stays server-side in the session.
      res.json({ question: humanVerification.question });
    } catch (error) {
      next(error);
    }
  }

  // Handle contact form submission
  static async submit(req, res, next) {
    try {
      const data = matchedData(req, { locations: ['body'] });
      const submittedAt = new Date();
      const name = data.name || '';
      const email = data.email || '';
      const company = data.company || '';
      const type = data.type || 'Not provided';
      const website = data.website || 'Not provided';
      const message = data.message || '';

      const textBody = [
        'New contact form submission',
        '',
        `Submitted At: ${submittedAt.toISOString()}`,
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${company}`,
        `Company Type: ${type}`,
        `Website: ${website}`,
        '',
        'Message:',
        message,
      ].join('\n');

      const htmlBody = `
        <h2>New contact form submission</h2>
        <p><strong>Submitted At:</strong> ${escapeHtml(submittedAt.toISOString())}</p>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company)}</p>
        <p><strong>Company Type:</strong> ${escapeHtml(type)}</p>
        <p><strong>Website:</strong> ${escapeHtml(website)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
      `;

      await getMailer().sendMail({
        from: `Pimofy Website <${config.email.smtpUser}>`,
        to: config.email.contactEmail || config.email.adminEmail || config.email.smtpUser,
        replyTo: email,
        subject: `New Contact Request - ${name.replace(/[\r\n]/g, ' ')}`,
        text: textBody,
        html: htmlBody,
      });

      // Auto-reply should not block successful form submission if it fails.
      try {
        const confirmationText = [
          `Hi ${name},`,
          '',
          'Thanks for reaching out to Pimofy Digital.',
          'We have received your request and will reply within one business day.',
          '',
          'Summary of your submission:',
          `Company: ${company}`,
          `Company Type: ${type}`,
          `Website: ${website}`,
          '',
          'Best regards,',
          'Pimofy Digital',
          'info@pimofydigital.com',
        ].join('\n');

        const confirmationHtml = `
          <p>Hi ${escapeHtml(name)},</p>
          <p>Thanks for reaching out to <strong>Pimofy Digital</strong>.</p>
          <p>We have received your request and will reply within one business day.</p>
          <p><strong>Summary of your submission:</strong></p>
          <ul>
            <li><strong>Company:</strong> ${escapeHtml(company)}</li>
            <li><strong>Company Type:</strong> ${escapeHtml(type)}</li>
            <li><strong>Website:</strong> ${escapeHtml(website)}</li>
          </ul>
          <p>Best regards,<br />Pimofy Digital<br />info@pimofydigital.com</p>
        `;

        await getMailer().sendMail({
          from: `Pimofy Digital <${config.email.smtpUser}>`,
          to: email,
          subject: 'We received your request - Pimofy Digital',
          text: confirmationText,
          html: confirmationHtml,
        });
      } catch (autoReplyError) {
        console.warn('Contact form auto-reply failed:', autoReplyError.message);
      }

      req.session.contactSuccess = true;
      req.session.errors = [];
      req.session.formData = {};
      req.session.contactChallenge = null;
      res.redirect('/contact?success=1#contact-feedback-anchor');
    } catch (error) {
      console.error('Contact form email failed:', error.message);
      req.session.contactSuccess = false;
      req.session.contactChallenge = null;
      req.session.errors = [
        {
          field: 'form',
          message:
            'Sorry, we could not send your request right now. Please try again in a few minutes or email info@pimofydigital.com directly.',
        },
      ];
      req.session.formData = {
        name: req.body?.name || '',
        email: req.body?.email || '',
        company: req.body?.company || '',
        type: req.body?.type || '',
        website: req.body?.website || '',
        message: req.body?.message || '',
      };
      res.redirect('/contact?error=1#contact-feedback-anchor');
    }
  }
  // Handle AI Visibility Audit request
  static async submitAudit(req, res) {
    const keep = ['name', 'email', 'company', 'website', 'offering', 'market', 'industry', 'competitors', 'buyer_question', 'phone', 'consent'];
    try {
      const data = matchedData(req, { locations: ['body'] });
      const submittedAt = new Date();
      const rows = [
        ['Name', data.name],
        ['Email', data.email],
        ['Company', data.company],
        ['Website', data.website],
        ['What they sell', data.offering],
        ['Main market', data.market],
        ['Industry', data.industry],
        ['Competitors', data.competitors || 'Not provided'],
        ['Buyer question', data.buyer_question || 'Not provided'],
        ['WhatsApp / phone', data.phone || 'Not provided'],
        ['Consent to contact', 'Yes'],
      ];
      const textBody = [
        'New AI Visibility Audit request',
        'Deliver the scorecard within 2 business days.',
        '',
        `Submitted At: ${submittedAt.toISOString()}`,
        ...rows.map(([k, v]) => `${k}: ${v}`),
      ].join('\n');
      const htmlBody = `
        <h2>New AI Visibility Audit request</h2>
        <p>Deliver the scorecard within 2 business days.</p>
        <p><strong>Submitted At:</strong> ${escapeHtml(submittedAt.toISOString())}</p>
        ${rows.map(([k, v]) => `<p><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v)}</p>`).join('')}
      `;

      await getMailer().sendMail({
        from: `Pimofy Website <${config.email.smtpUser}>`,
        to: config.email.contactEmail || config.email.adminEmail || config.email.smtpUser,
        replyTo: data.email,
        subject: `AI Visibility Audit Request - ${String(data.company || '').replace(/[\r\n]/g, ' ')}`,
        text: textBody,
        html: htmlBody,
      });

      try {
        const confirmationText = [
          `Hi ${data.name},`,
          '',
          'Thanks for requesting a free AI Visibility Audit from Pimofy Digital.',
          'Your audit is in the queue. You will receive your one-page scorecard by email within 2 business days.',
          '',
          'It will include:',
          '- Your AI Visibility Score out of 100',
          '- Results for real buyer questions across Google, AI Overviews, ChatGPT, Perplexity, Gemini and Copilot',
          '- The competitors AI names instead of you',
          '- Your three highest-impact fixes',
          '',
          `Company: ${data.company}`,
          `Website: ${data.website}`,
          '',
          'Best regards,',
          'Pimofy Digital',
          'info@pimofydigital.com',
        ].join('\n');
        const confirmationHtml = `
          <p>Hi ${escapeHtml(data.name)},</p>
          <p>Thanks for requesting a free <strong>AI Visibility Audit</strong> from Pimofy Digital.</p>
          <p>Your audit is in the queue. You will receive your one-page scorecard by email within <strong>2 business days</strong>.</p>
          <p>It will include:</p>
          <ul>
            <li>Your AI Visibility Score out of 100</li>
            <li>Results for real buyer questions across Google, AI Overviews, ChatGPT, Perplexity, Gemini and Copilot</li>
            <li>The competitors AI names instead of you</li>
            <li>Your three highest-impact fixes</li>
          </ul>
          <p><strong>Company:</strong> ${escapeHtml(data.company)}<br /><strong>Website:</strong> ${escapeHtml(data.website)}</p>
          <p>Best regards,<br />Pimofy Digital<br />info@pimofydigital.com</p>
        `;
        await getMailer().sendMail({
          from: `Pimofy Digital <${config.email.smtpUser}>`,
          to: data.email,
          subject: 'Your AI Visibility Audit request - Pimofy Digital',
          text: confirmationText,
          html: confirmationHtml,
        });
      } catch (autoReplyError) {
        console.warn('Audit auto-reply failed:', autoReplyError.message);
      }

      req.session.auditSuccess = true;
      req.session.auditErrors = [];
      req.session.auditFormData = {};
      req.session.contactChallenge = null;
      res.redirect('/ai-visibility-audit?success=1#contact-feedback-anchor');
    } catch (error) {
      console.error('Audit request email failed:', error.message);
      req.session.auditSuccess = false;
      req.session.contactChallenge = null;
      req.session.auditErrors = [
        {
          field: 'form',
          message:
            'Sorry, we could not send your request right now. Please try again in a few minutes or email info@pimofydigital.com directly.',
        },
      ];
      req.session.auditFormData = Object.fromEntries(keep.map((k) => [k, String(req.body?.[k] || '')]));
      res.redirect('/ai-visibility-audit?error=1#contact-feedback-anchor');
    }
  }
}

module.exports = ContactController;
