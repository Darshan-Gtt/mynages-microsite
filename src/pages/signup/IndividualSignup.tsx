import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building,
  Check,
  CheckCircle2,
  CreditCard,
  Gift,
  Lock,
  PartyPopper,
  Pencil,
  ShieldCheck,
  Smartphone,
  UserPlus,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { Captcha, Checkbox, Field, Input, MobileInput, OtpInput, ResendTimer, Select, SubmitButton } from '../../components/ui/Form';
import { Segmented, Stepper } from '../../components/ui/Misc';
import { useToast } from '../../components/ui/Toast';
import { StoreBadges } from '../../components/StoreBadges';
import { getDb, updateDb } from '../../lib/store';
import { usePersistentState } from '../../lib/usePersistentState';
import { addDays, DEMO_OTP, firstName, fmtDate, inr, maskEmail, maskMobile, refNo, sleep, uid } from '../../lib/utils';
import { hasErrors, rx, validEmail, validMobile, validName, type Errors } from '../../lib/validation';
import { B2C_PLANS, GST_RATE, planById, yearlySaving } from '../../data/plans';
import type { BillingCycle, FamilyInvite, SignupRequest, Tenant } from '../../lib/types';

type Step = 'details' | 'otp' | 'existing' | 'invite' | 'plan' | 'checkout' | 'done';
type PayMethod = 'upi' | 'card' | 'netbanking';

interface State {
  step: Step;
  fullName: string;
  mobile: string;
  email: string;
  consent: boolean;
  human: boolean;
  signupId?: string;
  inviteCode?: string;
  planId: string;
  cycle: BillingCycle;
  result?: {
    mode: 'trial' | 'paid' | 'joined';
    workspace: string;
    planId?: string;
    cycle?: BillingCycle;
    trialEndsAt?: string;
    invoiceNo?: string;
    total?: number;
    role?: string;
  };
}

const BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'Bank of Baroda', 'Punjab National Bank', 'Canara Bank'];

function initialState(plan?: string | null, cycle?: string | null, mobile?: string | null): State {
  return {
    step: 'details',
    fullName: '',
    mobile: mobile && /^\d{10}$/.test(mobile) ? mobile : '',
    email: '',
    consent: false,
    human: false,
    planId: planById(plan ?? undefined)?.audience === 'individual' ? plan! : 'family',
    cycle: cycle === 'monthly' ? 'monthly' : 'yearly',
  };
}

