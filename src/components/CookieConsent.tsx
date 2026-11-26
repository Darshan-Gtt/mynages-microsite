import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, Lock } from 'lucide-react';
import { Modal } from './ui/Modal';
import { useToast } from './ui/Toast';
import { updateDb, useDb } from '../lib/store';
import { uid } from '../lib/utils';
import type { CookieConsent } from '../lib/types';

export const COOKIE_POLICY_VERSION = '2026.11';
const VISITOR_KEY = 'mynages.visitorId';

function visitorId(): string {
  try {
    let v = localStorage.getItem(VISITOR_KEY);
    if (!v) {
      v = uid('v');
      localStorage.setItem(VISITOR_KEY, v);
    }
    return v;
  } catch {
    return 'anonymous';
  }
}

/** Current visitor's latest choice (the consent log is insert-only, so the newest entry wins). */
export function useMyConsent(): CookieConsent | undefined {
  const db = useDb();
  const me = visitorId();
  const mine = db.cookieConsents.filter((c) => c.visitorId === me && c.policyVersion === COOKIE_POLICY_VERSION);
  return mine[mine.length - 1];
}

export function saveConsent(analytics: boolean, marketing: boolean) {
  const entry: CookieConsent = {
    id: uid('cc'),
    visitorId: visitorId(),
    choice: { essential: true, analytics, marketing },
    policyVersion: COOKIE_POLICY_VERSION,
    givenAt: new Date().toISOString(),
  };
  updateDb((d) => ({ ...d, cookieConsents: [...d.cookieConsents, entry] }));
}

export function CookieBanner({ onCustomise }: { onCustomise: () => void }) {
  const consent = useMyConsent();
  const toast = useToast();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    // Small delay so the banner does not flash on first paint.
    const t = setTimeout(() => setVisible(!consent), 600);
    return () => clearTimeout(t);
  }, [consent]);
  if (!visible || consent) return null;
  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
      <span className="icon-tile sm yellow">
        <Cookie size={18} />
      </span>
      <p className="small">
        We use essential cookies to run this site, and — only with your permission — analytics and marketing cookies.{' '}
        <Link to="/cookies">Cookie policy</Link>
      </p>
      <div className="cookie-actions">
        <button className="btn btn-sm btn-ghost" onClick={onCustomise}>Customise</button>
        <button
          className="btn btn-sm btn-outline"
          onClick={() => {
            saveConsent(false, false);
            toast({ type: 'info', title: 'Only essential cookies will be used' });
          }}
        >
          Reject non-essential
        </button>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => {
            saveConsent(true, true);
            toast({ type: 'success', title: 'Cookie preferences saved' });
          }}
        >
          Accept all
        </button>
      </div>
    </div>
  );
}

export function CookiePreferences({ onSaved }: { onSaved?: () => void }) {
  const consent = useMyConsent();
  const toast = useToast();
  const [analytics, setAnalytics] = useState(consent?.choice.analytics ?? false);
  const [marketing, setMarketing] = useState(consent?.choice.marketing ?? false);
  useEffect(() => {
    setAnalytics(consent?.choice.analytics ?? false);
    setMarketing(consent?.choice.marketing ?? false);
  }, [consent]);

  const rows = [
    { key: 'essential', title: 'Essential', desc: 'Needed for sign-up, security and remembering your cookie choice. Always on.', value: true, set: undefined },
    { key: 'analytics', title: 'Analytics', desc: 'Help us understand which pages are useful so we can improve them.', value: analytics, set: setAnalytics },
    { key: 'marketing', title: 'Marketing', desc: 'Measure campaigns and show relevant Mynages offers on other sites.', value: marketing, set: setMarketing },
  ];

  return (
    <div className="stack">
      {rows.map((r) => (
        <div key={r.key} className="pref-row">
          <div>
            <strong className="small">{r.title}</strong>
            <p className="xs muted">{r.desc}</p>
          </div>
          {r.set ? (
            <label className="switch">
              <input type="checkbox" checked={r.value} onChange={(e) => r.set!(e.target.checked)} aria-label={`${r.title} cookies`} />
              <span />
            </label>
          ) : (
            <span className="badge"><Lock size={12} /> Always on</span>
          )}
        </div>
      ))}
      {consent && (
        <p className="xs muted">
          Last saved {new Date(consent.givenAt).toLocaleString('en-IN')} · policy version {consent.policyVersion}
        </p>
      )}
      <div className="row-wrap" style={{ justifyContent: 'flex-end' }}>
        <button
          className="btn btn-outline"
          onClick={() => {
            saveConsent(false, false);
            toast({ type: 'info', title: 'Only essential cookies will be used' });
            onSaved?.();
          }}
        >
          Reject non-essential
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            saveConsent(analytics, marketing);
            toast({ type: 'success', title: 'Cookie preferences saved' });
            onSaved?.();
          }}
        >
          Save preferences
        </button>
      </div>
    </div>
  );
}

export function CookiePreferencesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Cookie preferences" subtitle="Choose which cookies Mynages may use on this website.">
      <CookiePreferences onSaved={onClose} />
    </Modal>
  );
}
