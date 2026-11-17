import http from 'node:http';

// El portapapeles de la hoja vive en el servidor: se comparte entre pestañas del mismo usuario.
const clipboard = new Map();
const cells = new Map();

const json = (res, status, body) => { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(body)); };
const read = (req) => new Promise((resolve) => { let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => resolve(b ? JSON.parse(b) : {})); });

http.createServer(async (req, res) => {
  const user = req.headers['x-user'] ?? 'anon';
  if (req.url === '/api/clipboard' && req.method === 'POST') { clipboard.set(user, await read(req)); return json(res, 204, {}); }
  if (req.url === '/api/clipboard' && req.method === 'GET') return json(res, 200, clipboard.get(user) ?? null);
  const m = req.url.match(/^\/api\/sheets\/(\w+)\/cells\/(\w+)$/);
  if (m && req.method === 'PUT') { cells.set(`${m[1]}:${m[2]}`, (await read(req)).value); return json(res, 204, {}); }
  if (m && req.method === 'GET') return json(res, 200, { value: cells.get(`${m[1]}:${m[2]}`) ?? '' });
  json(res, 404, {});
}).listen(3001);
