import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Building2, CheckCircle2, Clock, Headphones, Handshake, Mail, MessageSquare, User } from 'lucide-react';
import { Captcha, Checkbox, Field, Input, MobileInput, Select, SubmitButton, Textarea } from '../components/ui/Form';
import { Segmented } from '../components/ui/Misc';
import { useToast } from '../components/ui/Toast';
import { updateDb } from '../lib/store';
import { refNo, sleep, uid } from '../lib/utils';
import { hasErrors, rx, validEmail, validName, type Errors } from '../lib/validation';
import { usePersistentState } from '../lib/usePersistentState';
import { planById } from '../data/plans';
import type { AccountType, Enquiry, EnquiryType } from '../lib/types';

interface Form {
  name: string;
  email: string;
  mobile: string;
  enquiringAs: AccountType;
  organisation: string;
  enquiryType: EnquiryType;
  message: string;
  consent: boolean;
  human: boolean;
}

const blank: Form = {
  name: '', email: '', mobile: '', enquiringAs: 'individual', organisation: '', enquiryType: 'sales', message: '', consent: false, human: false,
};

export function ContactPage() {
  const [params] = useSearchParams();
  const loc = useLocation();
  const toast = useToast();
  const [f, setF, clearDraft] = usePersistentState<Form>('mynages.contact.draft', blank, 'local');
  const [errors, setErrors] = useState<Errors<Form>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<Enquiry | null>(null);

  // Prefill from links such as /contact?type=sales&as=business&plan=biz_growth
  useEffect(() => {
    const type = params.get('type') as EnquiryType | null;
    const as = params.get('as') as AccountType | null;
    const plan = planById(params.get('plan') ?? undefined);
    if (!type && !as && !plan) return;
    setF((cur) => ({
      ...cur,
      enquiryType: type && ['sales', 'support', 'partnership', 'other'].includes(type) ? type : cur.enquiryType,
      enquiringAs: as === 'business' || as === 'individual' ? as : cur.enquiringAs,
      message: plan && !cur.message ? `I'd like to know more about the ${plan.name} plan for our company.` : cur.message,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setF({ ...f, [k]: v });
    setErrors({ ...errors, [k]: undefined });
  };

  const validate = (): Errors<Form> => ({
    name: validName(f.name),
    email: validEmail(f.email),
    mobile: f.mobile && !rx.indianMobile.test(f.mobile) ? 'Enter a valid 10-digit mobile number' : undefined,
    organisation: f.enquiringAs === 'business' && !f.organisation.trim() ? 'Organisation is required for business enquiries' : undefined,
    message: !f.message.trim() ? 'Message is required' : f.message.trim().length < 15 ? 'Please add a little more detail (at least 15 characters)' : undefined,
    consent: f.consent ? undefined : 'Please allow us to contact you about this enquiry',
    human: f.human ? undefined : 'Please complete the security check',
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (hasErrors(errs)) {
      toast({ type: 'error', title: 'Please fix the highlighted fields' });
      return;
    }
    setLoading(true);
    await sleep(1100);
    const enq: Enquiry = {
      id: uid('enq'),
      ref: refNo('ENQ'),
      name: f.name.trim(),
      email: f.email.trim().toLowerCase(),
      mobileCountryCode: '+91',
      mobileNumber: f.mobile || undefined,
      enquiringAs: f.enquiringAs,
      organisation: f.enquiringAs === 'business' ? f.organisation.trim() : undefined,
      enquiryType: f.enquiryType,
      message: f.message.trim(),
      consentGiven: f.consent,
      sourcePage: loc.pathname + loc.search,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    updateDb((d) => ({ ...d, enquiries: [enq, ...d.enquiries] }));
    setLoading(false);
    setDone(enq);
    clearDraft();
    toast({ type: 'success', title: 'Enquiry sent', message: `Reference ${enq.ref}` });
  };

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <span className="eyebrow">Contact us</span>
            <h1>How can we help?</h1>
            <p className="lead">Questions about plans, a demo for your company, or help with your account — we reply within one working day.</p>
          </div>
        </div>
      </section>

      <section className="section-sm">
        <div className="container contact-layout">
          <aside className="stack">
            {[
              { icon: Handshake, t: 'Sales & demos', d: 'Plans for your family or a walkthrough for your company.' },
              { icon: Headphones, t: 'Support', d: 'Help with sign-up, the app or your subscription.' },
              { icon: Building2, t: 'Partnerships', d: 'Insurers, service networks and resellers.' },
            ].map((c) => (
              <div key={c.t} className="card contact-card">
                <span className="icon-tile"><c.icon size={20} /></span>
                <div>
                  <h4>{c.t}</h4>
                  <p className="small muted">{c.d}</p>
                </div>
              </div>
            ))}
            <div className="card contact-card">
              <span className="icon-tile yellow"><Mail size={20} /></span>
              <div>
                <h4>Email</h4>
                <a href="mailto:hello@mynages.com" className="small">hello@mynages.com</a>
                <p className="xs muted" style={{ marginTop: 6 }}><Clock size={12} style={{ display: 'inline', verticalAlign: '-2px' }} /> Mon–Sat, 9:30 am – 6:30 pm IST</p>
              </div>
            </div>
          </aside>

          <div className="card form-card">
            {done ? (
              <div className="success-state">
                <span className="icon-tile lg" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}><CheckCircle2 size={30} /></span>
                <h2>Thank you, {done.name.split(' ')[0]}!</h2>
                <p className="muted">
                  Your enquiry has reached our team. We’ve sent an acknowledgement to <b>{done.email}</b>.
                </p>
                <div className="ref-box">
                  <span className="xs muted">Reference number</span>
                  <b>{done.ref}</b>
                </div>
                <div className="row-wrap" style={{ justifyContent: 'center' }}>
                  <button className="btn btn-outline" onClick={() => setDone(null)}>Send another enquiry</button>
                  <Link to="/faqs" className="btn btn-ghost">Browse FAQs</Link>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="stack">
                <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <h3><MessageSquare size={18} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} />Send us a message</h3>
                  {(f.name || f.message) && <span className="xs muted">Draft saved</span>}
                </div>
                <Field label="I am enquiring as">
                  <Segmented
                    label="Enquiring as"
                    value={f.enquiringAs}
                    onChange={(v) => set('enquiringAs', v)}
                    options={[
                      { value: 'individual', label: <><User size={15} /> An individual</> },
                      { value: 'business', label: <><Building2 size={15} /> A business</> },
                    ]}
                  />
                </Field>
                <div className="form-grid">
                  <Field label="Full name" required htmlFor="c-name" error={errors.name}>
                    <Input id="c-name" autoComplete="name" value={f.name} onChange={(e) => set('name', e.target.value)} invalid={!!errors.name} placeholder="e.g. Ananya Deshpande" />
                  </Field>
                  <Field label={f.enquiringAs === 'business' ? 'Work email' : 'Email'} required htmlFor="c-email" error={errors.email}>
                    <Input id="c-email" type="email" autoComplete="email" value={f.email} onChange={(e) => set('email', e.target.value)} invalid={!!errors.email} placeholder="you@example.com" />
                  </Field>
                  <Field label="Mobile" optional htmlFor="c-mobile" error={errors.mobile}>
                    <MobileInput id="c-mobile" value={f.mobile} onChange={(v) => set('mobile', v)} invalid={!!errors.mobile} />
                  </Field>
                  <Field label="Enquiry type" required htmlFor="c-type">
                    <Select id="c-type" value={f.enquiryType} onChange={(e) => set('enquiryType', e.target.value as EnquiryType)}>
                      <option value="sales">Sales / demo</option>
                      <option value="support">Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </Select>
                  </Field>
                  {f.enquiringAs === 'business' && (
                    <Field label="Organisation" required htmlFor="c-org" error={errors.organisation} className="full">
                      <Input id="c-org" autoComplete="organization" value={f.organisation} onChange={(e) => set('organisation', e.target.value)} invalid={!!errors.organisation} placeholder="Company name" />
                    </Field>
                  )}
                  <Field label="Message" required htmlFor="c-msg" error={errors.message} className="full" hint={`${f.message.length}/1000`}>
                    <Textarea id="c-msg" maxLength={1000} value={f.message} onChange={(e) => set('message', e.target.value)} invalid={!!errors.message} placeholder="Tell us what you’d like to know" />
                  </Field>
                </div>
                <Field error={errors.consent}>
                  <Checkbox id="c-consent" checked={f.consent} onChange={(v) => set('consent', v)}>
                    I agree that Mynages may contact me about this enquiry, as described in the <Link to="/privacy">Privacy Policy</Link>.
                  </Checkbox>
                </Field>
                <Captcha checked={f.human} onChange={(v) => set('human', v)} error={errors.human} />
                <div className="row-wrap">
                  <SubmitButton loading={loading}>{loading ? 'Sending…' : 'Send enquiry'}</SubmitButton>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      clearDraft();
                      setErrors({});
                    }}
                  >
                    Clear form
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
