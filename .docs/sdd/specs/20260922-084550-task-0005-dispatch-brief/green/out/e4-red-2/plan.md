---
id: 20260922-090000-task-0009-slot-format
task: 0009
title: Plan de implementación — Validar el formato de la franja horaria
spec: ./spec.md
status: draft
created: 2026-09-22
---

# Plan de implementación — Validar el formato de la franja horaria

> Compatible con `superpowers:writing-plans`. Ejecución: `superpowers:subagent-driven-development`
> (default del kit); ninguna task de este plan se desvía a en línea.

## Decisiones que he tomado yo — valida estas

1. **Posición de la franja en `reservar`** — la spec no fija dónde llega la franja en `params` de `reservar`. Decido: es el primer argumento posicional que no sea la sala (`params[0]`) ni empiece por `--`. Así `reservar Norte --cada-semana` (caso ya cubierto por test) sigue sin franja y sin romperse, y `reservar Norte 10:00-12:00 [--cada-semana]` sí la valida. Riesgo si me equivoco: bajo — es un cambio de una línea si el dev-lead prefiere otra posición.
2. **Modelo y effort por task** — Sonnet, effort medio, en las dos tasks. Motivo: hay que interpretar prosa de la spec (regex del formato, mensaje exacto) y tocar código existente sin romper tests; no es un arreglo mecánico puro. Cumple el suelo de gama media del Art. 6 de la constitution.
3. **Ejecución** — `superpowers:subagent-driven-development` para las dos tasks, sin excepción en línea: son cambios pequeños y acotados, no hay motivo para saltarse el default del kit.
4. **Coste estimado** — 1h de implementación total (2 tasks de ~30 min cada una), sin despacho a servicios de pago adicionales.

**Goal**: Que `libres` y `reservar` rechacen con un mensaje claro cualquier franja que no cumpla `HH:MM-HH:MM` (horas 00–23, minutos 00–59), sin consultar ni reservar nada.

**Architecture**: Un módulo nuevo y propio (`src/slot-format.js`) expone una única función de validación de formato; `src/app.js` la importa y la llama al principio de las ramas `libres` y `reservar` de `run()`, devolviendo el mensaje de error como salida temprana antes de tocar `freeRooms` o la reserva.

**Tech Stack**: Node 22, sin dependencias externas, `node --test`.

**Spec**: `./spec.md`

## Restricciones globales

- Formato estricto `HH:MM-HH:MM`, horas 00–23 y minutos 00–59 (spec, decisión 1).
- Mensaje único, igual para `libres` y `reservar`: `Franja horaria no válida: "<valor>". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).` (spec, decisión 2 y delta).
- Una sola función de validación, en un módulo propio, usada por los dos comandos (spec, decisión 3).
- No entra: validar que el inicio sea anterior al fin (spec, Scope).
- Tests antes que código: `node --test` en verde antes de cada commit (constitution, Art. 2).
- Texto de la interfaz en castellano (constitution, Art. 4).
- Calidad de código (constitution, Art. 5, literal): sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, capacidad); funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación. El revisor marca el incumplimiento como Important.
- Política de modelos (constitution, Art. 6, literal): al despachar un subagente se declaran modelo y effort; gama media como suelo para revisores e implementadores.
- Perfil de control vigente: `delegate` (`.docs/sdd/sdd-kit.json`) — sin gate en el plan; para en la spec (ya aprobada), en los desvíos y en la validación final.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sí — un módulo de una función más dos salidas tempranas en `run()`; no hay diseño más simple que cumpla la spec.
- [x] **YAGNI gate**: no se abstrae nada con menos de 3 usos — la función se reutiliza exactamente en los 2 sitios que pide la spec (`libres`, `reservar`); no se generaliza más allá.
- [x] **Brownfield gate**: retrocompatible — el test existente de `reservar --cada-semana` sigue pasando sin cambios (ver decisión 1); respeta el patrón de módulo único de entrada de `tech-stack.md` (`src/app.js` sigue siendo el único fichero ejecutado directamente; `src/slot-format.js` es un módulo importado, no un segundo entry point) y esa separación en módulo propio es, además, la decisión 3 ya aprobada en la spec; sin refactor fuera de scope.
- [x] **Constitution check**: respeta Art. 2 (TDD), Art. 4 (castellano), Art. 5 (funciones cortas, sin comentarios redundantes) y Art. 6 (modelo y effort declarados abajo).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `src/slot-format.js` — única función de validación de formato de franja horaria, usada por `libres` y `reservar`.
- `test/slot-format.test.js` — tests unitarios de esa función.

