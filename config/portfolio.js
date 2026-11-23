/**
 * Portfolio: live products and websites built by the Pimofy team.
 * Only verified, publicly live work is listed. Edit here to add projects;
 * views/pages/work.ejs and the AI service pages render it.
 */
const products = [
  {
    name: 'ASCENDR',
    url: 'https://www.getascendr.com',
    category: 'AI Career Intelligence Platform',
    summary: 'Career intelligence platform with skills-gap analysis, a 90-day career roadmap, an AI career coach, mentors and real roles, plus a networks view for funds, accelerators and universities to see who is ready and what it will take.',
    stack: ['Next.js', 'TypeScript', 'Supabase + RLS', 'OpenAI', 'Paystack', 'ESCO skills data'],
    services: ['ai-web-development'],
  },
  {
    name: 'AWIVEST Members Portal',
    url: 'https://membersportal-lac.vercel.app',
    category: 'Secure Investor Portal',
    summary: 'Members-only investor portal for African Women Investors. Members get dashboards, statements, contributions, documents and meetings; staff run approvals, KYC review, in-house e-signature, withdrawals and reporting, protected by two-factor sign-in and row-level security.',
    stack: ['Next.js', 'React', 'Supabase + RLS', 'E-signature', 'MFA'],
    services: ['ai-web-development'],
  },
  {
    name: 'Introthread',
    url: 'https://introthread.com',
    category: 'AI SaaS Platform',
    summary: 'Professional networking and relationship intelligence platform. Digital business cards shared by QR, NFC, link or wallet, connection context, smart follow-ups and an AI networking assistant roadmap.',
    stack: ['Supabase', 'Vercel', 'Row-level security', 'Rate limiting'],
    services: ['ai-web-development', 'schema-markup'],
  },
  {
    name: 'Vibely',
    url: 'https://vibely-inky.vercel.app',
    category: 'Social Discovery App',
    summary: 'People-discovery app for dating, friends and networking across Kenya and East Africa, with M-Pesa payments, Paystack payouts, realtime chat and a 39-table secured database.',
    stack: ['Next.js 15', 'React 19', 'Supabase', 'M-Pesa Daraja', 'Paystack'],
    services: ['ai-web-development', 'ai-seo', 'schema-markup'],
  },
  {
    name: 'PesaBooks',
    url: 'https://moselanto.github.io/pesabooks/',
    category: 'AI Fintech Product',
    summary: 'An AI bookkeeper that lives in WhatsApp. Small businesses text their sales and it turns M-Pesa payments into KRA eTIMS invoices and proper books automatically.',
    stack: ['Next.js 14', 'TypeScript', 'Supabase Edge Functions', 'WhatsApp'],
    services: ['ai-web-development'],
  },
  {
    name: 'CertForge',
    url: 'https://pdf-certificates.vercel.app',
    category: 'AI Certificate Platform',
    summary: 'Certificate management system with AI-generated templates, bulk issuance, unique numbering, ZIP and email delivery, and QR codes anyone can verify online.',
    stack: ['TypeScript', 'PDF generation', 'QR verification', 'Vercel'],
    services: ['ai-web-development'],
  },
];

