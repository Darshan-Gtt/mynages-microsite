import { useState } from 'react';
import {
  AlertTriangle,
  BellRing,
  Car,
  ClipboardList,
  FileText,
  History,
  IndianRupee,
  Link2,
  ListChecks,
  Phone,
  QrCode,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { cx } from '../lib/utils';

type SectionId = 'details' | 'coverage' | 'due' | 'tasks' | 'documents' | 'service' | 'contacts' | 'cost' | 'timeline';

const SECTIONS: { id: SectionId; label: string; icon: LucideIcon }[] = [
  { id: 'details', label: 'Key details', icon: ListChecks },
  { id: 'coverage', label: 'Coverage', icon: ShieldCheck },
  { id: 'due', label: 'Due & reminders', icon: BellRing },
  { id: 'tasks', label: 'Tasks', icon: ClipboardList },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'service', label: 'Service', icon: Wrench },
  { id: 'contacts', label: 'Contacts', icon: Phone },
  { id: 'cost', label: 'Cost & value', icon: IndianRupee },
  { id: 'timeline', label: 'Timeline', icon: History },
];

const QUICK: { label: string; to: SectionId }[] = [
  { label: '+ Document', to: 'documents' },
  { label: '+ Reminder', to: 'due' },
  { label: '+ Task', to: 'tasks' },
  { label: 'Log service', to: 'service' },
  { label: '+ Expense', to: 'cost' },
  { label: '+ Coverage', to: 'coverage' },
  { label: 'Map contact', to: 'contacts' },
];

type Row = string[];
const TABLES: Record<SectionId, { cols: string[]; rows: Row[]; tone?: (r: Row) => string | undefined }> = {
  details: {
    cols: ['Field', 'Value'],
    rows: [
      ['Registration no.', 'MH 12 RT 4521'],
      ['Variant / fuel', 'ZX 2.4 · Diesel'],
      ['Chassis no.', 'MBJ••••••••••7821'],
      ['Owner', 'Nitin Kulkarni (Self)'],
      ['Location', 'Baner home, Pune'],
      ['Space', 'Family'],
    ],
  },
  coverage: {
    cols: ['Type', 'Provider', 'Policy no.', 'Ends', 'Status'],
    rows: [
      ['Motor insurance', 'ICICI Lombard', '3001/2147/88', '06 Dec 2026', 'Expiring · 11 days'],
      ['Extended warranty', 'Toyota Kirloskar', 'EW-77120', '14 Mar 2027', 'Active'],
    ],
    tone: (r) => (r[4].startsWith('Expiring') ? 'warn' : 'ok'),
  },
  due: {
    cols: ['Due', 'Item', 'Amount', 'Notified'],
    rows: [
      ['06 Dec 2026', 'Insurance renewal', '₹24,860', 'Nitin, Sneha'],
      ['19 Dec 2026', 'PUC certificate', '₹150', 'Nitin'],
      ['02 Jan 2027', 'FASTag recharge', '₹1,000', 'Nitin'],
    ],
  },
  tasks: {
    cols: ['Task', 'Assignee', 'Due', 'Status'],
    rows: [
      ['Get renewal quotes', 'Sneha (Spouse)', '28 Nov, 6 pm', 'In progress'],
      ['Replace wiper blades', 'Nitin (Self)', '05 Dec', 'Open'],
    ],
  },
  documents: {
    cols: ['Document', 'Category', 'Expiry'],
    rows: [
      ['Registration certificate', 'RC', '—'],
      ['Motor policy 2025–26', 'Insurance', '06 Dec 2026'],
      ['Purchase invoice', 'Invoice', '—'],
      ['PUC certificate', 'PUC', '19 Dec 2026'],
    ],
  },
  service: {
    cols: ['Date', 'Provider', 'Work done', 'Cost', 'Odometer'],
    rows: [
      ['12 Sep 2026', 'Toyota service, Baner', '40,000 km service', '₹9,850', '40,212 km'],
      ['08 Mar 2026', 'Toyota service, Baner', 'Brake pads, alignment', '₹6,420', '30,780 km'],
    ],
  },
  contacts: {
    cols: ['Name', 'Purpose', 'Phone'],
    rows: [
      ['Ramesh Patil', 'Insurance agent — renewal', '+91 98220 ••• 41'],
      ['Toyota service, Baner', 'Service and repair', '+91 20 6711 ••••'],
    ],
  },
  cost: {
    cols: ['Date', 'Expense', 'Amount'],
    rows: [
      ['Purchase', 'On-road price (Mar 2023)', '₹22,40,000'],
      ['12 Sep 2026', 'Service', '₹9,850'],
      ['06 Dec 2025', 'Insurance premium', '₹23,410'],
      ['Lifecycle total', '', '₹23,79,680'],
    ],
  },
  timeline: {
    cols: ['Date', 'Event', 'By'],
    rows: [
      ['24 Nov 2026', 'Task “Get renewal quotes” assigned', 'Nitin'],
      ['12 Sep 2026', 'Service logged · 40,212 km', 'Nitin'],
      ['12 Sep 2026', 'Status In repair → In use', 'Nitin'],
      ['14 Mar 2023', 'Asset added', 'Nitin'],
    ],
  },
};

/** Interactive preview of the one-page Asset 360° view (PRD §7.3). */
export function Asset360Showcase() {
  const [sec, setSec] = useState<SectionId>('coverage');
  const t = TABLES[sec];
  return (
    <div className="a360">
      <div className="a360-head">
        <div className="a360-photo"><Car size={30} /></div>
        <div className="a360-id">
          <div className="row-wrap" style={{ gap: 8 }}>
            <b>Toyota Innova Crysta</b>
            <span className="badge badge-success">In use</span>
            <span className="badge">Family</span>
          </div>
          <span className="xs muted">Vehicles › Car · AST-00042 · Added by Nitin, 14 Mar 2023</span>
          <div className="a360-stats">
            <span><em>Current value</em><b>₹14.6 L</b></span>
            <span><em>Insurance</em><b className="warn-text">11 days left</b></span>
            <span><em>Next due</em><b>06 Dec · ₹24,860</b></span>
            <span><em>Open tasks</em><b>2</b></span>
          </div>
        </div>
        <span className="a360-qr" title="Asset QR"><QrCode size={34} /></span>
      </div>

      <button className="a360-alert" onClick={() => setSec('coverage')}>
        <AlertTriangle size={15} /> Motor insurance expires in 11 days — renew now
      </button>

      <div className="a360-quick" role="toolbar" aria-label="Quick actions">
        {QUICK.map((q) => (
          <button key={q.label} onClick={() => setSec(q.to)} className={cx(sec === q.to && 'on')}>
            {q.label}
          </button>
        ))}
      </div>

      <div className="a360-body">
        <nav className="a360-nav" aria-label="Asset sections">
          {SECTIONS.map((s) => (
            <button key={s.id} className={cx(sec === s.id && 'on')} onClick={() => setSec(s.id)} aria-pressed={sec === s.id}>
              <s.icon size={15} /> {s.label}
            </button>
          ))}
        </nav>
        <div className="a360-panel" key={sec}>
          <div className="a360-panel-head">
            <b>{SECTIONS.find((s) => s.id === sec)!.label}</b>
            <span className="xs muted"><Link2 size={12} /> Linked to this asset</span>
          </div>
          <div className="a360-table">
            <table>
              <thead>
                <tr>{t.cols.map((c) => <th key={c}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {t.rows.map((r, i) => (
                  <tr key={i} className={t.tone?.(r)}>
                    {r.map((c, j) => <td key={j}>{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
