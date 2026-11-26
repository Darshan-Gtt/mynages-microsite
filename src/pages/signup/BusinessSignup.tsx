import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Check,
  CheckCircle2,
  Copy,
  Globe,
  Loader2,
  Lock,
  Mail,
  Pencil,
  Rocket,
  Smartphone,
} from 'lucide-react';
import { Captcha, Checkbox, Field, Input, MobileInput, OtpInput, ResendTimer, Select, SubmitButton } from '../../components/ui/Form';
import { Stepper } from '../../components/ui/Misc';
import { useToast } from '../../components/ui/Toast';
import { getDb, updateDb } from '../../lib/store';
import { usePersistentState } from '../../lib/usePersistentState';
import { addDays, cx, DEMO_OTP, maskEmail, maskMobile, sleep, slugify, uid } from '../../lib/utils';
import { hasErrors, rx, validEmail, validMobile, validName, type Errors } from '../../lib/validation';
import { COMPANY_SIZES, INDUSTRIES, RESERVED_SLUGS } from '../../data/content';
import type { SignupRequest, Tenant } from '../../lib/types';

type Step = 'details' | 'otp' | 'taken' | 'provisioning' | 'done';

interface State {
  step: Step;
  companyName: string;
  slug: string;
  slugTouched: boolean;
  industry: string;
  size: string;
  city: string;
  gstin: string;
  contactName: string;
  designation: string;
  email: string;
  mobile: string;
  consent: boolean;
  human: boolean;
  signupId?: string;
  tenantId?: string;
}

const initial: State = {
  step: 'details', companyName: '', slug: '', slugTouched: false, industry: '', size: '', city: '', gstin: '',
  contactName: '', designation: '', email: '', mobile: '', consent: false, human: false,
};

type SlugState = 'idle' | 'checking' | 'available' | 'taken' | 'reserved' | 'invalid';

function checkSlug(slug: string): SlugState {
  if (!slug) return 'idle';
  if (!rx.slug.test(slug)) return 'invalid';
  if (RESERVED_SLUGS.includes(slug)) return 'reserved';
  if (getDb().tenants.some((t) => t.slug === slug)) return 'taken';
  return 'available';
}

export function BusinessSignupPage() {
  const [s, setS, reset] = usePersistentState<State>('mynages.signup.business', initial);
  const patch = (p: Partial<State>) => setS((cur) => ({ ...cur, ...p }));
  const idx = { details: 0, otp: 1, taken: 1, provisioning: 2, done: 3 }[s.step];
  return (
    <section className="signup-wrap">
      <div className="container signup-container">
        <div className="signup-top">
          <Link to="/signup" className="link-btn small"><ArrowLeft size={15} /> Account type</Link>
          <span className="badge badge-navy"><Briefcase size={13} /> Business</span>
        </div>
        <Stepper steps={['Company details', 'Verify', 'Set up', 'Ready']} current={idx} />
        {s.step === 'details' && <DetailsStep s={s} patch={patch} />}
        {s.step === 'otp' && <OtpStep s={s} patch={patch} />}
        {s.step === 'taken' && <TakenStep s={s} patch={patch} />}
        {s.step === 'provisioning' && <ProvisioningStep s={s} patch={patch} />}
        {s.step === 'done' && <DoneStep s={s} onReset={reset} />}
      </div>
    </section>
  );
}

type P = { s: State; patch: (p: Partial<State>) => void };

