import { useState } from 'react';
import { Send, Smartphone } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Field, MobileInput, SubmitButton } from './ui/Form';
import { useToast } from './ui/Toast';
import { validMobile } from '../lib/validation';
import { maskMobile, sleep } from '../lib/utils';
import { AppleIcon, PlayIcon } from './Icons';

/** Deterministic QR-like pattern (visual only — stands in for the store QR code). */
export function FakeQr({ seed = 'mynages', size = 148 }: { seed?: string; size?: number }) {
  const n = 25;
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const cells: JSX.Element[] = [];
  const finder = (x: number, y: number) => x < 7 && y < 7;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const inFinder = finder(x, y) || finder(n - 1 - x, y) || finder(x, n - 1 - y);
      if (inFinder) continue;
      h = (h * 1103515245 + 12345) >>> 0;
      if ((h >> 16) % 2) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
    }
  }
  const F = ({ x, y }: { x: number; y: number }) => (
    <g>
      <rect x={x} y={y} width="7" height="7" fill="#0F2D3D" />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
      <rect x={x + 2} y={y + 2} width="3" height="3" fill="#0F2D3D" />
    </g>
  );
  return (
    <svg width={size} height={size} viewBox={`-1 -1 ${n + 2} ${n + 2}`} role="img" aria-label="QR code" style={{ background: '#fff' }}>
      <g fill="#0F2D3D">{cells}</g>
      <F x={0} y={0} />
      <F x={n - 7} y={0} />
      <F x={0} y={n - 7} />
      <rect x={10.5} y={10.5} width="4" height="4" rx="1" fill="#F4C76B" />
    </svg>
  );
}

export function AppDownloadModal({ store, onClose }: { store: null | 'ios' | 'android' | 'any'; onClose: () => void }) {
  const toast = useToast();
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const title =
    store === 'ios' ? 'Get Mynages for iPhone' : store === 'android' ? 'Get Mynages for Android' : 'Get the Mynages app';

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validMobile(mobile);
    setError(err);
    if (err) return;
    setLoading(true);
    await sleep(900);
    setLoading(false);
    toast({ type: 'success', title: 'Download link sent', message: `We've sent the app link to +91 ${maskMobile(mobile)} by SMS.` });
    setMobile('');
    onClose();
  };

  return (
    <Modal open={store !== null} onClose={onClose} title={title} subtitle="Families use Mynages on the mobile app. Scan the code or get the link by SMS.">
      <div className="app-dl">
        <div className="app-dl-qr">
          <FakeQr seed={store ?? 'any'} />
          <span className="xs muted center">Scan with your phone camera</span>
        </div>
        <form className="stack" onSubmit={send} noValidate>
          <div className="row" style={{ gap: 10 }}>
            <span className="icon-tile sm">{store === 'ios' ? <AppleIcon size={18} /> : store === 'android' ? <PlayIcon size={16} /> : <Smartphone size={18} />}</span>
            <div>
              <strong className="small">Mynages: One platform. Everything managed.</strong>
              <p className="xs muted">Android 9+ · iOS 15+</p>
            </div>
          </div>
          <Field label="Send me the link" htmlFor="dl-mobile" error={error}>
            <MobileInput id="dl-mobile" value={mobile} onChange={(v) => { setMobile(v); setError(undefined); }} invalid={!!error} />
          </Field>
          <SubmitButton loading={loading} className="btn-block">
            <Send size={16} /> Send link
          </SubmitButton>
          <p className="xs alert alert-demo" style={{ padding: '8px 12px' }}>
            Prototype: the store listing is not live yet, so the QR and SMS are simulated.
          </p>
        </form>
      </div>
    </Modal>
  );
}
