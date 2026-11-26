import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Download, Edit3, FileSearch, HelpCircle, SearchX, Trash2 } from 'lucide-react';
import { Captcha, Checkbox, Field, Input, OtpInput, ResendTimer, SubmitButton, Textarea } from '../components/ui/Form';
import { Empty, Segmented, Stepper } from '../components/ui/Misc';
import { StatusBadge } from '../components/DemoPanel';
import { useToast } from '../components/ui/Toast';
import { getDb, updateDb } from '../lib/store';
import { addDays, cx, DEMO_OTP, fmtDate, fmtDateTime, refNo, sleep, uid } from '../lib/utils';
import { hasErrors, rx, validName, type Errors } from '../lib/validation';
import type { PrivacyRequest, PrivacyRequestType } from '../lib/types';

const TYPES: { id: PrivacyRequestType; label: string; desc: string; icon: typeof Download }[] = [
  { id: 'export', label: 'Export my data', desc: 'Get a copy of the data held about you', icon: Download },
  { id: 'correction', label: 'Correct my data', desc: 'Fix something that is wrong', icon: Edit3 },
  { id: 'delete', label: 'Delete my data', desc: 'Close your account and erase your data', icon: Trash2 },
  { id: 'other', label: 'Something else', desc: 'Any other privacy question', icon: HelpCircle },
];

// Placeholder response window for the demo; the legal due date is to be confirmed (PRD §16.2).
const RESPONSE_DAYS = 30;

interface Form {
  name: string;
  contact: string;
  type: PrivacyRequestType;
  details: string;
  confirm: boolean;
  human: boolean;
}

export function PrivacyRequestPage() {
  const [tab, setTab] = useState<'new' | 'track'>('new');
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <span className="eyebrow">Privacy request</span>
            <h1>Your data, your choice</h1>
            <p className="lead">Ask for a copy of your data, a correction or deletion. We verify it’s you by OTP before acting on any request.</p>
            <Segmented label="Privacy request" value={tab} onChange={setTab} options={[{ value: 'new', label: 'New request' }, { value: 'track', label: 'Track a request' }]} />
          </div>
        </div>
      </section>
      <section className="section-sm">
        <div className="container signup-narrow" style={{ maxWidth: 720 }}>
          {tab === 'new' ? <NewRequest /> : <TrackRequest />}
        </div>
      </section>
    </>
  );
}