function DetailsStep({ s, patch }: P) {
  const toast = useToast();
  const [errors, setErrors] = useState<Errors<State>>({});
  const [slugState, setSlugState] = useState<SlugState>(s.slug ? 'checking' : 'idle');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!s.slug) {
      setSlugState('idle');
      return;
    }
    setSlugState('checking');
    const t = setTimeout(() => setSlugState(checkSlug(s.slug)), 500);
    return () => clearTimeout(t);
  }, [s.slug]);

  const set = <K extends keyof State>(k: K, v: State[K]) => {
    const p: Partial<State> = { [k]: v } as Partial<State>;
    if (k === 'companyName' && !s.slugTouched) p.slug = slugify(v as string);
    patch(p);
    setErrors((e) => ({ ...e, [k]: undefined, ...(k === 'companyName' ? { slug: undefined } : {}) }));
  };

  const suggest = () => {
    const base = s.slug || slugify(s.companyName) || 'company';
    for (const suf of ['-in', '-india', '-group', '-hq', '1', '2']) {
      const c = `${base}${suf}`.slice(0, 30);
      if (checkSlug(c) === 'available') return c;
    }
    return `${base}-${Math.floor(Math.random() * 90 + 10)}`;
  };

  const slugMsg: Record<SlugState, { text: string; tone: 'ok' | 'err' | 'hint' } | null> = {
    idle: { text: 'Lowercase letters, numbers and hyphens', tone: 'hint' },
    checking: { text: 'Checking availability…', tone: 'hint' },
    available: { text: `${s.slug}.mynages.com is available`, tone: 'ok' },
    taken: { text: `${s.slug}.mynages.com is already taken`, tone: 'err' },
    reserved: { text: 'This address is reserved', tone: 'err' },
    invalid: { text: '3–30 characters: lowercase letters, numbers, hyphens; must start and end with a letter or number', tone: 'err' },
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const st = checkSlug(s.slug);
    const errs: Errors<State> = {
      companyName: s.companyName.trim().length < 2 ? 'Company name is required' : undefined,
      slug: !s.slug ? 'Choose a web address' : st !== 'available' ? slugMsg[st]!.text : undefined,
      industry: s.industry ? undefined : 'Select your industry',
      size: s.size ? undefined : 'Select company size',
      city: s.city.trim() ? undefined : 'City is required',
      gstin: s.gstin && !rx.gstin.test(s.gstin) ? 'Enter a valid 15-character GSTIN' : undefined,
      contactName: validName(s.contactName, 'Your name'),
      designation: s.designation.trim() ? undefined : 'Designation is required',
      email: validEmail(s.email, 'Work email'),
      mobile: validMobile(s.mobile),
      consent: s.consent ? undefined : 'You need to accept the Terms of Use and Privacy Policy',
      human: s.human ? undefined : 'Please complete the security check',
    };
    setErrors(errs);
    if (hasErrors(errs)) {
      toast({ type: 'error', title: 'Please fix the highlighted fields' });
      return;
    }
    setLoading(true);
    await sleep(900);
    setLoading(false);
    patch({ step: 'otp', human: false });
    toast({ type: 'info', title: 'OTPs sent to your email and mobile', message: `Demo OTP: ${DEMO_OTP}` });
  };

  const msg = errors.slug ? { text: errors.slug, tone: 'err' as const } : slugMsg[slugState];

  return (
    <div className="signup-grid">
      <form className="card form-card stack" onSubmit={submit} noValidate>
        <div>
          <h2 className="step-title">Set up your company</h2>
          <p className="muted small">You’ll be the Owner of your company’s Mynages workspace.</p>
        </div>

        <h4 className="form-section">Company</h4>
        <div className="form-grid">
          <Field label="Company name" required htmlFor="b-company" error={errors.companyName} className="full">
            <Input id="b-company" autoComplete="organization" placeholder="e.g. Sahyog Engineering Pvt Ltd" value={s.companyName} onChange={(e) => set('companyName', e.target.value)} invalid={!!errors.companyName} />
          </Field>
          <div className="field full">
            <label className="field-label" htmlFor="b-slug">Web address <span className="req">*</span></label>
            <div className="input-group">
              <span className="addon"><Globe size={15} /></span>
              <Input
                id="b-slug"
                value={s.slug}
                invalid={msg?.tone === 'err'}
                onChange={(e) => {
                  patch({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 30), slugTouched: true });
                  setErrors((x) => ({ ...x, slug: undefined }));
                }}
                placeholder="yourcompany"
              />
              <span className="addon">.mynages.com</span>
            </div>
            {msg && (
              <span className={msg.tone === 'ok' ? 'field-ok' : msg.tone === 'err' ? 'field-error' : 'field-hint'}>
                {slugState === 'checking' && <Loader2 size={13} className="spinner" />}
                {msg.tone === 'ok' && <CheckCircle2 size={13} />}
                {msg.tone === 'err' && <AlertCircle size={13} />}
                {msg.text}
                {(slugState === 'taken' || slugState === 'reserved') && (
                  <button type="button" className="link-btn xs" style={{ marginLeft: 6 }} onClick={() => patch({ slug: suggest(), slugTouched: true })}>
                    Suggest one
                  </button>
                )}
              </span>
            )}
          </div>
          <Field label="Industry" required htmlFor="b-industry" error={errors.industry} hint="We pre-select modules and categories for your industry.">
            <Select id="b-industry" value={s.industry} onChange={(e) => set('industry', e.target.value)} invalid={!!errors.industry}>
              <option value="">Select industry</option>
              {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
            </Select>
          </Field>
          <Field label="Company size" required htmlFor="b-size" error={errors.size}>
            <Select id="b-size" value={s.size} onChange={(e) => set('size', e.target.value)} invalid={!!errors.size}>
              <option value="">Number of employees</option>
              {COMPANY_SIZES.map((i) => <option key={i}>{i}</option>)}
            </Select>
          </Field>
          <Field label="City" required htmlFor="b-city" error={errors.city}>
            <Input id="b-city" autoComplete="address-level2" placeholder="e.g. Pune" value={s.city} onChange={(e) => set('city', e.target.value)} invalid={!!errors.city} />
          </Field>
          <Field label="GSTIN" optional htmlFor="b-gstin" error={errors.gstin}>
            <Input id="b-gstin" maxLength={15} placeholder="27ABCDE1234F1Z5" value={s.gstin} onChange={(e) => set('gstin', e.target.value.toUpperCase().replace(/\s/g, ''))} invalid={!!errors.gstin} />
          </Field>
        </div>

        <h4 className="form-section">You (Owner)</h4>
        <div className="form-grid">
          <Field label="Your name" required htmlFor="b-name" error={errors.contactName}>
            <Input id="b-name" autoComplete="name" value={s.contactName} onChange={(e) => set('contactName', e.target.value)} invalid={!!errors.contactName} />
          </Field>
          <Field label="Designation" required htmlFor="b-desig" error={errors.designation}>
            <Input id="b-desig" autoComplete="organization-title" placeholder="e.g. Admin Manager" value={s.designation} onChange={(e) => set('designation', e.target.value)} invalid={!!errors.designation} />
          </Field>
          <Field label="Work email" required htmlFor="b-email" error={errors.email}>
            <Input id="b-email" type="email" autoComplete="email" placeholder="you@company.com" value={s.email} onChange={(e) => set('email', e.target.value)} invalid={!!errors.email} />
          </Field>
          <Field label="Mobile number" required htmlFor="b-mobile" error={errors.mobile}>
            <MobileInput id="b-mobile" value={s.mobile} onChange={(v) => set('mobile', v)} invalid={!!errors.mobile} />
          </Field>
        </div>

        <Field error={errors.consent}>
          <Checkbox id="b-consent" checked={s.consent} onChange={(v) => set('consent', v)}>
            I agree to the <Link to="/terms" target="_blank">Terms of Use</Link> and <Link to="/privacy" target="_blank">Privacy Policy</Link> on behalf of my company.
          </Checkbox>
        </Field>
        <Captcha checked={s.human} onChange={(v) => set('human', v)} error={errors.human} />
        <SubmitButton loading={loading} className="btn-lg btn-block">
          {loading ? 'Sending OTPs…' : <>Verify email &amp; mobile <ArrowRight size={17} /></>}
        </SubmitButton>
      </form>

      <aside className="signup-aside">
        <div className="card aside-card">
          <span className="eyebrow">Your company gets</span>
          <ul className="check-list small" style={{ marginTop: 12 }}>
            <li>Its own web address and dedicated database</li>
            <li>Your logo and colours across the app</li>
            <li>Modules pre-selected for your industry</li>
            <li>Roles for Admin, Finance, Auditors and employees</li>
          </ul>
        </div>
        <div className="card aside-card">
          <span className="eyebrow">About plans</span>
          <p className="small muted" style={{ marginTop: 8 }}>
            Business plans are agreed with our team and assigned by contract — no card needed to sign up.
          </p>
          <Link to="/plans?for=business" className="link-btn small" target="_blank">See business plans</Link>
        </div>
        <div className="aside-secure"><Lock size={14} /> Both email and mobile are verified by OTP</div>
      </aside>
    </div>
  );
}

