import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, CalendarX2, CheckCircle2, Clock, Link2Off, Loader2, Smartphone, UserX } from 'lucide-react';
import { InviteCard } from './signup/IndividualSignup';
import { StoreBadges } from '../components/StoreBadges';
import { ConfirmDialog } from '../components/ui/Modal';
import { Field, Input } from '../components/ui/Form';
import { useToast } from '../components/ui/Toast';
import { updateDb, useDb } from '../lib/store';
import { maskMobile, sleep } from '../lib/utils';

function daysLeft(iso: string) {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000));
}

function StateCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="card form-card stack center-stack">
      <span className="icon-tile lg yellow">{icon}</span>
      <h2 className="step-title">{title}</h2>
      {children}
    </div>
  );
}

/** Family Invite Landing — the WhatsApp deep link target (PRD §11.2, §4.3). */
export function InviteLandingPage() {
  const { code } = useParams();
  const db = useDb();
  const toast = useToast();
  const navigate = useNavigate();
  const [opening, setOpening] = useState(false);
  const [noApp, setNoApp] = useState(false);
  const [confirmDecline, setConfirmDecline] = useState(false);
  const [entered, setEntered] = useState('');

  if (!code) {
    return (
      <section className="signup-wrap">
        <div className="container signup-narrow">
          <form
            className="card form-card stack"
            onSubmit={(e) => {
              e.preventDefault();
              if (entered.trim()) navigate(`/invite/${entered.trim().toUpperCase()}`);
            }}
          >
            <h2 className="step-title">Have a family invite?</h2>
            <p className="muted small">Open the link from your WhatsApp or SMS message, or enter the invite code below.</p>
            <Field label="Invite code" htmlFor="inv-code">
              <Input id="inv-code" placeholder="e.g. SHARMA7K" value={entered} onChange={(e) => setEntered(e.target.value.toUpperCase())} />
            </Field>
            <button className="btn btn-primary" disabled={!entered.trim()}>Find invite <ArrowRight size={16} /></button>
          </form>
        </div>
      </section>
    );
  }

  const invite = db.invites.find((i) => i.code.toUpperCase() === code.toUpperCase());
  const expired = invite && invite.status === 'invited' && new Date(invite.expiresAt) < new Date();

  const openApp = async () => {
    setOpening(true);
    await sleep(1400);
    setOpening(false);
    setNoApp(true);
  };

  let body: React.ReactNode;
  if (!invite) {
    body = (
      <StateCard icon={<Link2Off size={28} />} title="This invite link isn’t valid">
        <p className="muted">The link may be incomplete or the invite was withdrawn. Ask the person who invited you to send it again from the Mynages app.</p>
        <div className="row-wrap" style={{ justifyContent: 'center' }}>
          <Link to="/invite" className="btn btn-outline">Enter a code</Link>
          <Link to="/" className="btn btn-ghost">Go to home</Link>
        </div>
      </StateCard>
    );
  } else if (expired || invite.status === 'expired') {
    body = (
      <StateCard icon={<CalendarX2 size={28} />} title="This invite has expired">
        <p className="muted">
          {invite.inviterName}’s invite to {invite.familyName} expired. Invites last 7 days — ask {invite.inviterName.split(' ')[0]} to re-send it from
          the family members screen in the app.
        </p>
        <Link to="/signup/individual" className="btn btn-outline">Create your own family instead</Link>
      </StateCard>
    );
  } else if (invite.status === 'joined') {
    body = (
      <StateCard icon={<CheckCircle2 size={28} />} title={`You’re already part of ${invite.familyName}`}>
        <p className="muted">This invite has been accepted. Open the Mynages app and sign in with +91 {maskMobile(invite.mobile)}.</p>
        <StoreBadges />
      </StateCard>
    );
  } else if (invite.status === 'declined' || invite.status === 'removed') {
    body = (
      <StateCard icon={<UserX size={28} />} title="This invite was declined">
        <p className="muted">If that was a mistake, ask {invite.inviterName} to send a new invite.</p>
        <Link to="/" className="btn btn-outline">Go to home</Link>
      </StateCard>
    );
  } else {
    const left = daysLeft(invite.expiresAt);
    body = (
      <div className="stack">
        <InviteCard invite={invite} />
        <div className="card form-card stack">
          <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
            <h3>Join in under 2 minutes</h3>
            <span className="badge badge-warning"><Clock size={12} /> Expires in {left} {left === 1 ? 'day' : 'days'}</span>
          </div>
          <ol className="join-steps">
            <li><b>Open or install the Mynages app</b><span>Available on Android and iPhone.</span></li>
            <li><b>Sign in with +91 {maskMobile(invite.mobile)}</b><span>Use the same number this invite was sent to.</span></li>
            <li><b>Accept the invite</b><span>You’ll see {invite.familyName}’s shared items right away, and get your own private space.</span></li>
          </ol>
          <div className="row-wrap">
            <button className="btn btn-primary btn-lg" onClick={openApp} disabled={opening}>
              {opening ? <><Loader2 size={17} className="spinner" /> Opening Mynages…</> : <><Smartphone size={17} /> Open in the app</>}
            </button>
            <Link to={`/signup/individual?mobile=${invite.mobile}`} className="btn btn-outline btn-lg">Sign up on the web</Link>
          </div>
          {noApp && (
            <div className="alert alert-info" style={{ display: 'grid', gap: 12 }}>
              <span>Don’t have the app yet? Install it, then open this link again — your invite will be waiting.</span>
              <StoreBadges />
            </div>
          )}
          <p className="xs muted">
            Not expecting this?{' '}
            <button className="link-btn xs" onClick={() => setConfirmDecline(true)}>Decline the invite</button>
          </p>
        </div>
        <ConfirmDialog
          open={confirmDecline}
          title="Decline this invite?"
          message={`${invite.inviterName} will see that you declined. They can send a new invite later.`}
          confirmLabel="Decline invite"
          onConfirm={() => {
            updateDb((d) => ({ ...d, invites: d.invites.map((i) => (i.code === invite.code ? { ...i, status: 'declined' } : i)) }));
            toast({ type: 'info', title: 'Invite declined' });
          }}
          onClose={() => setConfirmDecline(false)}
        />
      </div>
    );
  }

  return (
    <section className="signup-wrap">
      <div className="container signup-narrow">{body}</div>
    </section>
  );
}