**Modificar**:

- `src/app.js` — las ramas `libres` y `reservar` de `run()` validan la franja antes de consultar o reservar.
- `test/app.test.js` — se añaden los dos tests de integración de la spec (uno por comando).

**NO se tocan**:

- La rama `cancelar` de `run()` — fuera de Scope de la spec.
- `freeRooms()` y los datos de `rooms`/`bookings` — sin cambios de comportamiento, solo dejan de ejecutarse cuando la franja es inválida.

### 1.6 Dependencias

Ninguna: sin librerías externas, sin specs previas de las que dependa.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La posición de la franja en `params` de `reservar` (decisión 1) no es la que espera el dev-lead | Baja | Bajo | Cambio de una línea en `runReservar`; test de regresión (`reservar --cada-semana` sin franja) ya cubre el caso actual. |
| Regex de formato deja pasar un valor inválido (p. ej. `30:00-31:00` sin tope de hora) | Baja | Medio | Tests unitarios cubren los 3 ejemplos de la spec (`10-12`, `9:00-11:00`, `24:00-24:30`) más un caso válido. |

### 1.8 Rollout

Directo: CLI local de un solo usuario, sin despliegue ni toggle.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Módulo de validación de formato de franja

**Modelo**: Sonnet, effort medio — interpreta la regla de formato de la spec (regex + mensaje exacto), no es un arreglo mecánico.
**Tests RED**: hilo principal · `test/slot-format.test.js`, escritos y commiteados antes de despachar.

**Interfaces**:
- Produce: `export function formatSlotError(slot: string): string | null` — `null` si `slot` cumple `HH:MM-HH:MM` (horas 00–23, minutos 00–59); si no, el mensaje `Franja horaria no válida: "<slot>". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).`

**Ficheros**: crear `src/slot-format.js`, `test/slot-format.test.js`

- [ ] **Step 1: Escribir el test en rojo**

```js
// test/slot-format.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatSlotError } from '../src/slot-format.js';

test('acepta una franja bien formada', () => {
  assert.equal(formatSlotError('10:00-12:00'), null);
});

test('rechaza una franja sin minutos', () => {
  assert.equal(
    formatSlotError('10-12'),
    'Franja horaria no válida: "10-12". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).'
  );
});

test('rechaza una franja con hora sin cero delante', () => {
  assert.equal(
    formatSlotError('9:00-11:00'),
    'Franja horaria no válida: "9:00-11:00". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).'
  );
});

test('rechaza una hora fuera de rango', () => {
  assert.equal(
    formatSlotError('24:00-24:30'),
    'Franja horaria no válida: "24:00-24:30". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).'
  );
});
```

- [ ] **Step 2: Ejecutar y confirmar el rojo**

Run: `node --test test/slot-format.test.js`
Esperado: FALLA — `src/slot-format.js` no existe.

- [ ] **Step 3: Implementación mínima**

```js
// src/slot-format.js
const SLOT_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/;

export function formatSlotError(slot) {
  if (SLOT_PATTERN.test(slot)) return null;
  return `Franja horaria no válida: "${slot}". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).`;
}
```

- [ ] **Step 4: Ejecutar y confirmar el verde**

Run: `node --test test/slot-format.test.js`
Esperado: PASS, 4 de 4.

- [ ] **Step 5: Commit**

```bash
git add src/slot-format.js test/slot-format.test.js
git commit -m "feat: validar formato de franja horaria HH:MM-HH:MM"
```

