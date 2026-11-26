import { useState, type ReactNode } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cx } from '../../lib/utils';

export function Accordion({
  items,
  defaultOpen,
}: {
  items: { id: string; title: ReactNode; body: ReactNode; icon?: ReactNode }[];
  defaultOpen?: string;
}) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null);
  return (
    <div className="accordion">
      {items.map((it) => {
        const isOpen = open === it.id;
        return (
          <div key={it.id} className={cx('acc-item', isOpen && 'open')}>
            <button
              className="acc-trigger"
              aria-expanded={isOpen}
              aria-controls={`acc-${it.id}`}
              onClick={() => setOpen(isOpen ? null : it.id)}
            >
              {it.icon}
              <span>{it.title}</span>
              <ChevronDown size={18} className="chev" />
            </button>
            {isOpen && (
              <div className="acc-panel" id={`acc-${it.id}`}>
                {it.body}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="stepper" aria-label="Progress">
      {steps.map((s, i) => (
        <div key={s} style={{ display: 'contents' }}>
          <div className={cx('step', i === current && 'active', i < current && 'done')} aria-current={i === current ? 'step' : undefined}>
            <span className="step-dot">{i < current ? <Check size={14} /> : i + 1}</span>
            <span className="step-label">{s}</span>
          </div>
          {i < steps.length - 1 && <span className={cx('step-line', i < current && 'done')} />}
        </div>
      ))}
    </div>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  dark,
  label,
}: {
  options: { value: T; label: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  dark?: boolean;
  label: string;
}) {
  return (
    <div className={cx('segmented', dark && 'dark')} role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={value === o.value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Empty({ icon, title, children }: { icon: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="empty">
      <span className="icon-tile">{icon}</span>
      <h4>{title}</h4>
      {children}
    </div>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  left,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  left?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={cx('section-head', left && 'left')}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {lead && <p className="lead">{lead}</p>}
      {children}
    </div>
  );
}
