const { generateArithmeticChallenge } = require('../utils/humanVerification');
const { BlogPost } = require('../models');
const config = require('../config/environment');
const aiServices = require('../config/aiServices');
const portfolio = require('../config/portfolio');
const faqGroups = require('../config/faqs');
const dataOpsServices = require('../config/dataOpsServices');
const locations = require('../config/locations');

const SITE_URL = () => config.app.url || 'https://pimofydigital.com';

const ORGANIZATION_REF = () => ({ '@id': `${SITE_URL()}/#organization` });

function faqSchema(faqs) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

function breadcrumbSchema(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL()}${item.path}`,
    })),
  };
}

class PageController {
  // Home page
  static async home(req, res, next) {
    try {
      res.render('pages/home', {
        title: 'Be the Answer on Google and in AI Search | Pimofy Digital',
        description:
          'AI-powered SEO, AEO, GEO and conversion campaigns that get your business found on Google, recommended by ChatGPT and chosen. USA, UK, Europe and Africa.',
        preloadImage: '/assets/hero-home.webp',
        aiServicesList: aiServices.services,
        schemaMarkup: {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'OfferCatalog',
              '@id': `${SITE_URL()}/#services`,
              name: 'Pimofy Digital services',
              itemListElement: [
                ...aiServices.services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, url: `${SITE_URL()}/ai-services/${s.slug}`, provider: ORGANIZATION_REF() } })),
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Data Operations Pod', url: `${SITE_URL()}/data-operations`, provider: ORGANIZATION_REF() } },
                { '@type': 'Offer', price: '0', priceCurrency: 'USD', itemOffered: { '@type': 'Service', name: 'Free AI Visibility Review', url: `${SITE_URL()}/ai-visibility-review`, provider: ORGANIZATION_REF() } },
              ],
            },
          ],
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Solutions page
  static async solutions(req, res, next) {
    try {
      res.render('pages/solutions', {
        title: 'Solutions: AI Visibility, Websites & Data Operations | Pimofy',
        description:
          'Four solutions: a free AI Visibility Review, Answer-Ready Websites, the AI Visibility Programme (SEO, AEO, GEO, schema) and the Data Operations Pod.',
        preloadImage: '/assets/data-warehouse.webp',
      });
    } catch (error) {
      next(error);
    }
  }

  // Data operations page
  static async dataOperations(req, res, next) {
    try {
      res.render('pages/data-operations', {
        dataOpsServices,
        title: 'Data Operations Pod for SaaS & Ecommerce | Pimofy',
        description:
          'Discover how Pimofy\'s Data Operations Pod combines specialists, QA, and reporting to restore team capacity without hiring overhead.',
        preloadImage: '/assets/data-specialist.webp',
        schemaMarkup: {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Service',
              '@id': `${SITE_URL()}/data-operations#service`,
              name: 'Data Operations Pod',
              serviceType: 'Managed data operations outsourcing',
              description: 'A dedicated Data Operations Specialist (160 hours per month) with QA oversight, weekly KPI reports, SOPs and a dedicated account manager, for SaaS and Ecommerce companies.',
              url: `${SITE_URL()}/data-operations`,
              provider: ORGANIZATION_REF(),
              areaServed: ['United Kingdom', 'United States', 'Europe', 'Africa', 'Middle East', 'Asia'],
              audience: { '@type': 'BusinessAudience', audienceType: 'SaaS and Ecommerce companies' },
              offers: [
                { '@type': 'Offer', name: 'One-time sign-up', price: '499', priceCurrency: 'USD' },
                { '@type': 'Offer', name: 'Dedicated specialist, 160 hours per month', price: '1600', priceCurrency: 'USD', priceSpecification: { '@type': 'UnitPriceSpecification', price: '1600', priceCurrency: 'USD', unitText: 'MONTH' } },
              ],
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Data Operations services',
                itemListElement: dataOpsServices.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, url: `${SITE_URL()}/data-operations/${s.slug}` } })),
              },
            },
            faqSchema([{"q": "How do you keep our data secure and confidential?", "a": "We operate under your confidentiality and NDA requirements as standard, signed before any data is shared. Access is limited to your assigned specialist and account manager, and we follow agreed handling, storage, and access controls for every workflow."}, {"q": "Are you GDPR compliant?", "a": "Yes. We handle personal data strictly as a data processor on your instructions, in line with GDPR principles. We will sign a Data Processing Agreement (DPA) on request and apply the access, retention, and confidentiality controls your business requires."}, {"q": "Which time zones do you cover?", "a": "We are based in Nairobi (GMT+3) and work comfortably across UK, European, and US business hours. We agree your preferred working window and reporting cadence during onboarding, so there is meaningful daily overlap with your team."}, {"q": "What is the contract length and can we cancel?", "a": "Engagements run month to month after the one-time setup. There is no long lock-in—you can scale up, scale down, or give notice in line with the simple terms agreed at onboarding. The 40-hour trial lets you confirm fit before you commit fully."}, {"q": "What happens if we need more capacity?", "a": "Each pod is one dedicated specialist at 160 hours per month. As your volume grows you can add specialists—capacity flexes with your needs without new hiring or training cycles on your side."}, {"q": "What tools and systems do you work with?", "a": "Our specialists work across virtually any format or system—CRMs, spreadsheets, databases, ticketing and back-office platforms. We onboard to your existing tools during Phase 2 rather than forcing you onto ours."}]),
            breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Data Operations', path: '/data-operations' }]),
          ],
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Capacity audit page
  static async capacityAudit(req, res, next) {
    try {
      res.render('pages/capacity-audit', {
        title: 'Free Operations Capacity Audit™ | Pimofy Digital',
        description:
          'Free Operations Capacity Audit™ for SaaS & Ecommerce operations teams: find repetitive data work, quantify lost hours and map a practical plan.',
        preloadImage: '/assets/capacity-donut.webp',
      });
    } catch (error) {
      next(error);
    }
  }

  // Industries page
  static async industries(req, res, next) {
    try {
      res.render('pages/industries', {
        title: 'Industries: SaaS, Ecommerce & Every Business | Pimofy Digital',
        description: 'Specialists in SaaS & Ecommerce data operations, with AI Visibility & Growth services for businesses in every industry across the USA, UK, Europe and Africa.',
      });
    } catch (error) {
      next(error);
    }
  }

  // About page
  static async about(req, res, next) {
    try {
      res.render('pages/about', {
        title: 'About Pimofy Digital | AI Visibility & Data Operations',
        description: 'Pimofy Digital is the AI Visibility & Growth partner for SaaS & Ecommerce, getting brands found and recommended by Google and AI, backed by data operations.',
        preloadImage: '/assets/team.webp',
      });
    } catch (error) {
      next(error);
    }
  }

  // AI Visibility & Growth hub
  static async aiServices(req, res, next) {
    try {
      const { hub, services } = aiServices;
      res.render('pages/ai-services', {
        title: hub.title,
        description: hub.metaDescription,
        keywords: 'AI web development, AEO, SEO, GEO, schema markup, AI search optimization',
        hub,
        services,
        schemaMarkup: {
          '@context': 'https://schema.org',
          '@graph': [
            ORGANIZATION_REF(),
            {
              '@type': 'ItemList',
              name: 'Pimofy AI Visibility & Growth Services',
              itemListElement: services.map((service, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: `${SITE_URL()}/ai-services/${service.slug}`,
                name: service.name,
              })),
            },
            breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'AI Services', path: '/ai-services' }]),
            faqSchema(hub.faqs),
          ],
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Individual AI service page
  static async aiService(req, res, next) {
    try {
      const service = aiServices.getService(String(req.params.slug || ''));
      if (!service) {
        return res.status(404).render('pages/404', {
          title: 'Page Not Found',
          description: 'The page you are looking for does not exist.',
        });
      }

      const related = aiServices.services.filter((item) => item.slug !== service.slug).slice(0, 4);
      const url = `${SITE_URL()}/ai-services/${service.slug}`;

      return res.render('pages/ai-service', {
        title: service.title,
        description: service.metaDescription,
        keywords: service.keywords,
        service,
        related,
        work: portfolio.forService(service.slug, 3),
        schemaMarkup: {
          '@context': 'https://schema.org',
          '@graph': [
            ORGANIZATION_REF(),
            {
              '@type': 'Service',
              '@id': `${url}#service`,
              name: service.name,
              serviceType: service.name,
              description: service.metaDescription,
              url,
              provider: { '@id': `${SITE_URL()}/#organization` },
              areaServed: ['United Kingdom', 'Europe', 'United States', 'Africa'],
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: `${service.name} deliverables`,
                itemListElement: service.deliverables.map((item) => ({
                  '@type': 'Offer',
                  itemOffered: { '@type': 'Service', name: item.title, description: item.text },
                })),
              },
            },
            breadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'AI Services', path: '/ai-services' },
              { name: service.shortName, path: `/ai-services/${service.slug}` },
            ]),
            faqSchema(service.faqs),
          ],
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  // Free AI Visibility Review
  static async aiVisibilityReview(req, res, next) {
    try {
      const successFromQuery = String(req.query.success || '') === '1';
      const auditSuccess = successFromQuery || req.session.auditSuccess || false;
      const errors = req.session.auditErrors || [];
      const formData = req.session.auditFormData || {};
      const humanVerification = req.session.contactChallenge || generateArithmeticChallenge();
      req.session.auditSuccess = false;
      req.session.auditErrors = [];
      req.session.auditFormData = {};
      req.session.contactChallenge = humanVerification;

      const auditFaqs = [
        { q: 'Is it really free?', a: 'Yes. There is no cost and no obligation, and the scorecard is yours to keep whether or not you work with us.' },
        { q: 'Which AI assistants do you check?', a: 'ChatGPT, Perplexity, Google Gemini and Microsoft Copilot, plus Google Search and Google AI Overviews.' },
        { q: 'How long does it take?', a: 'You will receive your one-page scorecard by email within 2 business days of submitting the form.' },
        { q: 'Do you need access to my website or accounts?', a: 'No. We only use what is publicly visible, the same view a buyer or an AI assistant gets.' },
        { q: 'Can you guarantee AI will recommend us?', a: 'No one can honestly guarantee that. We show you where you stand today and which fixes are most likely to help, then re-test after 90 days so you can compare.' },
        { q: 'Who is the review for?', a: 'Any business that wins customers online. We work across industries, from SaaS and ecommerce to professional services, local businesses and non-profits.' },
      ];

      res.render('pages/ai-visibility-review', {
        title: 'Free AI Visibility Review for Your Business | Pimofy Digital',
        description: 'Find out if Google, ChatGPT, Perplexity and Gemini recommend your business. Free scorecard: your score, competitors and top 3 fixes in 2 business days.',
        auditSuccess,
        errors,
        formData,
        humanVerification,
        auditFaqs,
        schemaMarkup: {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Service',
              name: 'Free AI Visibility Review',
              serviceType: 'AI search visibility review',
              description: 'A one-page scorecard rating a business out of 100 on visibility across Google Search, Google AI Overviews, ChatGPT, Perplexity, Gemini and Microsoft Copilot, with competitors named and three priority fixes. Delivered within 2 business days.',
              url: `${SITE_URL()}/ai-visibility-review`,
              provider: ORGANIZATION_REF(),
              areaServed: ['United States', 'United Kingdom', 'Europe', 'Africa'],
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            },
            {
              '@type': 'FAQPage',
              mainEntity: auditFaqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
            },
            breadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'AI Visibility & Growth', path: '/ai-services' },
              { name: 'AI Visibility Review', path: '/ai-visibility-review' },
            ]),
          ],
        },
      });
    } catch (error) {
      next(error);
    }
  }


  // Data Operations service page (/data-operations/:slug)
  static async dataOpsService(req, res) {
    const service = dataOpsServices.find((s) => s.slug === String(req.params.slug || ''));
    if (!service) {
      return res.status(404).render('pages/404', { title: 'Page Not Found', description: 'The page you are looking for does not exist.' });
    }
    const url = `${SITE_URL()}/data-operations/${service.slug}`;
    const related = service.related.map((slug) => dataOpsServices.find((s) => s.slug === slug)).filter(Boolean);
    return res.render('pages/dataops-service', {
      title: service.title,
      description: service.metaDescription,
      keywords: service.keywords,
      service,
      related,
      schemaMarkup: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Service',
            '@id': `${url}#service`,
            name: service.name,
            serviceType: service.name,
            description: service.answer,
            url,
            provider: ORGANIZATION_REF(),
            isRelatedTo: { '@id': `${SITE_URL()}/data-operations#service` },
            areaServed: ['United Kingdom', 'Europe', 'United States', 'Kenya'],
            audience: { '@type': 'BusinessAudience', audienceType: 'SaaS and Ecommerce companies' },
            offers: {
              '@type': 'Offer',
              price: '1600',
              priceCurrency: 'USD',
              description: 'Dedicated Data Operations Specialist, 160 hours per month, delivered inside the Data Operations Pod. One-time sign-up fee of $499.',
              priceSpecification: { '@type': 'UnitPriceSpecification', price: '1600', priceCurrency: 'USD', unitText: 'MONTH' },
            },
          },
          faqSchema(service.faqs),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Data Operations', path: '/data-operations' },
            { name: service.shortName, path: `/data-operations/${service.slug}` },
          ]),
        ],
      },
    });
  }

  // Markets hub (/locations)
  static async locationsHub(req, res) {
    return res.render('pages/locations', {
      title: 'Markets We Serve: UK, USA, Europe, Africa & More | Pimofy Digital',
      description: 'Nairobi-based Pimofy Digital serves the UK, USA, Europe, Kenya, East Africa, the Middle East and Asia. Working hours, data protection and terms by market.',
      locations,
      schemaMarkup: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'CollectionPage',
            '@id': `${SITE_URL()}/locations#webpage`,
            url: `${SITE_URL()}/locations`,
            name: 'Markets We Serve',
            about: ORGANIZATION_REF(),
            hasPart: locations.map((l) => ({ '@type': 'WebPage', url: `${SITE_URL()}/locations/${l.slug}`, name: l.title })),
          },
          breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Markets', path: '/locations' }]),
        ],
      },
    });
  }

  // Market page (/locations/:slug)
  static async location(req, res) {
    const loc = locations.find((l) => l.slug === String(req.params.slug || ''));
    if (!loc) {
      return res.status(404).render('pages/404', { title: 'Page Not Found', description: 'The page you are looking for does not exist.' });
    }
    const url = `${SITE_URL()}/locations/${loc.slug}`;
    return res.render('pages/location', {
      title: loc.title,
      description: loc.metaDescription,
      keywords: loc.keywords,
      loc,
      others: locations.filter((l) => l.slug !== loc.slug),
      schemaMarkup: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Service',
            '@id': `${url}#service`,
            name: `Data operations and AI visibility services for ${loc.country}`,
            description: loc.answer,
            url,
            provider: ORGANIZATION_REF(),
            areaServed: { '@type': ['united-kingdom', 'united-states', 'kenya'].includes(loc.slug) ? 'Country' : 'Place', name: loc.country },
          },
          faqSchema(loc.faqs),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Markets', path: '/locations' },
            { name: loc.country, path: `/locations/${loc.slug}` },
          ]),
        ],
      },
    });
  }

  // FAQ
  static async faq(req, res, next) {
    try {
      const allFaqs = faqGroups.flatMap((group) => group.items);
      res.render('pages/faq', {
        title: 'FAQ: AI Web Development, SEO, AEO, GEO & Data Operations | Pimofy',
        description: 'Answers to the questions SaaS & Ecommerce leaders ask about AI web development, SEO, AEO, GEO, schema markup, data operations, security and working with Pimofy.',
        faqGroups,
        schemaMarkup: {
          '@context': 'https://schema.org',
          '@graph': [
            faqSchema(allFaqs),
            breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'FAQ', path: '/faq' }]),
          ],
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Portfolio
  static async work(req, res, next) {
    try {
      const all = [...portfolio.products, ...portfolio.websites];
      res.render('pages/work', {
        title: 'Our Work: AI Products, Websites & Ecommerce | Pimofy Digital',
        description: 'Live AI-powered SaaS platforms, Ecommerce stores and international websites designed and engineered by Pimofy Digital for clients around the world.',
        products: portfolio.products,
        websites: portfolio.websites,
        schemaMarkup: {
          '@context': 'https://schema.org',
          '@graph': [
            ORGANIZATION_REF(),
            {
              '@type': 'ItemList',
              name: 'Pimofy Digital portfolio',
              itemListElement: all.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: { '@type': 'CreativeWork', name: item.name, url: item.url, description: item.summary, creator: { '@id': `${SITE_URL()}/#organization` } },
              })),
            },
            breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Our Work', path: '/work' }]),
          ],
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Resources page - redirect to blog
  static async resources(req, res) {
    res.redirect('/blog');
  }

  // Privacy page
  static async privacy(req, res, next) {
    try {
      res.render('pages/privacy', {
        title: 'Privacy Policy | Pimofy Digital',
        description: 'How Pimofy Digital collects, uses, stores and protects personal data from website visitors, enquiries and clients, in line with GDPR principles.',
      });
    } catch (error) {
      next(error);
    }
  }

  // Terms page
  static async terms(req, res, next) {
    try {
      res.render('pages/terms', {
        title: 'Terms & Conditions | Pimofy Digital',
        description: 'The terms and conditions that apply when you use the Pimofy Digital website, request a consultation or engage our AI Visibility & Growth or data services.',
      });
    } catch (error) {
      next(error);
    }
  }

  // Dynamic sitemap.xml
  static async sitemap(req, res, next) {
    try {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');

      // Static pages
      const staticPages = [
        { url: '/', changefreq: 'weekly', priority: 1.0 },
        { url: '/solutions', changefreq: 'monthly', priority: 0.8 },
        { url: '/data-operations', changefreq: 'monthly', priority: 0.8 },
        ...dataOpsServices.map((s) => ({ url: `/data-operations/${s.slug}`, changefreq: 'monthly', priority: 0.7 })),
        { url: '/locations', changefreq: 'monthly', priority: 0.6 },
        ...locations.map((l) => ({ url: `/locations/${l.slug}`, changefreq: 'monthly', priority: 0.7 })),
        { url: '/capacity-audit', changefreq: 'monthly', priority: 0.8 },
        { url: '/industries', changefreq: 'monthly', priority: 0.8 },
        { url: '/ai-services', changefreq: 'monthly', priority: 0.9 },
        { url: '/work', changefreq: 'monthly', priority: 0.8 },
        { url: '/faq', changefreq: 'monthly', priority: 0.8 },
        { url: '/ai-visibility-review', changefreq: 'monthly', priority: 0.9 },
        ...aiServices.services.map((service) => ({ url: `/ai-services/${service.slug}`, changefreq: 'monthly', priority: 0.8 })),
        { url: '/about', changefreq: 'monthly', priority: 0.7 },
        { url: '/blog', changefreq: 'weekly', priority: 0.9 },
        { url: '/contact', changefreq: 'monthly', priority: 0.8 },
        { url: '/privacy', changefreq: 'yearly', priority: 0.3 },
        { url: '/terms', changefreq: 'yearly', priority: 0.3 },
      ];

      // Get published blog posts
      const posts = await BlogPost.findAll({
        where: { published: true },
        attributes: ['slug', 'updatedAt'],
        order: [['publishDate', 'DESC']],
      });

      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

      // Add static pages
      staticPages.forEach((page) => {
        const baseUrl = SITE_URL();
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += '  </url>\n';
      });

      // Add blog posts
      posts.forEach((post) => {
        const baseUrl = SITE_URL();
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
        xml += `    <lastmod>${post.updatedAt.toISOString().split('T')[0]}</lastmod>\n`;
        xml += '    <changefreq>monthly</changefreq>\n';
        xml += '    <priority>0.7</priority>\n';
        xml += '  </url>\n';
      });

      xml += '</urlset>';

      res.send(xml);
    } catch (error) {
      next(error);
    }
  }

  // llms.txt: concise, machine-readable company summary for AI assistants (GEO)
  static async llms(req, res) {
    const base = SITE_URL();
    const lines = [
      '# Pimofy Digital',
      '',
      '> Be the answer, on Google and in AI search. Pimofy Digital is an AI growth agency: Be Found (AI-powered SEO), Be Cited (AEO, GEO, schema) and Be Chosen (AI web development, landing pages, Facebook & Instagram ads) for any business, plus dedicated Data Operations Pods for SaaS & Ecommerce. Nairobi-based, serving businesses across the USA, UK, Europe and Africa.',
      '',
      '## AI Visibility & Growth',
      `- [Free AI Visibility Review](${base}/ai-visibility-review): How Google, ChatGPT, Gemini and Perplexity describe and recommend your brand versus competitors, with a prioritised action plan.`,
      ...aiServices.services.map((s) => `- [${s.name}](${base}/ai-services/${s.slug}): ${s.summary}`),
      '',
      '## Data Operations',
      `- [Dedicated Data Operations Pod](${base}/data-operations): A dedicated specialist (160 hours/month) with QA on every output, SOPs, weekly KPI reports and an account manager. Data entry, CRM updates, enrichment, research, database cleanup, back-office and non-voice support.`,
      ...dataOpsServices.map((s) => `- [${s.name}](${base}/data-operations/${s.slug}): ${s.menuTagline}.`),
      `- [Free Operations Capacity Audit](${base}/capacity-audit): No-obligation review of repetitive workflows and reclaimable capacity.`,
      '',
      '## Markets',
      ...locations.map((l) => `- [${l.country}](${base}/locations/${l.slug}): ${l.metaDescription}`),
      '',
      '## Company',
      `- [Our Work](${base}/work): Live AI products, SaaS platforms, ecommerce stores and websites.`,
      `- [FAQ](${base}/faq): Answers about AI web development, SEO, AEO, GEO, schema, data operations, security, pricing and engagement.`,
      `- [About](${base}/about)`,
      `- [Resources](${base}/blog)`,
      `- [Contact](${base}/contact): info@pimofydigital.com, +254 722 412676, +254 703 201241`,
      '',
    ];
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(lines.join('\n'));
  }

  // robots.txt
  static async robots(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    const baseUrl = SITE_URL();

    // Publishing policy (owner decision, Nov 2026): allow search, AI-answer and
    // AI-training crawlers on public pages. Private areas stay disallowed
    // (and are also protected by authentication and noindex).
    const searchBots = ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User', 'Claude-SearchBot', 'Claude-User', 'DuckAssistBot', 'Applebot'];
    const trainingBots = ['GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Meta-ExternalAgent', 'Amazonbot'];
    const aiBots = [...searchBots, ...trainingBots];
    const content = [
      '# Pimofy Digital robots.txt',
      'User-agent: *',
      'Allow: /',
      'Disallow: /admin',
      'Disallow: /auth/',
      '',
      ...aiBots.flatMap((bot) => [`User-agent: ${bot}`, 'Allow: /', 'Disallow: /admin', 'Disallow: /auth/', '']),
      `Sitemap: ${baseUrl}/sitemap.xml`,
      `# AI summary: ${baseUrl}/llms.txt`,
      '',
    ].join('\n');

    res.send(content);
  }
}

module.exports = PageController;
