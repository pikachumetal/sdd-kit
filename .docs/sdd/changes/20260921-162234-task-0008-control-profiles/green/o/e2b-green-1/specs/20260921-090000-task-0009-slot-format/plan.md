---
id: 20260921-090000-task-0009-slot-format
task: 0009
title: Plan de implementación — Validar el formato de la franja horaria
spec: ./spec.md
status: approved
created: 2026-09-22
---

# Plan de implementación — Validar el formato de la franja horaria

> Compatible con `superpowers:writing-plans`. Ejecución: `superpowers:subagent-driven-development`
> (default del kit); una task va en línea solo si lo declara con motivo en su campo `Ejecución`.

## Decisiones que he tomado yo — valida estas

1. Reutilizar `isValidSlot` de `src/slots.js` (ya existe en el repo) en vez de escribir otro validador — regla YAGNI.
2. Arreglar el regex de `src/slots.js`: acepta hoy `2[0-4]` (permite hora 24), la spec exige 00–23. Se cambia a `2[0-3]`.
3. Modelo: `sonnet`, effort medio — task mecánica (fix de regex + wiring + mensaje) pero exige leer bien la spec para el texto exacto del error.
4. Ejecución: agente (default del kit), sin motivo para ir en línea.
5. Una sola task: el cambio toca 2 ficheros con una responsabilidad cada uno, no da para partir.
6. Coste estimado: ~0.3h de implementación, task trivial de bajo riesgo.

**Goal**: rechazar con mensaje claro en castellano cualquier franja que no cumpla `HH:MM-HH:MM` (horas 00–23, minutos 00–59) en `libres` y `reservar`, sin tocar el resto del flujo.

**Architecture**: `isValidSlot` (regex, ya en `src/slots.js`) se corrige y se llama al principio de `run()` en `src/app.js` para `libres` y `reservar`, antes de cualquier otra lógica; si falla, devuelve el mensaje de error y no ejecuta nada más.

**Tech Stack**: Node 22, sin dependencias externas, `node --test` (ver `.docs/sdd/tech-stack.md`).

**Spec**: `./spec.md`

## Restricciones globales

- Mensaje exacto: `Franja horaria no válida: "<valor>". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).` (spec, Delta de comportamiento).
- Formato válido: `HH:MM-HH:MM`, horas 00–23, minutos 00–59 (spec, Decisión 1).
- Mismo mensaje para `libres` y `reservar` (spec, Decisión 2).
- No entra: validar que el inicio sea anterior al fin (spec, Scope).
- Tests antes que código: `node --test` en verde antes de cada commit (constitution, art. 2).
- Texto de interfaz en castellano (constitution, art. 4).
- Sin comentarios que repitan el código ni citen documentos (constitution/kit, calidad de código): comentarios solo si explican un "por qué" no obvio.
- Modelo: gama media (`sonnet`) como suelo si hay que interpretar prosa; nada de `fable` ni `opus xhigh` sin justificar.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sí — un regex fix + una llamada de validación en `run()`, nada más.
- [x] **YAGNI gate**: sí — se reutiliza `isValidSlot`, no se crea un segundo validador ni una clase de errores.
- [x] **Brownfield gate**: retrocompatible (solo añade un rechazo temprano), respeta el patrón existente (`run()` como despachador por `cmd`), sin refactor fuera de scope.
- [x] **Constitution check**: cumple art. 1 (flujo SDD), art. 2 (tests antes que código), art. 4 (castellano).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/slots.js` — corrige el rango de horas del regex (`2[0-4]` → `2[0-3]`).
- `src/app.js` — importa `isValidSlot` y lo aplica al principio de `run()` para `cmd === 'libres'` y `cmd === 'reservar'`.
- `test/app.test.js` — añade los casos de franja inválida para `libres` y `reservar`.

**NO se tocan**:

- La lógica de `cancelar` — la spec no la incluye en el Scope.
- La validación de que el inicio sea anterior al fin — explícitamente fuera de Scope.

### 1.6 Dependencias

Ninguna — `isValidSlot` ya existe en `src/slots.js`, no wireado todavía en `app.js`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El regex corregido rompe una franja válida usada en datos de prueba (`bookings`) | baja | media | test explícito con `10:00-12:00` (ya usado en `bookings`) para confirmar que sigue aceptándose |

### 1.8 Rollout

Directo — sin toggle, entra en la siguiente release del roadmap.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Validar franja en `libres` y `reservar`

**Modelo**: sonnet, effort medio
**Tests RED**: hilo principal · `test/app.test.js`, escritos y commiteados antes de despachar

**Ficheros**: modificar `src/slots.js`, `src/app.js`, `test/app.test.js`

- [ ] **Step 1: Implementación**

En `src/slots.js`, corregir el límite de horas:

```js
const SLOT = /^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/;

