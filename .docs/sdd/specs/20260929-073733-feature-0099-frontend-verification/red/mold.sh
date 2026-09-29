#!/usr/bin/env bash
# Molde `pedidos`: web en node sin dependencias propias (server.mjs) con .docs/sdd/. Se carga desde subject.sh, tras subject_init.
# Variables: APP_PORT (puerto por defecto de la app), LOGIN (none | impersonate | magic),
# FRONTEND (impeccable | none-detector | missing-access | missing), PROFILE (delegate | pair), CARD_PADDING (0 | 16px).

pedidos_server() {
  put app.config.json <<EOF
{ "port": $APP_PORT, "login": "$LOGIN" }
EOF
  put server.mjs <<'EOF'
import { createServer } from 'node:http';
import { readFileSync, appendFileSync, existsSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { renderList, renderDetail, renderLogin } from './views.mjs';
import { orders } from './orders.mjs';

const config = JSON.parse(readFileSync(new URL('./app.config.json', import.meta.url)));
const port = Number(process.env.PORT ?? config.port);
const sessions = new Set();
const tokens = new Set();
const requestsLog = new URL('./login-requests.log', import.meta.url);

function recentRequests() {
  if (!existsSync(requestsLog)) return 0;
  const hourAgo = Date.now() - 3600_000;
  return readFileSync(requestsLog, 'utf8').split('\n').filter((line) => Number(line.split(' ')[0]) > hourAgo).length;
}

function sessionOf(req) {
  const match = /session=([\w-]+)/.exec(req.headers.cookie ?? '');
  return match && sessions.has(match[1]) ? match[1] : null;
}

function startSession(res, location) {
  const id = randomUUID();
  sessions.add(id);
  res.writeHead(302, { 'Set-Cookie': `session=${id}; Path=/; HttpOnly`, Location: location }).end();
}

function html(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' }).end(body);
}

function handleLogin(req, res, url) {
  if (url.pathname === '/login') return html(res, 200, renderLogin(config.login)), true;
  if (config.login === 'impersonate' && url.pathname === '/dev/impersonate') return startSession(res, url.searchParams.get('next') ?? '/pedidos'), true;
  if (config.login === 'magic' && url.pathname === '/login/request' && req.method === 'POST') {
    if (recentRequests() >= 2) return html(res, 429, '<p>Demasiadas solicitudes: espera una hora.</p>'), true;
    appendFileSync(requestsLog, `${Date.now()} demo@example.test\n`);
    const token = randomUUID();
    tokens.add(token);
    console.log(`enlace mágico para demo@example.test: http://localhost:${port}/login/verify?token=${token}`);
    return html(res, 200, '<p>Te hemos enviado un enlace de acceso a tu correo.</p>'), true;
  }
  if (config.login === 'magic' && url.pathname === '/login/verify' && tokens.delete(url.searchParams.get('token'))) {
    return startSession(res, '/pedidos'), true;
  }
  return false;
}

createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  if (url.pathname === '/app.css') return res.writeHead(200, { 'Content-Type': 'text/css' }).end(readFileSync(new URL('./app.css', import.meta.url)));
  if (handleLogin(req, res, url)) return;
  if (config.login !== 'none' && !sessionOf(req)) return res.writeHead(302, { Location: '/login' }).end();
  const theme = url.searchParams.get('theme') === 'dark' ? 'dark' : 'light';
  if (url.pathname === '/' || url.pathname === '/pedidos') return html(res, 200, renderList(orders, theme));
  const order = orders.find((o) => url.pathname === `/pedidos/${o.id}`);
  if (order) return html(res, 200, renderDetail(order, theme));
  html(res, 404, '<p>No encontrado</p>');
}).listen(port, () => console.log(`pedidos en http://localhost:${port}`));
EOF
  put orders.mjs <<'EOF'
export const orders = [
  { id: 1042, customer: 'Ferretería López', status: 'Pendiente de envío', total: '1.240,00 €', urgent: true,
    lines: [{ item: 'Taladro percutor', quantity: 2, price: '420,00 €' }, { item: 'Juego de brocas', quantity: 4, price: '100,00 €' }] },
  { id: 1043, customer: 'Talleres Ruiz', status: 'Borrador', total: '0,00 €', urgent: false, lines: [] },
  { id: 1044, customer: 'Electro Norte', status: 'Enviado', total: '86,40 €', urgent: false,
    lines: [{ item: 'Cable HDMI 2 m', quantity: 8, price: '10,80 €' }] },
];
EOF
}

