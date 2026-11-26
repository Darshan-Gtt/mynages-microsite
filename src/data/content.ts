// Microsite content. In production this comes from microsite_banners / microsite_faqs,
// managed in the Admin Console (Microsite Content).

export type Audience = 'all' | 'individual' | 'business';

export interface Banner {
  id: string;
  title: string;
  highlight: string;
  subtitle: string;
  ctaLabel: string;
  ctaUrl: string;
  audience: Audience;
  sortOrder: number;
  isPublished: boolean;
}

export const BANNERS: Banner[] = [
  {
    id: 'bn1', title: 'Everything you own,', highlight: 'well managed.', audience: 'individual', sortOrder: 1, isPublished: true,
    subtitle: 'Your home, vehicles, gadgets, policies and important papers — with every renewal, service and task — in one place your whole family can see.',
    ctaLabel: 'Get started', ctaUrl: '/signup/individual',
  },
  {
    id: 'bn2', title: 'Every company asset,', highlight: 'accounted for.', audience: 'business', sortOrder: 2, isPublished: true,
    subtitle: 'Barcode-tagged assets across branches, custody and transfers, maintenance and calibration, depreciation books and audit-ready reports.',
    ctaLabel: 'Set up your company', ctaUrl: '/signup/business',
  },
];

export type FaqTopic = 'account' | 'privacy' | 'personal' | 'business' | 'billing';

export interface Faq {
  id: string;
  topic: FaqTopic;
  question: string;
  answer: string;
  sortOrder: number;
}

export const FAQ_TOPICS: { id: FaqTopic; label: string }[] = [
  { id: 'account', label: 'Account & sign-up' },
  { id: 'personal', label: 'Personal & family' },
  { id: 'business', label: 'Business' },
  { id: 'billing', label: 'Plans & billing' },
  { id: 'privacy', label: 'Privacy & security' },
];

export const FAQS: Faq[] = [
  { id: 'f1', topic: 'account', sortOrder: 1, question: 'How do I sign up for Mynages?',
    answer: 'Choose Individual or Business on the sign-up page. Individuals sign up with their mobile number (verified by OTP); email is optional. Businesses sign up with a work email and mobile number, both verified by OTP.' },
  { id: 'f2', topic: 'account', sortOrder: 2, question: 'Do I need a password?',
    answer: 'No. Mynages uses one-time passwords (OTP) sent to your mobile or email, or Google / Apple sign-in linked to your account. There is no password to remember or leak.' },
  { id: 'f3', topic: 'account', sortOrder: 3, question: 'Where do I sign in after signing up?',
    answer: 'Families sign in on the Mynages app for Android or iOS with the same mobile number. Businesses sign in at their own company address, for example yourcompany.mynages.com, which is created during sign-up.' },
  { id: 'f4', topic: 'account', sortOrder: 4, question: 'I changed my mobile number. How do I get back into my account?',
    answer: 'If you added an email, verify it by OTP and then verify your new mobile number. If you have no email on file, the Owner or an adult member of your family can confirm the request in the app, or our support team will verify your identity.' },
  { id: 'f5', topic: 'personal', sortOrder: 1, question: 'What can I keep in Mynages?',
    answer: 'Vehicles, property, electronics and gadgets, home appliances, furniture, jewellery and valuables, savings and investments, digital subscriptions and more. Each asset holds its documents, insurance, warranty, AMC, renewals, tasks, service history, contacts and expenses.' },
  { id: 'f6', topic: 'personal', sortOrder: 2, question: 'How does family sharing work?',
    answer: 'The person who signs up creates a family workspace and invites members by mobile number over WhatsApp or SMS. Everything in the family workspace is visible to joined members, and each member also gets a private space nobody else can see.' },
  { id: 'f7', topic: 'personal', sortOrder: 3, question: 'Can I add a family member who does not have a phone?',
    answer: 'Yes. Add them as a profile — for example a child or an elderly parent. You can keep their documents, health records and policies against their profile even though they do not sign in.' },
  { id: 'f8', topic: 'personal', sortOrder: 4, question: 'Who gets the reminders?',
    answer: 'Reminders on a family item go to every joined member who has that type of notification turned on. Reminders on a private item go only to its owner.' },
  { id: 'f9', topic: 'personal', sortOrder: 5, question: 'Do you store my bank or net-banking passwords?',
    answer: 'No. Mynages never stores passwords or net-banking credentials. Bank accounts only appear as a masked reference on an investment.' },
  { id: 'f10', topic: 'business', sortOrder: 1, question: 'Does my company get its own space?',
    answer: 'Yes. Every company gets its own web address and its own dedicated database, with your logo and colours applied across the app.' },
  { id: 'f11', topic: 'business', sortOrder: 2, question: 'Can we manage multiple branches?',
    answer: 'Yes. Set up branches, locations, departments and cost centres. Head office sees every branch; branch users see only their own scope.' },
  { id: 'f12', topic: 'business', sortOrder: 3, question: 'Which reports are included?',
    answer: 'Business plans include a fixed assets register, depreciation as per Books and Income-Tax, physical verification, custody, coverage, maintenance and other audit-ready reports — 22 in total.' },
  { id: 'f13', topic: 'business', sortOrder: 4, question: 'How is a business plan assigned?',
    answer: 'Business plans are agreed with our sales team and assigned to your company by contract. You can sign up and start setting up your workspace before the plan is finalised.' },
  { id: 'f14', topic: 'billing', sortOrder: 1, question: 'Is there a free plan?',
    answer: 'Every personal plan starts with a 14-day free trial with all the features of the plan you choose. After the trial, a paid subscription is needed to keep adding and editing.' },
  { id: 'f15', topic: 'billing', sortOrder: 2, question: 'What happens if my subscription ends?',
    answer: 'Nothing is deleted. You can still view, search and export everything; adding and editing pause until you subscribe again, and all your data comes back exactly as it was.' },
  { id: 'f16', topic: 'billing', sortOrder: 3, question: 'Do family members have to pay?',
    answer: 'No. Joined family members are covered by the Owner\'s subscription.' },
  { id: 'f17', topic: 'billing', sortOrder: 4, question: 'Can I change my plan later?',
    answer: 'Yes. Upgrades apply immediately. Downgrades apply at the end of the paid period and never delete data — items over the new limit become read-only.' },
  { id: 'f18', topic: 'billing', sortOrder: 5, question: 'How can I pay?',
    answer: 'On the website you can pay by UPI autopay, debit or credit card, or net banking. A GST invoice is emailed to you and listed under Plan and billing in the app.' },
  { id: 'f19', topic: 'privacy', sortOrder: 1, question: 'Who can see my private space?',
    answer: 'Only you. Items in your private space are never shown to other family members and are left out of family totals.' },
  { id: 'f20', topic: 'privacy', sortOrder: 2, question: 'How do I export or delete my data?',
    answer: 'Use the Privacy Request page. After verifying your email or mobile by OTP, you can ask for an export, a correction or deletion of your data, and track the request with its reference number.' },
  { id: 'f21', topic: 'privacy', sortOrder: 3, question: 'Can I share an asset with my CA or insurance agent?',
    answer: 'Sharing with people outside your family — view-only with an expiry — is planned. Today, sharing works within your family workspace.' },
];

