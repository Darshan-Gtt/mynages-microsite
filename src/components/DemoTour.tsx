import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BellRing,
  FileText,
  LayoutGrid,
  ScanLine,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Modal } from './ui/Modal';
import { cx } from '../lib/utils';

const SLIDES: { icon: LucideIcon; title: string; body: string; points: string[] }[] = [
  {
    icon: LayoutGrid,
    title: 'Add anything in under a minute',
    body: 'Pick a category tile — a car, a flat, a laptop, a gold chain — and Mynages asks only the fields that matter for it.',
    points: ['9 ready-made categories for Indian households', 'A house never asks for “Make”; a car always asks for its registration number'],
  },
  {
    icon: ScanLine,
    title: 'One page for every asset',
    body: 'The Asset 360° page shows coverage, renewals, tasks, documents, service history, contacts and costs together — no hunting across screens.',
    points: ['Alerts for expiring cover or overdue payments', 'Quick actions: add document, reminder, task, expense'],
  },
  {
    icon: BellRing,
    title: 'Never miss a date',
    body: 'Insurance, PUC, property tax, AMC, FD maturity, subscriptions — get reminded on push and WhatsApp, as early as you want.',
    points: ['Standard presets or your own lead times', 'Everyone who shares the item gets the reminder'],
  },
  {
    icon: Users,
    title: 'Your family, on the same page',
    body: 'Invite family members by WhatsApp. Shared items are visible to everyone; each member also keeps a private space.',
    points: ['Owner, adult member and view-only roles', 'Profiles for children or elderly parents without a phone'],
  },
  {
    icon: FileText,
    title: 'Find any paper in seconds',
    body: 'Every document belongs to an asset or a person, so the RC is with the car and the vaccination card is with your child.',
    points: ['Search by policy number, serial or name', 'Expiry dates turn into reminders automatically'],
  },
];

export function DemoTour({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    if (open) setI(0);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setI((x) => Math.min(SLIDES.length - 1, x + 1));
      if (e.key === 'ArrowLeft') setI((x) => Math.max(0, x - 1));
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const s = SLIDES[i];
  const Icon = s.icon;
  const last = i === SLIDES.length - 1;

  return (
    <Modal open={open} onClose={onClose} title="Product tour" subtitle={`Step ${i + 1} of ${SLIDES.length}`} size="lg">
      <div className="tour">
        <div className="tour-visual">
          <span className="icon-tile lg navy">
            <Icon size={30} />
          </span>
          <div className="tour-orbit" />
        </div>
        <div className="stack">
          <h3 style={{ fontSize: '1.45rem' }}>{s.title}</h3>
          <p className="lead">{s.body}</p>
          <ul className="check-list">
            {s.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="tour-foot">
        <div className="tour-dots">
          {SLIDES.map((sl, k) => (
            <button key={sl.title} className={cx(k === i && 'on')} onClick={() => setI(k)} aria-label={`Go to step ${k + 1}`} />
          ))}
        </div>
        <div className="row">
          <button className="btn btn-outline btn-sm" disabled={i === 0} onClick={() => setI(i - 1)}>
            <ArrowLeft size={15} /> Back
          </button>
          {last ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                onClose();
                navigate('/signup');
              }}
            >
              Get started <ArrowRight size={15} />
            </button>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => setI(i + 1)}>
              Next <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
