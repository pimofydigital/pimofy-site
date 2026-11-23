/**
 * AI Visibility & Growth content.
 *
 * Single source of truth for the /ai-services hub and each service page.
 * Edit copy here; templates in views/pages/ai-services.ejs and
 * views/pages/ai-service.ejs render it, and PageController builds the
 * Service, FAQPage and BreadcrumbList structured data from it.
 */

const ICONS = {
  landing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M8 14h8M10 17.5h4"/></svg>',
  ads: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
  web: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 8l2 2-2 2M12 12h4"/></svg>',
  aeo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M9.5 8.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V13M12 15.5h.01"/></svg>',
  seo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/><path d="M8 13l2-2 2 2 3-3"/></svg>',
  geo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z"/><path d="M19 15l.8 1.9 1.9.8-1.9.8L19 20.4l-.8-1.9-1.9-.8 1.9-.8zM5 16l.6 1.4 1.4.6-1.4.6L5 20l-.6-1.4L3 18l1.4-.6z"/></svg>',
  schema: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M8 3H6a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h2"/><path d="M16 3h2a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2"/><circle cx="12" cy="12" r="1.5"/></svg>',
};

const services = [
  {
    slug: 'ai-web-development',
    stage: 'chosen',
    icon: ICONS.web,
    name: 'AI Web Development',
    shortName: 'AI Web Development',
    menuTagline: 'Fast websites built to convert and be found',
    eyebrow: 'AI Web Development',
    title: 'AI Web Development for Businesses, SaaS & Ecommerce | Pimofy',
    metaDescription:
      'AI web development for fast, secure, conversion-ready websites built from day one to be found by Google and AI assistants. Strategy, design, build and launch.',
    headline: 'Websites That Get Found, Earn Trust and Turn Visitors Into Enquiries.',
    lead:
      'Fast, secure, conversion-focused websites that launch in weeks, not months. AI speeds up our design and engineering, and senior specialists review every page. Every site is structured from the first line of code to rank in search and to be cited by AI assistants.',
    summary:
      'Fast, secure, search-ready websites that turn visitors into enquiries, built with AI-assisted design and senior human review.',
    problemTitle: 'Most Websites Are Built for People Only. Yours Must Also Be Read by Machines.',
    problemIntro:
      'Buyers now start their research in Google, ChatGPT, Perplexity and Gemini. A site that looks good but is slow, unstructured or hard for AI to interpret quietly loses that demand.',
    problems: [
      'Slow pages that fail Core Web Vitals and leak paid and organic traffic',
      'Content that AI assistants cannot parse, summarise or cite',
      'Long agency timelines and expensive change requests',
      'Templates that look generic next to international competitors',
      'Security, accessibility and privacy treated as an afterthought',
      'No clear path from visitor to booked call or sale',
    ],
    deliverablesTitle: 'What We Deliver',
    deliverables: [
      { title: 'Strategy & Information Architecture', text: 'Audience, offer and competitor research turned into a sitemap and page structure designed around how buyers and AI engines search.' },
      { title: 'Conversion-Focused UX & Visual Design', text: 'Brand-aligned, international-standard design that guides visitors to enquire, produced faster with AI and refined by senior designers.' },
      { title: 'Performance-First Engineering', text: 'Lean, modern code targeting 90+ PageSpeed scores on mobile and desktop and sub-three-second load times.' },
      { title: 'Search & AI Readiness Built In', text: 'Semantic HTML, schema markup, clean URLs, sitemaps and answer-ready content blocks from day one.' },
      { title: 'Conversion Design', text: 'Clear calls to action, booking and lead forms, trust signals and analytics events mapped to your funnel.' },
      { title: 'Security, Accessibility & Compliance', text: 'HTTPS, security headers, WCAG 2.2 AA accessibility practices and GDPR-aware forms and cookies.' },
    ],
    processTitle: 'How We Build',
    process: [
      { title: 'Discover', text: 'Goals, audience, competitors and success metrics agreed in a structured kickoff.' },
      { title: 'Design', text: 'AI-generated concepts refined into a design system and high-fidelity pages you approve.' },
      { title: 'Build', text: 'Engineering, content, schema and integrations, with staged reviews on a live preview.' },
      { title: 'Launch & Improve', text: 'Performance, SEO and security checks, launch, then monthly optimisation if you choose.' },
    ],
    outcomes: [
      'Launch in weeks with a clear, fixed scope',
      'Core Web Vitals and PageSpeed targets agreed up front',
      'Structured for Google, Bing and AI answer engines',
      'A site your team can update without a developer',
    ],
    faqs: [
      { q: 'Is this just a website built with an AI tool?', a: 'No. AI speeds up research, design exploration, content drafting and coding. Senior strategists, designers and engineers make every decision, review every page and own quality, security and performance.' },
      { q: 'How long does an AI web development project take?', a: 'Most marketing websites launch in 3 to 6 weeks depending on page count, content readiness and integrations. We confirm a timeline in your proposal before work starts.' },
      { q: 'Which platforms do you build on?', a: 'We recommend the right stack for your goals, from modern JavaScript frameworks to headless CMS and leading ecommerce platforms. You own the code, content and accounts.' },
      { q: 'Will my new website be optimised for SEO and AI search?', a: 'Yes. Technical SEO, schema markup and answer-ready content structure are included in every build, and can be extended with our AEO, SEO and GEO services.' },
      { q: 'Do you support the site after launch?', a: 'Yes. We offer optional monthly plans covering performance monitoring, security updates, content changes and conversion optimisation.' },
    ],
    keywords: 'AI web development, AI website design, AI-powered website, website for SaaS, ecommerce website, fast website',
  },
  {
    slug: 'answer-engine-optimization',
    stage: 'cited',
    icon: ICONS.aeo,
    name: 'Answer Engine Optimization (AEO)',
    shortName: 'AEO',
    menuTagline: 'Become the answer in AI assistants',
    eyebrow: 'Answer Engine Optimization',
    title: 'Answer Engine Optimization (AEO) Services | Pimofy Digital',
    metaDescription:
      'AEO services that make your brand the direct answer in Google AI Overviews, featured snippets, voice search, ChatGPT and Perplexity.',
    headline: 'Be the Answer, Not Just a Link.',
    lead:
      'Answer Engine Optimization positions your brand as the direct, trusted answer when buyers ask questions in Google AI Overviews, featured snippets, voice assistants and AI chat tools.',
    summary:
      'Answer-first content, question research, schema and entity signals that make your brand the direct answer in AI Overviews, snippets and assistants.',
    problemTitle: 'Search Has Become a Conversation. Are You Part of It?',
    problemIntro:
      'More queries now end without a click. If an answer engine summarises your category and your brand is not the source, a competitor becomes the authority by default.',
    problems: [
      'Competitors appear in AI Overviews and featured snippets for your key questions',
      'Valuable expertise buried in long pages that machines cannot extract',
      'No structured data telling engines what each answer is about',
      'Inconsistent brand and product facts across the web',
      'Voice and conversational queries left completely unserved',
      'No measurement of visibility beyond classic rankings',
    ],
    deliverablesTitle: 'What We Deliver',
    deliverables: [
      { title: 'Question & Intent Research', text: 'We map the real questions your buyers ask across search, People Also Ask, forums and AI assistants.' },
      { title: 'Answer-First Content', text: 'Concise, expert answers placed at the top of pages, supported by depth, data and clear sourcing.' },
      { title: 'FAQ, HowTo & Q&A Schema', text: 'Structured data that labels questions, answers and steps so engines can extract them with confidence.' },
      { title: 'Entity & Brand Consistency', text: 'Aligned facts about your company, products and people across your site, profiles and directories.' },
      { title: 'Snippet & AI Overview Targeting', text: 'Formatting, tables and lists engineered for featured snippets and AI-generated summaries.' },
      { title: 'Visibility Reporting', text: 'Monthly tracking of snippets, AI Overview appearances and assistant mentions for priority questions.' },
    ],
    processTitle: 'Our AEO Process',
    process: [
      { title: 'Audit', text: 'Benchmark where you and competitors appear as answers today.' },
      { title: 'Map', text: 'Prioritise questions by commercial value and winnability.' },
      { title: 'Optimise', text: 'Rewrite and structure content, add schema, fix entity signals.' },
      { title: 'Measure', text: 'Track answer share monthly and expand to new question sets.' },
    ],
    outcomes: [
      'More appearances as the cited answer for buying questions',
      'Higher-quality traffic from people further along the decision',
      'A clear, consistent brand story across engines',
      'Reporting that shows visibility beyond blue links',
    ],
    faqs: [
      { q: 'What is the difference between AEO and SEO?', a: 'SEO helps pages rank in search results. AEO focuses on being selected as the direct answer, in featured snippets, AI Overviews, voice responses and AI chat tools. The two work best together.' },
      { q: 'Which answer engines do you optimise for?', a: 'Google (featured snippets, People Also Ask, AI Overviews), Bing and Copilot, voice assistants, and AI chat tools such as ChatGPT, Perplexity and Gemini.' },
      { q: 'How long until we see results?', a: 'Formatting and schema improvements can show in weeks. Durable answer share typically builds over three to six months as content and authority signals compound.' },
      { q: 'Can you guarantee placement in AI answers?', a: 'No ethical provider can guarantee placement, because engines decide. We use proven practices that significantly improve the likelihood and we report progress transparently.' },
    ],
    keywords: 'answer engine optimization, AEO services, AI Overviews optimization, featured snippets, voice search optimization',
  },
  {
    slug: 'ai-seo',
    stage: 'found',
    icon: ICONS.seo,
    name: 'AI-Powered SEO',
    shortName: 'SEO',
    menuTagline: 'Technical, content and authority SEO',
    eyebrow: 'AI-Powered SEO',
    title: 'AI-Powered SEO Services for Businesses & Brands | Pimofy Digital',
    metaDescription:
      'AI-powered SEO: technical audits, data-driven content and authority building that grow qualified organic traffic and revenue for businesses across the USA, UK, Europe and Africa.',
    headline: 'SEO That Compounds. Powered by AI, Led by Specialists.',
    lead:
      'We use AI to analyse your site, competitors and market at a depth and speed manual teams cannot match, then our specialists turn those insights into technical fixes, content and authority that grow qualified organic revenue.',
    summary:
      'Technical SEO, AI-driven content strategy and authority building that grow qualified organic traffic and revenue.',
    problemTitle: 'Traffic Is Not the Goal. Qualified Pipeline Is.',
    problemIntro:
      'Many SEO programmes chase vanity rankings. We focus on the searches that bring buyers, and on removing the technical issues that hold good content back.',
    problems: [
      'Technical issues that block crawling, indexing or speed',
      'Content written for keywords rather than buyer intent',
      'Thin or duplicated category and product pages',
      'Weak authority compared with established competitors',
      'Reporting that shows rankings but not revenue',
      'No plan for how AI search is changing click-through rates',
    ],
    deliverablesTitle: 'What We Deliver',
    deliverables: [
      { title: 'Technical SEO Audit & Fixes', text: 'Crawlability, indexation, Core Web Vitals, site architecture, internal linking and international (hreflang) setup.' },
      { title: 'AI-Driven Keyword & Topic Strategy', text: 'Topic clusters built from search demand, competitor gaps and buyer intent, prioritised by revenue potential.' },
      { title: 'Content Production & Optimisation', text: 'AI-assisted, expert-edited content that meets Google’s helpful content and E-E-A-T standards.' },
      { title: 'On-Page & Ecommerce SEO', text: 'Titles, metadata, product and category optimisation, faceted navigation and structured data.' },
      { title: 'Authority Building', text: 'Digital PR, expert contributions and relevant, white-hat links that strengthen domain trust.' },
      { title: 'Revenue-Focused Reporting', text: 'Dashboards that connect organic visibility to leads, sign-ups and sales.' },
    ],
    processTitle: 'Our SEO Process',
    process: [
      { title: 'Audit', text: 'Technical, content and competitor analysis with a prioritised roadmap.' },
      { title: 'Fix', text: 'Resolve the technical issues with the highest impact first.' },
      { title: 'Create', text: 'Publish and improve content clusters mapped to buyer intent.' },
      { title: 'Scale', text: 'Build authority, test, and expand into new markets and topics.' },
    ],
    outcomes: [
      'Growth in qualified organic traffic and conversions',
      'A technically healthy, fast, indexable website',
      'Content that earns rankings, snippets and AI citations',
      'Transparent monthly reporting tied to business results',
    ],
    faqs: [
      { q: 'How is AI-powered SEO different from traditional SEO?', a: 'AI lets us process far more data, from crawl logs to competitor content and search trends, and produce first drafts faster. Specialists still set strategy, edit for expertise and approve every change, so quality and accuracy stay high.' },
      { q: 'Will AI-written content hurt our rankings?', a: 'Google rewards helpful, accurate content regardless of how it is produced. All our content is fact-checked, edited by humans and enriched with your real expertise and data.' },
      { q: 'Do you work with international and multilingual sites?', a: 'Yes. We set up hreflang, regional targeting and localised content for brands selling across the UK, Europe, the USA and beyond.' },
      { q: 'How soon will SEO deliver results?', a: 'Technical fixes can lift performance within weeks. Content and authority typically show meaningful growth in three to six months and compound over time.' },
    ],
    keywords: 'AI SEO services, technical SEO, SaaS SEO, ecommerce SEO, content strategy, SEO agency',
  },
  {
    slug: 'generative-engine-optimization',
    stage: 'cited',
    icon: ICONS.geo,
    name: 'Generative Engine Optimization (GEO)',
    shortName: 'GEO',
    menuTagline: 'Get cited by ChatGPT, Gemini & Perplexity',
    eyebrow: 'Generative Engine Optimization',
    title: 'Generative Engine Optimization (GEO) Services | Pimofy Digital',
    metaDescription:
      'GEO services that get your brand mentioned, recommended and cited by ChatGPT, Gemini, Perplexity, Claude and Copilot, with AI share-of-voice tracking.',
    headline: 'Get Recommended by AI. Everywhere Your Buyers Ask.',
    lead:
      'Generative Engine Optimization increases how often large language models such as ChatGPT, Gemini, Perplexity, Claude and Copilot mention, recommend and cite your brand when buyers ask for advice in your category.',
    summary:
      'Brand visibility audits, citation-worthy content and AI share-of-voice tracking so ChatGPT, Gemini and Perplexity recommend you.',
    problemTitle: 'When Buyers Ask AI for a Recommendation, Who Does It Name?',
    problemIntro:
      'Generative engines build answers from what they learn and retrieve about your market. If your brand is missing, unclear or poorly sourced, you are left out of the shortlist before a buyer ever visits your site.',
    problems: [
      'Your brand is absent or misdescribed in AI-generated answers',
      'Competitors are recommended for your core use cases',
      'Few authoritative third-party sources mention you',
      'Key facts such as pricing, features and locations are unclear to models',
      'No way to measure your share of voice in AI tools',
      'Content lacks the statistics, quotes and sources models prefer to cite',
    ],
    deliverablesTitle: 'What We Deliver',
    deliverables: [
      { title: 'AI Visibility Audit', text: 'We test hundreds of buyer prompts across leading AI tools to benchmark mentions, sentiment and citations against competitors.' },
      { title: 'Citation-Worthy Content', text: 'Original data, clear definitions, comparisons and expert quotes structured so models can understand and cite them.' },
      { title: 'Entity & Knowledge Graph Optimisation', text: 'Consistent, verifiable facts about your organisation across your site, schema, Wikidata-style sources and profiles.' },
      { title: 'Third-Party Presence', text: 'Placement in the reviews, directories, publications and communities that generative engines rely on.' },
      { title: 'Technical AI Accessibility', text: 'Crawler access, llms.txt guidance, clean rendering and structured data so AI systems can read your content.' },
      { title: 'AI Share-of-Voice Tracking', text: 'Monthly reporting on how often and how favourably AI tools mention and recommend your brand.' },
    ],
    processTitle: 'Our GEO Process',
    process: [
      { title: 'Benchmark', text: 'Measure your current AI visibility and sentiment across priority prompts.' },
      { title: 'Diagnose', text: 'Identify the gaps in sources, entities and content behind the results.' },
      { title: 'Optimise', text: 'Publish citation-worthy assets and strengthen third-party signals.' },
      { title: 'Track', text: 'Re-test monthly and expand to new prompts, markets and models.' },
    ],
    outcomes: [
      'More frequent and more accurate brand mentions in AI answers',
      'Inclusion in AI-generated shortlists and comparisons',
      'Stronger authority signals that also lift classic SEO',
      'A clear, measurable view of your AI share of voice',
    ],
    faqs: [
      { q: 'What is Generative Engine Optimization?', a: 'GEO is the practice of improving how generative AI tools understand, mention and cite your brand. It combines content, entity, technical and digital PR work aimed at large language models rather than only search rankings.' },
      { q: 'How is GEO different from AEO?', a: 'AEO focuses on winning direct answers to specific questions, often in search features. GEO focuses on your overall presence, reputation and recommendation rate inside generative AI tools. We usually run them together.' },
      { q: 'Which AI platforms do you track?', a: 'ChatGPT, Google Gemini and AI Overviews, Perplexity, Microsoft Copilot and Claude, with additional models added as they gain market share.' },
      { q: 'How do you measure GEO results?', a: 'We run a fixed set of buyer prompts each month and record mentions, position, sentiment and cited sources for you and your competitors, so progress is visible and comparable.' },
    ],
    keywords: 'generative engine optimization, GEO services, ChatGPT SEO, AI search visibility, LLM optimization, Perplexity optimization',
  },
  {
    slug: 'schema-markup',
    stage: 'cited',
    icon: ICONS.schema,
    name: 'Schema Markup & Structured Data',
    shortName: 'Schemas',
    menuTagline: 'Structured data machines understand',
    eyebrow: 'Schema Markup & Structured Data',
    title: 'Schema Markup & Structured Data Services | Pimofy Digital',
    metaDescription:
      'Expert schema markup and JSON-LD structured data: Organization, Product, Service, FAQ and Article schema that earn rich results and help AI understand you.',
    headline: 'Give Search Engines and AI a Clear Map of Your Business.',
    lead:
      'Schema markup is the structured language search engines and AI systems use to understand who you are, what you sell and why you are trustworthy. We design, implement and maintain error-free JSON-LD across your entire site.',
    summary:
      'Expert JSON-LD schema strategy, implementation and monitoring that earns rich results and helps AI understand your brand.',
    problemTitle: 'Without Structured Data, Machines Have to Guess.',
    problemIntro:
      'Search engines and AI assistants reward content they can interpret with confidence. Missing, broken or inconsistent schema means lost rich results and a blurry picture of your brand.',
    problems: [
      'No rich results such as stars, prices, FAQs or breadcrumbs in search',
      'Schema errors and warnings reported in Google Search Console',
      'Plugins producing duplicate or conflicting markup',
      'No connected entity graph linking your organisation, people and products',
      'Product and service details AI systems cannot read reliably',
      'Markup that breaks silently after site updates',
    ],
    deliverablesTitle: 'What We Deliver',
    deliverables: [
      { title: 'Schema Audit', text: 'A full review of existing markup, errors, warnings, gaps and rich-result eligibility across your templates.' },
      { title: 'Schema Strategy & Entity Graph', text: 'A connected JSON-LD graph linking Organization, WebSite, people, services, products and content with stable identifiers.' },
      { title: 'Implementation', text: 'Clean, validated JSON-LD for Organization, Service, Product, Offer, Review, FAQPage, HowTo, Article, BreadcrumbList, LocalBusiness, Event and more.' },
      { title: 'Ecommerce & SaaS Schema', text: 'Product, pricing, availability, software application and review markup tuned for merchant listings and comparisons.' },
      { title: 'Validation & QA', text: 'Testing with Google Rich Results Test and Schema.org validators before and after every release.' },
      { title: 'Monitoring & Maintenance', text: 'Ongoing checks so markup stays accurate as your site, products and Google guidelines change.' },
    ],
    processTitle: 'Our Schema Process',
    process: [
      { title: 'Audit', text: 'Inventory current markup and rich-result opportunities.' },
      { title: 'Design', text: 'Plan the entity graph and schema types per page template.' },
      { title: 'Implement', text: 'Deploy validated JSON-LD in your CMS or codebase.' },
      { title: 'Monitor', text: 'Track rich results and fix issues as they appear.' },
    ],
    outcomes: [
      'Eligibility for rich results that lift click-through rates',
      'Zero schema errors in Search Console',
      'A machine-readable brand that AI can describe accurately',
      'A scalable setup that survives redesigns and updates',
    ],
    faqs: [
      { q: 'What is schema markup?', a: 'Schema markup is code, usually JSON-LD, based on the Schema.org vocabulary. It describes your content in a standard way so search engines and AI systems can understand and display it more richly.' },
      { q: 'Does schema markup improve rankings?', a: 'Schema is not a direct ranking factor, but it unlocks rich results, improves click-through rates and helps engines and AI tools understand and trust your content, all of which support visibility.' },
      { q: 'Which platforms can you implement schema on?', a: 'Any platform, including custom code, WordPress, Shopify, Webflow, headless CMS and ecommerce systems, without relying on bloated plugins.' },
      { q: 'Is schema a one-time project?', a: 'The initial build is a project, but schema should be maintained as your content, products and search guidelines evolve. We offer light monthly monitoring for that reason.' },
    ],
    keywords: 'schema markup services, structured data, JSON-LD, rich results, FAQ schema, product schema, technical SEO',
  },
  {
    slug: 'conversion-landing-pages',
    stage: 'chosen',
    icon: ICONS.landing,
    name: 'Conversion-Focused Landing Pages',
    shortName: 'Landing Pages',
    menuTagline: 'Pages built around one action',
    eyebrow: 'Conversion-Focused Landing Pages',
    title: 'Conversion-Focused Landing Pages | Pimofy Digital',
    metaDescription:
      'Landing pages built around one action, so more visitors from search, AI answers and ads become enquiries, demos and sales. Strategy, copy, design, testing.',
    headline: 'Turn More of Your Visitors Into Enquiries.',
    lead:
      'Traffic only matters if it converts. We design and build focused landing pages for your campaigns, services and offers, each built around one clear action and tested to keep improving.',
    summary:
      'Focused pages for campaigns, services and offers, each built around one action and tested so more visitors become enquiries.',
    problemTitle: 'Visitors Arrive. Then They Leave.',
    problemIntro:
      'Many businesses send paid, organic and AI-referred traffic to a homepage or a generic service page. Visitors cannot find the answer or the next step quickly, so they bounce and the budget is wasted.',
    problems: [
      'Ads and campaigns sending visitors to the homepage',
      'Pages trying to say everything to everyone',
      'Slow mobile load times that lose visitors before the page appears',
      'Weak or buried calls to action and long forms',
      'No testing, so nobody knows what would convert better',
      'Tracking that cannot connect visits to enquiries',
    ],
    deliverablesTitle: 'What We Deliver',
    deliverables: [
      { title: 'Offer & Audience Strategy', text: 'One audience, one problem, one action per page, agreed before anything is designed.' },
      { title: 'Conversion Copywriting', text: 'Headlines, proof and objection-handling written around what your buyers actually ask.' },
      { title: 'Fast, Mobile-First Design', text: 'Lightweight pages built for quick loading on phones, with clear hierarchy and trust signals.' },
      { title: 'Forms, Booking & Integrations', text: 'Short forms, booking links, WhatsApp or chat, connected to your CRM or inbox.' },
      { title: 'Tracking & Analytics', text: 'Conversion events and source tracking so you can see which channels produce enquiries.' },
      { title: 'A/B Testing & Iteration', text: 'Structured tests on headlines, offers and layouts to keep improving conversion over time.' },
    ],
    processTitle: 'How We Build Landing Pages',
    process: [
      { title: 'Define', text: 'Agree the audience, offer, single action and success metric.' },
      { title: 'Write & Design', text: 'Draft the copy and design the page around that one action.' },
      { title: 'Launch & Track', text: 'Publish, connect tracking and integrations, and check speed.' },
      { title: 'Test & Improve', text: 'Run tests and refine based on real visitor behaviour.' },
    ],
    outcomes: [
      'A dedicated page for every key campaign or offer',
      'One clear next step for every visitor',
      'Visibility into which channels produce enquiries',
      'Ongoing tests that keep improving results',
    ],
    faqs: [
      { q: 'How is a landing page different from a normal website page?', a: 'A landing page is built for one audience and one action, such as booking a call, requesting a quote or buying a product. It removes distractions that a general website page needs to include, which usually makes it more effective for campaigns.' },
      { q: 'Can you build landing pages on our existing website?', a: 'Yes. We can build within your current platform, such as WordPress, Webflow or Shopify, or as standalone pages on a subdomain, depending on what is fastest and easiest for your team.' },
      { q: 'Do you write the copy?', a: 'Yes. Conversion copy is part of the service. We base it on your customers\' real questions and objections, and you approve every page before it goes live.' },
      { q: 'Can you guarantee a conversion rate?', a: 'No honest provider can guarantee a conversion rate, because it depends on your offer, traffic and market. We agree clear metrics, track them and test improvements continuously.' },
    ],
    keywords: 'landing page design, conversion rate optimisation, high-converting landing pages, landing pages for ads, CRO agency',
  },
  {
    slug: 'ai-meta-ads',
    stage: 'chosen',
    icon: ICONS.ads,
    name: 'AI-Powered Facebook & Instagram Ads',
    shortName: 'Facebook & Instagram Ads',
    menuTagline: 'Paid campaigns that bring qualified enquiries',
    eyebrow: 'AI-Powered Facebook & Instagram Ads',
    title: 'AI-Powered Facebook & Instagram Ads | Pimofy Digital',
    metaDescription:
      'AI-powered Facebook and Instagram ad campaigns: audience strategy, creative, tracking and optimisation focused on qualified enquiries and sales, not just clicks.',
    headline: 'Paid Social That Brings Customers, Not Just Clicks.',
    lead:
      'We plan, create and manage Facebook and Instagram campaigns using AI-assisted audience research, creative testing and optimisation, and connect every campaign to a page built to convert.',
    summary:
      'Facebook and Instagram campaigns with AI-assisted targeting, creative testing and tracking, connected to pages built to convert.',
    problemTitle: 'Ad Spend Without Clear Results',
    problemIntro:
      'Paid social can grow a business quickly, but without the right audience, creative, tracking and landing pages it mostly buys clicks that never become customers.',
    problems: [
      'Boosted posts instead of structured campaigns',
      'Broad audiences and creative that never gets tested',
      'Ads sending people to pages that do not convert',
      'Missing or broken tracking for leads and purchases',
      'Reports full of reach and clicks, not enquiries or sales',
      'No time in-house to manage and optimise campaigns weekly',
    ],
    deliverablesTitle: 'What We Deliver',
    deliverables: [
      { title: 'Campaign Strategy', text: 'Objectives, audiences, offers and budgets mapped to your sales funnel and target markets.' },
      { title: 'AI-Assisted Audience Research', text: 'Customer and competitor insight used to shape audiences, messaging and placements.' },
      { title: 'Creative Production & Testing', text: 'Ad copy, images and short videos produced in variations and tested to find what performs.' },
      { title: 'Tracking Setup', text: 'Meta Pixel and Conversions API set up so leads and purchases are measured accurately.' },
      { title: 'Landing Page Alignment', text: 'Every campaign points to a page built for that audience and action.' },
      { title: 'Optimisation & Reporting', text: 'Weekly optimisation and monthly reports focused on cost per enquiry and return on spend.' },
    ],
    processTitle: 'How We Run Campaigns',
    process: [
      { title: 'Plan', text: 'Agree goals, audiences, budget and the metric that defines success.' },
      { title: 'Build', text: 'Set up tracking, creative and the landing pages each campaign needs.' },
      { title: 'Launch', text: 'Go live with structured tests across audiences and creative.' },
      { title: 'Optimise', text: 'Shift budget to what works and report on enquiries and revenue.' },
    ],
    outcomes: [
      'Campaigns structured around enquiries and sales',
      'Accurate tracking from ad to lead or purchase',
      'Creative that is tested, not guessed',
      'Clear monthly reporting on cost per result',
    ],
    faqs: [
      { q: 'Is the ad budget included in your fee?', a: 'No. Your ad spend is paid directly to Meta from your own ad account, which you own. Our fee covers strategy, creative, setup, management and reporting.' },
      { q: 'What does AI-powered mean for ads?', a: 'We use AI tools to speed up audience research, generate and vary creative, and analyse performance, alongside Meta\'s own machine-learning delivery. Specialists set strategy and approve everything that runs.' },
      { q: 'Which markets can you advertise in?', a: 'We run campaigns for audiences in the USA, UK, Europe, Africa and other markets, following Meta\'s advertising policies and local rules for each market.' },
      { q: 'How soon will we see results?', a: 'Campaigns usually need a learning period of a few weeks while tests run and delivery optimises. We agree realistic expectations based on your budget, offer and market before launch.' },
    ],
    keywords: 'Facebook ads agency, Instagram ads, Meta ads management, paid social, AI ads, lead generation ads',
  },
];

