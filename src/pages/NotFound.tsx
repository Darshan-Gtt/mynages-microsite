import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';

export function NotFoundPage() {
  const { pathname } = useLocation();
  return (
    <section className="signup-wrap">
      <div className="container signup-narrow">
        <div className="card form-card stack center-stack">
          <span className="icon-tile lg"><Compass size={28} /></span>
          <h1 style={{ fontSize: '2rem' }}>Page not found</h1>
          <p className="muted">We couldn’t find <code>{pathname}</code>. It may have moved.</p>
          <div className="row-wrap" style={{ justifyContent: 'center' }}>
            <Link to="/" className="btn btn-primary">Go to home <ArrowRight size={16} /></Link>
            <Link to="/faqs" className="btn btn-outline">FAQs</Link>
            <Link to="/contact" className="btn btn-ghost">Contact us</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
