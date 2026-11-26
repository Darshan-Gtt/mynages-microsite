import type { Db } from '../lib/types';

export const SEED_VERSION = 1;

const day = 86_400_000;
const iso = (offsetDays: number, hour = 10) => {
  const d = new Date(Date.now() + offsetDays * day);
  d.setHours(hour, 15, 0, 0);
  return d.toISOString();
};

/**
 * Demo records. Dates are relative to "today" so invites and trials always look current.
 * Demo shortcuts (also listed in the Demo panel):
 *  - OTP for every verification: 123456
 *  - Mobile 9876543210 already has an account (Nitin Kulkarni)
 *  - Mobile 9822012345 has a pending invite to the Sharma Family
 *  - Business slug "acme" and email owner@acmeengg.in are already registered
 *  - UPI ID fail@upi simulates a failed payment
 */
export function createSeedDb(): Db {
  return {
    version: SEED_VERSION,
    tenants: [
      {
        id: 'ten_kulkarni', type: 'individual', name: "Nitin's Family", ownerName: 'Nitin Kulkarni',
        ownerMobile: '9876543210', ownerEmail: 'nitin.kulkarni@gmail.com', planId: 'family', billingCycle: 'yearly',
        lifecycle: 'active', createdAt: iso(-210),
      },
      {
        id: 'ten_sharma', type: 'individual', name: 'Sharma Family', ownerName: 'Rahul Sharma',
        ownerMobile: '9811122233', planId: 'family_plus', billingCycle: 'monthly', lifecycle: 'trialing',
        trialEndsAt: iso(9), createdAt: iso(-5),
      },
      {
        id: 'ten_acme', type: 'business', name: 'Acme Engineering Pvt Ltd', slug: 'acme', ownerName: 'Suresh Iyer',
        ownerEmail: 'owner@acmeengg.in', ownerMobile: '9890011122', industry: 'Manufacturing', city: 'Pune',
        lifecycle: 'active', createdAt: iso(-400),
      },
      {
        id: 'ten_kaveri', type: 'business', name: 'Kaveri Foods Ltd', slug: 'kaveri-foods', ownerName: 'Lakshmi Narayan',
        ownerEmail: 'it@kaverifoods.in', ownerMobile: '9845098450', industry: 'Food & Beverage', city: 'Mysuru',
        lifecycle: 'active', createdAt: iso(-120),
      },
      {
        id: 'ten_vrindavan', type: 'business', name: 'Vrindavan Infra Projects', slug: 'vrindavan-infra', ownerName: 'Amit Agarwal',
        ownerEmail: 'admin@vrindavaninfra.com', ownerMobile: '9829012345', industry: 'Construction & Infrastructure', city: 'Jaipur',
        lifecycle: 'active', createdAt: iso(-60),
      },
    ],
    invites: [
      {
        code: 'SHARMA7K', inviterName: 'Rahul Sharma', familyName: 'Sharma Family', inviteeName: 'Priya Sharma',
        mobile: '9822012345', relation: 'Spouse', role: 'adult', status: 'invited', expiresAt: iso(5), createdAt: iso(-2),
      },
      {
        code: 'SHARMA2M', inviterName: 'Rahul Sharma', familyName: 'Sharma Family', inviteeName: 'Kamla Sharma',
        mobile: '9822054321', relation: 'Mother', role: 'view_only', status: 'invited', expiresAt: iso(6), createdAt: iso(-1),
      },
      {
        code: 'MEHTA4X', inviterName: 'Neha Mehta', familyName: 'Mehta Family', inviteeName: 'Arjun Mehta',
        mobile: '9765400012', relation: 'Son', role: 'adult', status: 'invited', expiresAt: iso(-3), createdAt: iso(-10),
      },
      {
        code: 'KULK9Q', inviterName: 'Nitin Kulkarni', familyName: "Nitin's Family", inviteeName: 'Sneha Kulkarni',
        mobile: '9876500011', relation: 'Spouse', role: 'adult', status: 'joined', expiresAt: iso(-150), createdAt: iso(-157),
      },
    ],
    signups: [
      {
        id: 'sr_seed1', accountType: 'individual', formData: { fullName: 'Rahul Sharma' }, mobileCountryCode: '+91',
        mobileNumber: '9811122233', mobileVerifiedAt: iso(-5), selectedPlanId: 'family_plus', billingCycle: 'monthly',
        status: 'completed', tenantId: 'ten_sharma', createdAt: iso(-5), updatedAt: iso(-5), expiresAt: iso(-4),
      },
      {
        id: 'sr_seed2', accountType: 'business',
        formData: { companyName: 'Deccan Diagnostics LLP', slug: 'deccan-diagnostics', industry: 'Healthcare', city: 'Hyderabad', contactName: 'Farhan Qureshi' },
        email: 'farhan@deccandiagnostics.in', mobileCountryCode: '+91', mobileNumber: '9700012345',
        emailVerifiedAt: iso(-1), status: 'pending', createdAt: iso(-1), updatedAt: iso(-1), expiresAt: iso(1),
      },
    ],
    enquiries: [
      {
        id: 'enq_seed1', ref: 'ENQ-2026-4127', name: 'Kavita Reddy', email: 'kavita.reddy@sriramhospitals.in',
        mobileCountryCode: '+91', mobileNumber: '9849011223', enquiringAs: 'business', organisation: 'Sri Ram Multispeciality Hospitals',
        enquiryType: 'sales', message: 'We have 6 branches and around 3,200 medical devices that need calibration tracking. Please share a demo slot next week.',
        consentGiven: true, sourcePage: '/use-cases/business', status: 'in_progress', createdAt: iso(-3, 14),
      },
      {
        id: 'enq_seed2', ref: 'ENQ-2026-4133', name: 'Aditya Joshi', email: 'aditya.j@outlook.com', mobileCountryCode: '+91',
        enquiringAs: 'individual', enquiryType: 'support', message: 'Can my parents in Nagpur use the app on their phone if I pay for the Family plan?',
        consentGiven: true, sourcePage: '/plans', status: 'new', createdAt: iso(-1, 19),
      },
    ],
    privacyRequests: [
      {
        id: 'pr_seed1', ref: 'PR-2026-0318', requesterName: 'Meera Pillai', requesterContact: 'meera.pillai@gmail.com',
        requestType: 'export', details: 'Please send a copy of all data held for my family workspace.', status: 'in_progress',
        verifiedAt: iso(-6), dueBy: iso(24).slice(0, 10), createdAt: iso(-6),
      },
    ],
    cookieConsents: [],
  };
}