function OtpStep({ s, patch }: P) {
  const toast = useToast();
  const [eOtp, setEOtp] = useState('');
  const [mOtp, setMOtp] = useState('');
  const [eErr, setEErr] = useState<string>();
  const [mErr, setMErr] = useState<string>();
  const [loading, setLoading] = useState(false);

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    const ee = eOtp.length < 6 ? 'Enter the 6-digit code' : eOtp !== DEMO_OTP ? 'That code is incorrect' : undefined;
    const me = mOtp.length < 6 ? 'Enter the 6-digit code' : mOtp !== DEMO_OTP ? 'That code is incorrect' : undefined;
    setEErr(ee);
    setMErr(me);
    if (ee || me) return;
    setLoading(true);
    await sleep(800);
    setLoading(false);

    const now = new Date().toISOString();
    const email = s.email.trim().toLowerCase();
    const req: SignupRequest = {
      id: uid('sr'),
      accountType: 'business',
      formData: {
        companyName: s.companyName.trim(), slug: s.slug, industry: s.industry, companySize: s.size, city: s.city.trim(),
        ...(s.gstin ? { gstin: s.gstin } : {}), contactName: s.contactName.trim(), designation: s.designation.trim(),
      },
      email,
      mobileCountryCode: '+91',
      mobileNumber: s.mobile,
      emailVerifiedAt: now,
      mobileVerifiedAt: now,
      status: 'verified',
      createdAt: now,
      updatedAt: now,
      expiresAt: addDays(new Date(), 1).toISOString(),
    };
    updateDb((d) => ({ ...d, signups: [req, ...d.signups] }));

    // A company Owner email can only own one company (tenant_registrants rule).
    if (getDb().tenants.some((t) => t.type === 'business' && t.ownerEmail?.toLowerCase() === email)) {
      updateDb((d) => ({ ...d, signups: d.signups.map((r) => (r.id === req.id ? { ...r, status: 'failed' } : r)) }));
      patch({ step: 'taken', signupId: req.id });
      return;
    }
    // Re-check the address in case it was taken meanwhile.
    if (checkSlug(s.slug) !== 'available') {
      toast({ type: 'error', title: `${s.slug}.mynages.com was just taken`, message: 'Choose another web address.' });
      patch({ step: 'details', signupId: req.id });
      return;
    }
    patch({ step: 'provisioning', signupId: req.id });
  };

  return (
    <div className="signup-narrow">
      <form className="card form-card stack" onSubmit={verify} noValidate>
        <div>
          <h2 className="step-title">Verify your email and mobile</h2>
          <p className="muted small">Both are needed for a business account. <span className="badge badge-yellow">Demo OTP: {DEMO_OTP}</span></p>
        </div>
        <Field label={<><Mail size={15} /> Email sent to {maskEmail(s.email)}</>} error={eErr}>
          <OtpInput value={eOtp} onChange={(v) => { setEOtp(v); setEErr(undefined); }} state={eErr ? 'error' : eOtp === DEMO_OTP ? 'ok' : undefined} autoFocus label="Email OTP" />
        </Field>
        <Field label={<><Smartphone size={15} /> SMS sent to +91 {maskMobile(s.mobile)}</>} error={mErr}>
          <OtpInput value={mOtp} onChange={(v) => { setMOtp(v); setMErr(undefined); }} state={mErr ? 'error' : mOtp === DEMO_OTP ? 'ok' : undefined} label="Mobile OTP" />
        </Field>
        <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
          <ResendTimer onResend={() => toast({ type: 'info', title: 'New OTPs sent', message: `Demo OTP: ${DEMO_OTP}` })} />
          <button type="button" className="link-btn small" onClick={() => patch({ step: 'details' })}>
            <Pencil size={13} /> Edit details
          </button>
        </div>
        <SubmitButton loading={loading} className="btn-lg btn-block">{loading ? 'Verifying…' : 'Verify and create workspace'}</SubmitButton>
      </form>
    </div>
  );
}

