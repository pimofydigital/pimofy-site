'use strict';

/**
 * Article enhancements for blog posts:
 * - adds stable ids to <h2> headings and builds a table of contents
 * - extracts the FAQ section (<h2 id="faq"> followed by <h3> question / <p> answer pairs)
 *   so it can be published as FAQPage structured data
 */

function stripTags(html) {
  return String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(text) {
  return stripTags(text)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'section';
}

function enhanceArticle(content) {
  const html = String(content || '');
  const used = new Set();
  const toc = [];

  // Skip headings that sit inside the key takeaways box.
  const takeawaysStart = html.search(/<div[^>]*class="[^"]*key-takeaways/i);
  const takeawaysEnd = takeawaysStart >= 0 ? html.indexOf('</div>', takeawaysStart) : -1;

  const out = html.replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi, (match, attrs = '', inner, offset) => {
    const text = stripTags(inner);
    const inTakeaways = takeawaysStart >= 0 && offset > takeawaysStart && offset < takeawaysEnd;
    const idMatch = attrs.match(/\sid="([^"]+)"/i);
    let id = idMatch ? idMatch[1] : slugify(text);
    if (!idMatch) {
      let candidate = id;
      let n = 2;
      while (used.has(candidate)) candidate = `${id}-${n++}`;
      id = candidate;
    }
    used.add(id);
    if (!inTakeaways) toc.push({ id, text });
    return idMatch ? match : `<h2${attrs} id="${id}">${inner}</h2>`;
  });

  // FAQ extraction
  const faqs = [];
  let faqStart = out.search(/<h2[^>]*\sid="faq"[^>]*>/i);
  if (faqStart < 0) faqStart = out.search(/<h2[^>]*>\s*(frequently asked questions|faqs?)\s*<\/h2>/i);
  if (faqStart >= 0) {
    const afterHeading = out.indexOf('</h2>', faqStart) + 5;
    const nextH2 = out.slice(afterHeading).search(/<h2[\s>]/i);
    const block = nextH2 >= 0 ? out.slice(afterHeading, afterHeading + nextH2) : out.slice(afterHeading);
    const parts = block.split(/<h3[^>]*>/i).slice(1);
    parts.forEach((part) => {
      const end = part.indexOf('</h3>');
      if (end < 0) return;
      const question = stripTags(part.slice(0, end));
      const answer = stripTags(part.slice(end + 5));
      if (question && answer) faqs.push({ question, answer });
    });
  }

  const hasAnswerLead = /class="[^"]*answer-lead/i.test(out);
  const hasTakeaways = takeawaysStart >= 0;

  return { html: out, toc, faqs, hasAnswerLead, hasTakeaways };
}

module.exports = { enhanceArticle, stripTags, slugify };
