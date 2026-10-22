import { mkdirSync, writeFileSync } from 'node:fs';
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { dirname } from 'node:path';
import { UsageError } from '../cli/args.ts';
import { isRecord } from '../cli/records.ts';

export interface Step {
  id: string;
  title: string;
}

type Status = 'pending' | 'ok' | 'ko';

interface Mark extends Step {
  status: Status;
  comment: string;
  markedAt: string | null;
}

export interface ServeOptions {
  steps: Step[];
  out: string;
  panelSource: string;
}

export interface RunningServer {
  url: string;
  close(): Promise<void>;
}

const STATUSES: Status[] = ['pending', 'ok', 'ko'];
const HOST = '127.0.0.1';

const isStep = (value: unknown): value is Step => isRecord(value) && typeof value.id === 'string' && typeof value.title === 'string';

export function parseSteps(text: string, path: string): Step[] {
  const invalid = new UsageError(`${path}: no es una lista de pasos {id, title}`);
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw invalid;
  }
  if (!Array.isArray(parsed) || parsed.length === 0 || !parsed.every(isStep)) throw invalid;
  if (new Set(parsed.map((step) => step.id)).size !== parsed.length) throw invalid;
  return parsed.map(({ id, title }) => ({ id, title }));
}

const escapeHtml = (text: string): string =>
  text.replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char] ?? char);

function page(steps: Step[]): string {
  const items = steps.map((step) => `<li>${escapeHtml(step.title)}</li>`).join('');
  const mount = `sddValidationPanel.mount('serve', ${JSON.stringify(steps).replace(/</g, '\\u003c')});`;
  const onChange = "window.sddValidationPanelOnChange = (marks) => marks.forEach(({ id, status, comment }) =>"
    + " fetch('/mark', { method: 'POST', body: JSON.stringify({ id, status, comment }) }));";
  return `<!doctype html><meta charset="utf-8"><title>Validación</title><ol>${items}</ol>`
    + `<script src="/panel.js"></script><script>${onChange} ${mount}</script>`;
}

class Marks {
  private readonly marks: Mark[];
  private readonly out: string;

  constructor(steps: Step[], out: string) {
    this.out = out;
    this.marks = steps.map((step) => ({ ...step, status: 'pending', comment: '', markedAt: null }));
    mkdirSync(dirname(out), { recursive: true });
    this.save();
  }

  list(): Mark[] {
    return this.marks;
  }

  apply(body: unknown): boolean {
    if (!isRecord(body)) return false;
    const target = this.marks.find((item) => item.id === body.id);
    const status = body.status ?? target?.status;
    if (!target || !STATUSES.includes(status as Status)) return false;
    if (body.comment !== undefined && typeof body.comment !== 'string') return false;
    if (status !== target.status) target.markedAt = new Date().toISOString();
    target.status = status as Status;
    target.comment = (body.comment as string | undefined) ?? target.comment;
    this.save();
    return true;
  }

  private save(): void {
    writeFileSync(this.out, `${JSON.stringify(this.marks, null, 2)}\n`);
  }
}

function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve) => {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve(undefined);
      }
    });
  });
}

function reply(res: ServerResponse, status: number, body: string, type = 'text/plain; charset=utf-8'): void {
  res.writeHead(status, { 'content-type': type });
  res.end(body);
}

function fromThisPage(req: IncomingMessage, port: number): boolean {
  const origin = req.headers.origin;
  return req.headers.host === `${HOST}:${port}` && (origin === undefined || origin === `http://${HOST}:${port}`);
}

function handler(options: ServeOptions, marks: Marks, port: () => number) {
  return async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    if (!fromThisPage(req, port())) return reply(res, 403, 'origen no permitido');
    if (req.method === 'GET' && req.url === '/') return reply(res, 200, page(options.steps), 'text/html; charset=utf-8');
    if (req.method === 'GET' && req.url === '/panel.js') return reply(res, 200, options.panelSource, 'text/javascript; charset=utf-8');
    if (req.method === 'GET' && req.url === '/results') return reply(res, 200, JSON.stringify(marks.list()), 'application/json');
    if (req.method !== 'POST' || req.url !== '/mark') return reply(res, 404, 'no encontrado');
    return marks.apply(await readBody(req)) ? reply(res, 200, 'ok') : reply(res, 400, 'marca no válida');
  };
}

function listen(server: Server): Promise<number> {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, HOST, () => {
      const address = server.address();
      resolve(typeof address === 'object' && address !== null ? address.port : 0);
    });
  });
}

export async function startValidationServer(options: ServeOptions): Promise<RunningServer> {
  const marks = new Marks(options.steps, options.out);
  let port = 0;
  const server = createServer(handler(options, marks, () => port));
  port = await listen(server);
  return {
    url: `http://${HOST}:${port}/`,
    close: () => new Promise((resolve) => server.close(() => resolve())),
  };
}
