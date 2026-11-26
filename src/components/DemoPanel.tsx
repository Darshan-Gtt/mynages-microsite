import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  Copy,
  Database,
  ExternalLink,
  FlaskConical,
  Inbox,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from 'lucide-react';
import { ConfirmDialog, Drawer, Modal } from './ui/Modal';
import { Field, Input, MobileInput, Select } from './ui/Form';
import { Empty } from './ui/Misc';
import { useToast } from './ui/Toast';
import { resetDb, updateDb, useDb } from '../lib/store';
import { addDays, cx, fmtDate, fmtDateTime } from '../lib/utils';
import { planById } from '../data/plans';
import { RELATIONS } from '../data/content';
import { validMobile, validName } from '../lib/validation';
import type { EnquiryStatus, FamilyInvite, FamilyRole, PrivacyRequestStatus } from '../lib/types';

type Tab = 'guide' | 'accounts' | 'signups' | 'enquiries' | 'privacy' | 'invites' | 'cookies';

const statusTone: Record<string, string> = {
  completed: 'badge-success', active: 'badge-success', joined: 'badge-success', closed: 'badge-success',
  trialing: 'badge-teal', verified: 'badge-teal', in_progress: 'badge-info', provisioning: 'badge-info',
  pending: 'badge-warning', new: 'badge-warning', invited: 'badge-warning', received: 'badge-warning',
  failed: 'badge-danger', expired: 'badge-danger', declined: 'badge-danger', rejected: 'badge-danger', removed: 'badge-danger',
};

export function StatusBadge({ s }: { s: string }) {
  return <span className={cx('badge', statusTone[s])}>{s.replace('_', ' ')}</span>;
}

function Item({
  title,
  sub,
  badge,
  children,
  actions,
}: {
  title: ReactNode;
  sub: ReactNode;
  badge?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="data-item">
      <div className="data-item-head">
        <div className="meta">
          <strong>{title}</strong>
          <span className="xs muted">{sub}</span>
        </div>
        {badge}
        {children && (
          <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setOpen(!open)} aria-label={open ? 'Hide details' : 'Show details'} aria-expanded={open}>
            <ChevronDown size={16} style={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'transform .2s' }} />
          </button>
        )}
      </div>
      {open && children}
      {actions && <div className="row-wrap" style={{ marginTop: 12, gap: 8 }}>{actions}</div>}
    </div>
  );
}

function KV({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="kv">
      {rows.map(([k, v]) => (
        <div key={k} style={{ display: 'contents' }}>
          <dt>{k}</dt>
          <dd>{v || '—'}</dd>
        </div>
      ))}
    </dl>
  );
}

