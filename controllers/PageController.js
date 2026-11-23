const { BlogPost } = require('../models');
const config = require('../config/environment');
const aiServices = require('../config/aiServices');

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
        title: 'Dedicated Data Operations for SaaS & Ecommerce | Pimofy Digital',
        description:
          'Pimofy Digital provides dedicated data operations and AI growth services (AI web development, AEO, SEO, GEO and schema) for SaaS, Ecommerce and B2B brands in the UK, Europe and the USA.',
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
        title: 'Data Operations Solutions for SaaS & Ecommerce | Pimofy',
        description:
          'One focused solution built around your data. Explore the Dedicated Data Operations Pod and a free Operations Capacity Audit for growing teams.',
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
        title: 'The Data Operations Pod | Pimofy Digital',
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
        title: 'Industries | Pimofy Digital',
        description: 'Explore the industries we serve with specialized data operations solutions.',
      });
    } catch (error) {
      next(error);
    }
  }

  // About page
  static async about(req, res, next) {
    try {
      res.render('pages/about', {
        title: 'About Pimofy Digital',
        description: 'Learn about our team, our mission, and why we specialize in data operations.',
        preloadImage: '/assets/team.webp',
      });
    } catch (error) {
      next(error);
    }
  }

  // AI Growth Services hub
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
              name: 'Pimofy AI Growth Services',
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

  // Resources page - redirect to blog
  static async resources(req, res) {
    res.redirect('/blog');
  }

  // Privacy page
  static async privacy(req, res, next) {
    try {
      res.render('pages/privacy', {
        title: 'Privacy Policy | Pimofy Digital',
        description: 'Privacy Policy for Pimofy Digital',
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
        description: 'Terms and Conditions for using Pimofy Digital services',
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

  // robots.txt
  static async robots(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    const baseUrl = SITE_URL();

    const content = `# Pimofy Digital Robots.txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /auth/login

Sitemap: ${baseUrl}/sitemap.xml
`;

    res.send(content);
  }
}

module.exports = PageController;
