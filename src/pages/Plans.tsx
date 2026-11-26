import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Briefcase, Check, Info, Minus, Users } from 'lucide-react';
import { B2B_PLANS, B2B_ROWS, B2C_PLANS, B2C_ROWS, yearlySaving, type Plan } from '../data/plans';
import { FAQS } from '../data/content';
import { Accordion, Segmented } from '../components/ui/Misc';
import { cx, inr, sleep } from '../lib/utils';
import type { BillingCycle } from '../lib/types';

function PlanCard({ p, cycle }: { p: Plan; cycle: BillingCycle }) {
  const isB2C = p.audience === 'individual';
  const price = cycle === 'monthly' ? p.monthly : p.yearly;
  const saving = yearlySaving(p);
  return (
    <div className={cx('card plan-card', p.highlight && 'featured')}>
      {p.highlight && <span className="badge badge-navy plan-flag">{isB2C ? 'Most popular' : 'Recommended'}</span>}
      <h3>{p.name}</h3>
      <p className="small muted">{p.tagline}</p>
      {isB2C ? (
        <div className="price">
          <b>{inr(price!)}</b>
          <span>/ {cycle === 'monthly' ? 'month' : 'year'}</span>
        </div>
      ) : (
        <div className="price"><b className="custom">Custom pricing</b></div>
      )}
      <p className="xs plan-sub">
        {isB2C
          ? cycle === 'yearly'
            ? `Save ${inr(saving)} a year · ${p.trialDays}-day free trial`
            : `${p.trialDays}-day free trial · cancel anytime`
          : 'Assigned by contract · invoiced offline'}
      </p>
      <ul className="check-list small">
        {p.bullets.map((b) => <li key={b}>{b}</li>)}
      </ul>
      {isB2C ? (
        <Link to={`/signup/individual?plan=${p.id}&cycle=${cycle}`} className={cx('btn btn-block', p.highlight ? 'btn-primary' : 'btn-outline')}>
          {p.cta}
        </Link>
      ) : (
        <Link to={`/contact?type=sales&as=business&plan=${p.id}`} className={cx('btn btn-block', p.highlight ? 'btn-primary' : 'btn-outline')}>
          {p.cta}
        </Link>
      )}
    </div>
  );
}

function SkeletonCards() {
  return (
    <div className="grid grid-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="card plan-card" aria-hidden="true">
          <div className="skeleton" style={{ height: 22, width: '50%' }} />
          <div className="skeleton" style={{ height: 14, width: '80%' }} />
          <div className="skeleton" style={{ height: 40, width: '60%', marginTop: 8 }} />
          {[0, 1, 2, 3].map((k) => <div key={k} className="skeleton" style={{ height: 14 }} />)}
          <div className="skeleton" style={{ height: 44, borderRadius: 999, marginTop: 8 }} />
        </div>
      ))}
    </div>
  );
}

export function PlansPage() {
  const [params, setParams] = useSearchParams();
  const audience = params.get('for') === 'business' ? 'business' : 'individual';
  const [cycle, setCycle] = useState<BillingCycle>('yearly');
  const [loading, setLoading] = useState(true);

  // Simulates reading the plan master (PRD §10.9).
  useEffect(() => {
    let live = true;
    setLoading(true);
    sleep(450).then(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [audience]);

  const plans = audience === 'business' ? B2B_PLANS : B2C_PLANS;
  const rows = audience === 'business' ? B2B_ROWS : B2C_ROWS;

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <span className="eyebrow">Plans</span>
            <h1>Plans that grow with you</h1>
            <p className="lead">
              {audience === 'business'
                ? 'Business plans are tailored to your users, branches and modules, and assigned to your company by contract.'
                : 'Every personal plan starts with a 14-day free trial. Family members you invite never pay.'}
            </p>
            <div className="row-wrap" style={{ justifyContent: 'center' }}>
              <Segmented
                label="Plan audience"
                value={audience}
                onChange={(v) => setParams(v === 'business' ? { for: 'business' } : {}, { replace: true })}
                options={[
                  { value: 'individual', label: <><Users size={15} /> Individuals & families</> },
                  { value: 'business', label: <><Briefcase size={15} /> Business</> },
                ]}
              />
              {audience === 'individual' && (
                <Segmented
                  label="Billing cycle"
                  value={cycle}
                  onChange={setCycle}
                  options={[
                    { value: 'monthly', label: 'Monthly' },
                    { value: 'yearly', label: <>Yearly <span className="badge badge-yellow" style={{ height: 20 }}>~2 months free</span></> },
                  ]}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          {loading ? (
            <SkeletonCards />
          ) : (
            <div className="grid grid-3">
              {plans.map((p) => <PlanCard key={p.id} p={p} cycle={cycle} />)}
            </div>
          )}
          <div className="alert alert-info" style={{ marginTop: 24 }}>
            <Info size={18} />
            <span>
              {audience === 'business'
                ? 'Self-serve sign-up is open to every company — you can set up your workspace now, and our team will agree the plan with you.'
                : 'Indicative pricing for this preview; final prices will be confirmed at launch. Prices exclude GST. Payment by UPI autopay, card or net banking.'}
            </span>
          </div>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <h2 className="group-title">Compare plans</h2>
          <div className="table-wrap">
            <table className="table compare">
              <thead>
                <tr>
                  <th style={{ width: '28%' }}>&nbsp;</th>
                  {plans.map((p) => <th key={p.id} className={cx(p.highlight && 'hl')}>{p.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {audience === 'individual' && (
                  <>
                    <tr>
                      <td>Price per month</td>
                      {plans.map((p) => <td key={p.id} className={cx(p.highlight && 'hl')}>{inr(p.monthly!)}</td>)}
                    </tr>
                    <tr>
                      <td>Price per year</td>
                      {plans.map((p) => <td key={p.id} className={cx(p.highlight && 'hl')}>{inr(p.yearly!)} <span className="xs muted">(save {inr(yearlySaving(p))})</span></td>)}
                    </tr>
                    <tr>
                      <td>Free trial</td>
                      {plans.map((p) => <td key={p.id} className={cx(p.highlight && 'hl')}>{p.trialDays} days</td>)}
                    </tr>
                  </>
                )}
                {rows.map((r) => (
                  <tr key={r.key}>
                    <td>{r.label}</td>
                    {plans.map((p) => {
                      const v = p.entitlements[r.key];
                      return (
                        <td key={p.id} className={cx(p.highlight && 'hl')}>
                          {v === 'Yes' ? <Check size={18} className="text-teal" aria-label="Yes" /> : v === 'No' ? <Minus size={18} className="muted" aria-label="No" /> : v}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container split split-faq">
          <div className="stack">
            <span className="eyebrow">Billing questions</span>
            <h2>About plans and payments</h2>
            <Link to="/faqs?topic=billing" className="link-btn">All billing FAQs <ArrowRight size={15} /></Link>
          </div>
          <Accordion items={FAQS.filter((f) => f.topic === 'billing').map((f) => ({ id: f.id, title: f.question, body: f.answer }))} />
        </div>
      </section>
    </>
  );
}