const hub = {
  title: 'AI Visibility & Growth: AI Web Development, AEO, SEO, GEO & Schema | Pimofy',
  metaDescription:
    'AI Visibility & Growth for every industry, with deep SaaS & Ecommerce expertise: AI web development, SEO, AEO, GEO and schema that get you found by AI.',
  eyebrow: 'AI Visibility & Growth',
  headline: 'Be the Answer, on Google and in AI Search.',
  lead:
    'Customers now ask Google, ChatGPT, Gemini and Perplexity before they contact anyone. We make your business the one they find, the one AI recommends and the one they choose, and we report it in enquiries, not rankings.',
  stages: [
    { id: 'found', title: 'Be Found', outcome: 'More qualified visitors from Google, Bing and other search engines.', plain: 'Search engine optimisation (SEO) makes your website rank for the searches your customers make.' },
    { id: 'cited', title: 'Be Cited', outcome: 'Your business named and recommended by AI assistants and answer boxes.', plain: 'Answer Engine Optimization (AEO) wins direct answers, Generative Engine Optimization (GEO) earns mentions in ChatGPT, Gemini and Perplexity, and schema markup labels your information so machines understand it.' },
    { id: 'chosen', title: 'Be Chosen', outcome: 'Visitors and ad clicks that turn into enquiries instead of bouncing.', plain: 'Fast websites, focused landing pages and paid social campaigns, each built around one clear action.' },
  ],
  pillars: [
    { title: 'Built by AI, Owned by Experts', text: 'AI gives us speed and depth. Senior specialists set strategy, review every output and stay accountable for results.' },
    { title: 'One Connected System', text: 'Website, SEO, AEO, GEO and schema planned together, so every improvement strengthens the others.' },
    { title: 'Measured Against Revenue', text: 'Clear KPIs and monthly reporting that connect visibility in search and AI tools to leads and sales.' },
  ],
  howTitle: 'How the Services Work Together',
  how: [
    { title: 'Foundation', text: 'AI Web Development and Schema give you a fast, secure, machine-readable website.' },
    { title: 'Visibility', text: 'AI-Powered SEO grows qualified organic traffic from Google and Bing.' },
    { title: 'Answers', text: 'AEO makes you the direct answer in snippets, AI Overviews and voice.' },
    { title: 'Recommendation', text: 'GEO increases how often AI assistants mention and recommend your brand.' },
  ],
  faqs: [
    { q: 'Do I need every service?', a: 'No. Most clients start with a free AI Visibility Audit and one step, Be Found, Be Cited or Be Chosen, then add services as results grow. We recommend the right combination for your goals and budget.' },
    { q: 'Who are these services for?', a: 'Any business that wants to be found and recommended in Google and AI assistants: professional services, healthcare, education, manufacturing, retail, non-profits, local businesses and more. We have particularly deep expertise in SaaS and Ecommerce, and serve clients in the USA, UK, Europe, Africa and worldwide.' },
    { q: 'How do engagements work?', a: 'Websites and landing pages are fixed-scope projects. SEO, AEO, GEO, schema and ad management run as monthly programmes with clear deliverables and a monthly report on where you are found, where you are cited and the enquiries it produced.' },
    { q: 'How do we get started?', a: 'Book a free AI Visibility Audit. We will show how your brand currently appears in Google and leading AI assistants and where the biggest opportunities are.' },
  ],
};

function getService(slug) {
  return services.find((service) => service.slug === slug) || null;
}

module.exports = { services, hub, getService };
