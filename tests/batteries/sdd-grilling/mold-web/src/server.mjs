import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const types = { '.html': 'text/html', '.css': 'text/css', '.json': 'application/json' };
const port = Number(process.env.PORT ?? 5173);

createServer(async (req, res) => {
  const file = join('public', req.url === '/' ? 'index.html' : req.url);
  try {
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'text/plain' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404).end();
  }
}).listen(port);
