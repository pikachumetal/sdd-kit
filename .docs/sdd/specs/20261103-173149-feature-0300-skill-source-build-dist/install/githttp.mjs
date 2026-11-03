// Servidor git smart-HTTP mínimo: CGI de git http-backend sobre la carpeta dada.
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';

const [root, port] = process.argv.slice(2);
createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  const env = {
    ...process.env,
    GIT_PROJECT_ROOT: root,
    GIT_HTTP_EXPORT_ALL: '1',
    PATH_INFO: url.pathname,
    QUERY_STRING: url.search.slice(1),
    REQUEST_METHOD: req.method,
    CONTENT_TYPE: req.headers['content-type'] ?? '',
    CONTENT_LENGTH: req.headers['content-length'] ?? '',
    HTTP_CONTENT_ENCODING: req.headers['content-encoding'] ?? '',
    GIT_PROTOCOL: req.headers['git-protocol'] ?? '',
  };
  const child = spawn('git', ['http-backend'], { env });
  req.pipe(child.stdin);
  let head = Buffer.alloc(0);
  let done = false;
  child.stdout.on('data', (chunk) => {
    if (done) return void res.write(chunk);
    head = Buffer.concat([head, chunk]);
    const i = head.indexOf('\r\n\r\n');
    if (i < 0) return;
    done = true;
    let status = 200;
    for (const line of head.subarray(0, i).toString().split('\r\n')) {
      const [key, ...rest] = line.split(':');
      const value = rest.join(':').trim();
      if (key.toLowerCase() === 'status') status = parseInt(value, 10);
      else res.setHeader(key, value);
    }
    res.writeHead(status);
    res.write(head.subarray(i + 4));
  });
  child.stdout.on('end', () => res.end());
  child.stderr.pipe(process.stderr);
}).listen(Number(port), '127.0.0.1');
console.log(`git http en ${port}`);
