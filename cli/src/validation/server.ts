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

type Content = { body: string; type: string };

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

const inlineJson = (value: unknown): string => JSON.stringify(value).replace(/</g, '\\u003c');

// Salen en orden y solo los pasos que cambian; el estado, solo si cambió, para no renovar su markedAt.
const POST_CHANGED_MARKS = `let queue = Promise.resolve();
window.sddValidationPanelOnChange = (marks) => marks.forEach(({ id, status, comment }) => {
  const last = sent[id];
  if (last.status === status && last.comment === comment) return;
  const body = JSON.stringify(last.status === status ? { id, comment } : { id, status, comment });
  sent[id] = { status, comment };
  queue = queue.then(() => fetch('/mark', { method: 'POST', body })).catch(() => {});
});`;

// El navegador parte de las marcas del servidor: un puerto ya usado no hereda las de otra validación.
function page(marks: Mark[]): string {
  const items = marks.map((mark) => `<li>${escapeHtml(mark.title)}</li>`).join('');
  const sent = Object.fromEntries(marks.map(({ id, status, comment }) => [id, { status, comment }]));
  const seed = `localStorage.setItem('sdd-validation-serve', ${inlineJson(JSON.stringify(marks))});`;
  return `<!doctype html><meta charset="utf-8"><link rel="icon" href="data:,"><title>Validación</title><ol>${items}</ol>`
    + `<script src="/panel.js"></script><script>const sent = ${inlineJson(sent)}; ${POST_CHANGED_MARKS} ${seed} sddValidationPanel.mount('serve');</script>`;
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
    if (body.status !== undefined) target.markedAt = new Date().toISOString();
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
    req.on('error', () => resolve(undefined));
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve(undefined);
      }
    });
  });
}

function reply(res: ServerResponse, status: number, content: Content | string): void {
  const { body, type } = typeof content === 'string' ? { body: content, type: 'text/plain; charset=utf-8' } : content;
  res.writeHead(status, { 'content-type': type });
  res.end(body);
}

function fromThisPage(req: IncomingMessage, port: number): boolean {
  const origin = req.headers.origin;
  return req.headers.host === `${HOST}:${port}` && (origin === undefined || origin === `http://${HOST}:${port}`);
}

function readRoutes(options: ServeOptions, marks: Marks): Record<string, () => Content> {
  return {
    '/': () => ({ body: page(marks.list()), type: 'text/html; charset=utf-8' }),
    '/panel.js': () => ({ body: options.panelSource, type: 'text/javascript; charset=utf-8' }),
    '/results': () => ({ body: JSON.stringify(marks.list()), type: 'application/json' }),
  };
}

async function saveMark(req: IncomingMessage, res: ServerResponse, marks: Marks): Promise<void> {
  try {
    return marks.apply(await readBody(req)) ? reply(res, 200, 'ok') : reply(res, 400, 'marca no válida');
  } catch {
    return reply(res, 500, 'no se pudo guardar');
  }
}

function handler(options: ServeOptions, marks: Marks, port: () => number) {
  const routes = readRoutes(options, marks);
  return async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    if (!fromThisPage(req, port())) return reply(res, 403, 'origen no permitido');
    const route = req.method === 'GET' ? routes[req.url ?? ''] : undefined;
    if (route) return reply(res, 200, route());
    if (req.method !== 'POST' || req.url !== '/mark') return reply(res, 404, 'no encontrado');
    return saveMark(req, res, marks);
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