function NewRequest() {
  const toast = useToast();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [f, setF] = useState<Form>({ name: '', contact: '', type: 'export', details: '', confirm: false, human: false });
  const [errors, setErrors] = useState<Errors<Form>>({});
  const [otp, setOtp] = useState('');
  const [otpErr, setOtpErr] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<PrivacyRequest | null>(null);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setF({ ...f, [k]: v });
    setErrors({ ...errors, [k]: undefined });
  };
  const isEmail = f.contact.includes('@');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const c = f.contact.trim();
    const errs: Errors<Form> = {
      name: validName(f.name),
      contact: !c ? 'Email or mobile is required' : c.includes('@') ? (rx.email.test(c) ? undefined : 'Enter a valid email') : rx.indianMobile.test(c) ? undefined : 'Enter a valid email or 10-digit mobile',
      details: f.type !== 'export' && f.details.trim().length < 10 ? 'Please describe your request (at least 10 characters)' : undefined,
      confirm: f.confirm ? undefined : 'Please confirm',
      human: f.human ? undefined : 'Please complete the security check',
    };
    setErrors(errs);
    if (hasErrors(errs)) return;
    setLoading(true);
    await sleep(800);
    setLoading(false);
    setStep(1);
    toast({ type: 'info', title: `OTP sent to ${isEmail ? 'your email' : 'your mobile'}`, message: `Demo OTP: ${DEMO_OTP}` });
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== DEMO_OTP) {
      setOtpErr(otp.length < 6 ? 'Enter the 6-digit code' : 'That code is incorrect');
      return;
    }
    setLoading(true);
    await sleep(900);
    const now = new Date();
    const req: PrivacyRequest = {
      id: uid('pr'),
      ref: refNo('PR'),
      requesterName: f.name.trim(),
      requesterContact: f.contact.trim(),
      requestType: f.type,
      details: f.details.trim(),
      status: 'verified',
      verifiedAt: now.toISOString(),
      dueBy: addDays(now, RESPONSE_DAYS).toISOString().slice(0, 10),
      createdAt: now.toISOString(),
    };
    updateDb((d) => ({ ...d, privacyRequests: [req, ...d.privacyRequests] }));
    setLoading(false);
    setCreated(req);
    setStep(2);
    toast({ type: 'success', title: 'Privacy request submitted', message: req.ref });
  };

  return (
    <div className="card form-card">
      <Stepper steps={['Request', 'Verify', 'Submitted']} current={step} />
      {step === 0 && (
        <form className="stack" onSubmit={submit} noValidate>
          <div className="grid grid-2" role="radiogroup" aria-label="Request type">
            {TYPES.map((t) => (
              <button key={t.id} type="button" role="radio" aria-checked={f.type === t.id} className="choice-card" onClick={() => set('type', t.id)}>
                <span className="tick" />
                <b className="row" style={{ gap: 8 }}><t.icon size={16} /> {t.label}</b>
                <span className="xs muted">{t.desc}</span>
              </button>
            ))}
          </div>
          {f.type === 'delete' && (
            <div className="alert alert-warning small">
              <Trash2 size={16} />
              <span>
                Deleting your data closes your account. If you own a family workspace, transfer ownership first or every member loses access to
                shared items. We’ll confirm with you before anything is erased.
              </span>
            </div>
          )}
          <div className="form-grid">
            <Field label="Full name" required htmlFor="pr-name" error={errors.name}>
              <Input id="pr-name" value={f.name} onChange={(e) => set('name', e.target.value)} invalid={!!errors.name} />
            </Field>
            <Field label="Email or mobile on your account" required htmlFor="pr-contact" error={errors.contact}>
              <Input id="pr-contact" placeholder="you@example.com or 98765 43210" value={f.contact} onChange={(e) => set('contact', e.target.value)} invalid={!!errors.contact} />
            </Field>
            <Field label="Details" optional={f.type === 'export'} required={f.type !== 'export'} htmlFor="pr-details" error={errors.details} className="full">
              <Textarea id="pr-details" value={f.details} onChange={(e) => set('details', e.target.value)} invalid={!!errors.details} placeholder="Tell us what you need" />
            </Field>
          </div>
          <Field error={errors.confirm}>
            <Checkbox checked={f.confirm} onChange={(v) => set('confirm', v)}>I confirm I am the account holder, or authorised to act for them.</Checkbox>
          </Field>
          <Captcha checked={f.human} onChange={(v) => set('human', v)} error={errors.human} />
          <SubmitButton loading={loading}>Continue to verification</SubmitButton>
        </form>
      )}
      {step === 1 && (
        <form className="stack" onSubmit={verify} noValidate>
          <h3>Verify {isEmail ? 'your email' : 'your mobile'}</h3>
          <p className="small muted">Code sent to {f.contact}. <span className="badge badge-yellow">Demo OTP: {DEMO_OTP}</span></p>
          <Field error={otpErr}>
            <OtpInput value={otp} onChange={(v) => { setOtp(v); setOtpErr(undefined); }} state={otpErr ? 'error' : undefined} autoFocus />
          </Field>
          <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
            <ResendTimer onResend={() => toast({ type: 'info', title: 'New OTP sent', message: `Demo OTP: ${DEMO_OTP}` })} />
            <button type="button" className="link-btn small" onClick={() => setStep(0)}>Edit request</button>
          </div>
          <SubmitButton loading={loading}>Verify and submit</SubmitButton>
        </form>
      )}
      {step === 2 && created && (
        <div className="success-state">
          <span className="icon-tile lg" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}><CheckCircle2 size={30} /></span>
          <h2>Request received</h2>
          <p className="muted">We’ll respond by <b>{fmtDate(created.dueBy)}</b>. Keep this reference to track your request.</p>
          <div className="ref-box"><span className="xs muted">Reference</span><b>{created.ref}</b></div>
          <button
            className="btn btn-outline"
            onClick={() => {
              setStep(0);
              setCreated(null);
              setOtp('');
              setF({ name: '', contact: '', type: 'export', details: '', confirm: false, human: false });
            }}
          >
            Make another request
          </button>
        </div>
      )}
    </div>
  );
}

const FLOW: PrivacyRequest['status'][] = ['received', 'verified', 'in_progress', 'completed'];

function TrackRequest() {
  const [ref, setRef] = useState('');
  const [result, setResult] = useState<PrivacyRequest | null | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ref.trim()) return;
    setLoading(true);
    await sleep(600);
    setLoading(false);
    setResult(getDb().privacyRequests.find((p) => p.ref.toUpperCase() === ref.trim().toUpperCase()) ?? null);
  };

  const idx = result ? (result.status === 'rejected' ? -1 : FLOW.indexOf(result.status)) : -1;

  return (
    <div className="card form-card stack">
      <form className="row-wrap" onSubmit={search} style={{ alignItems: 'flex-end' }}>
        <Field label="Reference number" htmlFor="pr-ref" className="grow">
          <Input id="pr-ref" placeholder="e.g. PR-2026-0318" value={ref} onChange={(e) => setRef(e.target.value.toUpperCase())} />
        </Field>
        <SubmitButton loading={loading} disabled={!ref.trim()}><FileSearch size={16} /> Track</SubmitButton>
      </form>
      {result === null && (
        <Empty icon={<SearchX size={22} />} title="No request with that reference">
          <p className="small">Check the reference in your confirmation, or <Link to="/contact?type=support">contact us</Link>.</p>
        </Empty>
      )}
      {result && (
        <div className="track-result">
          <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
            <div>
              <b>{result.ref}</b>
              <p className="xs muted">{TYPES.find((t) => t.id === result.requestType)?.label} · submitted {fmtDateTime(result.createdAt)}</p>
            </div>
            <StatusBadge s={result.status} />
          </div>
          {result.status === 'rejected' ? (
            <div className="alert alert-danger small">We couldn’t complete this request. Our team has emailed you the reason.</div>
          ) : (
            <ol className="track-steps">
              {FLOW.map((st, i) => (
                <li key={st} className={cx(i <= idx && 'done', i === idx && 'current')}>
                  <span />
                  {st === 'received' ? 'Received' : st === 'verified' ? 'Identity verified' : st === 'in_progress' ? 'In progress' : 'Completed'}
                </li>
              ))}
            </ol>
          )}
          <p className="small muted">Response due by <b>{fmtDate(result.dueBy)}</b></p>
        </div>
      )}
    </div>
  );
}
