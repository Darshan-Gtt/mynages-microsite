import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { FileWarning, KeyRound, Database, Eye, Lock, ServerCog, ShieldCheck, UserCheck } from 'lucide-react';
import { CookiePreferences } from '../components/CookieConsent';
import { cx } from '../lib/utils';

interface Sec {
  id: string;
  title: string;
  body: ReactNode;
}

function LegalLayout({ eyebrow, title, updated, intro, sections, aside }: { eyebrow: string; title: string; updated: string; intro: ReactNode; sections: Sec[]; aside?: ReactNode }) {
  const [active, setActive] = useState(sections[0]?.id);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: '-90px 0px -60% 0px' },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sections]);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <span className="eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            <p className="muted small">Last updated {updated}</p>
          </div>
        </div>
      </section>
      <section className="section-sm">
        <div className="container legal-layout">
          <nav className="legal-toc" aria-label="On this page">
            <span className="xs muted" style={{ fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}>On this page</span>
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className={cx(active === s.id && 'on')} onClick={(e) => {
                e.preventDefault();
                document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' });
                setActive(s.id);
              }}>
                {s.title}
              </a>
            ))}
          </nav>
          <article className="legal-body">
            <div className="alert alert-demo small" style={{ marginBottom: 24 }}>
              <FileWarning size={16} />
              <span>Prototype text for demonstration. The final legal wording is subject to legal review before launch.</span>
            </div>
            <div className="lead" style={{ marginBottom: 28 }}>{intro}</div>
            {aside}
            {sections.map((s) => (
              <section key={s.id} id={s.id}>
                <h2>{s.title}</h2>
                {s.body}
              </section>
            ))}
          </article>
        </div>
      </section>
    </>
  );
}

const UPDATED = '23 Nov 2026';

export function PrivacyPolicyPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Privacy Policy"
      updated={UPDATED}
      intro={<p>This policy explains what personal data Mynages collects, why, and the choices you have. It applies to the website, the Mynages mobile app and company workspaces.</p>}
      sections={[
        { id: 'collect', title: 'What we collect', body: <><p>Account data: your name, mobile number, email (optional for individuals), and for businesses the company details you provide at sign-up.</p><p>Content you add: assets, documents, policies, reminders, tasks, contacts, expenses and health records. You decide what to add.</p><p>Usage data: device, app version and diagnostic information, and — only with your consent — analytics on this website.</p></> },
        { id: 'not-collect', title: 'What we never store', body: <p>We do not store passwords, net-banking credentials or card numbers. Bank accounts appear only as masked references you choose to add. Card payments are processed by our payment gateway.</p> },
        { id: 'use', title: 'How we use it', body: <ul><li>To run your account and send the reminders you set up — by push, WhatsApp, SMS or email.</li><li>To send family invites to the mobile numbers you enter.</li><li>To bill your subscription and issue GST invoices.</li><li>To provide support when you ask for it.</li></ul> },
        { id: 'sharing', title: 'Who can see your data', body: <><p>Items in a family workspace are visible to joined family members. Items in your private space are visible only to you. In a company workspace, visibility follows the roles and scopes set by your company.</p><p>We use service providers (hosting, messaging, payments) under contracts that restrict their use of your data. We do not sell your data.</p></> },
        { id: 'rights', title: 'Your rights', body: <p>You can export, correct or delete your data. Use the <Link to="/privacy-request">Privacy Request</Link> page; we verify your identity by OTP before acting.</p> },
        { id: 'retention', title: 'Retention', body: <p>If your subscription ends, your data is kept so you can resubscribe and pick up where you left off. We notify you before any data of an expired workspace is deleted. Retention periods are being finalised.</p> },
        { id: 'contact', title: 'Contact', body: <p>Questions about privacy: <a href="mailto:privacy@mynages.com">privacy@mynages.com</a> or the <Link to="/contact">Contact Us</Link> page.</p> },
      ]}
    />
  );
}

