import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Layout } from './components/Layout';
import { HomePage } from './pages/Home';
import { AboutPage } from './pages/About';
import { FeaturesPage } from './pages/Features';
import { UseCasesPage } from './pages/UseCases';
import { PlansPage } from './pages/Plans';
import { FaqsPage } from './pages/Faqs';
import { ContactPage } from './pages/Contact';
import { SignupChoosePage } from './pages/signup/SignupChoose';
import { IndividualSignupPage } from './pages/signup/IndividualSignup';
import { BusinessSignupPage } from './pages/signup/BusinessSignup';
import { InviteLandingPage } from './pages/InviteLanding';
import { PrivacyRequestPage } from './pages/PrivacyRequest';
import { CookiesPage, PrivacyPolicyPage, TermsPage, TrustSecurityPage } from './pages/Legal';
import { NotFoundPage } from './pages/NotFound';

const TITLES: Record<string, string> = {
  '/': 'Mynages — One platform. Everything managed.',
  '/about': 'About us',
  '/features/individuals': 'Features for individuals',
  '/features/business': 'Features for business',
  '/use-cases/personal': 'Personal use cases',
  '/use-cases/business': 'Business use cases',
  '/plans': 'Plans',
  '/faqs': 'FAQs',
  '/contact': 'Contact us',
  '/signup': 'Sign up',
  '/signup/individual': 'Individual sign-up',
  '/signup/business': 'Business sign-up',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms of Use',
  '/trust-security': 'Trust & Security',
  '/privacy-request': 'Privacy Request',
  '/cookies': 'Cookie Consent',
};

function DocumentTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    const t = TITLES[pathname] ?? (pathname.startsWith('/invite') ? 'Family invite' : 'Page not found');
    document.title = pathname === '/' ? t : `${t} · Mynages`;
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <DocumentTitle />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="features" element={<Navigate to="/features/individuals" replace />} />
          <Route path="features/individuals" element={<FeaturesPage audience="individual" />} />
          <Route path="features/business" element={<FeaturesPage audience="business" />} />
          <Route path="use-cases" element={<Navigate to="/use-cases/personal" replace />} />
          <Route path="use-cases/personal" element={<UseCasesPage audience="personal" />} />
          <Route path="use-cases/business" element={<UseCasesPage audience="business" />} />
          <Route path="plans" element={<PlansPage />} />
          <Route path="faqs" element={<FaqsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="signup" element={<SignupChoosePage />} />
          <Route path="signup/individual" element={<IndividualSignupPage />} />
          <Route path="signup/business" element={<BusinessSignupPage />} />
          <Route path="invite" element={<InviteLandingPage />} />
          <Route path="invite/:code" element={<InviteLandingPage />} />
          <Route path="privacy" element={<PrivacyPolicyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="trust-security" element={<TrustSecurityPage />} />
          <Route path="privacy-request" element={<PrivacyRequestPage />} />
          <Route path="cookies" element={<CookiesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
