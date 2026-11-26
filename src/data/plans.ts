// Plan master as shown on the microsite (PRD §10.1, §10.2, §10.8).
// PRD lists B2C prices as "To decide" — the amounts below are INDICATIVE demo values only.

export interface PlanFeatureRow {
  key: string;
  label: string;
}

export interface Plan {
  id: string;
  name: string;
  audience: 'individual' | 'business';
  tagline: string;
  monthly: number | null;
  yearly: number | null;
  trialDays: number | null;
  highlight?: boolean;
  cta: string;
  entitlements: Record<string, string>;
  bullets: string[];
}

export const B2C_ROWS: PlanFeatureRow[] = [
  { key: 'members', label: 'Joined family members' },
  { key: 'assets', label: 'Assets' },
  { key: 'privateSpace', label: 'Private space for each member' },
  { key: 'reminders', label: 'Reminder channels' },
  { key: 'tasks', label: 'Tasks with recurrence' },
  { key: 'modules', label: 'Optional modules' },
  { key: 'storage', label: 'Storage' },
  { key: 'ai', label: 'AI document capture (coming soon)' },
  { key: 'sharing', label: 'Sharing outside family' },
  { key: 'reports', label: 'Reports and export' },
];

export const B2C_PLANS: Plan[] = [
  {
    id: 'individual', name: 'Individual', audience: 'individual', tagline: 'For one person managing their own things',
    monthly: 99, yearly: 990, trialDays: 14, cta: 'Start free trial',
    entitlements: {
      members: 'Owner only', assets: '100', privateSpace: 'Yes', reminders: 'Push + WhatsApp', tasks: 'Yes',
      modules: 'Insurance, Warranties & AMC, Maintenance, QR labels', storage: '5 GB', ai: '10 / month', sharing: 'No',
      reports: 'All core reports',
    },
    bullets: ['Up to 100 assets', 'Push + WhatsApp reminders', '5 GB secure storage', 'Insurance, warranties & AMC'],
  },
  {
    id: 'family', name: 'Family', audience: 'individual', tagline: 'Your household on one shared workspace',
    monthly: 199, yearly: 1990, trialDays: 14, highlight: true, cta: 'Start free trial',
    entitlements: {
      members: 'Owner + 4', assets: '300', privateSpace: 'Yes', reminders: 'Push + WhatsApp', tasks: 'Yes',
      modules: 'All except Savings & investments', storage: '20 GB', ai: '30 / month', sharing: 'Yes, 7-day links',
      reports: 'All',
    },
    bullets: ['Owner + 4 family members', 'Up to 300 assets', '20 GB secure storage', 'Health records & family reports'],
  },
  {
    id: 'family_plus', name: 'Family Plus', audience: 'individual', tagline: 'Joint families and everything you own',
    monthly: 349, yearly: 3490, trialDays: 14, cta: 'Start free trial',
    entitlements: {
      members: 'Owner + 8', assets: 'Unlimited', privateSpace: 'Yes', reminders: 'Push + WhatsApp + email', tasks: 'Yes',
      modules: 'All modules', storage: '50 GB', ai: '100 / month', sharing: 'Yes, any expiry', reports: 'All',
    },
    bullets: ['Owner + 8 family members', 'Unlimited assets', '50 GB secure storage', 'Savings & investments tracking'],
  },
];

export const B2B_ROWS: PlanFeatureRow[] = [
  { key: 'users', label: 'Users' },
  { key: 'branches', label: 'Branches / sites' },
  { key: 'assets', label: 'Assets' },
  { key: 'modules', label: 'Modules' },
  { key: 'storage', label: 'Storage' },
  { key: 'branding', label: 'Company branding' },
  { key: 'support', label: 'Onboarding' },
];

// PRD §10.8: B2B plans are assigned by contract from the admin console; no self-serve payment.
// Tier names and limits are placeholders for the demo.
export const B2B_PLANS: Plan[] = [
  {
    id: 'biz_starter', name: 'Business Starter', audience: 'business', tagline: 'Single office, getting organised',
    monthly: null, yearly: null, trialDays: null, cta: 'Talk to sales',
    entitlements: {
      users: 'Up to 25', branches: '1', assets: '2,000', modules: 'Core asset register, documents, renewals, tasks, QR labels',
      storage: '50 GB', branding: 'Logo and primary colour', support: 'Guided self-setup',
    },
    bullets: ['1 branch, 25 users', 'Asset register with QR labels', 'Renewals, tasks & documents', 'Custody & transfers'],
  },
  {
    id: 'biz_growth', name: 'Business Growth', audience: 'business', tagline: 'Multi-branch teams with finance needs',
    monthly: null, yearly: null, trialDays: null, highlight: true, cta: 'Talk to sales',
    entitlements: {
      users: 'Up to 150', branches: 'Up to 10', assets: '25,000', modules: 'Starter + maintenance, calibration, depreciation, approvals, audit reports',
      storage: '250 GB', branding: 'Full theme and document branding', support: 'Assisted onboarding',
    },
    bullets: ['Up to 10 branches', 'Depreciation (Books & Income-Tax)', 'Maintenance & calibration', '22 audit-ready reports'],
  },
  {
    id: 'biz_enterprise', name: 'Enterprise', audience: 'business', tagline: 'Large and regulated organisations',
    monthly: null, yearly: null, trialDays: null, cta: 'Talk to sales',
    entitlements: {
      users: 'Custom', branches: 'Unlimited', assets: 'Unlimited', modules: 'All modules',
      storage: 'Custom', branding: 'Full branding + custom domain', support: 'Dedicated onboarding manager',
    },
    bullets: ['Unlimited branches', 'Dedicated database', 'Custom domain & branding', 'Dedicated onboarding'],
  },
];

export const ALL_PLANS = [...B2C_PLANS, ...B2B_PLANS];

export function planById(id?: string): Plan | undefined {
  return ALL_PLANS.find((p) => p.id === id);
}

/** Yearly saving vs 12 × monthly. */
export function yearlySaving(p: Plan): number {
  if (p.monthly == null || p.yearly == null) return 0;
  return p.monthly * 12 - p.yearly;
}

/** PRD §10.7 leaves GST inclusive/exclusive open — demo assumes exclusive at 18%. */
export const GST_RATE = 0.18;
