import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Barcode,
  BellRing,
  Building2,
  Calculator,
  Car,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Home as HomeIcon,
  Lock,
  Pause,
  Play,
  ShieldCheck,
  Smartphone,
  UserCheck,
  Users,
  Wrench,
  ArrowLeftRight,
  EyeOff,
} from 'lucide-react';
import { BANNERS, BASE_CATEGORIES, FAQS } from '../data/content';
import { B2C_PLANS } from '../data/plans';
import { CategoryIcon } from '../components/Icons';
import { DashboardMock, FamilyAvatars, FloatingCard, PhoneMock } from '../components/Mockups';
import { Asset360Showcase } from '../components/Asset360Showcase';
import { StoreBadges } from '../components/StoreBadges';
import { useShell } from '../components/ShellContext';
import { Accordion, SectionHead } from '../components/ui/Misc';
import { cx, inr } from '../lib/utils';

function Hero() {
  const banners = BANNERS.filter((b) => b.isPublished).sort((a, b) => a.sortOrder - b.sortOrder);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const { openTour } = useShell();
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((x) => (x + 1) % banners.length), 7000);
    return () => clearInterval(t);
  }, [paused, banners.length]);
  const b = banners[i];
  const business = b.audience === 'business';

  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true" />
      <div className="container hero-grid">
        <div className="hero-copy" key={b.id}>
          <div className="segmented" role="tablist" aria-label="Who is Mynages for">
            {banners.map((bn, k) => (
              <button
                key={bn.id}
                role="tab"
                aria-pressed={k === i}
                aria-selected={k === i}
                onClick={() => {
                  setI(k);
                  setPaused(true);
                }}
              >
                {bn.audience === 'business' ? <Building2 size={15} /> : <Users size={15} />}
                {bn.audience === 'business' ? 'For business' : 'For families'}
              </button>
            ))}
          </div>
          <h1>
            {b.title}
            <br />
            <span className="text-teal">{b.highlight}</span>
          </h1>
          <p className="lead">{b.subtitle}</p>
          <div className="row-wrap">
            <Link to={b.ctaUrl} className="btn btn-primary btn-lg">
              {b.ctaLabel} <ArrowRight size={18} />
            </Link>
            <button className="btn btn-ghost btn-lg" onClick={openTour}>
              <span className="play-dot"><Play size={14} fill="currentColor" /></span> Watch demo
            </button>
          </div>
          <div className="hero-trust">
            {business ? (
              <>
                <span><CheckCircle2 size={16} /> Own database per company</span>
                <span><CheckCircle2 size={16} /> Your logo &amp; colours</span>
              </>
            ) : (
              <>
                <span><CheckCircle2 size={16} /> 14-day free trial</span>
                <span><CheckCircle2 size={16} /> No passwords — OTP sign-in</span>
              </>
            )}
          </div>
          <div className="hero-dots">
            {banners.map((bn, k) => (
              <button key={bn.id} className={cx(k === i && 'on')} onClick={() => { setI(k); setPaused(true); }} aria-label={`Show banner ${k + 1}`} />
            ))}
            <button className="hero-pause" onClick={() => setPaused(!paused)} aria-label={paused ? 'Play banners' : 'Pause banners'}>
              {paused ? <Play size={12} /> : <Pause size={12} />}
            </button>
          </div>
        </div>

        <div className="hero-visual" key={`v-${b.id}`}>
          {business ? (
            <>
              <DashboardMock />
              <FloatingCard className="fc-1" icon={<ClipboardCheck size={16} />} title="Audit session closed" sub="Pune plant · 1,284 scanned" />
              <FloatingCard className="fc-2" icon={<Wrench size={16} />} title="Calibration due" sub="Pressure gauge PG-14 · 3 days" />
            </>
          ) : (
            <>
              <div className="hero-blob" />
              <PhoneMock />
              <FloatingCard className="fc-1" icon={<BellRing size={16} />} title="Car insurance renews in 11 days" sub="Reminder sent to Nitin & Sneha" />
              <FloatingCard className="fc-2" icon={<FileText size={16} />} title="Sneha added a document" sub="Washing machine warranty card" />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

const VALUE = [
  { icon: HomeIcon, title: 'All your assets', desc: 'Homes, vehicles, gadgets, gold and investments' },
  { icon: FileText, title: 'Important documents', desc: 'Stored with the asset or person they belong to' },
  { icon: BellRing, title: 'Never miss a renewal', desc: 'Push and WhatsApp reminders, as early as you like' },
  { icon: Users, title: 'Family & business', desc: 'Share with family, or run your whole company' },
];

export function HomePage() {
  const { openTour } = useShell();
  return (
    <>
      <Hero />

      <section className="value-strip">
        <div className="container">
          <div className="value-grid">
            {VALUE.map((v) => (
              <div key={v.title} className="value-item">
                <span className="icon-tile"><v.icon size={22} /></span>
                <div>
                  <h4>{v.title}</h4>
                  <p className="small muted">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="asset-360">
        <div className="container">
          <SectionHead
            eyebrow="Asset 360°"
            title={<>One page for <span className="text-teal">everything</span> about an asset</>}
            lead="Cover, renewals, tasks, papers, service history, contacts and costs — together on a single page. Tap a section or a quick action below."
          />
          <Asset360Showcase />
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <SectionHead eyebrow="How it works" title="Up and running in three steps" />
          <div className="grid grid-3 steps">
            {[
              { n: '01', title: 'Sign up with your mobile', desc: 'Verify by OTP, choose a plan and start your 14-day trial. No passwords.', icon: Smartphone },
              { n: '02', title: 'Add what you own', desc: 'Ready-made categories for Indian homes — pick a tile and fill only what matters.', icon: Car },
              { n: '03', title: 'Relax, we remind you', desc: 'Renewals, premiums, services and maturities come to you and your family in time.', icon: BellRing },
            ].map((s) => (
              <div key={s.n} className="card step-card">
                <span className="step-n">{s.n}</span>
                <span className="icon-tile"><s.icon size={22} /></span>
                <h3>{s.title}</h3>
                <p className="muted small">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="stack">
            <span className="eyebrow">Family workspace</span>
            <h2>Your family, on the same page. Your private things, private.</h2>
            <p className="lead">
              Invite your spouse, parents or grown-up children with a WhatsApp link. Everything in the family workspace is shared;
              each member also keeps a private space no one else sees.
            </p>
            <ul className="check-list">
              <li>Join in under two minutes from a WhatsApp invite</li>
              <li>Owner, adult member and view-only roles</li>
              <li>Profiles for children or elderly parents without a phone</li>
              <li>Every record shows who added it</li>
            </ul>
            <div className="row-wrap">
              <Link to="/features/individuals" className="btn btn-navy">Explore features <ArrowRight size={16} /></Link>
              <Link to="/use-cases/personal" className="btn btn-outline">See use cases</Link>
            </div>
          </div>
          <div className="family-visual" aria-hidden="true">
            <div className="fv-card fv-shared">
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <b><Users size={16} /> Kulkarni Family</b>
                <FamilyAvatars />
              </div>
              {[
                ['Baner flat', 'Property', 'Nitin'],
                ['Toyota Innova', 'Vehicle', 'Nitin'],
                ['LG washing machine', 'Appliance', 'Sneha'],
                ['Mother’s health policy', 'Insurance', 'Sneha'],
              ].map(([n, c, by]) => (
                <div key={n} className="fv-row"><span>{n}</span><em>{c}</em><small>Added by {by}</small></div>
              ))}
            </div>
            <div className="fv-card fv-private">
              <b><EyeOff size={15} /> Sneha’s private space</b>
              <div className="fv-row"><span>Personal FD — SBI</span><em>Savings</em></div>
              <div className="fv-row"><span>Gold bangles</span><em>Jewellery</em></div>
              <small className="muted"><Lock size={12} /> Only Sneha can see these</small>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <SectionHead
            eyebrow="Ready-made categories"
            title="Built for what Indian families own"
            lead="Each category asks only the questions that matter — registration number for a car, property tax ID for a flat, IMEI for a phone."
          />
          <div className="cat-grid">
            {BASE_CATEGORIES.map((c) => (
              <div key={c.id} className="cat-tile card-hover">
                <span className="icon-tile"><CategoryIcon name={c.icon} /></span>
                <b>{c.name}</b>
                <span className="xs muted">{c.examples}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-navy biz-band">
        <div className="container split">
          <div className="stack">
            <span className="eyebrow" style={{ color: 'var(--teal)' }}>For business</span>
            <h2>Every company asset — tagged, tracked and audit-ready</h2>
            <p style={{ color: '#b7cbd4' }}>
              Your company gets its own web address, its own database and your branding. Track assets across branches, hand them to
              employees, transfer between units, keep machines calibrated and close the books with depreciation as per Books and Income-Tax.
            </p>
            <div className="row-wrap">
              <Link to="/signup/business" className="btn btn-yellow">Set up your company <ArrowRight size={16} /></Link>
              <Link to="/features/business" className="btn btn-outline-light">Business features</Link>
            </div>
          </div>
          <div className="biz-chips">
            {[
              [Barcode, 'QR / barcode tagging & audits'],
              [UserCheck, 'Custody & acknowledgements'],
              [ArrowLeftRight, 'Transfers between branches'],
              [ClipboardCheck, 'Requests & multi-level approvals'],
              [Wrench, 'Maintenance & calibration'],
              [ShieldCheck, 'Warranties, AMC & insurance'],
              [Calculator, 'Depreciation — Books & Income-Tax'],
              [FileText, '22 audit-ready reports'],
            ].map(([I, l]) => {
              const Icon = I as typeof Wrench;
              return (
                <span key={l as string} className="biz-chip"><Icon size={17} /> {l as string}</span>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Plans" title="Simple plans for every family" lead="Every plan starts with a 14-day free trial. Business plans are tailored to your company." />
          <div className="grid grid-3">
            {B2C_PLANS.map((p) => (
              <div key={p.id} className={cx('card plan-mini', p.highlight && 'featured')}>
                {p.highlight && <span className="badge badge-navy plan-flag">Most popular</span>}
                <h3>{p.name}</h3>
                <p className="small muted">{p.tagline}</p>
                <div className="price"><b>{inr(p.monthly!)}</b><span>/ month</span></div>
                <ul className="check-list small">
                  {p.bullets.slice(0, 3).map((x) => <li key={x}>{x}</li>)}
                </ul>
                <Link to={`/signup/individual?plan=${p.id}`} className={cx('btn btn-block', p.highlight ? 'btn-primary' : 'btn-outline')}>
                  Start free trial
                </Link>
              </div>
            ))}
          </div>
          <p className="center" style={{ marginTop: 24 }}>
            <Link to="/plans" className="link-btn">Compare all plans and business options <ArrowRight size={15} /></Link>
          </p>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container split split-faq">
          <div className="stack">
            <span className="eyebrow">Questions</span>
            <h2>Good questions, straight answers</h2>
            <p className="muted">Can’t find what you need? Our team is happy to help.</p>
            <div className="row-wrap">
              <Link to="/faqs" className="btn btn-outline">All FAQs</Link>
              <Link to="/contact" className="btn btn-ghost">Contact us</Link>
            </div>
          </div>
          <Accordion
            defaultOpen={FAQS[5].id}
            items={[FAQS[5], FAQS[13], FAQS[14], FAQS[8]].map((f) => ({ id: f.id, title: f.question, body: f.answer }))}
          />
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div className="cta-band">
            <div className="stack-sm">
              <h2>One platform. Everything managed.</h2>
              <p>Start your 14-day free trial today — get the app on your phone.</p>
            </div>
            <div className="stack-sm" style={{ justifyItems: 'start' }}>
              <div className="row-wrap">
                <Link to="/signup" className="btn btn-yellow btn-lg">Get started <ArrowRight size={18} /></Link>
                <button className="btn btn-outline-light btn-lg" onClick={openTour}>Take the tour</button>
              </div>
              <StoreBadges />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