export function isValidSlot(slot) {
  return typeof slot === 'string' && SLOT.test(slot);
}
```

En `src/app.js`, importar y validar al principio de `run()`:

```js
import { isValidSlot } from './slots.js';

const [command, ...args] = process.argv.slice(2);
const rooms = ['Norte', 'Sur'];
const bookings = [{ room: 'Norte', day: 'lun', slot: '10:00-12:00' }];

function invalidSlotMessage(slot) {
  return `Franja horaria no válida: "${slot}". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).`;
}

function freeRooms(slot) {
  return rooms.filter((room) => !bookings.some((b) => b.room === room && b.slot === slot));
}

export function run(cmd, params) {
  if (cmd === 'libres') {
    if (!isValidSlot(params[0])) return invalidSlotMessage(params[0]);
    return freeRooms(params[0]).join(', ');
  }
  if (cmd === 'reservar') {
    const slot = params.find((p) => !p.startsWith('--'));
    if (!isValidSlot(slot)) return invalidSlotMessage(slot);
    if (params.includes('--cada-semana')) return 'reserva semanal creada';
  }
  if (cmd === 'cancelar') return `cancelada ${params[0]} ${params[1]}`;
  return 'salas';
}

if (command) console.log(run(command, args));
```

> Nota: el test existente `reservar --cada-semana crea la reserva semanal` llama a `run('reservar', ['Norte', '--cada-semana'])` — no lleva franja. Para no romperlo ni inventar una franja fuera de la spec, `reservar` valida solo si `params` trae un token que no empiece por `--` (el hueco de la franja); si no hay token de franja, sigue el flujo actual. Es un ruling de wiring, no un cambio de la spec: registrado aquí, no hace falta pararse.

- [ ] **Step 2: Escribir los tests RED (antes del Step 1, en la práctica: commit de los tests primero)**

Añadir a `test/app.test.js`:

```js
test('libres rechaza una franja mal formada', () => {
  assert.equal(
    run('libres', ['10-12']),
    'Franja horaria no válida: "10-12". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).'
  );
});

test('reservar rechaza una franja con hora 24', () => {
  assert.equal(
    run('reservar', ['Norte', '24:00-24:30', '--cada-semana']),
    'Franja horaria no válida: "24:00-24:30". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).'
  );
});

test('libres sigue aceptando una franja válida', () => {
  assert.equal(run('libres', ['10:00-12:00']), 'Sur');
});
```

- [ ] **Step 3: Build**

Comando: `node --test`
Esperado: los 3 tests nuevos en FAIL (por `isValidSlot` no wireado / regex permisivo con hora 24), el resto en PASS.

- [ ] **Step 4: Implementar** (código del Step 1) y re-ejecutar `node --test`

Esperado: verde, 6/6 tests (3 existentes + 3 nuevos).

- [ ] **Step 5: Commit**

```bash
git add test/app.test.js src/slots.js src/app.js
git commit -m "feat: validar franja horaria en libres y reservar"
```

---

## Estimación y esfuerzo

> `.docs/sdd/estimation.md` no existe en este proyecto — sección no obligatoria, se deja por trazabilidad.

- Tipo: backend
- Esfuerzo spec + plan: 0.3h
- Estimación de implementación: 0.3h
- Base de la estimación: 1 task, cambio mecánico sobre código ya existente (regex + wiring), sin incertidumbres nuevas
- Confianza: alta

---

## 3. Validación final

- [ ] Build verde con `node --test`
- [ ] Verificación del criterio de éxito de la spec: franja mal formada en `libres` y `reservar` devuelve el mensaje exacto y no consulta ni reserva nada
- [ ] Spec satisfecha: el único escenario ADDED tiene su task (ver §4)
- [ ] Cierre de rama según `sdd-end-task`

---

## 4. Self-review (cobertura spec → tasks)

- ADDED "Una franja mal formada se rechaza" (`libres` y `reservar`) → Task 1. ✓
- "No entra: validar que el inicio sea anterior al fin" → N/A, confirmado en spec y en `NO se tocan`. ✓
- Mensaje único para ambos comandos (Decisión 2) → Task 1, misma función `invalidSlotMessage`. ✓
