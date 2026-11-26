import {
  Bell,
  Building2,
  Car,
  ClipboardList,
  FileText,
  Home,
  Laptop,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Wrench,
  Package,
  Users,
  AlertTriangle,
  CalendarClock,
  LayoutDashboard,
  BarChart3,
  Settings,
} from 'lucide-react';
import { LogoMark } from './Logo';

/** B2C app home screen, drawn in CSS for the hero (mirrors the approved B2C template). */
export function PhoneMock() {
  return (
    <div className="phone" aria-hidden="true">
      <div className="phone-notch" />
      <div className="phone-screen">
        <div className="ph-status"><span>9:41</span><span>●●● ▮</span></div>
        <div className="ph-top">
          <span className="row" style={{ gap: 6 }}><LogoMark size={20} /><b>Mynages</b></span>
          <span className="row" style={{ gap: 8 }}><Bell size={14} /><span className="ph-avatar">NK</span></span>
        </div>
        <div className="ph-greet">
          <b>Good morning, Nitin!</b>
          <span>Kulkarni Family · 5 members</span>
        </div>
        <div className="ph-search"><Search size={11} /> Search assets, documents…</div>
        <div className="ph-tiles">
          <div className="ph-tile"><Home size={13} /><span>Assets</span><b>42</b></div>
          <div className="ph-tile"><ShieldCheck size={13} /><span>Family value</span><b>₹1.85 Cr</b></div>
          <div className="ph-tile warn"><CalendarClock size={13} /><span>Due in 7 days</span><b>3</b></div>
          <div className="ph-tile danger"><AlertTriangle size={13} /><span>Overdue</span><b>1</b></div>
        </div>
        <div className="ph-section">
          <b>Upcoming</b><span>View all</span>
        </div>
        {[
          { i: <Car size={12} />, t: 'Car insurance renewal', s: 'Toyota Innova · 06 Dec', tag: 'Due soon', c: 'warn' },
          { i: <Home size={12} />, t: 'Property tax — Baner flat', s: 'PMC · 15 Dec', tag: '₹18,400', c: '' },
          { i: <Wrench size={12} />, t: 'AC service', s: 'Assigned to Sneha · 18 Dec', tag: 'Task', c: '' },
        ].map((r) => (
          <div key={r.t} className="ph-row">
            <span className="ph-ico">{r.i}</span>
            <span className="ph-row-t"><b>{r.t}</b><span>{r.s}</span></span>
            <span className={`ph-tag ${r.c}`}>{r.tag}</span>
          </div>
        ))}
        <div className="ph-nav">
          <span className="on"><Home size={13} />Home</span>
          <span><Package size={13} />Assets</span>
          <span className="ph-plus"><Plus size={16} /></span>
          <span><ClipboardList size={13} />Tasks</span>
          <span><MoreHorizontal size={13} />More</span>
        </div>
      </div>
    </div>
  );
}

/** B2B dashboard frame for business banners. */
export function DashboardMock() {
  return (
    <div className="dash" aria-hidden="true">
      <div className="dash-side">
        <div className="row" style={{ gap: 6, marginBottom: 14 }}>
          <LogoMark size={18} variant="dark" />
          <b style={{ color: '#fff', fontSize: 11 }}>Acme Engg.</b>
        </div>
        {[
          [LayoutDashboard, 'Dashboard', true],
          [Package, 'Assets'],
          [FileText, 'Documents'],
          [CalendarClock, 'Renewals'],
          [ClipboardList, 'Tasks'],
          [Building2, 'Organisation'],
          [Wrench, 'Maintenance'],
          [BarChart3, 'Reports'],
          [Settings, 'Settings'],
        ].map(([I, l, on]) => {
          const Icon = I as typeof Home;
          return (
            <span key={l as string} className={on ? 'on' : ''}>
              <Icon size={11} /> {l as string}
            </span>
          );
        })}
      </div>
      <div className="dash-main">
        <div className="dash-top">
          <span className="dash-search"><Search size={10} /> Search assets, documents…</span>
          <Bell size={12} />
          <span className="ph-avatar">SI</span>
        </div>
        <b className="dash-title">Company overview</b>
        <div className="dash-kpis">
          {[
            ['Total assets', '2,450', '↑ 12%'],
            ['Asset value', '₹8.5 Cr', '↑ 8%'],
            ['Pending approvals', '18', '↓ 2%'],
            ['Maintenance due', '12', '↑ 1%'],
          ].map(([l, v, d]) => (
            <div key={l} className="dash-kpi">
              <span>{l}</span>
              <b>{v}</b>
              <em>{d}</em>
            </div>
          ))}
        </div>
        <div className="dash-row">
          <div className="dash-card">
            <span className="dash-card-t">Asset portfolio</span>
            <div className="donut-wrap">
              <div className="donut"><span>2,450</span></div>
              <ul>
                <li><i style={{ background: '#14B8A6' }} />Vehicles 35%</li>
                <li><i style={{ background: '#0F2D3D' }} />Property 30%</li>
                <li><i style={{ background: '#F4C76B' }} />Electronics 25%</li>
                <li><i style={{ background: '#9FB8C4' }} />Others 10%</li>
              </ul>
            </div>
          </div>
          <div className="dash-card">
            <span className="dash-card-t">Recent activity</span>
            {[
              [Laptop, 'Laptop added — Finance', '2h ago'],
              [Wrench, 'Generator service — Plant 1', '3h ago'],
              [FileText, 'Fire NOC uploaded', '5h ago'],
            ].map(([I, t, s]) => {
              const Icon = I as typeof Home;
              return (
                <div key={t as string} className="dash-act">
                  <span className="ph-ico"><Icon size={10} /></span>
                  <span><b>{t as string}</b><em>{s as string}</em></span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FloatingCard({
  icon,
  title,
  sub,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  className?: string;
}) {
  return (
    <div className={`float-card ${className ?? ''}`} aria-hidden="true">
      <span className="icon-tile sm">{icon}</span>
      <span>
        <b>{title}</b>
        <em>{sub}</em>
      </span>
    </div>
  );
}

export function FamilyAvatars() {
  const people = [
    ['NK', '#14B8A6'],
    ['SK', '#F4C76B'],
    ['AK', '#0F2D3D'],
    ['PK', '#5EEAD4'],
  ];
  return (
    <div className="avatars" aria-hidden="true">
      {people.map(([n, c]) => (
        <span key={n} style={{ background: c, color: c === '#F4C76B' || c === '#5EEAD4' ? '#0F2D3D' : '#fff' }}>{n}</span>
      ))}
      <span className="more"><Users size={12} /></span>
    </div>
  );
}
