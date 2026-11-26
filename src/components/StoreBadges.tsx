import { AppleIcon, PlayIcon } from './Icons';
import { useShell } from './ShellContext';

export function StoreBadges() {
  const { openAppDownload } = useShell();
  return (
    <div className="store-badges">
      <button type="button" className="store-badge" onClick={() => openAppDownload('ios')}>
        <AppleIcon size={26} />
        <span>
          <small>Download on the</small>
          <strong>App Store</strong>
        </span>
      </button>
      <button type="button" className="store-badge" onClick={() => openAppDownload('android')}>
        <PlayIcon size={22} />
        <span>
          <small>GET IT ON</small>
          <strong>Google Play</strong>
        </span>
      </button>
    </div>
  );
}
