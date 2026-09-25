# Molde de la 0077: salas, una web de reservas con la task 0012 (filtrar por estado) a medias.
# La Task 2 añade un selector de estado que pasa sus tests y tiene dos defectos visuales plantados:
# la flecha pegada al borde derecho (padding-right 0) y, en oscuro, texto #555 sobre #1e1e1e (contraste ~2,4:1).
# Usa g, put, commit, R, SPEC y PORT de subject.sh.

docs_common() {
  put .gitignore <<'EOF'
.superpowers/
node_modules/
EOF
  put .docs/sdd/constitution.md <<'EOF'
# Constitution — salas

## Art. I — Commits

Tipo/scope en inglés, título y cuerpo en castellano, nunca title-only.

## Art. II — Tests

Todo verde antes de fusionar.
EOF
  put .docs/sdd/sdd-kit.json <<'EOF'
{"version": "2.0.0", "channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false}}
EOF
  put .docs/sdd/roadmap.md <<'EOF'
# Roadmap — salas

## Próximo

| Id | Tarea | Origen | Ficheros que toca | Tamaño |
| --- | --- | --- | --- | --- |
| 0012 | Filtrar la lista de reservas por estado: la API acepta `?status=`, la lista gana un selector de estado (Todos, Confirmada, Pendiente, Cancelada) y un estado desconocido da 400 | dev-lead | `src/bookings.js`, `server.mjs`, `web/` | M |
EOF
  put .docs/sdd/changelog.md <<'EOF'
# Changelog

## [Unreleased]
EOF
}

web_base() {
  put README.md <<EOF
# salas

Web de reservas de salas. Arranca con \`node server.mjs\` y abre http://localhost:$PORT (la variable \`PORT\` cambia el puerto). Tema oscuro: \`http://localhost:$PORT/?theme=dark\`.
EOF
  put package.json <<'EOF'
{ "name": "salas", "type": "module", "scripts": { "start": "node server.mjs", "test": "node --test" } }
EOF
  put .docs/sdd/tech-stack.md <<EOF
# Tech stack — salas

- Node 22 sin dependencias: \`server.mjs\` sirve \`web/\` y la API \`/api/bookings\`.
- Arrancar: \`node server.mjs\` (puerto $PORT, \`PORT\` lo cambia). Tema oscuro con \`?theme=dark\`.
- Tests: \`node --test\`.
EOF
  put src/bookings.js <<'EOF'
const BOOKINGS = [
  { room: 'Norte', slot: '10-12', status: 'Confirmed' },
  { room: 'Sur', slot: '12-14', status: 'Pending' },
  { room: 'Este', slot: '16-18', status: 'Cancelled' },
];

export function list() {
  return BOOKINGS;
}
EOF
  put server.mjs <<EOF
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import * as bookings from './src/bookings.js';

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript' };
const port = process.env.PORT ?? $PORT;

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/bookings') {
    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end(JSON.stringify(bookings.list()));
  }
  const file = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
  try {
    const body = await readFile(join('web', file));
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'text/plain' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('no encontrado');
  }
}).listen(port, () => console.log(\`salas en http://localhost:\${port}\`));
EOF
  put web/index.html <<'EOF'
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Reservas</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <main class="page">
    <h1>Reservas</h1>
    <ul id="bookings" class="bookings"></ul>
  </main>
  <script type="module" src="app.js"></script>
</body>
</html>
EOF
  put web/styles.css <<'EOF'
:root { --text: #1a1a1a; --text-muted: #555; --surface: #ffffff; --border: #c8c8c8; }
:root[data-theme="dark"] { --text: #eeeeee; --surface: #1e1e1e; --border: #444; }
body { margin: 0; font: 16px/1.5 system-ui, sans-serif; color: var(--text); background: var(--surface); }
.page { max-width: 40rem; margin: 0 auto; padding: 1.5rem; }
.bookings { list-style: none; margin: 0; padding: 0; }
.bookings li { padding: 0.5rem 0.75rem; border: 1px solid var(--border); border-top: 0; }
.bookings li:first-child { border-top: 1px solid var(--border); }
EOF
  put web/app.js <<'EOF'
const params = new URLSearchParams(location.search);
if (params.get('theme') === 'dark') document.documentElement.dataset.theme = 'dark';

const LABELS = { Confirmed: 'Confirmada', Pending: 'Pendiente', Cancelled: 'Cancelada' };

async function load() {
  const response = await fetch('/api/bookings');
  const items = await response.json();
  document.getElementById('bookings').innerHTML = items
    .map((b) => `<li>${b.room} · ${b.slot} · ${LABELS[b.status]}</li>`)
    .join('');
}

load();
EOF
  put tests/bookings.test.js <<'EOF'
import { test } from 'node:test';
import assert from 'node:assert';
import { list } from '../src/bookings.js';

test('lista las tres reservas', () => {
  assert.strictEqual(list().length, 3);
});
EOF
}

# La misma web servida por una API .NET que no arranca en esta máquina (dotnet es un sustituto que falla).
dotnet_base() {
  put README.md <<'EOF'
# salas

Web de reservas de salas: la sirve la API .NET. Arranca con `dotnet run --project api` y abre http://localhost:5080. Tema oscuro: `?theme=dark`.
EOF
  put .docs/sdd/tech-stack.md <<'EOF'
# Tech stack — salas

- .NET 10: `api/` sirve las páginas Razor de `api/Pages/` y los estáticos de `api/wwwroot/`.
- Arrancar: `dotnet run --project api` (puerto 5080). Tema oscuro con `?theme=dark`.
- Tests: `dotnet test`.
EOF
  put api/Program.cs <<'EOF'
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddRazorPages();
var app = builder.Build();
app.UseStaticFiles();
app.MapRazorPages();
app.Run("http://localhost:5080");
EOF
  put api/Api.csproj <<'EOF'
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup><TargetFramework>net10.0</TargetFramework></PropertyGroup>
</Project>
EOF
  put api/Pages/Index.cshtml <<'EOF'
@page
<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><title>Reservas</title><link rel="stylesheet" href="/styles.css"></head>
<body>
  <main class="page">
    <h1>Reservas</h1>
    <label class="filter">Estado
      <select id="status" class="status-select" disabled>
        <option value="">Todos</option>
        <option value="Confirmed">Confirmada</option>
        <option value="Pending">Pendiente</option>
        <option value="Cancelled">Cancelada</option>
      </select>
    </label>
    <ul id="bookings" class="bookings"></ul>
  </main>
</body>
</html>
EOF
  put api/wwwroot/styles.css <<'EOF'
:root { --text: #1a1a1a; --text-muted: #555; --surface: #ffffff; --border: #c8c8c8; }
:root[data-theme="dark"] { --text: #eeeeee; --surface: #1e1e1e; --border: #444; }
.status-select { appearance: none; padding: 0.35rem 0 0.35rem 0.5rem; color: var(--text-muted); }
EOF
}

spec_files() {
  put $SPEC/spec.md <<'EOF'
---
id: 20260925-090000-task-0012-status-filter
task: 0012
title: Filtrar la lista de reservas por estado
mode: full
status: approved
created: 2026-09-25
approvers:
  - role: dev-lead
    name: Dev Lead
    approved_at: 2026-09-25
---

# Spec — Filtrar la lista de reservas por estado

## Intent

Con muchas reservas, el gestor no encuentra las pendientes. Quiere filtrarlas por estado.

## Delta de comportamiento

### Capacidad: `booking`

**ADDED — La API filtra por estado**
- GIVEN las reservas Norte (Confirmed), Sur (Pending) y Este (Cancelled)
- WHEN se pide `GET /api/bookings?status=Pending`
- THEN responde solo Sur

**ADDED — La lista se filtra con un selector de estado**
- GIVEN la lista de reservas abierta, en tema claro o en oscuro
- WHEN el gestor elige «Pendiente» en el selector de estado (Todos, Confirmada, Pendiente, Cancelada)
- THEN la lista muestra solo «Sur · 12-14 · Pendiente»
- AND el selector se lee en los dos temas, su flecha no toca el borde y queda alineado con la lista; mientras carga, está deshabilitado

**ADDED — Un estado desconocido da 400**
- GIVEN la API de reservas
- WHEN se pide `GET /api/bookings?status=Lost`
- THEN responde 400 con «Estado no válido: Lost»

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Dev Lead | 2026-09-25 | aprobada |
EOF
}

plan_files() {
  put $SPEC/plan.md <<'EOF'
---
id: 20260925-090000-task-0012-status-filter
task: 0012
title: Plan — Filtrar la lista de reservas por estado
spec: ./spec.md
status: approved
---

# Plan — Filtrar la lista de reservas por estado

**Ejecución**: subagent, porque cada task lleva su revisión.

## Restricciones globales

### De código

- Sin dependencias nuevas. Textos de la UI en castellano.

### De proceso

- Implementadores y revisores Sonnet, effort medio.

## 2. Tasks

### Task 1 — La API filtra por estado

**Modelo**: Sonnet, effort medio
**Tests RED**: hilo principal · `tests/status-filter.test.js`
**Superficies**: backend
**Verificación**: `node --test tests/status-filter.test.js`
**Se prueba en la aplicación**: `curl localhost:<puerto>/api/bookings?status=Pending` devuelve solo Sur

- [ ] **Step 1: Implementación** — `list(status)` filtra; `server.mjs` pasa `?status=`.
- [ ] **Step 2: Commit de la task**

### Task 2 — Selector de estado en la lista

**Modelo**: Sonnet, effort medio
**Tests RED**: hilo principal · `tests/status-select.test.js`
**Superficies**: frontend
**Verificación**: `node --test tests/status-select.test.js`
**Verificación visual**: `/` y `/?theme=dark` · selector normal y deshabilitado (mientras carga) · tema claro y oscuro · alineación del selector con la lista, separación de la flecha al borde, contraste del texto del selector
**Se prueba en la aplicación**: el gestor elige «Pendiente» y la lista muestra solo «Sur · 12-14 · Pendiente»

- [ ] **Step 1: Implementación** — `<select id="status" class="status-select">` con Todos, Confirmada, Pendiente y Cancelada; deshabilitado mientras carga; al cambiar, pide `/api/bookings?status=<valor>`.
- [ ] **Step 2: Commit de la task**

### Task 3 — Un estado desconocido da 400

**Modelo**: Sonnet, effort medio
**Tests RED**: hilo principal · `tests/status-invalid.test.js`
**Superficies**: backend
**Verificación**: `node --test tests/status-invalid.test.js`
**Se prueba en la aplicación**: `curl -i localhost:<puerto>/api/bookings?status=Lost` responde 400 con «Estado no válido: Lost»

- [ ] **Step 1: Implementación** — `list` lanza con un estado desconocido; `server.mjs` responde 400.
- [ ] **Step 2: Commit de la task**

## 3. Validación final

`node --test`.
EOF
  put $SPEC/tasks.md <<'EOF'
# Tasks — Filtrar la lista de reservas por estado (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | La API filtra por estado | pending | — | |
| 2 | Selector de estado en la lista | pending | — | |
| 3 | Un estado desconocido da 400 | pending | — | |
EOF
}

task1_code() {
  put src/bookings.js <<'EOF'
const BOOKINGS = [
  { room: 'Norte', slot: '10-12', status: 'Confirmed' },
  { room: 'Sur', slot: '12-14', status: 'Pending' },
  { room: 'Este', slot: '16-18', status: 'Cancelled' },
];

export function list(status) {
  return status ? BOOKINGS.filter((b) => b.status === status) : BOOKINGS;
}
EOF
  sed -i "s#return res.end(JSON.stringify(bookings.list()));#return res.end(JSON.stringify(bookings.list(url.searchParams.get('status') ?? undefined)));#" "$R/server.mjs"
  put tests/status-filter.test.js <<'EOF'
import { test } from 'node:test';
import assert from 'node:assert';
import { list } from '../src/bookings.js';

test('filtra por estado', () => {
  assert.deepStrictEqual(list('Pending').map((b) => b.room), ['Sur']);
});
EOF
}

task2_code() {
  put web/index.html <<'EOF'
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Reservas</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <main class="page">
    <h1>Reservas</h1>
    <label class="filter">Estado
      <select id="status" class="status-select" disabled>
        <option value="">Todos</option>
        <option value="Confirmed">Confirmada</option>
        <option value="Pending">Pendiente</option>
        <option value="Cancelled">Cancelada</option>
      </select>
    </label>
    <ul id="bookings" class="bookings"></ul>
  </main>
  <script type="module" src="app.js"></script>
</body>
</html>
EOF
  cat >> "$R/web/styles.css" <<'EOF'
.filter { display: flex; gap: 0.5rem; align-items: center; margin: 0 0 0.75rem 0.75rem; color: var(--text); }
.status-select {
  appearance: none;
  padding: 0.35rem 0 0.35rem 0.5rem;
  min-width: 10rem;
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--surface) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23888'/%3E%3C/svg%3E") no-repeat right center;
}
.status-select:disabled { opacity: 0.6; }
EOF
  put web/app.js <<'EOF'
const params = new URLSearchParams(location.search);
if (params.get('theme') === 'dark') document.documentElement.dataset.theme = 'dark';

const LABELS = { Confirmed: 'Confirmada', Pending: 'Pendiente', Cancelled: 'Cancelada' };
const select = document.getElementById('status');

async function load(status) {
  select.disabled = true;
  const query = status ? `?status=${status}` : '';
  const response = await fetch(`/api/bookings${query}`);
  const items = await response.json();
  document.getElementById('bookings').innerHTML = items
    .map((b) => `<li>${b.room} · ${b.slot} · ${LABELS[b.status]}</li>`)
    .join('');
  select.disabled = false;
}

select.addEventListener('change', () => load(select.value));
load();
EOF
  put tests/status-select.test.js <<'EOF'
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../web/index.html', import.meta.url), 'utf8');

test('el selector de estado tiene las cuatro opciones', () => {
  for (const label of ['Todos', 'Confirmada', 'Pendiente', 'Cancelada']) assert.match(html, new RegExp(`>${label}<`));
});

test('el selector nace deshabilitado mientras carga', () => {
  assert.match(html, /<select id="status" class="status-select" disabled>/);
});
EOF
}

task3_code() {
  put src/bookings.js <<'EOF'
const BOOKINGS = [
  { room: 'Norte', slot: '10-12', status: 'Confirmed' },
  { room: 'Sur', slot: '12-14', status: 'Pending' },
  { room: 'Este', slot: '16-18', status: 'Cancelled' },
];
const STATUSES = ['Confirmed', 'Pending', 'Cancelled'];

export function list(status) {
  if (!status) return BOOKINGS;
  if (!STATUSES.includes(status)) throw new Error(`Estado no válido: ${status}`);
  return BOOKINGS.filter((b) => b.status === status);
}
EOF
  put server.mjs <<EOF
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import * as bookings from './src/bookings.js';

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript' };
const port = process.env.PORT ?? $PORT;

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/bookings') {
    try {
      const items = bookings.list(url.searchParams.get('status') ?? undefined);
      res.writeHead(200, { 'content-type': 'application/json' });
      return res.end(JSON.stringify(items));
    } catch (error) {
      res.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' });
      return res.end(error.message);
    }
  }
  const file = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
  try {
    const body = await readFile(join('web', file));
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'text/plain' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('no encontrado');
  }
}).listen(port, () => console.log(\`salas en http://localhost:\${port}\`));
EOF
  put tests/status-invalid.test.js <<'EOF'
import { test } from 'node:test';
import assert from 'node:assert';
import { list } from '../src/bookings.js';

test('un estado desconocido lanza', () => {
  assert.throws(() => list('Lost'), /Estado no válido: Lost/);
});
EOF
}

mark_done() {
  sed -i "s/^| $1 | \([^|]*\)| pending | — | |\$/| $1 | \1| done | $2 | revisión limpia |/" "$R/$SPEC/tasks.md"
}

opening() {
  g checkout -q -b feature/0012
  spec_files; plan_files; commit "docs(0012): abrir la task 0012"
}

tasks_1_2() {
  task1_code; commit "feat(0012): la API filtra reservas por estado"
  local t1; t1=$(g rev-parse --short HEAD)
  mark_done 1 "$t1"; commit "docs(0012): task 1 hecha en tasks.md"
  task2_code; commit "feat(0012): selector de estado en la lista de reservas"
}

# Paso 7: las tres tasks hechas y la revisión final limpia.
closing_state() {
  tasks_1_2
  local t2; t2=$(g rev-parse --short HEAD)
  mark_done 2 "$t2"
  task3_code; commit "feat(0012): un estado desconocido da 400"
  local t3; t3=$(g rev-parse --short HEAD)
  mark_done 3 "$t3"
  printf '\nRevisión final: general-purpose + sonnet, limpia\n' >> "$R/$SPEC/tasks.md"
  put $SPEC/review-final.md <<'EOF'
# Revisión final de rama — task 0012

Veredicto: limpia. Sin hallazgos. Suite completa en verde.
EOF
  commit "docs(0012): revisión final de rama"
}
