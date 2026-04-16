// ─────────────────────────────────────────────────────────────
//  LAUNCHER CONFIGURATION  — Strategy & Planning Mockups
//  Edit this file to customise the launcher for this deployment
// ─────────────────────────────────────────────────────────────

const config = {
  launcherName: 'Strategy & Planning',
  orgName: 'Allps AI',
  subtitle: 'Strategic prototypes, roadmaps and planning artefacts for the Management team',
  audience: 'management',

  // Amber/gold accent — distinguishes this launcher visually from the Product one
  accentColor: '#F59E0B',
  accentColorDark: '#D97706',
  headerGradient: 'linear-gradient(135deg, #0A0F1E 0%, #1A130A 60%, #120F0A 100%)',

  // PIN protection — set to null to disable
  // Change this value after cloning. Do NOT commit a real PIN to a public repo.
  accessPin: '1124',

  // Categories shown in the filter bar (order matters)
  categories: [
    'All',
    'Product Roadmap',
    'Go-to-Market',
    'Competitive Analysis',
    'Pricing & Packaging',
    'Investor Materials',
    'Partnership Strategy',
    'Hiring & Org Design',
    'OKRs & Metrics',
    'Customer Research',
    'Other',
  ],

  // Webhook URL — POST with { title, addedBy, url } when new mockup is pushed
  // Useful for notifying the management team via Slack/Teams
  notificationWebhookUrl: null,
}

export default config
