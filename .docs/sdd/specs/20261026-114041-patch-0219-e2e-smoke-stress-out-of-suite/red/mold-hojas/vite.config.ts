/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  test: { environment: 'jsdom', include: ['src/**/*.test.tsx'] },
  server: { proxy: { '/api': 'http://localhost:3001' } },
  plugins: [{
    name: 'dev-login',
    configureServer(server) {
      // Solo en desarrollo: abre la sesión y redirige a next.
      server.middlewares.use('/dev/login', (req, res) => {
        const next = new URL(req.originalUrl ?? '/', 'http://x').searchParams.get('next') ?? '/';
        res.writeHead(302, { location: next }).end();
      });
    },
  }],
});
