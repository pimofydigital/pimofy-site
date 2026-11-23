const { BlogPost } = require('../models');
const config = require('../config/environment');
const aiServices = require('../config/aiServices');
const portfolio = require('../config/portfolio');
const faqGroups = require('../config/faqs');

const SITE_URL = () => config.app.url || 'https://pimofydigital.com';

const ORGANIZATION_REF = () => ({
  '@type': 'Organization',
  '@id': `${SITE_URL()}/#organization`,
  name: 'Pimofy Digital',
  url: SITE_URL(),
  logo: `${SITE_URL()}/assets/logo.png`,
  email: 'info@pimofydigital.com',
  telephone: '+254722412676',
  address: { '@type': 'PostalAddress', addressLocality: 'Nairobi', addressCountry: 'KE' },
});

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
        title: 'Data Operations & AI Growth for SaaS & Ecommerce | Pimofy Digital',
        description:
          'Pimofy Digital helps SaaS & Ecommerce companies in the USA, UK, Europe and worldwide scale with dedicated data operations and AI growth services: AI web development, SEO, AEO, GEO and schema markup.',
        preloadImage: '/assets/hero-home.webp',
        aiServicesList: aiServices.services,
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
          'Four solutions for SaaS & Ecommerce: a free AI Visibility Audit, Answer-Ready Websites, the AI Visibility Programme (SEO, AEO, GEO, schema) and the Data Operations Pod.',
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
        title: 'Data Operations Pod for SaaS & Ecommerce | Pimofy',
        description:
          'Discover how Pimofy\'s Data Operations Pod combines specialists, QA, and reporting to restore team capacity without hiring overhead.',
        preloadImage: '/assets/data-specialist.webp',
      });
    } catch (error) {
      next(error);
    }
  }

  // Capacity audit page
  static async capacityAudit(req, res, next) {
    try {
      res.render('pages/capacity-audit', {
        title: 'Free Operations Capacity Audit | Pimofy Digital',
        description:
          'Book a free Operations Capacity Audit to identify repetitive data tasks, quantify lost hours, and map a practical execution plan.',
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
        title: 'About Pimofy Digital | AI Visibility & Growth for SaaS & Ecommerce',
        description: 'Pimofy Digital is the AI Visibility & Growth partner for SaaS & Ecommerce: we get brands found, chosen and recommended by Google and AI assistants, backed by dedicated data operations.',
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

  // Free AI Visibility Audit
  static async aiVisibilityAudit(req, res, next) {
    try {
      res.render('pages/ai-visibility-audit', {
        title: 'Free AI Visibility Audit for Your Business | Pimofy Digital',
        description: 'See how Google, ChatGPT, Gemini and Perplexity describe and recommend your brand versus competitors. Free AI Visibility Audit with a prioritised action plan.',
        schemaMarkup: {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Service',
              name: 'Free AI Visibility Audit',
              serviceType: 'AI search visibility audit',
              url: `${SITE_URL()}/ai-visibility-audit`,
              provider: ORGANIZATION_REF(),
              areaServed: ['United States', 'United Kingdom', 'Europe', 'Worldwide'],
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            },
            breadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'AI Visibility & Growth', path: '/ai-services' },
              { name: 'AI Visibility Audit', path: '/ai-visibility-audit' },
            ]),
          ],
        },
      });
    } catch (error) {
      next(error);
    }
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
        description: 'Live AI-powered SaaS platforms, ecommerce stores and international websites designed and engineered by Pimofy Digital for clients worldwide.',
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
        description: 'How Pimofy Digital collects, uses and protects personal data, in line with GDPR principles.',
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
        description: 'Terms and conditions for using the Pimofy Digital website and services.',
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
        { url: '/capacity-audit', changefreq: 'monthly', priority: 0.8 },
        { url: '/industries', changefreq: 'monthly', priority: 0.8 },
        { url: '/ai-services', changefreq: 'monthly', priority: 0.9 },
        { url: '/work', changefreq: 'monthly', priority: 0.8 },
        { url: '/faq', changefreq: 'monthly', priority: 0.8 },
        { url: '/ai-visibility-audit', changefreq: 'monthly', priority: 0.9 },
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
      '> Pimofy Digital provides AI Visibility & Growth services (AI web development, SEO, AEO, GEO, schema) for businesses in every industry, and dedicated Data Operations Pods for SaaS & Ecommerce companies. Serving the USA, UK, Europe, Africa and worldwide. Headquartered in Nairobi, Kenya.',
      '',
      '## AI Visibility & Growth',
      `- [Free AI Visibility Audit](${base}/ai-visibility-audit): How Google, ChatGPT, Gemini and Perplexity describe and recommend your brand versus competitors, with a prioritised action plan.`,
      ...aiServices.services.map((s) => `- [${s.name}](${base}/ai-services/${s.slug}): ${s.summary}`),
      '',
      '## Data Operations',
      `- [Dedicated Data Operations Pod](${base}/data-operations): A dedicated specialist (160 hours/month) with QA on every output, SOPs, weekly KPI reports and an account manager. Data entry, CRM updates, enrichment, research, database cleanup, back-office and non-voice support.`,
      `- [Free Operations Capacity Audit](${base}/capacity-audit): No-obligation review of repetitive workflows and reclaimable capacity.`,
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

    // Search engines and AI assistants (GPTBot, ClaudeBot, PerplexityBot,
    // Google-Extended, etc.) are welcome on public pages; private areas are not.
    const aiBots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-Web', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'Bingbot'];
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
