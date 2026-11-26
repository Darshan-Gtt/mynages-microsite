import { useId } from 'react';
import { Link } from 'react-router-dom';
import { cx } from '../lib/utils';

type Variant = 'primary' | 'dark' | 'mono';

/** Approved M monogram with the centered yellow dot. */
export function LogoMark({ size = 36, variant = 'primary' }: { size?: number; variant?: Variant }) {
  const id = useId().replace(/:/g, '');
  const mono = variant === 'mono';
  const right = variant === 'dark' ? '#FFFFFF' : mono ? 'currentColor' : '#0F2D3D';
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2DD4BF" />
          <stop offset="1" stopColor="#0E9384" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5EEAD4" />
          <stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
      </defs>
      <path
        d="M11 20 L24 33 L37 20"
        fill="none"
        stroke={mono ? 'currentColor' : `url(#${id}b)`}
        strokeOpacity={mono ? 0.7 : 1}
        strokeWidth="7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="5" y="15" width="10" height="28" rx="5" fill={mono ? 'currentColor' : `url(#${id}a)`} />
      <rect x="33" y="15" width="10" height="28" rx="5" fill={right} />
      <circle cx="24" cy="9" r="5" fill={mono ? 'currentColor' : '#F4C76B'} />
    </svg>
  );
}

export function Logo({
  dark = false,
  withTagline = false,
  size = 36,
  to = '/',
}: {
  dark?: boolean;
  withTagline?: boolean;
  size?: number;
  to?: string | null;
}) {
  const inner = (
    <>
      <LogoMark size={size} variant={dark ? 'dark' : 'primary'} />
      <span>
        <span className="logo-word">Mynages</span>
        {withTagline && <span className="logo-tag">One platform. Everything managed.</span>}
      </span>
    </>
  );
  if (to === null) return <span className={cx('logo', dark && 'on-dark')}>{inner}</span>;
  return (
    <Link to={to} className={cx('logo', dark && 'on-dark')} aria-label="Mynages home">
      {inner}
    </Link>
  );
}