---

### Task 2 — Integrar la validación en `libres` y `reservar`

**Modelo**: Sonnet, effort medio — toca `run()` existente sin romper el test de `reservar --cada-semana` (decisión 1).
**Tests RED**: hilo principal · `test/app.test.js` (casos añadidos), escritos y commiteados antes de despachar.

**Interfaces**:
- Consume: `formatSlotError(slot: string): string | null` de `src/slot-format.js` (Task 1).

**Ficheros**: modificar `src/app.js`, `test/app.test.js`

- [ ] **Step 1: Añadir los tests en rojo a `test/app.test.js`**

```js
// añadir a test/app.test.js, tras los tests existentes
test('libres rechaza una franja mal formada', () => {
  assert.equal(
    run('libres', ['10-12']),
    'Franja horaria no válida: "10-12". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).'
  );
});

test('reservar rechaza una franja mal formada', () => {
  assert.equal(
    run('reservar', ['Norte', '9:00-11:00']),
    'Franja horaria no válida: "9:00-11:00". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).'
  );
});
```

- [ ] **Step 2: Ejecutar y confirmar el rojo**

Run: `node --test test/app.test.js`
Esperado: FALLAN los 2 tests nuevos — `run()` todavía no valida la franja.

- [ ] **Step 3: Implementación mínima**

```js
// src/app.js
import { formatSlotError } from './slot-format.js';

const [command, ...args] = process.argv.slice(2);
const rooms = ['Norte', 'Sur'];
const bookings = [{ room: 'Norte', day: 'lun', slot: '10:00-12:00' }];

function freeRooms(slot) {
  return rooms.filter((room) => !bookings.some((b) => b.room === room && b.slot === slot));
}

function runLibres(params) {
  const error = formatSlotError(params[0]);
  if (error) return error;
  return freeRooms(params[0]).join(', ');
}

function runReservar(params) {
  const [, ...rest] = params;
  const slot = rest.find((p) => !p.startsWith('--'));
  if (slot) {
    const error = formatSlotError(slot);
    if (error) return error;
  }
  if (rest.includes('--cada-semana')) return 'reserva semanal creada';
  return 'salas';
}

export function run(cmd, params) {
  if (cmd === 'libres') return runLibres(params);
  if (cmd === 'reservar') return runReservar(params);
  if (cmd === 'cancelar') return `cancelada ${params[0]} ${params[1]}`;
  return 'salas';
}

if (command) console.log(run(command, args));
```

- [ ] **Step 4: Ejecutar toda la suite y confirmar el verde**

Run: `node --test`
Esperado: PASS, todos los tests (los 3 existentes de `app.test.js` + 2 nuevos + los 4 de `slot-format.test.js`).

- [ ] **Step 5: Commit**

```bash
git add src/app.js test/app.test.js
git commit -m "feat: rechazar franja mal formada en libres y reservar"
```

---

## 3. Validación final

- [ ] Build verde con `node --test`
- [ ] Verificación del criterio de éxito de la spec: franja mal formada en `libres` o `reservar` devuelve el mensaje exacto y no consulta ni reserva
- [ ] Spec satisfecha: el único requisito de la spec tiene sus tasks (ver Self-review)
- [ ] Cierre de rama según `sdd-end-task`

---

## 4. Self-review (cobertura spec → tasks)

- ADDED — Una franja mal formada se rechaza (GIVEN/WHEN/THEN) → Task 1 (función `formatSlotError`) + Task 2 (wiring en `libres` y `reservar`, con test de integración por comando). ✓
- Mensaje único para `libres` y `reservar` → Task 1 genera un solo mensaje; Task 2 lo reutiliza en los dos sitios sin duplicarlo. ✓
- Una sola función de validación en módulo propio → Task 1 (`src/slot-format.js`), consumida por Task 2. ✓
- No entra: validar que el inicio sea anterior al fin → N/A, confirmado en Scope de la spec, ninguna task lo implementa. ✓