function TakenStep({ s, patch }: P) {
  const tenant = getDb().tenants.find((t) => t.ownerEmail?.toLowerCase() === s.email.trim().toLowerCase());
  return (
    <div className="signup-narrow">
      <div className="card form-card stack center-stack">
        <span className="icon-tile lg yellow"><Briefcase size={28} /></span>
        <h2 className="step-title">This email already owns a company workspace</h2>
        <p className="muted">
          {maskEmail(s.email)} is the Owner of an existing Mynages company{tenant?.slug ? <> at <b>{tenant.slug}.mynages.com</b></> : ''}.
          One Owner email can register one company. Sign in at your company address, or use a different work email.
        </p>
        <div className="row-wrap" style={{ justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => patch({ step: 'details', email: '' })}>Use a different email</button>
          <Link to="/contact?type=support&as=business" className="btn btn-outline">Contact support</Link>
        </div>
      </div>
    </div>
  );
}

const PROVISION_STEPS = (s: State) => [
  'Details verified',
  'Creating your company database',
  `Applying the ${s.industry} template`,
  `Reserving ${s.slug}.mynages.com`,
  'Securing your workspace',
];

function ProvisioningStep({ s, patch }: P) {
  const [done, setDone] = useState(0);
  const steps = PROVISION_STEPS(s);
  useEffect(() => {
    let live = true;
    updateDb((d) => ({ ...d, signups: d.signups.map((r) => (r.id === s.signupId ? { ...r, status: 'provisioning' } : r)) }));
    (async () => {
      for (let i = 1; i <= steps.length; i++) {
        await sleep(i === 1 ? 400 : 850);
        if (!live) return;
        setDone(i);
      }
      await sleep(400);
      if (!live) return;
      const now = new Date().toISOString();
      const tenant: Tenant = {
        id: uid('ten'),
        type: 'business',
        name: s.companyName.trim(),
        slug: s.slug,
        ownerName: s.contactName.trim(),
        ownerEmail: s.email.trim().toLowerCase(),
        ownerMobile: s.mobile,
        industry: s.industry,
        city: s.city.trim(),
        lifecycle: 'active',
        createdAt: now,
      };
      updateDb((d) => ({
        ...d,
        tenants: d.tenants.some((t) => t.slug === s.slug) ? d.tenants : [tenant, ...d.tenants],
        signups: d.signups.map((r) => (r.id === s.signupId ? { ...r, status: 'completed', tenantId: tenant.id, updatedAt: now } : r)),
      }));
      patch({ step: 'done', tenantId: tenant.id });
    })();
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="signup-narrow">
      <div className="card form-card stack">
        <div className="row" style={{ gap: 14 }}>
          <span className="icon-tile lg navy"><Rocket size={26} /></span>
          <div>
            <h2 className="step-title">Setting up {s.companyName}</h2>
            <p className="muted small">This usually takes less than a minute.</p>
          </div>
        </div>
        <ul className="provision">
          {steps.map((t, i) => (
            <li key={t} className={cx(i < done && 'done', i === done && 'active')}>
              <span className="pv-dot">
                {i < done ? <Check size={14} /> : i === done ? <Loader2 size={14} className="spinner" /> : null}
              </span>
              {t}
            </li>
          ))}
        </ul>
        <div className="progress"><span style={{ width: `${(done / steps.length) * 100}%` }} /></div>
      </div>
    </div>
  );
}

function DoneStep({ s, onReset }: { s: State; onReset: () => void }) {
  const toast = useToast();
  const url = `https://${s.slug}.mynages.com`;
  return (
    <div className="signup-narrow">
      <div className="card form-card stack center-stack done-card">
        <span className="icon-tile lg" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}><CheckCircle2 size={30} /></span>
        <h2 className="step-title">{s.companyName} is ready</h2>
        <p className="muted">We’ve emailed the sign-in link to {maskEmail(s.email)}.</p>
        <div className="url-box">
          <Globe size={18} />
          <b>{s.slug}.mynages.com</b>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => {
              navigator.clipboard?.writeText(url).catch(() => {});
              toast({ type: 'success', title: 'Workspace address copied' });
            }}
          >
            <Copy size={14} /> Copy
          </button>
        </div>
        <div className="done-summary">
          <span><em>Owner</em><b>{s.contactName}</b></span>
          <span><em>Industry</em><b>{s.industry}</b></span>
          <span><em>Plan</em><b>Assigned by our team</b></span>
        </div>
        <div className="next-steps">
          <h4>When you first sign in</h4>
          <ol>
            <li><b>Pick your modules</b> — pre-ticked for {s.industry}.</li>
            <li><b>Set up your first branch</b> and locations.</li>
            <li><b>Add your logo and colour</b> so the app looks like yours.</li>
            <li><b>Invite your team</b> and assign roles.</li>
          </ol>
        </div>
        <div className="alert alert-info small" style={{ textAlign: 'left' }}>
          <Briefcase size={16} />
          <span>Our team will contact you within one working day to agree your plan. Until then you can set up and explore your workspace.</span>
        </div>
        <div className="row-wrap" style={{ justifyContent: 'center' }}>
          <Link to="/contact?type=sales&as=business" className="btn btn-primary">Talk to sales now</Link>
          <Link to="/" className="btn btn-outline" onClick={onReset}>Back to home</Link>
        </div>
      </div>
    </div>
  );
}
