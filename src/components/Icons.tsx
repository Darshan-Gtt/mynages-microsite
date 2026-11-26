import {
  Car,
  Gem,
  Globe,
  Home,
  Laptop,
  Package,
  PiggyBank,
  Refrigerator,
  Sofa,
  type LucideProps,
} from 'lucide-react';

const MAP: Record<string, React.ComponentType<LucideProps>> = {
  car: Car,
  home: Home,
  laptop: Laptop,
  fridge: Refrigerator,
  sofa: Sofa,
  gem: Gem,
  piggy: PiggyBank,
  globe: Globe,
  package: Package,
};

export function CategoryIcon({ name, size = 22 }: { name: string; size?: number }) {
  const C = MAP[name] ?? Package;
  return <C size={size} />;
}

export function AppleIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.37 12.6c-.02-2.3 1.88-3.4 1.97-3.46-1.07-1.57-2.74-1.78-3.33-1.8-1.42-.14-2.77.83-3.49.83-.72 0-1.83-.81-3.01-.79-1.55.02-2.98.9-3.78 2.29-1.61 2.8-.41 6.94 1.16 9.21.77 1.11 1.68 2.36 2.88 2.31 1.16-.05 1.6-.75 3-.75s1.79.75 3.01.72c1.25-.02 2.03-1.13 2.79-2.25.88-1.29 1.24-2.54 1.26-2.6-.03-.01-2.42-.93-2.46-3.51zM14.07 5.85c.64-.77 1.07-1.85.95-2.92-.92.04-2.03.61-2.69 1.38-.59.68-1.11 1.77-.97 2.82 1.03.08 2.07-.52 2.71-1.28z" />
    </svg>
  );
}

export function PlayIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.6 2.2 13.4 12l-9.8 9.8c-.36-.2-.6-.6-.6-1.07V3.27c0-.47.24-.87.6-1.07z" fill="#00d7fe" />
      <path d="m16.7 8.7-3.3 3.3-9.8-9.8c.33-.18.75-.18 1.13.03l11.97 6.47z" fill="#00f076" />
      <path d="m16.7 15.3-11.97 6.47c-.38.21-.8.21-1.13.03l9.8-9.8 3.3 3.3z" fill="#ff3a44" />
      <path d="M20.4 12c0 .47-.26.9-.68 1.13l-3.02 2.17L13.4 12l3.3-3.3 3.02 2.17c.42.23.68.66.68 1.13z" fill="#ffd400" />
    </svg>
  );
}
