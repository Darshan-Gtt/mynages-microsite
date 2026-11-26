// Shapes follow PRD v2.1 Appendix A.4 (Microsite) and the related Admin Console tables.
// Field names are camelCase versions of the documented columns.

export type AccountType = 'individual' | 'business';
export type BillingCycle = 'monthly' | 'yearly';

export type SignupStatus = 'pending' | 'verified' | 'provisioning' | 'completed' | 'failed' | 'expired';

/** signup_requests */
export interface SignupRequest {
  id: string;
  accountType: AccountType;
  formData: Record<string, string>;
  email?: string;
  mobileCountryCode: string;
  mobileNumber: string;
  emailVerifiedAt?: string;
  mobileVerifiedAt?: string;
  selectedPlanId?: string;
  billingCycle?: BillingCycle;
  status: SignupStatus;
  tenantId?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export type EnquiryType = 'sales' | 'support' | 'partnership' | 'other';
export type EnquiryStatus = 'new' | 'in_progress' | 'closed';

/** enquiries */
export interface Enquiry {
  id: string;
  ref: string;
  name: string;
  email: string;
  mobileCountryCode: string;
  mobileNumber?: string;
  enquiringAs: AccountType;
  organisation?: string;
  enquiryType: EnquiryType;
  message: string;
  consentGiven: boolean;
  sourcePage: string;
  status: EnquiryStatus;
  createdAt: string;
}

export type PrivacyRequestType = 'export' | 'delete' | 'correction' | 'other';
export type PrivacyRequestStatus = 'received' | 'verified' | 'in_progress' | 'completed' | 'rejected';

/** privacy_requests */
export interface PrivacyRequest {
  id: string;
  ref: string;
  requesterName: string;
  requesterContact: string;
  requestType: PrivacyRequestType;
  details: string;
  status: PrivacyRequestStatus;
  verifiedAt?: string;
  dueBy: string;
  createdAt: string;
}

/** microsite_cookie_consents (insert-only) */
export interface CookieConsent {
  id: string;
  visitorId: string;
  choice: { essential: true; analytics: boolean; marketing: boolean };
  policyVersion: string;
  givenAt: string;
}

export type InviteStatus = 'invited' | 'joined' | 'declined' | 'expired' | 'removed';
export type FamilyRole = 'adult' | 'view_only';

/** family_invitations (B2C), used by the invite landing page */
export interface FamilyInvite {
  code: string;
  inviterName: string;
  familyName: string;
  inviteeName: string;
  mobile: string;
  relation: string;
  role: FamilyRole;
  status: InviteStatus;
  expiresAt: string;
  createdAt: string;
}

export type TenantLifecycle = 'trialing' | 'active' | 'past_due' | 'cancelled' | 'expired' | 'provisioning';

/** tenants (only what the microsite needs to check sign-ups against) */
export interface Tenant {
  id: string;
  type: AccountType;
  name: string;
  slug?: string;
  ownerName: string;
  ownerEmail?: string;
  ownerMobile?: string;
  industry?: string;
  city?: string;
  planId?: string;
  billingCycle?: BillingCycle;
  lifecycle: TenantLifecycle;
  trialEndsAt?: string;
  invoiceNo?: string;
  createdAt: string;
}

export interface Db {
  version: number;
  signups: SignupRequest[];
  enquiries: Enquiry[];
  privacyRequests: PrivacyRequest[];
  cookieConsents: CookieConsent[];
  invites: FamilyInvite[];
  tenants: Tenant[];
}
