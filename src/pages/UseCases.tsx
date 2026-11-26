import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  Check,
  Factory,
  GraduationCap,
  HeartPulse,
  Home,
  Laptop,
  Plane,
  Store,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { cx } from '../lib/utils';

interface UseCase {
  id: string;
  icon: LucideIcon;
  who: string;
  title: string;
  problem: string;
  how: string[];
  outcome: string;
}

const PERSONAL: UseCase[] = [
  {
    id: 'household', icon: Home, who: 'Young family, Pune', title: 'One household, one shared list',
    problem: 'Car insurance, two-wheeler PUC, property tax, AC service and the water purifier AMC were spread over WhatsApp chats and a drawer full of papers.',
    how: ['Added the flat, car, scooter and appliances from category tiles', 'Uploaded the RC, policies and invoices into each asset', 'Invited spouse by WhatsApp; both get the renewal reminders'],
    outcome: 'Every due date is visible on Home, and either partner can act on it.',
  },
  {
    id: 'parents', icon: Users, who: 'Caring for parents, Bengaluru & Mysuru', title: 'Looking after parents from another city',
    problem: 'Parents’ health insurance, FDs and pension papers were with them; renewals were often remembered at the last minute.',
    how: ['Added parents as family members — mother as a profile without a phone', 'Health policy linked to both parents; FD maturities tracked under Savings', 'Father joined as a view-only member and gets reminders too'],
    outcome: 'Health cover renews on time and FD maturities are re-invested, not forgotten.',
  },
  {
    id: 'nri', icon: Plane, who: 'NRI, Dubai — property in Kochi', title: 'Managing property in India from abroad',
    problem: 'A flat and agricultural land in Kerala with tax, maintenance and lease papers handled by a cousin.',
    how: ['Property records with tax and society maintenance as recurring obligations', 'Local contacts mapped with purpose — caretaker, lawyer, CA', 'Cousin invited as an adult member to upload receipts'],
    outcome: 'Payments and papers are visible from anywhere, with an audit trail of who did what.',
  },
  {
    id: 'gadgets', icon: Laptop, who: 'Professional, Gurugram', title: 'Warranties that are actually claimed',
    problem: 'Laptop, phone and TV warranties expired unnoticed; invoices could not be found when something broke.',
    how: ['Invoices and warranty cards stored with each gadget', 'Warranty expiry reminders 30 and 7 days ahead', 'Service centre contacts mapped for one-tap calling'],
    outcome: 'Repairs are claimed under warranty with the invoice ready in seconds.',
  },
];

const BUSINESS: UseCase[] = [
  {
    id: 'multibranch', icon: Building2, who: 'Multi-branch organisation, 14 branches', title: 'One register across every branch',
    problem: 'Each branch kept its own spreadsheet; head office could not reconcile assets at year-end.',
    how: ['Branches, locations and departments set up with branch-level scopes', 'Assets tagged with QR labels and verified in audit sessions', 'Inter-unit transfers approved through a two-level workflow'],
    outcome: 'Head office sees branch-wise dashboards; branch managers see only their own assets.',
  },
  {
    id: 'hospital', icon: HeartPulse, who: 'Hospital group', title: 'Calibration and AMC for medical devices',
    problem: 'Missed calibrations risked accreditation; AMC visits were tracked on paper.',
    how: ['Calibration schedules and certificates per device', 'AMC contracts linked to every covered device', 'Fault reports and service logs with downtime and cost'],
    outcome: 'Calibration due and overdue lists drive the biomedical team’s week.',
  },
  {
    id: 'manufacturing', icon: Factory, who: 'Manufacturer, Pune & Chakan plants', title: 'Depreciation that matches the books',
    problem: 'Finance maintained depreciation separately from the asset list, with frequent mismatches.',
    how: ['Depreciation as per Books and Income-Tax with IT blocks', 'Capital additions and cost breakup on each asset', 'Fixed assets ledger and period lock at month-end'],
    outcome: 'Auditors get the fixed assets register and depreciation reports straight from Mynages.',
  },
  {
    id: 'it', icon: Laptop, who: 'IT services company', title: 'Laptops handed over, and handed back',
    problem: 'Employee exits left laptops and access cards unaccounted for.',
    how: ['Custody assignments with employee acknowledgements', 'Check-out / check-in for shared equipment', 'Custody history per asset and per employee'],
    outcome: 'Every device has a named custodian and a signed acknowledgement.',
  },
  {
    id: 'education', icon: GraduationCap, who: 'School chain', title: 'Labs, buses and buildings in one place',
    problem: 'Bus fitness certificates, fire NOCs and lab equipment AMCs were renewed late.',
    how: ['Compliance items with renewal reminders', 'Vehicle documents stored against each bus', 'Requests from teachers routed for approval'],
    outcome: 'Renewals arrive in time and audits find every certificate on file.',
  },
  {
    id: 'retail', icon: Store, who: 'Retail chain', title: 'Store equipment across cities',
    problem: 'Chillers, DG sets and POS hardware were serviced inconsistently across stores.',
    how: ['Maintenance schedules by interval or meter reading', 'Vendors mapped to assets with service purpose', 'Branch-wise reports on maintenance cost'],
    outcome: 'Fewer breakdowns, and costs comparable across stores.',
  },
];

