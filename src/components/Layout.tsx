import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  Building2,
  ChevronDown,
  FlaskConical,
  Mail,
  Menu,
  User,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Logo } from './Logo';
import { StoreBadges } from './StoreBadges';
import { useShell } from './ShellContext';
import { cx } from '../lib/utils';

interface NavGroup {
  label: string;
  to?: string;
  match?: string;
  items?: { to: string; label: string; desc: string; icon: LucideIcon }[];
}

const NAV: NavGroup[] = [
  { label: 'Home', to: '/' },
  {
    label: 'Features',
    match: '/features',
    items: [
      { to: '/features/individuals', label: 'For Individuals', desc: 'Family assets, documents and reminders', icon: User },
      { to: '/features/business', label: 'For Business', desc: 'Asset register, custody, audits', icon: Briefcase },
    ],
  },
  {
    label: 'Use Cases',
    match: '/use-cases',
    items: [
      { to: '/use-cases/personal', label: 'Personal', desc: 'Households, parents, NRIs', icon: Users },
      { to: '/use-cases/business', label: 'Business', desc: 'Incl. multi-branch organisations', icon: Building2 },
    ],
  },
  { label: 'Plans', to: '/plans' },
  { label: 'FAQs', to: '/faqs' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

function Dropdown({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => setOpen(false), [loc.pathname]);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  const active = group.match && loc.pathname.startsWith(group.match);
  return (
    <div className="nav-dd" ref={ref} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className={cx('nav-link', active && 'active')} aria-expanded={open} aria-haspopup="true" onClick={() => setOpen(!open)}>
        {group.label} <ChevronDown size={14} />
      </button>
      {open && (
        <div className="nav-menu" role="menu">
          {group.items!.map((it) => (
            <Link key={it.to} to={it.to} className="nav-menu-item" role="menuitem">
              <span className="icon-tile sm"><it.icon size={17} /></span>
              <span>
                <b>{it.label}</b>
                <em>{it.desc}</em>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();
  useEffect(() => setMobileOpen(false), [loc.pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }, [mobileOpen]);

  return (
    <header className={cx('site-header', scrolled && 'scrolled')}>
      <div className="container header-inner">
        <Logo />
        <nav className="main-nav" aria-label="Main">
          {NAV.map((g) =>
            g.items ? (
              <Dropdown key={g.label} group={g} />
            ) : (
              <NavLink key={g.label} to={g.to!} end={g.to === '/'} className={({ isActive }) => cx('nav-link', isActive && 'active')}>
                {g.label}
              </NavLink>
            ),
          )}
        </nav>
        <div className="header-cta">
          <Link to="/signup" className="btn btn-primary btn-sm">
            Get Started <ArrowRight size={15} />
          </Link>
          <button className="btn btn-ghost btn-icon burger" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="mobile-nav">
          {NAV.map((g) =>
            g.items ? (
              <div key={g.label} className="mobile-group">
                <span className="mobile-group-label">{g.label}</span>
                {g.items.map((it) => (
                  <NavLink key={it.to} to={it.to} className={({ isActive }) => cx('mobile-link', isActive && 'active')}>
                    <it.icon size={17} /> {it.label}
                  </NavLink>
                ))}
              </div>
            ) : (
              <NavLink key={g.label} to={g.to!} end={g.to === '/'} className={({ isActive }) => cx('mobile-link', isActive && 'active')}>
                {g.label}
              </NavLink>
            ),
          )}
          <Link to="/signup" className="btn btn-primary btn-block" style={{ marginTop: 12 }}>
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const { openCookiePrefs } = useShell();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="stack" style={{ maxWidth: 320 }}>
            <Logo dark withTagline size={40} />
            <p className="small" style={{ color: '#9fb8c4' }}>
              Assets, documents, renewals and tasks for families and businesses — in one place.
            </p>
            <a href="mailto:hello@mynages.com" className="footer-mail">
              <Mail size={15} /> hello@mynages.com
            </a>
          </div>
          <div>
            <h4>Product</h4>
            <Link to="/features/individuals">For Individuals</Link>
            <Link to="/features/business">For Business</Link>
            <Link to="/plans">Plans</Link>
            <Link to="/signup">Sign up</Link>
          </div>
          <div>
            <h4>Use cases</h4>
            <Link to="/use-cases/personal">Personal</Link>
            <Link to="/use-cases/business">Business</Link>
            <Link to="/faqs">FAQs</Link>
            <Link to="/about">About us</Link>
            <Link to="/contact">Contact us</Link>
          </div>
          <div>
            <h4>Legal</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Use</Link>
            <Link to="/trust-security">Trust &amp; Security</Link>
            <Link to="/privacy-request">Privacy Request</Link>
            <Link to="/cookies">Cookie Consent</Link>
            <button className="footer-linkbtn" onClick={openCookiePrefs}>Cookie preferences</button>
          </div>
          <div>
            <h4>Get the app</h4>
            <StoreBadges />
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Mynages. All rights reserved.</span>
          <span>One platform. Everything managed.</span>
        </div>
      </div>
    </footer>
  );
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50);
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);
  return null;
}

export function Layout() {
  const { openDemoPanel } = useShell();
  return (
    <>
      <ScrollToTop />
      <a href="#main" className="skip-link">Skip to content</a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <button className="demo-fab" onClick={openDemoPanel} aria-label="Open demo data panel" title="Demo data">
        <FlaskConical size={18} /> <span>Demo</span>
      </button>
    </>
  );
}
