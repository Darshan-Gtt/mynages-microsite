import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { AppDownloadModal } from './AppDownloadModal';
import { DemoTour } from './DemoTour';
import { DemoPanel } from './DemoPanel';
import { CookieBanner, CookiePreferencesModal } from './CookieConsent';

interface ShellApi {
  openAppDownload: (store?: 'ios' | 'android') => void;
  openTour: () => void;
  openDemoPanel: () => void;
  openCookiePrefs: () => void;
}

const Ctx = createContext<ShellApi>({
  openAppDownload: () => {},
  openTour: () => {},
  openDemoPanel: () => {},
  openCookiePrefs: () => {},
});

/** Global overlays used from many pages: app download, product tour, cookie preferences and the demo panel. */
export function ShellProvider({ children }: { children: ReactNode }) {
  const [app, setApp] = useState<null | 'ios' | 'android' | 'any'>(null);
  const [tour, setTour] = useState(false);
  const [demo, setDemo] = useState(false);
  const [cookies, setCookies] = useState(false);

  const api = useMemo<ShellApi>(
    () => ({
      openAppDownload: (s) => setApp(s ?? 'any'),
      openTour: () => setTour(true),
      openDemoPanel: () => setDemo(true),
      openCookiePrefs: () => setCookies(true),
    }),
    [],
  );

  return (
    <Ctx.Provider value={api}>
      {children}
      <AppDownloadModal store={app} onClose={() => setApp(null)} />
      <DemoTour open={tour} onClose={() => setTour(false)} />
      <DemoPanel open={demo} onClose={() => setDemo(false)} />
      <CookieBanner onCustomise={() => setCookies(true)} />
      <CookiePreferencesModal open={cookies} onClose={() => setCookies(false)} />
    </Ctx.Provider>
  );
}

export const useShell = () => useContext(Ctx);