export function IndividualSignupPage() {
  const [params] = useSearchParams();
  const [s, setS, reset] = usePersistentState<State>(
    'mynages.signup.individual',
    initialState(params.get('plan'), params.get('cycle'), params.get('mobile')),
  );
  const patch = (p: Partial<State>) => setS((cur) => ({ ...cur, ...p }));

  // A plan or mobile chosen elsewhere (Plans page, invite link) overrides a stale draft that hasn't been verified yet.
  useEffect(() => {
    const plan = params.get('plan');
    const mobile = params.get('mobile');
    if (s.step === 'details' || s.step === 'plan') {
      const p: Partial<State> = {};
      if (plan && planById(plan)?.audience === 'individual') p.planId = plan;
      if (params.get('cycle') === 'monthly' || params.get('cycle') === 'yearly') p.cycle = params.get('cycle') as BillingCycle;
      if (mobile && /^\d{10}$/.test(mobile) && s.step === 'details') p.mobile = mobile;
      if (Object.keys(p).length) patch(p);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const steps = s.step === 'invite' || s.result?.mode === 'joined'
    ? ['Your details', 'Verify', 'Join family', 'Done']
    : ['Your details', 'Verify', 'Plan', 'Payment', 'Done'];
  const stepIndex = (() => {
    if (s.result?.mode === 'joined') return 3;
    switch (s.step) {
      case 'details': return 0;
      case 'otp': case 'existing': return 1;
      case 'invite': case 'plan': return 2;
      case 'checkout': return 3;
      case 'done': return 4;
    }
  })();

  return (
    <section className="signup-wrap">
      <div className="container signup-container">
        <div className="signup-top">
          <Link to="/signup" className="link-btn small"><ArrowLeft size={15} /> Account type</Link>
          <span className="badge badge-teal"><Users size={13} /> Individual &amp; family</span>
        </div>
        <Stepper steps={steps} current={stepIndex} />
        {s.step === 'details' && <DetailsStep s={s} patch={patch} />}
        {s.step === 'otp' && <OtpStep s={s} patch={patch} />}
        {s.step === 'existing' && <ExistingStep s={s} patch={patch} onReset={reset} />}
        {s.step === 'invite' && <InviteStep s={s} patch={patch} />}
        {s.step === 'plan' && <PlanStep s={s} patch={patch} />}
        {s.step === 'checkout' && <CheckoutStep s={s} patch={patch} />}
        {s.step === 'done' && <DoneStep s={s} onReset={reset} />}
      </div>
    </section>
  );
}

type StepProps = { s: State; patch: (p: Partial<State>) => void };

function DetailsStep({ s, patch }: StepProps) {
  const toast = useToast();
  const [errors, setErrors] = useState<Errors<State>>({});
  const [loading, setLoading] = useState(false);
  const set = <K extends keyof State>(k: K, v: State[K]) => {
    patch({ [k]: v } as Partial<State>);
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Errors<State> = {
      fullName: validName(s.fullName, 'Full name'),
      mobile: validMobile(s.mobile),
      email: s.email.trim() ? validEmail(s.email) : undefined,
      consent: s.consent ? undefined : 'You need to accept the Terms of Use and Privacy Policy',
      human: s.human ? undefined : 'Please complete the security check',
    };
    setErrors(errs);
    if (hasErrors(errs)) return;
    setLoading(true);
    await sleep(900);
    setLoading(false);
    patch({ step: 'otp', human: false });
    toast({
      type: 'info',
      title: `OTP sent to +91 ${maskMobile(s.mobile)}`,
      message: `${s.email ? `and to ${maskEmail(s.email)}. ` : ''}Demo OTP: ${DEMO_OTP}`,
    });
  };

  return (
    <div className="signup-grid">
      <form className="card form-card stack" onSubmit={submit} noValidate>
        <div>
          <h2 className="step-title">Create your account</h2>
          <p className="muted small">Your mobile number is your Mynages account. There’s no password — we’ll send an OTP.</p>
        </div>
        <Field label="Full name" required htmlFor="i-name" error={errors.fullName}>
          <Input id="i-name" autoComplete="name" placeholder="e.g. Priya Sharma" value={s.fullName} onChange={(e) => set('fullName', e.target.value)} invalid={!!errors.fullName} />
        </Field>
        <Field label="Mobile number" required htmlFor="i-mobile" error={errors.mobile} hint="Family invites and WhatsApp reminders are matched to this number.">
          <MobileInput id="i-mobile" value={s.mobile} onChange={(v) => set('mobile', v)} invalid={!!errors.mobile} />
        </Field>
        <Field label="Email" optional htmlFor="i-email" error={errors.email} hint="Needed for email reminders, invoices and exports. We’ll verify it by OTP.">
          <Input id="i-email" type="email" autoComplete="email" placeholder="you@example.com" value={s.email} onChange={(e) => set('email', e.target.value)} invalid={!!errors.email} />
        </Field>
        <Field error={errors.consent}>
          <Checkbox id="i-consent" checked={s.consent} onChange={(v) => set('consent', v)}>
            I agree to the <Link to="/terms" target="_blank">Terms of Use</Link> and <Link to="/privacy" target="_blank">Privacy Policy</Link>.
          </Checkbox>
        </Field>
        <Captcha checked={s.human} onChange={(v) => set('human', v)} error={errors.human} />
        <SubmitButton loading={loading} className="btn-lg btn-block">
          {loading ? 'Sending OTP…' : <>Send OTP <ArrowRight size={17} /></>}
        </SubmitButton>
      </form>
      <SignupAside planId={s.planId} cycle={s.cycle} />
    </div>
  );
}

function SignupAside({ planId, cycle }: { planId: string; cycle: BillingCycle }) {
  const p = planById(planId);
  return (
    <aside className="signup-aside">
      <div className="card aside-card">
        <span className="eyebrow">What you get</span>
        <ul className="check-list small" style={{ marginTop: 12 }}>
          <li>Ready-made categories for Indian homes</li>
          <li>Reminders on push and WhatsApp</li>
          <li>Family workspace + a private space for each member</li>
          <li>Everything you add stays yours — export anytime</li>
        </ul>
      </div>
      {p && (
        <div className="card aside-card aside-plan">
          <span className="xs muted">Selected plan</span>
          <b>{p.name} · {cycle}</b>
          <span className="small">{inr(cycle === 'monthly' ? p.monthly! : p.yearly!)} / {cycle === 'monthly' ? 'month' : 'year'} after a {p.trialDays}-day free trial</span>
          <span className="xs muted">You can change this in a later step.</span>
        </div>
      )}
      <div className="aside-secure"><Lock size={14} /> OTP sign-in · data encrypted in transit and at rest</div>
    </aside>
  );
}

function OtpStep({ s, patch }: StepProps) {
  const toast = useToast();
  const [mOtp, setMOtp] = useState('');
  const [eOtp, setEOtp] = useState('');
  const [mErr, setMErr] = useState<string>();
  const [eErr, setEErr] = useState<string>();
  const [loading, setLoading] = useState(false);
  const needEmail = !!s.email.trim();

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    const me = mOtp.length < 6 ? 'Enter the 6-digit code' : mOtp !== DEMO_OTP ? 'That code is incorrect. Check the SMS and try again.' : undefined;
    const ee = !needEmail ? undefined : eOtp.length < 6 ? 'Enter the 6-digit code' : eOtp !== DEMO_OTP ? 'That code is incorrect. Check your inbox and try again.' : undefined;
    setMErr(me);
    setEErr(ee);
    if (me || ee) return;
    setLoading(true);
    await sleep(800);
    setLoading(false);

    const now = new Date().toISOString();
    const req: SignupRequest = {
      id: uid('sr'),
      accountType: 'individual',
      formData: { fullName: s.fullName.trim() },
      email: needEmail ? s.email.trim().toLowerCase() : undefined,
      mobileCountryCode: '+91',
      mobileNumber: s.mobile,
      mobileVerifiedAt: now,
      emailVerifiedAt: needEmail ? now : undefined,
      selectedPlanId: s.planId,
      billingCycle: s.cycle,
      status: 'verified',
      createdAt: now,
      updatedAt: now,
      expiresAt: addDays(new Date(), 1).toISOString(),
    };
    updateDb((d) => ({ ...d, signups: [req, ...d.signups] }));

    const db = getDb();
    const existing =
      db.tenants.some((t) => t.type === 'individual' && t.ownerMobile === s.mobile) ||
      db.invites.some((i) => i.mobile === s.mobile && i.status === 'joined');
    if (existing) {
      patch({ step: 'existing', signupId: req.id });
      return;
    }
    const invite = db.invites.find((i) => i.mobile === s.mobile && i.status === 'invited' && new Date(i.expiresAt) > new Date());
    if (invite) {
      patch({ step: 'invite', signupId: req.id, inviteCode: invite.code });
      return;
    }
    toast({ type: 'success', title: 'Mobile number verified' });
    patch({ step: 'plan', signupId: req.id });
  };

  return (
    <div className="signup-narrow">
      <form className="card form-card stack" onSubmit={verify} noValidate>
        <div>
          <h2 className="step-title">Verify it’s you</h2>
          <p className="muted small">Enter the code{needEmail ? 's' : ''} we sent. <span className="badge badge-yellow">Demo OTP: {DEMO_OTP}</span></p>
        </div>
        <Field
          label={<><Smartphone size={15} /> SMS sent to +91 {maskMobile(s.mobile)}</>}
          error={mErr}
        >
          <OtpInput value={mOtp} onChange={(v) => { setMOtp(v); setMErr(undefined); }} state={mErr ? 'error' : undefined} autoFocus label="Mobile OTP" />
        </Field>
        {needEmail && (
          <Field label={<>Email sent to {maskEmail(s.email)}</>} error={eErr}>
            <OtpInput value={eOtp} onChange={(v) => { setEOtp(v); setEErr(undefined); }} state={eErr ? 'error' : undefined} label="Email OTP" />
          </Field>
        )}
        <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
          <ResendTimer onResend={() => toast({ type: 'info', title: 'A new OTP has been sent', message: `Demo OTP: ${DEMO_OTP}` })} />
          <button type="button" className="link-btn small" onClick={() => patch({ step: 'details' })}>
            <Pencil size={13} /> Change number or email
          </button>
        </div>
        <SubmitButton loading={loading} className="btn-lg btn-block">{loading ? 'Verifying…' : 'Verify and continue'}</SubmitButton>
      </form>
    </div>
  );
}

function ExistingStep({ s, patch, onReset }: StepProps & { onReset: () => void }) {
  return (
    <div className="signup-narrow">
      <div className="card form-card stack center-stack">
        <span className="icon-tile lg"><Smartphone size={28} /></span>
        <h2 className="step-title">You already have a Mynages account</h2>
        <p className="muted">
          +91 {maskMobile(s.mobile)} is already registered. Open the Mynages app and sign in with this number — no new sign-up needed.
        </p>
        <StoreBadges />
        <div className="row-wrap" style={{ justifyContent: 'center' }}>
          <button className="btn btn-outline" onClick={() => patch({ step: 'details', mobile: '' })}>Use a different number</button>
          <button className="btn btn-ghost" onClick={onReset}>Start over</button>
        </div>
      </div>
    </div>
  );
}

function InviteStep({ s, patch }: StepProps) {
  const toast = useToast();
  const invite = getDb().invites.find((i) => i.code === s.inviteCode);
  const [loading, setLoading] = useState<'accept' | 'decline' | null>(null);
  if (!invite) {
    return (
      <div className="signup-narrow">
        <div className="card form-card stack">
          <p>The invite could not be found. You can create your own family workspace.</p>
          <button className="btn btn-primary" onClick={() => patch({ step: 'plan', inviteCode: undefined })}>Continue</button>
        </div>
      </div>
    );
  }

  const respond = async (accept: boolean) => {
    setLoading(accept ? 'accept' : 'decline');
    await sleep(900);
    setLoading(null);
    const now = new Date().toISOString();
    updateDb((d) => ({
      ...d,
      invites: d.invites.map((i) => (i.code === invite.code ? { ...i, status: accept ? 'joined' : 'declined' } : i)),
      signups: accept
        ? d.signups.map((r) => (r.id === s.signupId ? { ...r, status: 'completed', selectedPlanId: undefined, updatedAt: now } : r))
        : d.signups,
    }));
    if (accept) {
      toast({ type: 'success', title: `You’ve joined ${invite.familyName}` });
      patch({
        step: 'done',
        result: { mode: 'joined', workspace: invite.familyName, role: invite.role === 'adult' ? 'Adult member' : 'View-only member' },
      });
    } else {
      toast({ type: 'info', title: 'Invite declined', message: `${invite.inviterName} will see that you declined.` });
      patch({ step: 'plan', inviteCode: undefined });
    }
  };

  return (
    <div className="signup-narrow">
      <InviteCard invite={invite} />
      <div className="card form-card stack" style={{ marginTop: 16 }}>
        <p className="small muted">
          Joined members are covered by the Owner’s subscription — you won’t need to choose or pay for a plan. You’ll also get your own private space.
        </p>
        <div className="row-wrap">
          <SubmitButton type="button" loading={loading === 'accept'} disabled={!!loading} className="btn-lg" onClick={() => respond(true)}>
            <Check size={17} /> Accept and join
          </SubmitButton>
          <button className="btn btn-outline btn-lg" disabled={!!loading} onClick={() => respond(false)}>
            {loading === 'decline' ? 'Declining…' : <><X size={17} /> Decline, create my own</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export function InviteCard({ invite }: { invite: FamilyInvite }) {
  const initials = invite.inviterName.split(' ').map((w) => w[0]).join('').slice(0, 2);
  return (
    <div className="invite-card">
      <div className="invite-avatar">{initials}</div>
      <div className="stack-sm">
        <span className="badge badge-yellow"><UserPlus size={13} /> Family invite</span>
        <h2>{invite.inviterName} wants to add you to <span className="text-teal">{invite.familyName}</span></h2>
        <div className="invite-meta">
          <span><em>Invited as</em><b>{invite.inviteeName}</b></span>
          <span><em>Relation</em><b>{invite.relation}</b></span>
          <span><em>Role</em><b>{invite.role === 'adult' ? 'Adult member' : 'View-only member'}</b></span>
          <span><em>Expires</em><b>{fmtDate(invite.expiresAt)}</b></span>
        </div>
      </div>
    </div>
  );
}

function PlanStep({ s, patch }: StepProps) {
  return (
    <div className="stack">
      <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
        <div>
          <h2 className="step-title">Choose your plan</h2>
          <p className="muted small">Every plan starts with a 14-day free trial. Family members you invite never pay.</p>
        </div>
        <Segmented
          label="Billing cycle"
          value={s.cycle}
          onChange={(v) => patch({ cycle: v })}
          options={[{ value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly · save ~2 months' }]}
        />
      </div>
      <div className="grid grid-3" role="radiogroup" aria-label="Plan">
        {B2C_PLANS.map((p) => {
          const on = s.planId === p.id;
          return (
            <button key={p.id} type="button" role="radio" aria-checked={on} className="choice-card plan-choice" onClick={() => patch({ planId: p.id })}>
              <span className="tick"><Check size={14} /></span>
              {p.highlight && <span className="badge badge-navy" style={{ justifySelf: 'start' }}>Most popular</span>}
              <b className="pc-name">{p.name}</b>
              <span className="xs muted">{p.tagline}</span>
              <span className="pc-price">
                {inr(s.cycle === 'monthly' ? p.monthly! : p.yearly!)}
                <small>/ {s.cycle === 'monthly' ? 'mo' : 'yr'}</small>
              </span>
              {s.cycle === 'yearly' && <span className="xs text-teal">Save {inr(yearlySaving(p))} a year</span>}
              <ul className="check-list xs">
                <li>{p.entitlements.members} · {p.entitlements.assets} assets</li>
                <li>{p.entitlements.storage} storage</li>
                <li>{p.entitlements.reminders}</li>
                <li>{p.entitlements.modules}</li>
              </ul>
            </button>
          );
        })}
      </div>
      <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
        <Link to="/plans" target="_blank" className="link-btn small">Compare all plan details</Link>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => {
            updateDb((d) => ({
              ...d,
              signups: d.signups.map((r) => (r.id === s.signupId ? { ...r, selectedPlanId: s.planId, billingCycle: s.cycle, updatedAt: new Date().toISOString() } : r)),
            }));
            patch({ step: 'checkout' });
          }}
        >
          Continue with {planById(s.planId)?.name} <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}

function CheckoutStep({ s, patch }: StepProps) {
  const toast = useToast();
  const plan = planById(s.planId)!;
  const [mode, setMode] = useState<'trial' | 'paid'>('trial');
  const [method, setMethod] = useState<PayMethod>('upi');
  const [upi, setUpi] = useState('');
  const [card, setCard] = useState({ number: '', name: s.fullName, expiry: '', cvv: '' });
  const [bank, setBank] = useState('');
  const [gstin, setGstin] = useState('');
  const [gstName, setGstName] = useState('');
  const [wantGst, setWantGst] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(false);
  const [payError, setPayError] = useState<string>();

  const price = s.cycle === 'monthly' ? plan.monthly! : plan.yearly!;
  const gst = Math.round(price * GST_RATE);
  const total = price + gst;
  const trialEnd = useMemo(() => addDays(new Date(), plan.trialDays ?? 14), [plan.trialDays]);

  const validate = () => {
    const e: Record<string, string | undefined> = {};
    if (method === 'upi') {
      if (!upi.trim()) e.upi = 'UPI ID is required';
      else if (!rx.upi.test(upi.trim())) e.upi = 'Enter a valid UPI ID, e.g. name@okhdfcbank';
    }
    if (method === 'card') {
      const digits = card.number.replace(/\s/g, '');
      if (!/^\d{16}$/.test(digits)) e.number = 'Enter the 16-digit card number';
      if (!card.name.trim()) e.cardName = 'Name on card is required';
      const m = card.expiry.match(/^(\d{2})\/(\d{2})$/);
      if (!m) e.expiry = 'Use MM/YY';
      else {
        const mm = +m[1];
        const exp = new Date(2000 + +m[2], mm, 0);
        if (mm < 1 || mm > 12 || exp < new Date()) e.expiry = 'Card has expired or the date is invalid';
      }
      if (!/^\d{3}$/.test(card.cvv)) e.cvv = '3 digits';
    }
    if (method === 'netbanking' && !bank) e.bank = 'Choose your bank';
    if (wantGst) {
      if (!rx.gstin.test(gstin.trim().toUpperCase())) e.gstin = 'Enter a valid 15-character GSTIN';
      if (!gstName.trim()) e.gstName = 'Registered business name is required';
    }
    return e;
  };

  const pay = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setPayError(undefined);
    const e = validate();
    setErrors(e);
    if (Object.values(e).some(Boolean)) return;
    setLoading(true);
    await sleep(1800);
    if (method === 'upi' && upi.trim().toLowerCase() === 'fail@upi') {
      setLoading(false);
      setPayError(
        mode === 'trial'
          ? 'Your bank declined the UPI autopay mandate. Try again, or use another UPI ID or payment method.'
          : 'Payment failed — your bank declined the transaction. No money was taken. Try again or use another method.',
      );
      updateDb((d) => ({ ...d, signups: d.signups.map((r) => (r.id === s.signupId ? { ...r, updatedAt: new Date().toISOString() } : r)) }));
      return;
    }
    const now = new Date().toISOString();
    const workspace = `${firstName(s.fullName)}'s Family`;
    const invoiceNo = mode === 'paid' ? refNo('MYN-INV') : undefined;
    const tenant: Tenant = {
      id: uid('ten'),
      type: 'individual',
      name: workspace,
      ownerName: s.fullName.trim(),
      ownerMobile: s.mobile,
      ownerEmail: s.email.trim() || undefined,
      planId: plan.id,
      billingCycle: s.cycle,
      lifecycle: mode === 'trial' ? 'trialing' : 'active',
      trialEndsAt: mode === 'trial' ? trialEnd.toISOString() : undefined,
      invoiceNo,
      createdAt: now,
    };
    updateDb((d) => ({
      ...d,
      tenants: [tenant, ...d.tenants],
      signups: d.signups.map((r) => (r.id === s.signupId ? { ...r, status: 'completed', tenantId: tenant.id, updatedAt: now } : r)),
    }));
    setLoading(false);
    toast({ type: 'success', title: mode === 'trial' ? 'Your free trial has started' : 'Payment successful' });
    patch({
      step: 'done',
      result: { mode, workspace, planId: plan.id, cycle: s.cycle, trialEndsAt: tenant.trialEndsAt, invoiceNo, total },
    });
  };

  const methodTabs: { id: PayMethod; label: string; icon: typeof Wallet }[] = [
    { id: 'upi', label: mode === 'trial' ? 'UPI autopay' : 'UPI', icon: Wallet },
    { id: 'card', label: 'Card', icon: CreditCard },
    { id: 'netbanking', label: 'Net banking', icon: Building },
  ];

  return (
    <form className="signup-grid" onSubmit={pay} noValidate>
      <div className="card form-card stack">
        <div>
          <h2 className="step-title">Start your subscription</h2>
          <p className="muted small">A subscription is needed for every family workspace. Start free for {plan.trialDays} days, or pay now.</p>
        </div>
        <div className="grid grid-2" role="radiogroup" aria-label="Start option">
          <button type="button" role="radio" aria-checked={mode === 'trial'} className="choice-card" onClick={() => setMode('trial')}>
            <span className="tick"><Check size={14} /></span>
            <b><Gift size={16} style={{ display: 'inline', verticalAlign: '-3px' }} /> {plan.trialDays}-day free trial</b>
            <span className="xs muted">₹0 today. Set up autopay; first charge on {fmtDate(trialEnd.toISOString())}. Cancel before then and you won’t be charged.</span>
          </button>
          <button type="button" role="radio" aria-checked={mode === 'paid'} className="choice-card" onClick={() => setMode('paid')}>
            <span className="tick"><Check size={14} /></span>
            <b><CreditCard size={16} style={{ display: 'inline', verticalAlign: '-3px' }} /> Pay now</b>
            <span className="xs muted">Pay {inr(total)} today and skip the trial. GST invoice emailed to you.</span>
          </button>
        </div>

        <div>
          <span className="field-label" style={{ marginBottom: 8 }}>Payment method</span>
          <div className="pill-tabs">
            {methodTabs.map((m) => (
              <button key={m.id} type="button" className="pill-tab" aria-pressed={method === m.id} onClick={() => { setMethod(m.id); setErrors({}); setPayError(undefined); }}>
                <m.icon size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />{m.label}
              </button>
            ))}
          </div>
        </div>

        {method === 'upi' && (
          <Field label="UPI ID" required htmlFor="p-upi" error={errors.upi} hint={mode === 'trial' ? 'You’ll approve a UPI autopay mandate in your UPI app.' : 'You’ll approve the payment in your UPI app.'}>
            <Input id="p-upi" placeholder="name@okhdfcbank" value={upi} onChange={(e) => { setUpi(e.target.value); setErrors({}); }} invalid={!!errors.upi} />
          </Field>
        )}
        {method === 'card' && (
          <div className="form-grid">
            <Field label="Card number" required htmlFor="p-card" error={errors.number} className="full">
              <Input
                id="p-card"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="4111 1111 1111 1111"
                value={card.number}
                invalid={!!errors.number}
                onChange={(e) => {
                  const d = e.target.value.replace(/\D/g, '').slice(0, 16);
                  setCard({ ...card, number: d.replace(/(\d{4})(?=\d)/g, '$1 ') });
                }}
              />
            </Field>
            <Field label="Name on card" required htmlFor="p-cname" error={errors.cardName} className="full">
              <Input id="p-cname" autoComplete="cc-name" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} invalid={!!errors.cardName} />
            </Field>
            <Field label="Expiry" required htmlFor="p-exp" error={errors.expiry}>
              <Input
                id="p-exp"
                placeholder="MM/YY"
                autoComplete="cc-exp"
                value={card.expiry}
                invalid={!!errors.expiry}
                onChange={(e) => {
                  const d = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setCard({ ...card, expiry: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d });
                }}
              />
            </Field>
            <Field label="CVV" required htmlFor="p-cvv" error={errors.cvv}>
              <Input id="p-cvv" type="password" inputMode="numeric" maxLength={3} autoComplete="cc-csc" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '') })} invalid={!!errors.cvv} />
            </Field>
          </div>
        )}
        {method === 'netbanking' && (
          <Field label="Bank" required htmlFor="p-bank" error={errors.bank}>
            <Select id="p-bank" value={bank} onChange={(e) => { setBank(e.target.value); setErrors({}); }} invalid={!!errors.bank}>
              <option value="">Select your bank</option>
              {BANKS.map((b) => <option key={b}>{b}</option>)}
            </Select>
          </Field>
        )}

        <Checkbox checked={wantGst} onChange={setWantGst}>Add GSTIN to my invoice</Checkbox>
        {wantGst && (
          <div className="form-grid">
            <Field label="GSTIN" required htmlFor="p-gstin" error={errors.gstin}>
              <Input id="p-gstin" placeholder="27ABCDE1234F1Z5" maxLength={15} value={gstin} onChange={(e) => setGstin(e.target.value.toUpperCase())} invalid={!!errors.gstin} />
            </Field>
            <Field label="Registered name" required htmlFor="p-gname" error={errors.gstName}>
              <Input id="p-gname" value={gstName} onChange={(e) => setGstName(e.target.value)} invalid={!!errors.gstName} />
            </Field>
          </div>
        )}

        {payError && (
          <div className="alert alert-danger" role="alert">
            <AlertCircle size={18} />
            <span>{payError}</span>
          </div>
        )}

        <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
          <button type="button" className="btn btn-ghost" onClick={() => patch({ step: 'plan' })} disabled={loading}>
            <ArrowLeft size={16} /> Change plan
          </button>
          <SubmitButton loading={loading} className="btn-lg">
            {loading ? 'Processing…' : mode === 'trial' ? 'Start free trial' : `Pay ${inr(total)}`}
          </SubmitButton>
        </div>
      </div>

      <aside className="signup-aside">
        <div className="card aside-card order">
          <span className="eyebrow">Order summary</span>
          <div className="order-row"><span>{plan.name} · {s.cycle}</span><b>{inr(price)}</b></div>
          <div className="order-row muted"><span>GST (18%)</span><span>{inr(gst)}</span></div>
          <div className="order-row total"><span>Total</span><b>{inr(total)}</b></div>
          {mode === 'trial' ? (
            <div className="order-today">
              <span>Due today</span>
              <b>₹0</b>
              <span className="xs">Then {inr(total)} on {fmtDate(trialEnd.toISOString())}</span>
            </div>
          ) : (
            <div className="order-today"><span>Due today</span><b>{inr(total)}</b></div>
          )}
          <ul className="check-list xs" style={{ marginTop: 12 }}>
            <li>{plan.entitlements.members} · {plan.entitlements.assets} assets</li>
            <li>{plan.entitlements.storage} storage</li>
            <li>Upgrade anytime; downgrades never delete data</li>
          </ul>
        </div>
        <div className="alert alert-demo xs">
          Prototype payment. Use UPI ID <b>fail@upi</b> to see a failed payment.
        </div>
        <div className="aside-secure"><ShieldCheck size={14} /> Payments processed by a PCI-DSS compliant gateway</div>
      </aside>
    </form>
  );
}

function DoneStep({ s, onReset }: { s: State; onReset: () => void }) {
  const r = s.result!;
  const plan = planById(r.planId);
  return (
    <div className="signup-narrow">
      <div className="card form-card stack center-stack done-card">
        <span className="icon-tile lg" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
          {r.mode === 'joined' ? <Users size={30} /> : <PartyPopper size={30} />}
        </span>
        <h2 className="step-title">
          {r.mode === 'joined' ? `Welcome to ${r.workspace}, ${firstName(s.fullName)}!` : `Welcome to Mynages, ${firstName(s.fullName)}!`}
        </h2>
        <p className="muted">
          {r.mode === 'joined'
            ? 'You can now see everything your family shares, get their reminders and keep your own private space.'
            : 'Your family workspace is ready, with categories, reminder presets and document types set up for India.'}
        </p>
        <div className="done-summary">
          <span><em>Workspace</em><b>{r.workspace}</b></span>
          {r.mode === 'joined' ? (
            <span><em>Your role</em><b>{r.role}</b></span>
          ) : (
            <span><em>Plan</em><b>{plan?.name} · {r.cycle}</b></span>
          )}
          {r.mode === 'trial' && <span><em>Trial ends</em><b>{fmtDate(r.trialEndsAt)}</b></span>}
          {r.mode === 'paid' && <span><em>Invoice</em><b>{r.invoiceNo}</b></span>}
          <span><em>Sign in with</em><b>+91 {maskMobile(s.mobile)}</b></span>
        </div>
        <div className="next-steps">
          <h4>Next steps</h4>
          <ol>
            <li><b>Get the Mynages app</b> on your phone.</li>
            <li><b>Sign in with your mobile number</b> — OTP, no password.</li>
            {r.mode === 'joined' ? (
              <li><b>Explore your family’s assets</b> and turn on the reminders you want.</li>
            ) : (
              <>
                <li><b>Add your home</b> and invite your family by WhatsApp.</li>
                <li><b>Add your first asset</b> — it takes under a minute.</li>
              </>
            )}
          </ol>
        </div>
        <StoreBadges />
        {r.mode === 'paid' && (
          <p className="xs muted"><CheckCircle2 size={12} style={{ display: 'inline', verticalAlign: '-2px' }} /> GST invoice {r.invoiceNo} {s.email ? `sent to ${maskEmail(s.email)}` : 'available in the app under Plan and billing'}.</p>
        )}
        <div className="row-wrap" style={{ justifyContent: 'center' }}>
          <Link to="/" className="btn btn-outline" onClick={onReset}>Back to home</Link>
          <button className="btn btn-ghost" onClick={onReset}>Sign up another account</button>
        </div>
      </div>
    </div>
  );
}
