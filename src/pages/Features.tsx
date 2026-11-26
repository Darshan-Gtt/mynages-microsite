import { Link, NavLink } from 'react-router-dom';
import {
  ArrowLeftRight,
  ArrowRight,
  Barcode,
  BarChart3,
  BellRing,
  Briefcase,
  Building2,
  Calculator,
  CalendarClock,
  Camera,
  ClipboardCheck,
  ClipboardList,
  FileText,
  Gauge,
  HeartPulse,
  IndianRupee,
  KeyRound,
  LayoutGrid,
  Lock,
  Palette,
  Phone,
  PiggyBank,
  ScanLine,
  ShieldCheck,
  Upload,
  User,
  UserCheck,
  Users,
  Wrench,
  FileBarChart,
  type LucideIcon,
} from 'lucide-react';
import { Asset360Showcase } from '../components/Asset360Showcase';
import { SectionHead } from '../components/ui/Misc';
import { cx } from '../lib/utils';

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
  soon?: boolean;
}

const INDIVIDUAL: { group: string; items: Feature[] }[] = [
  {
    group: 'Everything in one place',
    items: [
      { icon: LayoutGrid, title: 'Ready-made categories', desc: 'Vehicles, property, gadgets, appliances, jewellery, investments and more — with the right fields for each.' },
      { icon: ScanLine, title: 'Asset 360° page', desc: 'Coverage, renewals, tasks, documents, service, contacts and costs on one page per asset.' },
      { icon: FileText, title: 'Documents that belong somewhere', desc: 'The RC stays with the car, the vaccination card with your child. Search finds any paper in seconds.' },
      { icon: ShieldCheck, title: 'Insurance & coverage', desc: 'Motor, home, health, life, gadget and jewellery policies — plus warranties and AMCs — with days-left at a glance.' },
    ],
  },
  {
    group: 'Nothing missed',
    items: [
      { icon: BellRing, title: 'Renewals & reminders', desc: 'Insurance, PUC, property tax, AMC, FD maturity, subscriptions — one-off or recurring.' },
      { icon: CalendarClock, title: 'Your own lead times', desc: 'Pick standard presets like 30, 7 and 1 day before, or set your own — on every item.' },
      { icon: ClipboardList, title: 'Tasks with recurrence', desc: 'Date and time, priority, status and repeat rules. Assign to a family member and track it.' },
      { icon: Wrench, title: 'Service & maintenance', desc: 'Log services with odometer readings and costs; know when the next one is due.' },
    ],
  },
  {
    group: 'Made for families',
    items: [
      { icon: Users, title: 'Family workspace', desc: 'Invite members by WhatsApp or SMS; everyone sees shared items and gets the reminders.' },
      { icon: Lock, title: 'Private space', desc: 'Each member keeps a private space that is never shown to others or counted in family totals.' },
      { icon: HeartPulse, title: 'Health records', desc: 'Medical records and vaccinations held against each family member’s profile.' },
      { icon: PiggyBank, title: 'Savings & investments', desc: 'FDs, PPF, NPS, mutual funds and bonds with maturity and contribution reminders.' },
    ],
  },
  {
    group: 'Less typing',
    items: [
      { icon: Phone, title: 'Contacts mapped to assets', desc: 'Import from your phone and map with a purpose — “Repair: Ramesh, RO technician”. One-tap call or WhatsApp.' },
      { icon: IndianRupee, title: 'Lifecycle expenses', desc: 'Every rupee spent on an asset, so you know its true cost.' },
      { icon: BarChart3, title: 'Family reports', desc: 'Asset value, upcoming renewals, coverage gaps — export when you need them.' },
      { icon: Camera, title: 'Snap a document', desc: 'Photograph a policy or invoice and Mynages fills the form for you to review.', soon: true },
    ],
  },
];