const websites = [
  { name: 'Pimofy Digital', url: 'https://pimofydigital.com', category: 'Corporate & AI Services', summary: 'This website: a secure, fast Express platform with a blog, admin panel and full structured data for search and AI engines.', services: ['ai-web-development', 'schema-markup', 'answer-engine-optimization'] },
  { name: 'Sound Creations Ltd', url: 'https://soundcreationsltd.com', category: 'B2B Audio & AV', summary: 'Hand-coded, security-audited platform for a pro audio and AV integrator operating in Kenya, Rwanda, DR Congo and Dubai, with a unified JSON-LD schema graph.', services: ['ai-web-development', 'schema-markup', 'ai-seo'] },
  { name: 'Sound Creations Rwanda', url: 'https://soundcreationsltd.rw', category: 'B2B Audio & AV', summary: 'Localised Rwanda site for audio-visual and pro audio solutions in Kigali.', services: ['ai-web-development', 'ai-seo'] },
  { name: 'VTECH Audio Visual', url: 'https://vtechaudio.co.ke', category: 'AV Solutions', summary: 'Corporate website for an audio-visual systems company in Kenya.', services: ['ai-web-development', 'ai-seo'] },
  { name: 'Baldmann Audio', url: 'https://baldmannaudio.com', category: 'Personal Brand', summary: 'Portfolio website for a certified live sound engineer, showcasing credentials and event work.', services: ['ai-web-development'] },
  { name: 'AWIVEST', url: 'https://awivest.com', category: 'Investment Collective', summary: 'Public website for African Women Investors, bringing together women investors across the continent and the diaspora.', services: ['ai-web-development', 'ai-seo'] },
  { name: 'MK Auto Spares', url: 'https://mkautospares.co.ke', category: 'Ecommerce', summary: 'Car spare parts store with 4,300+ genuine, OEM and ex-Japan parts, WhatsApp fitment checks and M-Pesa payments.', services: ['ai-web-development', 'ai-seo', 'schema-markup'] },
  { name: 'Betech Solar', url: 'https://www.betech.co.ke', category: 'Ecommerce', summary: 'Online store for solar panels, inverters, batteries and complete solar kits with countrywide delivery.', services: ['ai-web-development', 'ai-seo'] },
  { name: 'Tabarak Electronics', url: 'https://tabarakelectronics.co.ke', category: 'Ecommerce', summary: 'Electronics and home appliances store: TVs, fridges, cookers and more.', services: ['ai-web-development', 'ai-seo'] },
  { name: 'NURA Beauty', url: 'https://nurabeauty.co.ke', category: 'Ecommerce', summary: 'Ecommerce store for human hair and lace wigs in Kenya.', services: ['ai-web-development', 'ai-seo'] },
  { name: 'Guru Expert Power Tools', url: 'https://guruexpertpowertools.co.ke', category: 'Ecommerce', summary: 'WooCommerce store for power tools, solar equipment and hardware.', services: ['ai-web-development'] },
  { name: 'Power Tools Plug Kenya', url: 'https://rickytools.com', category: 'Ecommerce', summary: 'Supplier of power tools, generators, water pumps, compressors and industrial equipment with nationwide delivery.', services: ['ai-web-development'] },
  { name: 'Power Tools Plug', url: 'https://www.powertoolsplugke.co.ke', category: 'Ecommerce', summary: 'Online store for power tools and hardware in Kenya.', services: ['ai-web-development'] },
  { name: 'Green World Health Solutions', url: 'https://greenworldhealth.co.ke', category: 'Health & Wellness', summary: 'Product and distributor website for Green World health products in Kenya.', services: ['ai-web-development', 'ai-seo'] },
  { name: 'Smile Community Centre', url: 'https://smilecommunitycentre.org', category: 'Non-profit', summary: 'Website for a children’s home in Nairobi, built to grow donor and volunteer support.', services: ['ai-web-development', 'ai-seo'] },
  { name: 'Light of Future Foundation', url: 'https://lightoffuturefoundation.org', category: 'Non-profit', summary: 'Foundation website bringing hope and opportunity to communities.', services: ['ai-web-development'] },
  { name: 'Cistern of Hope Foundation', url: 'https://cisternofhopefoundation.org', category: 'Non-profit', summary: 'NGO website for a Nairobi-based community foundation.', services: ['ai-web-development'] },
  { name: 'Deliverance Church Kabete N Market', url: 'https://dckabeten.org', category: 'Church', summary: 'Church website with service times, sermons, prayer and live stream for the Uthiru community.', services: ['ai-web-development', 'ai-seo'] },
  { name: 'Sylvia’s Dream', url: 'https://sylviasdream.com', category: 'Author & Publishing', summary: 'Author website for Christian books and devotionals.', services: ['ai-web-development', 'ai-seo'] },
];

function forService(slug, limit = 3) {
  return [...products, ...websites].filter((item) => item.services.includes(slug)).slice(0, limit);
}

module.exports = { products, websites, forService };
