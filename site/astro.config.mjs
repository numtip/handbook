// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://numtip.github.io',
  base: '/handbook',
vite: { plugins: [tailwindcss()] },
});
