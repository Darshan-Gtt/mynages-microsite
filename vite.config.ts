import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The dev and preview servers both fall back to index.html,
// so deep links such as /plans or /invite/SHARMA7K survive a refresh.
// GitHub Pages serves each app under /<repo>/ — CI sets PAGES_BASE; local dev and the Capacitor APK use '/'.
export default defineConfig({
  base: (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env.PAGES_BASE || '/',
  plugins: [react()],
  server: { port: 5101 },
  preview: { port: 5101 },
});
