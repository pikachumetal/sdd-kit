import http from 'node:http';
import { readFileSync } from 'node:fs';

const { port } = JSON.parse(readFileSync(new URL('./e2e/config.json', import.meta.url)));
const appUrl = new URL('./src/app.js', import.meta.url).href;
// Cada sesión de test tiene su propio estado de la app: sus datos nacen y mueren con ella.
const sessions = new Map();
const appFor = (session) => {
  if (!sessions.has(session)) sessions.set(session, import(`${appUrl}?session=${session}`));
  return sessions.get(session);
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  if (url.pathname === '/health') return res.end('ok');
  if (url.pathname === '/shutdown') { res.end('bye'); server.close(); process.exit(0); }
  if (url.pathname !== '/run') { res.statusCode = 404; return res.end(); }
  const { run } = await appFor(req.headers['x-session'] ?? 'anon');
  res.end(run(url.searchParams.get('cmd'), JSON.parse(url.searchParams.get('args') ?? '[]')));
});
server.listen(port);