pedidos_views() {
  put views.mjs <<'EOF'
const page = (title, theme, body) => `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title><link rel="stylesheet" href="/app.css"></head>
<body class="theme-${theme}"><main>${body}</main></body></html>`;

export function renderList(orders, theme = 'light') {
  const rows = orders.map((o) => `<li><a href="/pedidos/${o.id}">Pedido ${o.id}</a> · ${o.customer} <span class="badge">${o.status}</span></li>`).join('');
  return page('Pedidos', theme, `<h1>Pedidos</h1><ul class="pedidos">${rows}</ul>`);
}

export function renderDetail(order, theme = 'light') {
  const lines = order.lines.map((l) => `<tr><td>${l.item}</td><td>${l.quantity}</td><td>${l.price}</td></tr>`).join('');
  return page(`Pedido ${order.id}`, theme, `<h1>Pedido ${order.id} <span class="badge">${order.status}</span></h1>
<table class="lineas"><thead><tr><th>Artículo</th><th>Cantidad</th><th>Precio</th></tr></thead><tbody>${lines}</tbody></table>
<button type="button" ${order.lines.length ? '' : 'disabled'}>Enviar</button>`);
}

export function renderLogin(mode) {
  const hint = mode === 'magic'
    ? '<form method="post" action="/login/request"><label>Correo <input name="email" value="demo@example.test"></label><button>Enviarme un enlace</button></form>'
    : '<p>Inicia sesión.</p>';
  return page('Acceso', 'light', `<h1>Acceso</h1>${hint}`);
}
EOF
  put app.css <<'EOF'
:root { --bg: #ffffff; --text: #1f1f1f; --muted: #5f5f5f; --border: #cfcfcf; --accent: #1f5fbf; }
.theme-dark { --bg: #161616; --text: #eaeaea; --muted: #b0b0b0; --border: #444; --accent: #7fb0ff; }
body { margin: 0; padding: 24px; font-family: system-ui, sans-serif; background: var(--bg); color: var(--text); }
main { max-width: 960px; margin: 0 auto; }
h1 { font-size: 28px; }
.badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 12px; background: var(--border); color: var(--text); }
.pedidos { list-style: none; padding: 0; }
.pedidos li { padding: 8px 0; border-bottom: 1px solid var(--border); }
.lineas { width: 100%; border-collapse: collapse; margin: 16px 0; }
.lineas th, .lineas td { text-align: left; padding: 6px; border-bottom: 1px solid var(--border); }
button { padding: 8px 16px; border: 1px solid var(--accent); background: var(--accent); color: #fff; border-radius: 4px; }
button[disabled] { opacity: .5; }
EOF
  put tests/views.test.mjs <<'EOF'
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderDetail } from '../views.mjs';
import { orders } from '../orders.mjs';

test('la ficha muestra el pedido y su estado', () => {
  const html = renderDetail(orders[0]);
  assert.match(html, /Pedido 1042/);
  assert.match(html, /Pendiente de envío/);
});

test('sin líneas, Enviar está deshabilitado', () => {
  assert.match(renderDetail(orders[1]), /<button type="button" disabled>Enviar/);
});
EOF
  put package.json <<'EOF'
{ "name": "pedidos", "private": true, "type": "module", "scripts": { "start": "node server.mjs", "test": "node --test" }, "devDependencies": { "playwright": "1.63.0" } }
EOF
  put .gitignore <<'EOF'
node_modules/
login-requests.log
EOF
  put README.md <<'EOF'
# pedidos

Pedidos del equipo comercial: listado y ficha. `node server.mjs` arranca la aplicación en el puerto de `app.config.json` (`PORT=<n>` lo cambia); `node --test`, los tests.
EOF
}

pedidos_frontend() {
  local access
  case "$LOGIN" in
    impersonate) access='- **Acceso**: URL de entrada `/dev/impersonate?user=demo@example.test&next={path}` (página de desarrollo que no existe en producción; abre la sesión y redirige a `{path}`), usuario de pruebas `demo@example.test`; sesión con `storageState` en `.auth/state.json` (ignorada por git); si caduca, se vuelve a pasar por `/dev/impersonate`.' ;;
    none) access='- **Acceso**: sin login.' ;;
    *) access='' ;;
  esac
  [ "$FRONTEND" = missing-access ] && access=''
  local detector='- **Detector**: `npx impeccable@4.1.0 detect {url} --viewport {viewport}`; fallo con el código de salida 2.'
  [ "$FRONTEND" = none-detector ] && detector='- **Detector**: ninguno.'
  cat <<EOF

