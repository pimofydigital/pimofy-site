# Product requirements - Pimofy Digital website

## 1. Purpose
Generate qualified discovery calls for Pimofy Digital's Dedicated Data Operations Pod by explaining the offer clearly, building trust, and making booking a call effortless. Publish useful content that brings in search traffic.

## 2. Business context
- Pimofy Digital is a Nairobi-based data operations provider for SaaS and Ecommerce companies in the UK, Europe and the USA.
- Offer: a managed Data Operations Pod (dedicated specialist, 160 hours/month, QA on every output, weekly KPI reports, account manager, SOPs, flexible scaling).
- Services inside the pod: data entry and verification, CRM updates, data enrichment, research and data collection, database cleanup, SOP documentation, back-office tasks, non-voice support (chat and email).
- Lead magnet: Free Operations Capacity Audit.
- Contact: info@pimofydigital.com, +254 722 412676, +254 703 201241.

## 3. Audience
Founders, operations leads and customer-success managers at growing SaaS and Ecommerce companies whose teams are slowed down by manual data work.

## 4. Goals and success metrics
| Goal | Metric | Target |
|---|---|---|
| Lead generation | Contact form submissions / booked calls | Track monthly growth |
| Speed | Google PageSpeed Insights, mobile and desktop | 90+ on both |
| Load time | Largest Contentful Paint | under 2.5 s (goal 1-3 s full load) |
| Stability | Cumulative Layout Shift | under 0.1 |
| Security | securityheaders.com grade | A or A+ |
| SEO | Indexed pages, organic visits | Steady growth |

## 5. Functional requirements

### Public site
- FR1 Home page with value proposition, metrics, problem, before/after, services, process, monthly deliverables, trust section and call to action.
- FR2 Pages: Solutions, Data Operations Pod, Capacity Audit, Industries, About, Privacy, Terms.
- FR3 Contact form: name, work email, company, company type, website, message, human check. Server-side validation, email to Pimofy, auto-reply to the visitor, clear success/error feedback.
- FR4 Blog: list with pagination, single post with related posts and reading time, categories, tags, search.
- FR5 SEO: unique titles/descriptions, canonical URLs, Open Graph/Twitter tags, JSON-LD, sitemap.xml, robots.txt.
- FR6 Responsive, accessible (skip link, labelled forms, keyboard navigable menus).

### Admin
- FR7 Secure login for admin users.
- FR8 Dashboard with content overview.
- FR9 Article create/edit/publish/delete with rich text, featured image, SEO fields, categories and tags.
- FR10 CSV import of articles (create or upsert).
- FR11 Media library: upload, rename, delete images.
- FR12 Category and tag management.
- FR13 User management for superadmins: create users, disable users.

## 6. Non-functional requirements
- NFR1 Security: OWASP Top 10 protections as documented in SECURITY-AUDIT.md.
- NFR2 Performance: PageSpeed 90+ mobile and desktop; static assets cached long-term.
- NFR3 Privacy: collect only contact-form data needed to respond; comply with the published privacy policy (GDPR-aware for UK/EU visitors).
- NFR4 Reliability: graceful errors, no internal details shown to visitors.
- NFR5 Maintainability: documented code structure, environment-based config, tests runnable with `npm test`.

## 7. Out of scope (current version)
Online payments, client portal, live chat, multi-language content.

## 8. Planned improvements
- Design refresh (modern, clean) across all public pages.
- Content updates from the Pimofy team.
- Move taxonomy storage to the database.
- Optional 2-factor login for admins.
- Testimonials / case studies section.