export interface CategoryInfo {
  id: string;
  name: string;
  icon: string;
  examples: string;
}

// PRD §6.1 base category package (India)
export const BASE_CATEGORIES: CategoryInfo[] = [
  { id: 'vehicles', name: 'Vehicles', icon: 'car', examples: 'Car, two-wheeler, bicycle, commercial vehicle, tractor' },
  { id: 'property', name: 'Property', icon: 'home', examples: 'House / flat, plot, agricultural land, shop / office' },
  { id: 'electronics', name: 'Electronics & gadgets', icon: 'laptop', examples: 'Mobile, laptop, tablet, TV, camera, smartwatch' },
  { id: 'appliances', name: 'Home appliances', icon: 'fridge', examples: 'AC, refrigerator, washing machine, water purifier, inverter, solar' },
  { id: 'furniture', name: 'Furniture & fixtures', icon: 'sofa', examples: 'Sofa, bed, modular kitchen, wardrobe' },
  { id: 'jewellery', name: 'Jewellery & valuables', icon: 'gem', examples: 'Gold, silver, diamond, luxury watch, art, collectibles' },
  { id: 'savings', name: 'Savings & investments', icon: 'piggy', examples: 'FD, RD, PPF, NPS, mutual funds, stocks, bonds, gold bonds' },
  { id: 'digital', name: 'Digital & online', icon: 'globe', examples: 'Domain, website, online subscription, software licence' },
  { id: 'other', name: 'Other', icon: 'package', examples: 'Musical instruments, sports and fitness, tools' },
];

export const INDUSTRIES = [
  'Manufacturing', 'Healthcare', 'Education', 'IT & Services', 'Construction & Infrastructure', 'Retail',
  'Logistics & Transport', 'Hospitality', 'Food & Beverage', 'Banking & Finance', 'Government & PSU', 'Other',
];

export const COMPANY_SIZES = ['1–10', '11–50', '51–200', '201–1,000', '1,000+'];

export const RESERVED_SLUGS = ['www', 'admin', 'app', 'api', 'mail', 'support', 'secure', 'help', 'status', 'mynages'];

export const RELATIONS = ['Spouse', 'Son', 'Daughter', 'Father', 'Mother', 'Brother', 'Sister', 'Grandparent', 'Other'];
