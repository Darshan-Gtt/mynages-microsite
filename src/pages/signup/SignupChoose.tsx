import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Check, Info, Users } from 'lucide-react';
import { StoreBadges } from '../../components/StoreBadges';

export function SignupChoosePage() {
  return (
    <section className="signup-wrap">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Sign up</span>
          <h1 style={{ fontSize: 'clamp(1.9rem, 3.6vw, 2.7rem)' }}>How will you use Mynages?</h1>
          <p className="lead">Choose the account type. This can’t be changed later, so pick the one that fits.</p>
        </div>
        <div className="grid grid-2 choose-grid">
          <Link to="/signup/individual" className="card choose-card">
            <span className="icon-tile lg"><Users size={28} /></span>
            <h2>Individual &amp; family</h2>
            <p className="muted">For you and your family — home, vehicles, gadgets, policies, investments and papers.</p>
            <ul className="check-list small">
              <li>Sign up with your mobile number (OTP)</li>
              <li>Choose Individual, Family or Family Plus</li>
              <li>14-day free trial, then use the mobile app</li>
            </ul>
            <span className="btn btn-primary">Continue as individual <ArrowRight size={16} /></span>
          </Link>
          <Link to="/signup/business" className="card choose-card biz">
            <span className="icon-tile lg navy"><Briefcase size={28} /></span>
            <h2>Business</h2>
            <p className="muted">For companies — asset register, custody, maintenance, depreciation and audits across branches.</p>
            <ul className="check-list small">
              <li>Sign up with work email and mobile (both OTP)</li>
              <li>Your own web address and database</li>
              <li>Plan agreed with our team</li>
            </ul>
            <span className="btn btn-navy">Continue as business <ArrowRight size={16} /></span>
          </Link>
        </div>
        <div className="already card">
          <Info size={20} className="text-teal" />
          <div style={{ flex: 1 }}>
            <b>Already have an account?</b>
            <p className="small muted">
              Families sign in on the Mynages app with their mobile number. Businesses sign in at their company address, for example
              <i> yourcompany.mynages.com</i>.
            </p>
          </div>
          <StoreBadges />
        </div>
        <p className="center xs muted" style={{ marginTop: 18 }}>
          <Check size={12} style={{ display: 'inline', verticalAlign: '-2px' }} /> By signing up you agree to the <Link to="/terms">Terms of Use</Link> and <Link to="/privacy">Privacy Policy</Link>.
        </p>
      </div>
    </section>
  );
}
