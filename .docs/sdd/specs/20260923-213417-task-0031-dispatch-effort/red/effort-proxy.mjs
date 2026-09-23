import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
const logFile = process.argv[2];
http.createServer((req, res) => {
  const chunks = [];
  req.on('data', c => chunks.push(c));
  req.on('end', () => {
    const body = Buffer.concat(chunks);
    try {
      const j = JSON.parse(body.toString());
      fs.appendFileSync(logFile, JSON.stringify({ path: req.url, model: j.model, output_config: j.output_config, thinking: j.thinking, system0: JSON.stringify(j.system ?? '').slice(0, 120) }) + '\n');
    } catch { fs.appendFileSync(logFile, JSON.stringify({ path: req.url, raw: true }) + '\n'); }
    const headers = { ...req.headers, host: 'api.anthropic.com' };
    const up = https.request({ host: 'api.anthropic.com', path: req.url, method: req.method, headers }, r => { res.writeHead(r.statusCode, r.headers); r.pipe(res); });
    up.on('error', e => { res.writeHead(502); res.end(String(e)); });
    up.end(body);
  });
}).listen(8787, () => console.log('proxy on 8787'));
