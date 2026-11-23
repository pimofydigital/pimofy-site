/**
 * Site-wide FAQ content for /faq. Rendered by views/pages/faq.ejs and
 * published as FAQPage structured data by PageController.faq.
 * Keep answers factual: no guarantees, invented statistics or claims.
 */
module.exports = [
  {
    id: 'about',
    title: 'About Pimofy Digital',
    items: [
      { q: 'What does Pimofy Digital do?', a: 'Pimofy Digital helps SaaS & Ecommerce companies grow in two ways. Our Dedicated Data Operations Pod takes over repetitive data work such as data entry, CRM updates, enrichment, research and database cleanup. Our AI Growth Services, which are AI Web Development, Answer Engine Optimization (AEO), AI-Powered SEO, Generative Engine Optimization (GEO) and Schema Markup, make your brand easier to find and recommend on Google, ChatGPT, Gemini and Perplexity.' },
      { q: 'Who do you work with?', a: 'We work with SaaS and Ecommerce companies, from funded startups to established brands, as well as B2B service businesses with similar needs. Most of our clients are founders, CEOs, marketing leaders and operations leaders who want more capacity and more qualified demand without adding headcount.' },
      { q: 'Where are you based, and which countries do you serve?', a: 'We are headquartered in Nairobi, Kenya, and serve clients in the United States, United Kingdom, Europe, Africa and worldwide. All engagements are delivered remotely, with working hours agreed to overlap with your team.' },
      { q: 'What makes Pimofy different from a typical web or SEO agency?', a: 'We focus on outcomes rather than deliverables: being found, chosen and cited in Google and AI assistants, and giving your team back capacity. We also build our own AI-powered products, so we understand AI from the inside, not only as a marketing topic. And we combine growth work with dedicated data operations, which few agencies offer.' },
    ],
  },
  {
    id: 'ai-services',
    title: 'AI Growth Services',
    items: [
      { q: 'What is AI web development?', a: 'AI web development uses AI to speed up research, design exploration, content drafting and coding, while senior specialists make every decision and review every page. The result is a fast, secure, conversion-focused website that is structured from day one to rank in search and to be understood and cited by AI assistants.' },
      { q: 'What is Answer Engine Optimization (AEO)?', a: 'AEO structures your content so answer engines, such as Google AI Overviews, featured snippets, voice assistants and AI chat tools, can select it as the direct answer to a question. It combines question research, answer-first writing, clear page structure and schema markup.' },
      { q: 'What is Generative Engine Optimization (GEO)?', a: 'GEO improves how often and how accurately generative AI assistants such as ChatGPT, Gemini, Perplexity, Claude and Copilot mention and recommend your brand. It covers entity clarity, citation-worthy content, third-party presence, technical accessibility for AI crawlers and ongoing measurement of your AI share of voice.' },
      { q: 'What is the difference between SEO, AEO and GEO?', a: 'SEO helps your pages rank and earn clicks in search results. AEO helps your content become the direct answer to specific questions. GEO helps your brand get mentioned and recommended inside AI assistants. They share the same foundations, so we usually plan them together.' },
      { q: 'What is schema markup and why does it matter?', a: 'Schema markup is structured data, usually written as JSON-LD, that describes your organisation, products, services and content in a standard vocabulary. It makes your pages eligible for rich results and helps search engines and AI systems understand your business accurately.' },
      { q: 'Can you guarantee first-page rankings or AI recommendations?', a: 'No. Search engines and AI platforms decide what they show, so no honest provider can guarantee placements. We use proven practices that improve your likelihood of being found and recommended, agree clear KPIs with you, and report progress transparently every month.' },
      { q: 'How long does it take to see results from SEO, AEO and GEO?', a: 'Technical fixes, schema and answer-first rewrites can show impact within weeks once pages are recrawled. Content, authority and AI recommendation signals usually build over three to six months and compound over time. Timelines depend on your starting point and competition.' },
      { q: 'How long does an AI web development project take?', a: 'Most marketing websites launch in about three to six weeks, depending on page count, content readiness and integrations. We confirm the scope and timeline in your proposal before work begins.' },
      { q: 'Which platforms do you build on, and who owns the website?', a: 'We recommend the right stack for your goals, including modern JavaScript frameworks, headless CMS options and leading ecommerce platforms. You own the code, content, domain and accounts.' },
      { q: 'How do you measure visibility in AI search?', a: 'We run a fixed set of real buyer prompts across leading AI assistants on a regular schedule and record whether your brand is mentioned, recommended and cited, how it is described, and how you compare with competitors. Combined with search and analytics data, this gives you a clear view of your AI share of voice.' },
    ],
  },
  {
    id: 'data-operations',
    title: 'Data Operations',
    items: [
      { q: 'What is the Dedicated Data Operations Pod?', a: 'It is a managed service that gives you a dedicated data operations specialist for 160 hours a month, backed by QA on every output, written SOPs, weekly KPI reports and a named account manager.' },
      { q: 'What tasks can the pod handle?', a: 'Data entry and verification, CRM updates and record management, data enrichment, research and data collection, database cleanup, product catalogue updates, workflow documentation, back-office tasks and non-voice customer support by chat and email.' },
      { q: 'How do you maintain quality?', a: 'Quality standards and KPIs are agreed before production starts. Every output passes QA, work follows documented SOPs, and you receive weekly KPI reporting so accuracy is measured rather than assumed.' },
      { q: 'What tools and systems do you work with?', a: 'Our specialists work in your existing tools, including CRMs, spreadsheets, databases, ecommerce platforms, help desks and back-office systems. We onboard to your stack rather than asking you to change it.' },
      { q: 'What is the Free Operations Capacity Audit?', a: 'It is a no-obligation review of your workflows. We identify the repetitive tasks worth delegating, estimate the capacity your team could reclaim and recommend whether a dedicated pod is the right fit.' },
    ],
  },
  {
    id: 'security',
    title: 'Security, Privacy & Compliance',
    items: [
      { q: 'How do you protect our data and confidentiality?', a: 'We work under your confidentiality and NDA requirements as standard. Access is limited to the people assigned to your account, and we follow the handling, storage and access controls agreed for each workflow.' },
      { q: 'Are you GDPR-aware, and will you sign a DPA?', a: 'Yes. When we handle personal data we act as a processor on your instructions, in line with GDPR principles, and we will sign a Data Processing Agreement on request. For specific legal requirements, we recommend reviewing the arrangement with your own counsel.' },
      { q: 'Do you follow secure development practices?', a: 'Yes. Websites we build use HTTPS, strict security headers, input validation, secure authentication and current dependencies, and we keep secrets out of code. We document security measures so your team can review them.' },
    ],
  },
  {
    id: 'working-together',
    title: 'Working Together',
    items: [
      { q: 'How do engagements and pricing work?', a: 'Website builds are fixed-scope projects with a clear proposal. SEO, AEO, GEO, schema maintenance and Data Operations Pods run as monthly engagements with defined deliverables and reporting. Pricing depends on scope, so we share a tailored proposal after a short consultation.' },
      { q: 'Are there long-term contracts?', a: 'Monthly services run month to month after any one-time setup, with simple notice terms agreed at the start. You can scale up, scale down or pause in line with those terms.' },
      { q: 'Which time zones do you cover?', a: 'We are based in Nairobi (GMT+3) and work comfortably across UK, European and US business hours. We agree your working window, communication channels and reporting cadence during onboarding.' },
      { q: 'How do we communicate and track progress?', a: 'You get a named account manager, regular check-ins, and written reports with agreed KPIs. We work in the channels your team already uses, such as email, Slack or Microsoft Teams.' },
      { q: 'How do we get started?', a: 'Book a free consultation. We will learn about your goals, review your current operations or online visibility, and recommend the most effective next step, with no obligation to proceed.' },
    ],
  },
];