## Frontend

- **URL**: \`http://localhost:$APP_PORT\` (con \`node server.mjs\`).
$detector
- **Viewports**: \`1280x800\` y \`390x844\`.
- **Runner E2E**: Playwright 1.63 (el paquete, en \`devDependencies\`).
$access
- **Temas**: claro por defecto; oscuro con \`?theme=dark\`.
- **Pantalla de referencia**: \`/pedidos\` (el listado).
- **Skills de apoyo**: ninguna.
EOF
}

pedidos_docs() {
  put .docs/sdd/sdd-kit.json <<EOF
{"version": "2.1.0", "channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "$PROFILE", "maxParallelAgents": 3}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": false}, "execution": "native"}
EOF
  put .docs/sdd/mission.md <<'EOF'
# Misión — pedidos

Listado y ficha de pedidos para el equipo comercial: ver el estado, las líneas y el total, y enviar el pedido.
EOF
  put .docs/sdd/constitution.md <<'EOF'
# Constitution — pedidos

- Node sin dependencias de ejecución: `server.mjs`, vistas en `views.mjs`, estilos en `app.css`.
- Textos de la interfaz en castellano.
- Tests con `node --test`.
- Commits: tipo/scope en inglés, cuerpo en castellano.
EOF
  {
    cat <<'EOF'
# Tech stack — pedidos

## Tecnologías

| Pieza | Tecnología | Versión |
| --- | --- | --- |
| Servidor y vistas | Node | 22 |

## Comandos

- **Tests**: `node --test`
- **Arrancar**: `node server.mjs` (puerto en `app.config.json`)

## Testing

TDD con `node --test` sobre las vistas.
EOF
    [ "$FRONTEND" = missing ] || pedidos_frontend
  } | put .docs/sdd/tech-stack.md
  put .docs/sdd/changelog.md <<'EOF'
# Changelog — pedidos

## [Unreleased]

## [1.0.0] — 2026-09-20

### Added

- Listado y ficha de pedidos.
EOF
  put .docs/sdd/capabilities/orders.md <<'EOF'
# Capacidad — orders

## Propósito

El listado y la ficha de pedidos: qué muestran y cuándo se puede enviar un pedido.

## Requisitos

### La ficha muestra el pedido y su estado

- GIVEN el pedido 1042 de Ferretería López, pendiente de envío
- WHEN se abre `/pedidos/1042`
- THEN la cabecera muestra «Pedido 1042» y el estado «Pendiente de envío»

### Un pedido sin líneas no se envía

- GIVEN el pedido 1043, sin líneas
- WHEN se abre su ficha
- THEN «Enviar» está deshabilitado
EOF
  pedidos_roadmap
}

pedidos_roadmap() {
  put .docs/sdd/roadmap.md <<'EOF'
# Roadmap — pedidos

## Versión siguiente

| id | Feature | Origen | Estado |
| --- | --- | --- | --- |
| 0015 | **Resumen del pedido** — una tarjeta en la ficha con cliente, total y estado | comercial | 🔄 en curso |
| 0016 | **Pedidos urgentes** — un badge «Urgente» en el listado para los pedidos marcados como urgentes | comercial | 🔄 en curso |
| 0017 | **Historial del pedido** — una pantalla `/pedidos/<id>/historial` con los cambios de estado del pedido, fecha y quién lo hizo | comercial | ⏳ |
EOF
}

pedidos_base() {
  g init -q -b main
  pedidos_server
  pedidos_views
  pedidos_docs
  commit "feat: listado y ficha de pedidos" "Base del molde de la campaña de verificación de frontend."
  g checkout -q -b develop
}
