import { useSyncExternalStore } from 'react';
import { createSeedDb, SEED_VERSION } from '../data/seed';
import type { Db } from './types';

/**
 * Browser-side demo database. Everything the visitor submits (sign-ups, enquiries,
 * privacy requests, cookie choices, invites) is kept in localStorage so it survives refresh.
 */
const KEY = 'mynages.microsite.db';

const listeners = new Set<() => void>();
let db: Db = load();

function load(): Db {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Db;
      if (parsed.version === SEED_VERSION) return parsed;
    }
  } catch {
    /* storage blocked or corrupt: fall back to seed */
  }
  return createSeedDb();
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    /* ignore quota / private mode */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

export function getDb(): Db {
  return db;
}

export function updateDb(mutator: (draft: Db) => Db) {
  db = mutator(db);
  persist();
  emit();
}

export function resetDb() {
  db = createSeedDb();
  persist();
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Keep several open tabs in sync.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      db = load();
      emit();
    }
  });
}

/** Returns the whole demo database; re-renders when it changes. */
export function useDb(): Db {
  return useSyncExternalStore(subscribe, () => db);
}

persist();