export function TermsPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Terms of Use"
      updated={UPDATED}
      intro={<p>These terms govern your use of Mynages. By signing up you agree to them, for yourself or on behalf of your company.</p>}
      sections={[
        { id: 'accounts', title: 'Accounts', body: <p>Individual accounts are identified by mobile number; business accounts by work email and mobile, both verified by OTP. You are responsible for activity on your account and for keeping your phone and email secure.</p> },
        { id: 'subscriptions', title: 'Subscriptions and trials', body: <><p>Every individual and family workspace needs a paid subscription. New subscriptions start with a free trial. If no payment is made by the end of the trial, the workspace becomes view-only.</p><p>Upgrades take effect immediately; downgrades at the end of the paid period. A downgrade or expiry never deletes your data straight away.</p></> },
        { id: 'business', title: 'Business plans', body: <p>Business plans are agreed with Mynages and assigned to your company by contract. Usage limits for users, branches, assets, modules and storage are part of that agreement.</p> },
        { id: 'family', title: 'Family workspaces', body: <p>The Owner of a family workspace controls membership, roles, billing and categories. Joined members are covered by the Owner’s subscription.</p> },
        { id: 'content', title: 'Your content', body: <p>You keep ownership of everything you add. You give us permission to store and process it only to provide the service to you.</p> },
        { id: 'acceptable', title: 'Acceptable use', body: <p>Don’t use Mynages for unlawful purposes, to store content you have no right to, or to attempt to access other accounts.</p> },
        { id: 'liability', title: 'Liability', body: <p>Reminders are a convenience; you remain responsible for your renewals, payments and legal obligations.</p> },
      ]}
    />
  );
}

export function TrustSecurityPage() {
  const pillars = [
    { icon: KeyRound, t: 'No passwords', d: 'OTP and Google / Apple sign-in. Nothing to guess or leak.' },
    { icon: Lock, t: 'Encryption', d: 'Data is encrypted in transit and at rest.' },
    { icon: Database, t: 'Separate company databases', d: 'Each business gets its own dedicated database.' },
    { icon: Eye, t: 'Private by default', d: 'Private spaces are visible only to their owner.' },
    { icon: UserCheck, t: 'Roles and scopes', d: 'Access follows roles and branch or department scope.' },
    { icon: ServerCog, t: 'Activity log', d: 'Every create, edit, share and status change is recorded.' },
  ];
  return (
    <LegalLayout
      eyebrow="Trust & Security"
      title="How we keep your data safe"
      updated={UPDATED}
      intro={<p>Mynages holds the details of what families and companies own. We treat that responsibility seriously.</p>}
      aside={
        <div className="grid grid-3 trust-grid" style={{ marginBottom: 36 }}>
          {pillars.map((p) => (
            <div key={p.t} className="card">
              <span className="icon-tile sm"><p.icon size={18} /></span>
              <h4 style={{ margin: '10px 0 4px' }}>{p.t}</h4>
              <p className="xs muted">{p.d}</p>
            </div>
          ))}
        </div>
      }
      sections={[
        { id: 'access', title: 'Sign-in and access', body: <p>Sign-in uses one-time passwords to your verified mobile or email. You can see your signed-in devices and sign them out from the app. Business workspaces can require multi-factor authentication and session time-outs.</p> },
        { id: 'isolation', title: 'Data isolation', body: <p>Family data is separated per workspace with row-level controls; each company gets a dedicated database at its own web address.</p> },
        { id: 'recovery', title: 'Account recovery', body: <p>If you change your number, recovery uses your verified email, confirmation by your family’s Owner or an adult member, or identity checks by our support team. Every recovery is logged and notified.</p> },
        { id: 'support', title: 'Support access', body: <p>Our support team cannot see your data unless you grant time-limited access from within the app.</p> },
        { id: 'payments', title: 'Payments', body: <p>Payments are handled by a PCI-DSS compliant gateway. Mynages never stores card numbers or UPI PINs.</p> },
        { id: 'report', title: 'Report a concern', body: <p>Found a security issue? Email <a href="mailto:security@mynages.com">security@mynages.com</a>.</p> },
      ]}
    />
  );
}

export function CookiesPage() {
  return (
    <LegalLayout
      eyebrow="Cookie Consent"
      title="Cookies on this website"
      updated={UPDATED}
      intro={<p>We use a small number of cookies. Essential ones are always on; analytics and marketing cookies are used only if you allow them.</p>}
      aside={
        <div className="card" style={{ marginBottom: 36 }}>
          <h3 style={{ marginBottom: 14 }}><ShieldCheck size={18} style={{ display: 'inline', verticalAlign: '-3px' }} /> Your cookie preferences</h3>
          <CookiePreferences />
        </div>
      }
      sections={[
        { id: 'essential', title: 'Essential cookies', body: <p>Keep the site secure, remember your sign-up progress and remember your cookie choice. These can’t be switched off.</p> },
        { id: 'analytics', title: 'Analytics cookies', body: <p>Tell us which pages are visited and how people move through sign-up, so we can improve the site. Off unless you allow them.</p> },
        { id: 'marketing', title: 'Marketing cookies', body: <p>Measure our campaigns and show relevant Mynages offers elsewhere. Off unless you allow them.</p> },
        { id: 'record', title: 'How we record your choice', body: <p>Your choice is saved with an anonymous visitor ID, the policy version and the time. You can change it at any time on this page or from “Cookie preferences” in the footer.</p> },
      ]}
    />
  );
}
