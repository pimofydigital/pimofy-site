// Featured image fallback for blog posts.
// Posts imported by CSV have no uploaded image; they use a bundled illustration
// in /assets/blog/<slug>.webp. Any other post without an image gets the default.
const BUNDLED = new Set([
  'aeo-vs-seo-vs-geo',
  'ai-web-development-explained',
  'crm-data-hygiene-saas',
  'ecommerce-product-data-management',
  'ecommerce-seo-ai-search-playbook',
  'generative-engine-optimization-geo-guide',
  'how-to-choose-an-ai-seo-agency',
  'measure-brand-visibility-in-ai-search',
  'offshore-data-operations-security-gdpr',
  'outsourcing-data-operations-buyers-guide',
  'saas-seo-strategy-pipeline',
  'schema-markup-guide-saas-ecommerce',
  'website-speed-90-pagespeed-guide',
  'what-is-answer-engine-optimization-aeo',
]);
const DEFAULT_IMAGE = '/assets/article-1.webp';

function postImage(post) {
  if (!post) return DEFAULT_IMAGE;
  const own = String(post.featuredImage || '').trim();
  if (own) return own;
  if (post.slug && BUNDLED.has(post.slug)) return `/assets/blog/${post.slug}.webp`;
  return DEFAULT_IMAGE;
}

// Absolute JPG version for social previews (og:image), which prefer JPG/PNG.
function postSocialImage(post, siteUrl) {
  const img = postImage(post);
  const jpg = img.startsWith('/assets/') ? img.replace(/\.webp$/, '.jpg') : img;
  return /^https?:\/\//i.test(jpg) ? jpg : `${String(siteUrl || '').replace(/\/$/, '')}${jpg}`;
}

module.exports = { postImage, postSocialImage };
