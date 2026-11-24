const { BlogPost, User } = require('../models');
const { Op } = require('sequelize');

const POSTS_PER_PAGE = 6;
const MAX_PAGE = 1000;
const MAX_SEARCH_LENGTH = 100;

/** Positive integer page number, never negative or absurdly large. */
function parsePage(value) {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, MAX_PAGE) : 1;
}

/** Escape LIKE wildcards so user input is matched literally. */
function escapeLike(value) {
  return String(value).replace(/[\\%_]/g, (char) => `\\${char}`);
}
const DEFAULT_CATEGORY = 'Uncategorized';

function normalizeCategory(value) {
  const normalized = String(value || '').trim();
  return normalized || DEFAULT_CATEGORY;
}

function hasTag(tags, expectedTag) {
  const normalizedExpected = String(expectedTag || '').trim().toLowerCase();
  if (!normalizedExpected || !Array.isArray(tags)) {
    return false;
  }

  return tags.some((tag) => String(tag || '').trim().toLowerCase() === normalizedExpected);
}

function buildCategoryWhereClause(category) {
  if (category === DEFAULT_CATEGORY) {
    return {
      [Op.or]: [{ category: DEFAULT_CATEGORY }, { category: null }, { category: '' }],
    };
  }

  return { category };
}

class BlogController {
  // List all published blog posts with pagination
  static async index(req, res, next) {
    try {
      const page = parsePage(req.query.page);
      const offset = (page - 1) * POSTS_PER_PAGE;

      const { count, rows: posts } = await BlogPost.findAndCountAll({
        where: { published: true },
        include: [{ model: User, as: 'author', attributes: ['name'] }],
        order: [['publishDate', 'DESC']],
        limit: POSTS_PER_PAGE,
        offset,
      });

      const totalPages = Math.ceil(count / POSTS_PER_PAGE);

      // Get unique categories and tags
      const categories = await BlogPost.findAll({
        where: { published: true },
        attributes: [[BlogPost.sequelize.fn('DISTINCT', BlogPost.sequelize.col('category')), 'category']],
        raw: true,
      });

      const normalizedCategories = Array.from(
        new Set(
          categories
            .map((c) => normalizeCategory(c.category))
            .filter(Boolean)
        )
      ).sort((left, right) => left.localeCompare(right));

      res.render('blog/index', {
        title: 'AI Search & Growth Insights | Pimofy Digital Blog',
        description: 'Guides to being found on Google and recommended by ChatGPT, Gemini and Perplexity: AI SEO, AEO, GEO, schema and conversion, plus data operations playbooks.',
        posts,
        currentPage: page,
        totalPages,
        categories: normalizedCategories,
      });
    } catch (error) {
      next(error);
    }
  }

