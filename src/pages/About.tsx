import { Link } from 'react-router-dom';
import { ArrowRight, Boxes, Layers, Link2, ListChecks, Repeat, Target } from 'lucide-react';
import { LogoMark } from '../components/Logo';
import { SectionHead } from '../components/ui/Misc';

const PRINCIPLES = [
  { icon: Target, title: 'Serve the tagline', desc: 'Every screen must help you manage everything from one platform. A feature that does not, waits.' },
  { icon: Link2, title: 'Everything hangs off an asset or a person', desc: 'Documents, cover, tasks, reminders, contacts and expenses always belong somewhere — so they are always findable.' },
  { icon: Layers, title: 'One core, two front ends', desc: 'Families and businesses share the same asset engine; only the experience is shaped differently.' },
  { icon: ListChecks, title: 'Fields first, screens second', desc: 'A car asks for its registration number; a house never asks for a “make”.' },
  { icon: Boxes, title: 'Masters, not hard-coding', desc: 'Categories, fields, icons, reminder presets and plans are configurable, so Mynages adapts as you grow.' },
  { icon: Repeat, title: 'One frame, two layouts', desc: 'The same Asset 360° page works on your phone and on the web.' },
];

export function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container about-hero">
          <div className="stack">
            <span className="eyebrow">About us</span>
            <h1>We help people keep track of what matters</h1>
            <p className="lead">
              Most families and businesses manage their assets with a mix of drawers, spreadsheets, WhatsApp threads and memory.
              Renewals slip, warranties lapse and papers go missing exactly when they’re needed. Mynages brings it all into one place.
            </p>
          </div>
          <div className="about-mark" aria-hidden="true">
            <LogoMark size={180} />
          </div>
        </div>
      </section>

      <section className="section-sm">
        <div className="container grid grid-2 mission">
          <div className="card">
            <span className="eyebrow">Our promise to families</span>
            <h3 style={{ marginTop: 10 }}>All your family’s assets in one place, shared with your family, with nothing missed.</h3>
          </div>
          <div className="card">
            <span className="eyebrow">Our promise to businesses</span>
            <h3 style={{ marginTop: 10 }}>Every asset tagged, accounted for and audit-ready — across every branch.</h3>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <SectionHead eyebrow="How we build" title="The principles behind Mynages" />
          <div className="grid grid-3">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="card">
                <span className="icon-tile"><p.icon size={22} /></span>
                <h3 style={{ margin: '14px 0 6px' }}>{p.title}</h3>
                <p className="small muted">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Our identity" title="The M, and the dot" lead="Two strokes that hold everything together, and a yellow dot for the one thing you must not miss." />
          <div className="brand-row">
            {[
              ['Deep Navy', '#0F2D3D', '#fff'],
              ['Teal', '#14B8A6', '#fff'],
              ['Warm Yellow', '#F4C76B', '#0F2D3D'],
              ['Light Gray', '#EAF1F4', '#0F2D3D'],
            ].map(([n, c, fg]) => (
              <div key={n} className="swatch" style={{ background: c, color: fg }}>
                <b>{n}</b>
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div className="cta-band">
            <div className="stack-sm">
              <h2>Want to talk to the team?</h2>
              <p>Partnerships, enterprise pilots or feedback — we read every message.</p>
            </div>
            <Link to="/contact" className="btn btn-yellow btn-lg">Contact us <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
