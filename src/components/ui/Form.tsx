import {
  useEffect,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { AlertCircle, Check, CheckCircle2, Loader2 } from 'lucide-react';
import { cx } from '../../lib/utils';

export function Field({
  label,
  htmlFor,
  required,
  optional,
  hint,
  error,
  ok,
  children,
  className,
}: {
  label?: ReactNode;
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  hint?: ReactNode;
  error?: string;
  ok?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx('field', className)}>
      {label && (
        <label className="field-label" htmlFor={htmlFor}>
          {label}
          {required && <span className="req">*</span>}
          {optional && <span className="opt">(optional)</span>}
        </label>
      )}
      {children}
      {error ? (
        <span className="field-error" role="alert">
          <AlertCircle size={13} /> {error}
        </span>
      ) : ok ? (
        <span className="field-ok">
          <CheckCircle2 size={13} /> {ok}
        </span>
      ) : (
        hint && <span className="field-hint">{hint}</span>
      )}
    </div>
  );
}

export function Input({ invalid, className, ...rest }: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return <input className={cx('input', invalid && 'has-error', className)} aria-invalid={invalid || undefined} {...rest} />;
}

export function Select({
  invalid,
  className,
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return (
    <select className={cx('select', invalid && 'has-error', className)} aria-invalid={invalid || undefined} {...rest}>
      {children}
    </select>
  );
}

export function Textarea({
  invalid,
  className,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return <textarea className={cx('textarea', invalid && 'has-error', className)} aria-invalid={invalid || undefined} {...rest} />;
}

export function Checkbox({
  checked,
  onChange,
  children,
  disabled,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
  disabled?: boolean;
  id?: string;
}) {
  return (
    <label className={cx('check', disabled && 'disabled')} htmlFor={id}>
      <input id={id} type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span>{children}</span>
    </label>
  );
}

/** Indian mobile number with +91 prefix; digits only. */
export function MobileInput({
  value,
  onChange,
  invalid,
  id,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
  id?: string;
  disabled?: boolean;
}) {
  return (
    <div className="input-group">
      <span className="addon">🇮🇳 +91</span>
      <Input
        id={id}
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="98765 43210"
        maxLength={10}
        value={value}
        disabled={disabled}
        invalid={invalid}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
      />
    </div>
  );
}

/** 6-box OTP entry with paste support and auto-advance. */
export function OtpInput({
  value,
  onChange,
  state,
  autoFocus,
  label = 'One-time password',
}: {
  value: string;
  onChange: (v: string) => void;
  state?: 'error' | 'ok';
  autoFocus?: boolean;
  label?: string;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? '');
  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  const setAt = (i: number, d: string) => {
    const next = digits.slice();
    next[i] = d;
    onChange(next.join('').slice(0, 6));
  };

  return (
    <div className={cx('otp', state === 'error' && 'has-error', state === 'ok' && 'ok')} role="group" aria-label={label}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={d}
          aria-label={`Digit ${i + 1}`}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, '');
            if (!v) return setAt(i, '');
            setAt(i, v.slice(-1));
            refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !digits[i] && i > 0) {
              refs.current[i - 1]?.focus();
              setAt(i - 1, '');
            }
            if (e.key === 'ArrowLeft') refs.current[i - 1]?.focus();
            if (e.key === 'ArrowRight') refs.current[i + 1]?.focus();
          }}
          onPaste={(e) => {
            const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
            if (p) {
              e.preventDefault();
              onChange(p);
              refs.current[Math.min(p.length, 5)]?.focus();
            }
          }}
        />
      ))}
    </div>
  );
}

/** Countdown-gated resend link. */
export function ResendTimer({ onResend, seconds = 30 }: { onResend: () => void; seconds?: number }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  return (
    <button
      type="button"
      className="link-btn small"
      disabled={left > 0}
      onClick={() => {
        onResend();
        setLeft(seconds);
      }}
    >
      {left > 0 ? `Resend OTP in 0:${String(left).padStart(2, '0')}` : 'Resend OTP'}
    </button>
  );
}

/** Simulated human check, standing in for the captcha (captcha_score in signup_requests / enquiries). */
export function Captcha({
  checked,
  onChange,
  error,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="field">
      <div className={cx('captcha', error && 'has-error')}>
        <div className="row">
          <button
            type="button"
            className={cx('captcha-box', checked && 'checked')}
            aria-pressed={checked}
            aria-label="I am not a robot"
            onClick={() => {
              if (checked || busy) return;
              setBusy(true);
              setTimeout(() => {
                setBusy(false);
                onChange(true);
              }, 700);
            }}
          >
            {busy ? <Loader2 size={16} className="spinner" color="#14B8A6" /> : checked ? <Check size={16} /> : null}
          </button>
          <span className="small">I'm not a robot</span>
        </div>
        <span className="xs muted">Security check</span>
      </div>
      {error && (
        <span className="field-error">
          <AlertCircle size={13} /> {error}
        </span>
      )}
    </div>
  );
}

export function SubmitButton({
  loading,
  children,
  className,
  disabled,
  onClick,
  type = 'submit',
}: {
  loading?: boolean;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'submit' | 'button';
}) {
  return (
    <button type={type} className={cx('btn btn-primary', className)} disabled={loading || disabled} onClick={onClick}>
      {loading && <Loader2 size={17} className="spinner" />}
      {children}
    </button>
  );
}