export function UseCasesPage({ audience }: { audience: 'personal' | 'business' }) {
  const list = audience === 'personal' ? PERSONAL : BUSINESS;
  const [active, setActive] = useState(list[0].id);
  const uc = list.find((u) => u.id === active) ?? list[0];
  const biz = audience === 'business';

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <span className="eyebrow">Use cases</span>
            <h1>{biz ? 'How businesses use Mynages' : 'How families use Mynages'}</h1>
            <p className="lead">
              {biz
                ? 'From a single office to multi-branch organisations — the same asset core, shaped to how your company works.'
                : 'Real situations from Indian households — and how one shared place changes them.'}
            </p>
            <div className="segmented">
              <NavLink to="/use-cases/personal" className={({ isActive }) => cx('seg-link', isActive && 'on')} onClick={() => setActive(PERSONAL[0].id)}>
                <User size={15} /> Personal
              </NavLink>
              <NavLink to="/use-cases/business" className={({ isActive }) => cx('seg-link', isActive && 'on')} onClick={() => setActive(BUSINESS[0].id)}>
                <Building2 size={15} /> Business
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container uc-layout">
          <div className="uc-list" role="tablist" aria-label="Use cases">
            {list.map((u) => (
              <button key={u.id} role="tab" aria-selected={u.id === uc.id} className={cx('uc-item', u.id === uc.id && 'on')} onClick={() => setActive(u.id)}>
                <span className="icon-tile sm"><u.icon size={18} /></span>
                <span>
                  <b>{u.title}</b>
                  <em>{u.who}</em>
                </span>
              </button>
            ))}
          </div>
          <article className="card uc-detail" key={uc.id}>
            <span className="badge badge-teal">{uc.who}</span>
            <h2>{uc.title}</h2>
            <div className="uc-block">
              <h4>The situation</h4>
              <p className="muted">{uc.problem}</p>
            </div>
            <div className="uc-block">
              <h4>With Mynages</h4>
              <ul className="uc-steps">
                {uc.how.map((h) => (
                  <li key={h}><Check size={16} /> {h}</li>
                ))}
              </ul>
            </div>
            <div className="uc-outcome">
              <b>Outcome</b>
              <p>{uc.outcome}</p>
            </div>
            <div className="row-wrap">
              <Link to={biz ? '/signup/business' : '/signup/individual'} className="btn btn-primary">
                {biz ? 'Set up your company' : 'Start free trial'} <ArrowRight size={16} />
              </Link>
              <Link to={`/contact?as=${biz ? 'business' : 'individual'}&type=sales`} className="btn btn-outline">Talk to us</Link>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