  // Show single blog post
  static async show(req, res, next) {
    try {
      const { slug } = req.params;

      const post = await BlogPost.findOne({
        where: { slug, published: true },
        include: [{ model: User, as: 'author', attributes: ['name'] }],
      });

      if (!post) {
        return res.status(404).render('pages/404', {
          title: 'Article Not Found',
          description: 'The article you are looking for does not exist.',
        });
      }

      // Increment view count
      await post.increment('views');

      // Get related posts by category
      const normalizedPostCategory = normalizeCategory(post.category);
      const related = await BlogPost.findAll({
        where: {
          published: true,
          ...buildCategoryWhereClause(normalizedPostCategory),
          id: { [Op.ne]: post.id },
        },
        limit: 3,
        order: [['publishDate', 'DESC']],
      });

      // Calculate reading time (rough estimate: 200 words per minute)
      const wordCount = post.content.split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200);

      const base = String(process.env.APP_URL || 'https://pimofydigital.com').replace(/\/$/, '');
      const postUrl = `${base}/blog/${post.slug}`;
      const { postSocialImage } = require('../utils/blogImage');
      res.render('blog/show', {
        title: post.seoTitle || post.title,
        description: post.metaDescription || post.excerpt,
        post,
        related,
        readingTime,
        keywords: post.keywords,
        schemaMarkup: {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'BlogPosting',
              '@id': `${postUrl}#article`,
              headline: post.title,
              description: post.metaDescription || post.excerpt,
              image: postSocialImage(post, base),
              datePublished: new Date(post.publishDate || post.createdAt).toISOString(),
              dateModified: new Date(post.updatedAt || post.publishDate || post.createdAt).toISOString(),
              author: { '@id': `${base}/#founder-moses-njeru-munyi` },
              publisher: { '@id': `${base}/#organization` },
              mainEntityOfPage: { '@id': `${postUrl}#webpage` },
              isPartOf: { '@id': `${base}/#website` },
              articleSection: post.category || undefined,
              keywords: post.keywords || undefined,
              wordCount,
              inLanguage: 'en',
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
                { '@type': 'ListItem', position: 2, name: 'Blog', item: `${base}/blog` },
                { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
              ],
            },
          ],
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Filter by category
  static async byCategory(req, res, next) {
    try {
      const category = normalizeCategory(req.params.category);
      const page = parsePage(req.query.page);
      const offset = (page - 1) * POSTS_PER_PAGE;

      const { count, rows: posts } = await BlogPost.findAndCountAll({
        where: {
          published: true,
          ...buildCategoryWhereClause(category),
        },
        include: [{ model: User, as: 'author', attributes: ['name'] }],
        order: [['publishDate', 'DESC']],
        limit: POSTS_PER_PAGE,
        offset,
      });

      if (count === 0) {
        return res.status(404).render('pages/404', {
          title: 'Category Not Found',
          description: `No articles found in the category "${category}".`,
        });
      }

      const totalPages = Math.ceil(count / POSTS_PER_PAGE);

      res.render('blog/index', {
        title: `${category} | Pimofy Digital`,
        description: `Articles about ${category}`,
        posts,
        currentPage: page,
        totalPages,
        filterCategory: category,
      });
    } catch (error) {
      next(error);
    }
  }

  // Filter by tag
  static async byTag(req, res, next) {
    try {
      const tag = String(req.params.tag || '').slice(0, 100);
      const page = parsePage(req.query.page);

      const publishedPosts = await BlogPost.findAll({
        where: { published: true },
        include: [{ model: User, as: 'author', attributes: ['name'] }],
        order: [['publishDate', 'DESC']],
      });

      const matchingPosts = publishedPosts.filter((post) => hasTag(post.tags, tag));
      const count = matchingPosts.length;
      const offset = (page - 1) * POSTS_PER_PAGE;
      const posts = matchingPosts.slice(offset, offset + POSTS_PER_PAGE);

      if (count === 0) {
        return res.status(404).render('pages/404', {
          title: 'Tag Not Found',
          description: `No articles found with the tag "${tag}".`,
        });
      }

      const totalPages = Math.ceil(count / POSTS_PER_PAGE);

      res.render('blog/index', {
        title: `${tag} | Pimofy Digital`,
        description: `Articles tagged with ${tag}`,
        posts,
        currentPage: page,
        totalPages,
        filterTag: tag,
      });
    } catch (error) {
      next(error);
    }
  }

  // Search blog posts
  static async search(req, res, next) {
    try {
      const q = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, MAX_SEARCH_LENGTH) : '';

      if (q.length < 2) {
        return res.render('blog/search', {
          title: 'Search',
          description: 'Search our blog articles',
          posts: [],
          query: '',
        });
      }

      // Sequelize binds these values as parameters (no SQL injection);
      // wildcards are escaped so "%" or "_" cannot widen the search.
      const pattern = `%${escapeLike(q)}%`;
      const posts = await BlogPost.findAll({
        where: {
          published: true,
          [Op.or]: [
            { title: { [Op.iLike]: pattern } },
            { excerpt: { [Op.iLike]: pattern } },
            { content: { [Op.iLike]: pattern } },
          ],
        },
        limit: 50,
        include: [{ model: User, as: 'author', attributes: ['name'] }],
        order: [['publishDate', 'DESC']],
      });

      res.render('blog/search', {
        title: `Search: "${q}" | Pimofy Digital`,
        description: `Search results for "${q}"`,
        posts,
        query: q,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BlogController;