export function DemoPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const db = useDb();
  const toast = useToast();
  const [tab, setTab] = useState<Tab>('guide');
  const [q, setQ] = useState('');
  const [confirm, setConfirm] = useState<null | { title: string; message: string; run: () => void; label?: string }>(null);
  const [inviteForm, setInviteForm] = useState(false);

  const match = (...vals: Array<string | undefined>) =>
    !q.trim() || vals.some((v) => v?.toLowerCase().includes(q.trim().toLowerCase()));

  const del = (title: string, message: string, run: () => void) => setConfirm({ title, message, run });

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'guide', label: 'Demo guide' },
    { id: 'accounts', label: 'Accounts', count: db.tenants.length },
    { id: 'signups', label: 'Sign-ups', count: db.signups.length },
    { id: 'enquiries', label: 'Enquiries', count: db.enquiries.length },
    { id: 'privacy', label: 'Privacy', count: db.privacyRequests.length },
    { id: 'invites', label: 'Invites', count: db.invites.length },
    { id: 'cookies', label: 'Cookies', count: db.cookieConsents.length },
  ];

  const sortedSignups = useMemo(() => [...db.signups].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [db.signups]);
  const sortedEnq = useMemo(() => [...db.enquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [db.enquiries]);

  return (
    <>
      <Drawer open={open} onClose={onClose} title="Demo data" icon={<span className="icon-tile sm yellow"><FlaskConical size={18} /></span>}>
        <p className="small muted" style={{ marginBottom: 14 }}>
          Everything visitors submit on this prototype is stored in this browser. In the product these records go to the Admin Console.
        </p>
        <div className="tabs" role="tablist" style={{ marginBottom: 16 }}>
          {tabs.map((t) => (
            <button key={t.id} role="tab" className="tab" aria-selected={tab === t.id} onClick={() => { setTab(t.id); setQ(''); }}>
              {t.label}
              {t.count !== undefined && <span className="count">{t.count}</span>}
            </button>
          ))}
        </div>

        {tab !== 'guide' && (
          <div className="input-group" style={{ marginBottom: 14 }}>
            <span className="addon"><Search size={15} /></span>
            <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search records" />
          </div>
        )}

        {tab === 'guide' && (
          <div className="stack">
            <div className="alert alert-demo">
              <FlaskConical size={18} />
              <div>
                <strong>OTP for every verification: 123456</strong>
                <p className="xs">Any other 6 digits shows the wrong-OTP error.</p>
              </div>
            </div>
            <div className="card" style={{ padding: 18 }}>
              <h4 style={{ marginBottom: 10 }}>Scenarios to try</h4>
              <ul className="guide-list">
                <li><b>Individual sign-up:</b> any new mobile → choose plan → start trial or pay. <Link to="/signup/individual" onClick={onClose}>Open</Link></li>
                <li><b>Pending family invite:</b> sign up with <code>9822012345</code> — the Sharma Family invite is detected and the plan step is skipped.</li>
                <li><b>Existing account:</b> sign up with <code>9876543210</code>.</li>
                <li><b>Failed payment:</b> pay with UPI ID <code>fail@upi</code>.</li>
                <li><b>Business sign-up:</b> URL <code>acme</code> or email <code>owner@acmeengg.in</code> are already taken. <Link to="/signup/business" onClick={onClose}>Open</Link></li>
                <li><b>Invite links:</b> <Link to="/invite/SHARMA7K" onClick={onClose}>valid</Link> · <Link to="/invite/MEHTA4X" onClick={onClose}>expired</Link> · <Link to="/invite/KULK9Q" onClick={onClose}>already joined</Link> · <Link to="/invite/NOPE00" onClick={onClose}>invalid</Link></li>
                <li><b>Privacy request tracking:</b> reference <code>PR-2026-0318</code> on the Privacy Request page.</li>
              </ul>
            </div>
            <button
              className="btn btn-outline"
              onClick={() =>
                setConfirm({
                  title: 'Reset demo data?',
                  message: 'All sign-ups, enquiries, privacy requests, invites and cookie choices made in this browser will be replaced with the original sample records.',
                  label: 'Reset',
                  run: () => {
                    resetDb();
                    toast({ type: 'success', title: 'Demo data reset' });
                  },
                })
              }
            >
              <RotateCcw size={16} /> Reset demo data
            </button>
          </div>
        )}

        {tab === 'accounts' && (
          <div className="data-list">
            {db.tenants.filter((t) => match(t.name, t.ownerName, t.ownerMobile, t.ownerEmail, t.slug)).length === 0 && (
              <Empty icon={<Database size={20} />} title="No accounts match" />
            )}
            {db.tenants
              .filter((t) => match(t.name, t.ownerName, t.ownerMobile, t.ownerEmail, t.slug))
              .map((t) => (
                <Item
                  key={t.id}
                  title={t.name}
                  sub={`${t.type === 'individual' ? 'Family' : 'Business'} · Owner ${t.ownerName} · ${fmtDate(t.createdAt)}`}
                  badge={<StatusBadge s={t.lifecycle} />}
                  actions={
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => del('Delete account?', `${t.name} will be removed from the demo data.`, () => {
                        updateDb((d) => ({ ...d, tenants: d.tenants.filter((x) => x.id !== t.id) }));
                        toast({ type: 'success', title: 'Account deleted' });
                      })}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  }
                >
                  <KV
                    rows={[
                      ['Mobile', t.ownerMobile && `+91 ${t.ownerMobile}`],
                      ['Email', t.ownerEmail],
                      ['Web address', t.slug && `${t.slug}.mynages.com`],
                      ['Industry', t.industry],
                      ['City', t.city],
                      ['Plan', t.planId ? `${planById(t.planId)?.name} (${t.billingCycle})` : t.type === 'business' ? 'Assigned by contract' : undefined],
                      ['Trial ends', t.trialEndsAt && fmtDate(t.trialEndsAt)],
                      ['Invoice', t.invoiceNo],
                    ]}
                  />
                </Item>
              ))}
          </div>
        )}

        {tab === 'signups' && (
          <div className="data-list">
            {sortedSignups.filter((s) => match(s.formData.fullName, s.formData.companyName, s.mobileNumber, s.email)).length === 0 && (
              <Empty icon={<Inbox size={20} />} title="No sign-up requests" />
            )}
            {sortedSignups
              .filter((s) => match(s.formData.fullName, s.formData.companyName, s.mobileNumber, s.email))
              .map((s) => (
                <Item
                  key={s.id}
                  title={s.formData.companyName || s.formData.fullName || `+91 ${s.mobileNumber}`}
                  sub={`${s.accountType} · ${fmtDateTime(s.createdAt)}`}
                  badge={<StatusBadge s={s.status} />}
                  actions={
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => del('Delete sign-up request?', 'This removes the request record only.', () => {
                        updateDb((d) => ({ ...d, signups: d.signups.filter((x) => x.id !== s.id) }));
                        toast({ type: 'success', title: 'Sign-up request deleted' });
                      })}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  }
                >
                  <KV
                    rows={[
                      ['Mobile', `${s.mobileCountryCode} ${s.mobileNumber}`],
                      ['Mobile verified', s.mobileVerifiedAt ? fmtDateTime(s.mobileVerifiedAt) : 'No'],
                      ['Email', s.email],
                      ['Email verified', s.email ? (s.emailVerifiedAt ? fmtDateTime(s.emailVerifiedAt) : 'No') : undefined],
                      ['Plan', s.selectedPlanId && `${planById(s.selectedPlanId)?.name} (${s.billingCycle})`],
                      ...Object.entries(s.formData).map(([k, v]) => [k, v] as [string, string]),
                      ['Expires', fmtDateTime(s.expiresAt)],
                    ]}
                  />
                </Item>
              ))}
          </div>
        )}

        {tab === 'enquiries' && (
          <div className="data-list">
            {sortedEnq.filter((e) => match(e.name, e.email, e.ref, e.organisation, e.message)).length === 0 && (
              <Empty icon={<Inbox size={20} />} title="No enquiries">
                <Link to="/contact" onClick={onClose} className="small">Submit one from Contact Us</Link>
              </Empty>
            )}
            {sortedEnq
              .filter((e) => match(e.name, e.email, e.ref, e.organisation, e.message))
              .map((e) => (
                <Item
                  key={e.id}
                  title={`${e.name}${e.organisation ? ` · ${e.organisation}` : ''}`}
                  sub={`${e.ref} · ${e.enquiryType} · ${fmtDateTime(e.createdAt)}`}
                  badge={<StatusBadge s={e.status} />}
                  actions={
                    <>
                      <Select
                        aria-label="Enquiry status"
                        value={e.status}
                        style={{ height: 34, width: 150, fontSize: '0.82rem' }}
                        onChange={(ev) => {
                          const status = ev.target.value as EnquiryStatus;
                          updateDb((d) => ({ ...d, enquiries: d.enquiries.map((x) => (x.id === e.id ? { ...x, status } : x)) }));
                          toast({ type: 'success', title: `${e.ref} marked ${status.replace('_', ' ')}` });
                        }}
                      >
                        <option value="new">New</option>
                        <option value="in_progress">In progress</option>
                        <option value="closed">Closed</option>
                      </Select>
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => del('Delete enquiry?', `${e.ref} from ${e.name} will be deleted.`, () => {
                          updateDb((d) => ({ ...d, enquiries: d.enquiries.filter((x) => x.id !== e.id) }));
                          toast({ type: 'success', title: 'Enquiry deleted' });
                        })}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </>
                  }
                >
                  <KV
                    rows={[
                      ['Email', e.email],
                      ['Mobile', e.mobileNumber && `${e.mobileCountryCode} ${e.mobileNumber}`],
                      ['Enquiring as', e.enquiringAs],
                      ['Message', e.message],
                      ['Source page', e.sourcePage],
                      ['Consent', e.consentGiven ? 'Yes' : 'No'],
                    ]}
                  />
                </Item>
              ))}
          </div>
        )}

        {tab === 'privacy' && (
          <div className="data-list">
            {db.privacyRequests.filter((p) => match(p.ref, p.requesterName, p.requesterContact)).length === 0 && (
              <Empty icon={<Inbox size={20} />} title="No privacy requests" />
            )}
            {db.privacyRequests
              .filter((p) => match(p.ref, p.requesterName, p.requesterContact))
              .map((p) => (
                <Item
                  key={p.id}
                  title={`${p.ref} · ${p.requesterName}`}
                  sub={`${p.requestType} · due ${fmtDate(p.dueBy)}`}
                  badge={<StatusBadge s={p.status} />}
                  actions={
                    <>
                      <Select
                        aria-label="Privacy request status"
                        value={p.status}
                        style={{ height: 34, width: 150, fontSize: '0.82rem' }}
                        onChange={(ev) => {
                          const status = ev.target.value as PrivacyRequestStatus;
                          updateDb((d) => ({ ...d, privacyRequests: d.privacyRequests.map((x) => (x.id === p.id ? { ...x, status } : x)) }));
                          toast({ type: 'success', title: `${p.ref} marked ${status.replace('_', ' ')}` });
                        }}
                      >
                        {['received', 'verified', 'in_progress', 'completed', 'rejected'].map((s) => (
                          <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                      </Select>
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => del('Delete privacy request?', `${p.ref} will be deleted.`, () => {
                          updateDb((d) => ({ ...d, privacyRequests: d.privacyRequests.filter((x) => x.id !== p.id) }));
                          toast({ type: 'success', title: 'Privacy request deleted' });
                        })}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </>
                  }
                >
                  <KV rows={[['Contact', p.requesterContact], ['Details', p.details], ['Verified', fmtDateTime(p.verifiedAt)], ['Received', fmtDateTime(p.createdAt)]]} />
                </Item>
              ))}
          </div>
        )}

        {tab === 'invites' && (
          <div className="data-list">
            <button className="btn btn-outline btn-sm" style={{ justifySelf: 'start' }} onClick={() => setInviteForm(true)}>
              <Plus size={15} /> New invite link
            </button>
            {db.invites.filter((i) => match(i.code, i.inviteeName, i.inviterName, i.familyName, i.mobile)).length === 0 && (
              <Empty icon={<Inbox size={20} />} title="No invites" />
            )}
            {db.invites
              .filter((i) => match(i.code, i.inviteeName, i.inviterName, i.familyName, i.mobile))
              .map((i) => {
                const url = `${window.location.origin}${import.meta.env.BASE_URL}invite/${i.code}`;
                return (
                  <Item
                    key={i.code}
                    title={`${i.inviteeName} → ${i.familyName}`}
                    sub={`${i.code} · from ${i.inviterName} · expires ${fmtDate(i.expiresAt)}`}
                    badge={<StatusBadge s={new Date(i.expiresAt) < new Date() && i.status === 'invited' ? 'expired' : i.status} />}
                    actions={
                      <>
                        <Link className="btn btn-sm btn-outline" to={`/invite/${i.code}`} onClick={onClose}>
                          <ExternalLink size={14} /> Open
                        </Link>
                        <button
                          className="btn btn-sm btn-ghost"
                          onClick={() => {
                            navigator.clipboard?.writeText(url).catch(() => {});
                            toast({ type: 'success', title: 'Invite link copied', message: url });
                          }}
                        >
                          <Copy size={14} /> Copy link
                        </button>
                        <button
                          className="btn btn-sm btn-ghost"
                          onClick={() => del('Delete invite?', `The invite for ${i.inviteeName} will stop working.`, () => {
                            updateDb((d) => ({ ...d, invites: d.invites.filter((x) => x.code !== i.code) }));
                            toast({ type: 'success', title: 'Invite deleted' });
                          })}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </>
                    }
                  >
                    <KV rows={[['Mobile', `+91 ${i.mobile}`], ['Relation', i.relation], ['Role', i.role === 'adult' ? 'Adult member' : 'View-only member'], ['Sent', fmtDateTime(i.createdAt)]]} />
                  </Item>
                );
              })}
          </div>
        )}

        {tab === 'cookies' && (
          <div className="data-list">
            {db.cookieConsents.length === 0 ? (
              <Empty icon={<Inbox size={20} />} title="No cookie choices yet">
                <span className="small">Use the cookie banner or the Cookie Consent page.</span>
              </Empty>
            ) : (
              [...db.cookieConsents]
                .reverse()
                .filter((c) => match(c.visitorId))
                .map((c) => (
                  <Item
                    key={c.id}
                    title={`Visitor ${c.visitorId.slice(-6)}`}
                    sub={`${fmtDateTime(c.givenAt)} · policy ${c.policyVersion}`}
                    badge={<span className="badge badge-teal">{[c.choice.analytics && 'analytics', c.choice.marketing && 'marketing'].filter(Boolean).join(' + ') || 'essential only'}</span>}
                  />
                ))
            )}
            <p className="xs muted">The consent log is insert-only, as in the product; reset demo data to clear it.</p>
          </div>
        )}
      </Drawer>

      <InviteFormModal open={inviteForm} onClose={() => setInviteForm(false)} />

      <ConfirmDialog
        open={!!confirm}
        title={confirm?.title ?? ''}
        message={confirm?.message ?? ''}
        confirmLabel={confirm?.label ?? 'Delete'}
        onConfirm={() => confirm?.run()}
        onClose={() => setConfirm(null)}
      />
    </>
  );
}

function InviteFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const toast = useToast();
  const blank = { inviterName: 'Rahul Sharma', familyName: 'Sharma Family', inviteeName: '', mobile: '', relation: 'Spouse', role: 'adult' as FamilyRole };
  const [f, setF] = useState(blank);
  const [err, setErr] = useState<Record<string, string | undefined>>({});
  const set = (k: keyof typeof f, v: string) => {
    setF({ ...f, [k]: v });
    setErr({ ...err, [k]: undefined });
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = {
      inviterName: validName(f.inviterName, 'Inviter name'),
      familyName: f.familyName.trim() ? undefined : 'Family name is required',
      inviteeName: validName(f.inviteeName, 'Member name'),
      mobile: validMobile(f.mobile),
    };
    setErr(errors);
    if (Object.values(errors).some(Boolean)) return;
    const code = (f.familyName.replace(/[^A-Za-z]/g, '').slice(0, 5) + Math.random().toString(36).slice(2, 5)).toUpperCase();
    const inv: FamilyInvite = {
      code, inviterName: f.inviterName.trim(), familyName: f.familyName.trim(), inviteeName: f.inviteeName.trim(), mobile: f.mobile,
      relation: f.relation, role: f.role, status: 'invited', createdAt: new Date().toISOString(), expiresAt: addDays(new Date(), 7).toISOString(),
    };
    updateDb((d) => ({ ...d, invites: [inv, ...d.invites] }));
    toast({ type: 'success', title: 'Invite link created', message: `/invite/${code}` });
    setF(blank);
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title="New family invite" subtitle="Simulates the WhatsApp invite the B2C app sends (expires in 7 days).">
      <form className="form-grid" onSubmit={submit} noValidate>
        <Field label="Invited by" required error={err.inviterName} htmlFor="if-inviter">
          <Input id="if-inviter" value={f.inviterName} onChange={(e) => set('inviterName', e.target.value)} invalid={!!err.inviterName} />
        </Field>
        <Field label="Family workspace" required error={err.familyName} htmlFor="if-family">
          <Input id="if-family" value={f.familyName} onChange={(e) => set('familyName', e.target.value)} invalid={!!err.familyName} />
        </Field>
        <Field label="Member name" required error={err.inviteeName} htmlFor="if-name">
          <Input id="if-name" value={f.inviteeName} onChange={(e) => set('inviteeName', e.target.value)} invalid={!!err.inviteeName} />
        </Field>
        <Field label="Relation" htmlFor="if-rel">
          <Select id="if-rel" value={f.relation} onChange={(e) => set('relation', e.target.value)}>
            {RELATIONS.map((r) => <option key={r}>{r}</option>)}
          </Select>
        </Field>
        <Field label="Mobile number" required error={err.mobile} htmlFor="if-mobile" className="full">
          <MobileInput id="if-mobile" value={f.mobile} onChange={(v) => set('mobile', v)} invalid={!!err.mobile} />
        </Field>
        <Field label="Role" htmlFor="if-role" className="full">
          <Select id="if-role" value={f.role} onChange={(e) => set('role', e.target.value)}>
            <option value="adult">Adult member — can add and edit family items</option>
            <option value="view_only">View-only member — views items and gets reminders</option>
          </Select>
        </Field>
        <div className="full row" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">Create invite</button>
        </div>
      </form>
    </Modal>
  );
}