const BUSINESS: { group: string; items: Feature[] }[] = [
  {
    group: 'Asset register',
    items: [
      { icon: LayoutGrid, title: 'Dynamic asset forms', desc: 'Categories and fields designed for your industry, with item master (SKU), cost breakup and capitalisation.' },
      { icon: ScanLine, title: 'Asset 360°', desc: 'Adds custody, location history, depreciation, calibration, audit scans and approvals to the one-page view.' },
      { icon: Upload, title: 'Bulk add & import', desc: 'Load your existing register including opening balances.' },
      { icon: Barcode, title: 'QR / barcode labels', desc: 'Print labels, scan to identify, and keep a scan log of where every asset was seen.' },
    ],
  },
  {
    group: 'People & places',
    items: [
      { icon: Building2, title: 'Branches, locations, departments', desc: 'Head office sees everything; branch users see their own scope.' },
      { icon: KeyRound, title: 'Roles & scopes', desc: 'Owner, Admin, Finance, Editor, Auditor, Viewer and Employee — combined with branch, department or cost-centre scope.' },
      { icon: UserCheck, title: 'Custody & acknowledgements', desc: 'Assign assets to employees, check-out / check-in, and capture acknowledgements.' },
      { icon: ArrowLeftRight, title: 'Transfers', desc: 'Intra-unit and inter-unit transfers with full custody history.' },
    ],
  },
  {
    group: 'Upkeep & compliance',
    items: [
      { icon: ClipboardCheck, title: 'Requests & approvals', desc: 'Configurable multi-level approval workflows with an approval inbox.' },
      { icon: Wrench, title: 'Maintenance schedules', desc: 'By date, interval or meter reading, with a service and repair log.' },
      { icon: Gauge, title: 'Calibration', desc: 'Calibration settings, due and overdue lists, and certificates.' },
      { icon: ShieldCheck, title: 'Warranties, AMC & insurance', desc: 'Contracts and policies linked to the assets they cover.' },
    ],
  },
  {
    group: 'Finance & audit',
    items: [
      { icon: Calculator, title: 'Depreciation', desc: 'Books and Income-Tax methods, IT blocks, capital additions, fixed assets ledger and period lock.' },
      { icon: IndianRupee, title: 'Total cost of ownership', desc: 'Purchase, expenses, service and AMC costs per asset.' },
      { icon: ClipboardCheck, title: 'Physical verification', desc: 'Audit sessions with scanning and reconciliation.' },
      { icon: FileBarChart, title: '22 audit reports', desc: 'Fixed assets register, ledger, mismatch, backdated, custody, coverage and more — export-ready.' },
    ],
  },
  {
    group: 'Your brand',
    items: [
      { icon: Palette, title: 'Tenant branding', desc: 'Your logo, theme and document branding across your company’s Mynages.' },
      { icon: Briefcase, title: 'Own web address & database', desc: 'Every company gets its own URL and a dedicated database.' },
      { icon: Wrench, title: 'Work orders', desc: 'Raise and track maintenance work orders.', soon: true },
      { icon: ShieldCheck, title: 'Insurance claims', desc: 'Raise claims and build a claim pack from the asset’s documents.', soon: true },
    ],
  },
];

export function FeaturesTabs() {
  return (
    <div className="segmented" style={{ marginTop: 8 }}>
      <NavLink to="/features/individuals" className={({ isActive }) => cx('seg-link', isActive && 'on')}>
        <User size={15} /> For Individuals
      </NavLink>
      <NavLink to="/features/business" className={({ isActive }) => cx('seg-link', isActive && 'on')}>
        <Briefcase size={15} /> For Business
      </NavLink>
    </div>
  );
}

export function FeaturesPage({ audience }: { audience: 'individual' | 'business' }) {
  const groups = audience === 'individual' ? INDIVIDUAL : BUSINESS;
  const biz = audience === 'business';
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <span className="eyebrow">Features</span>
            <h1>{biz ? 'Run every company asset from one place' : 'Everything your family owns, managed together'}</h1>
            <p className="lead">
              {biz
                ? 'From the day an asset is bought to the day it is disposed of — tagged, assigned, maintained, depreciated and audit-ready.'
                : 'One platform for your assets, papers, renewals and tasks — shared with your family, with nothing missed.'}
            </p>
            <FeaturesTabs />
          </div>
        </div>
      </section>

      {groups.map((g, gi) => (
        <section key={g.group} className={cx('section-sm', gi % 2 === 1 && 'section-alt')}>
          <div className="container">
            <h2 className="group-title">{g.group}</h2>
            <div className="grid grid-4">
              {g.items.map((f) => (
                <div key={f.title} className="card card-hover feature-card">
                  <span className="icon-tile"><f.icon size={22} /></span>
                  <h3>
                    {f.title} {f.soon && <span className="badge badge-soon">Coming soon</span>}
                  </h3>
                  <p className="small muted">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="See it" title="The Asset 360° page" lead="The same one-page view on the mobile app and the web." />
          <Asset360Showcase />
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div className="cta-band">
            <div className="stack-sm">
              <h2>{biz ? 'Set up your company workspace' : 'Start your 14-day free trial'}</h2>
              <p>{biz ? 'Sign up with your work email and mobile — your company URL is ready in minutes.' : 'Sign up with your mobile number. No passwords.'}</p>
            </div>
            <div className="row-wrap">
              <Link to={biz ? '/signup/business' : '/signup/individual'} className="btn btn-yellow btn-lg">
                {biz ? 'Set up your company' : 'Get started'} <ArrowRight size={18} />
              </Link>
              <Link to={biz ? '/contact?type=sales&as=business' : '/plans'} className="btn btn-outline-light btn-lg">
                {biz ? 'Talk to sales' : 'See plans'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
