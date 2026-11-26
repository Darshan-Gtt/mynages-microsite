export type Errors<T> = Partial<Record<keyof T, string>>;

export const rx = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  indianMobile: /^[6-9]\d{9}$/,
  gstin: /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
  slug: /^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])$/,
  upi: /^[\w.-]{2,}@[a-zA-Z]{2,}$/,
  name: /^[A-Za-z][A-Za-z .'-]{1,}$/,
};

export function required(v: string | undefined | null, label: string): string | undefined {
  return v && v.trim() ? undefined : `${label} is required`;
}

export function validEmail(v: string, label = 'Email'): string | undefined {
  if (!v.trim()) return `${label} is required`;
  return rx.email.test(v.trim()) ? undefined : 'Enter a valid email address';
}

export function validMobile(v: string): string | undefined {
  if (!v.trim()) return 'Mobile number is required';
  return rx.indianMobile.test(v.trim()) ? undefined : 'Enter a valid 10-digit Indian mobile number';
}

export function validName(v: string, label = 'Name'): string | undefined {
  if (!v.trim()) return `${label} is required`;
  if (v.trim().length < 2) return `${label} is too short`;
  return rx.name.test(v.trim()) ? undefined : `${label} can only contain letters, spaces and . ' -`;
}

export function hasErrors<T>(e: Errors<T>): boolean {
  return Object.values(e).some(Boolean);
}
