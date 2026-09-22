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
> (default del kit); una task va en línea solo si lo declara con motivo en su campo `Ejecución`.

## Decisiones que he tomado yo — valida estas

1. Módulo nuevo `src/slot-format.js` con `isValidSlot(slot)` y `slotFormatError(slot)`, importado por `src/app.js` — cumple "una sola función de validación, en un módulo propio" (spec, decisión 3).
2. `reservar` no modela hoy la franja como parámetro (`run('reservar', ['Norte', '--cada-semana'])`, sin franja). Para validar la franja en `reservar` hay que darle sitio: se añade como `params[1]` (`reservar <sala> <franja> [--cada-semana]`) y se actualiza el test existente que pasaba sin franja — es un cambio de firma CLI necesario para poder cumplir el Scope de la spec, no una ampliación de alcance.
3. Modelo/effort: `claude-sonnet-5`, effort medio, para la única task — hay que interpretar la spec (regex, mensaje, dos puntos de integración), no es un arreglo mecánico; cumple el suelo de gama media del Art. 6.
4. Ejecución: agente (default del kit), vía `subagent-driven-development`. Una sola task: no hace falta `tasks.md`.
5. Riesgo alto: ninguno. Coste estimado: ~0.5h de implementación (módulo pequeño, dos puntos de integración, tests unitarios + de integración).

**Goal**: Rechazar con un mensaje claro cualquier franja horaria que no cumpla `HH:MM-HH:MM` (horas 00–23, minutos 00–59) al usarla en `libres` o `reservar`.

**Architecture**: Un módulo puro (`src/slot-format.js`) con la regex y el mensaje de error, sin estado ni dependencias. `src/app.js` lo consulta al principio de cada rama (`libres`, `reservar`) y corta devolviendo el mensaje si la franja no es válida, antes de tocar `rooms`/`bookings`.

**Tech Stack**: Node 22, sin dependencias externas, `node --test` (ver `.docs/sdd/tech-stack.md`).

**Spec**: `./spec.md`

## Restricciones globales

- Formato de franja: estricto `HH:MM-HH:MM`, horas 00–23, minutos 00–59 (spec, decisión 1).
- Mensaje único para `libres` y `reservar`: `Franja horaria no válida: "<valor>". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).` (spec, decisión 2 y delta).
- Una sola función de validación, en un módulo propio, usada por los dos comandos (spec, decisión 3).
- No entra: validar que el inicio sea anterior al fin (spec, Scope).
- Tests antes que código: `node --test` en verde antes de cada commit (constitution, Art. 2).
- Texto de la interfaz en castellano (constitution, Art. 4).
- Calidad de código: sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, capacidad); funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación. El revisor marca el incumplimiento como Important (constitution, Art. 5).
- Política de modelos: al despachar un subagente se declaran modelo y effort; gama media como suelo para revisores e implementadores (constitution, Art. 6).
- Ejecución por defecto: agente vía `subagent-driven-development`; en línea solo si una task lo declara con motivo (kit).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sí — una función pura + regex, sin capas nuevas.
- [x] **YAGNI gate**: no se abstrae nada con menos de 3 usos; la función se usa 2 veces (`libres`, `reservar`), justo lo pedido por la spec.
- [x] **Brownfield gate**: retrocompatible salvo el cambio de firma de `reservar` (decisión 2, documentado y con su test actualizado); respeta el patrón del proyecto (fichero único `app.js` + módulos pequeños importados, ver `tech-stack.md`); sin refactor fuera de scope.
- [x] **Constitution check**: cumple Art. 2, 4, 5, 6 (ver Restricciones globales).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `src/slot-format.js` — regex de validación (`isValidSlot`) y constructor del mensaje de error (`slotFormatError`).
- `test/slot-format.test.js` — tests unitarios de `isValidSlot` sobre los casos GIVEN de la spec (`10-12`, `9:00-11:00`, `24:00-24:30`) y un caso válido.

**Modificar**:

- `src/app.js` — `run()` valida la franja al principio de las ramas `libres` (usa `params[0]`) y `reservar` (usa `params[1]`, nueva posición); si no es válida, devuelve `slotFormatError(slot)` sin tocar `rooms`/`bookings`.
- `test/app.test.js` — el test `'reservar --cada-semana crea la reserva semanal'` pasa a incluir una franja válida en `params[1]` (`run('reservar', ['Norte', '10:00-12:00', '--cada-semana'])`); se añaden dos tests de integración: franja inválida en `libres` y en `reservar`.

**NO se tocan**:

- `src/app.js` — la rama `cancelar`: la spec no la incluye (Scope: solo `libres` y `reservar`), y su segundo parámetro (`'10:00'`) no es una franja sino una hora suelta.
- Validación de que el inicio sea anterior al fin — explícitamente fuera de Scope.

### 1.6 Dependencias

Ninguna: sin librerías externas (tech-stack.md). No depende de otras specs ni servicios.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El cambio de firma de `reservar` (franja en `params[1]`) rompe algún consumidor no cubierto por los tests actuales | Baja | Medio | Es el único punto de entrada (`src/app.js`); se actualiza el test existente en el mismo commit y se documenta en Interfaces |

### 1.8 Rollout

Directo: no hay toggle ni despliegue especial, un solo fichero de entrada (`tech-stack.md`).

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Validar la franja horaria en `libres` y `reservar`

**Modelo**: `claude-sonnet-5`, effort medio — interpreta la spec (regex + mensaje + dos puntos de integración), no es un arreglo mecánico ni código ya escrito.
**Ejecución**: agente (default del kit).
**Tests RED**: hilo principal · `test/slot-format.test.js` + `test/app.test.js` (casos nuevos y el actualizado), escritos y commiteados antes de despachar.

> Un test por escenario (THEN) de la spec: la franja mal formada se rechaza en `libres` y en `reservar`, más los casos unitarios de `isValidSlot` para cada ejemplo del GIVEN.

**Interfaces**:
- Consume: nada (primera y única task).
- Produce:
  - `isValidSlot(slot: string): boolean` — `true` si `slot` cumple `HH:MM-HH:MM` con horas `00`–`23` y minutos `00`–`59`; `false` en cualquier otro caso (incluye `undefined`/`null`).
  - `slotFormatError(slot: string): string` — devuelve `` `Franja horaria no válida: "${slot}". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).` ``.
  - `run('reservar', params)` pasa a leer la franja en `params[1]` (antes: `params[0]` era la sala, `params[1]` era `'--cada-semana'`; ahora `params[0]` = sala, `params[1]` = franja, `params[2]` = `'--cada-semana'` si aplica).

**Ficheros**: crear `src/slot-format.js`, `test/slot-format.test.js`; modificar `src/app.js`, `test/app.test.js`.

- [ ] **Step 1: Implementación**

`src/slot-format.js`:

```js
const SLOT_PATTERN = /^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/;

export function isValidSlot(slot) {
  return typeof slot === 'string' && SLOT_PATTERN.test(slot);
}

export function slotFormatError(slot) {
  return `Franja horaria no válida: "${slot}". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).`;
}
```

`src/app.js` (reemplaza `run`):

```js
import { isValidSlot, slotFormatError } from './slot-format.js';

export function run(cmd, params) {
  if (cmd === 'libres') {
    const slot = params[0];
    if (!isValidSlot(slot)) return slotFormatError(slot);
    return freeRooms(slot).join(', ');
  }
  if (cmd === 'reservar') {
    const slot = params[1];
    if (!isValidSlot(slot)) return slotFormatError(slot);
    if (params.includes('--cada-semana')) return 'reserva semanal creada';
  }
  if (cmd === 'cancelar') return `cancelada ${params[0]} ${params[1]}`;
  return 'salas';
}
```

`test/slot-format.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isValidSlot, slotFormatError } from '../src/slot-format.js';

test('acepta una franja bien formada', () => {
  assert.equal(isValidSlot('10:00-12:00'), true);
});

test('rechaza una franja sin ceros de relleno', () => {
  assert.equal(isValidSlot('10-12'), false);
});

test('rechaza una franja con hora sin dos dígitos', () => {
  assert.equal(isValidSlot('9:00-11:00'), false);
});

test('rechaza una hora fuera de rango', () => {
  assert.equal(isValidSlot('24:00-24:30'), false);
});

test('construye el mensaje de error con el valor recibido', () => {
  assert.equal(
    slotFormatError('10-12'),
    'Franja horaria no válida: "10-12". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).',
  );
});
```

`test/app.test.js` (sustituye el test de `reservar` y añade los dos nuevos):

```js
test('reservar --cada-semana crea la reserva semanal', () => {
  assert.equal(run('reservar', ['Norte', '10:00-12:00', '--cada-semana']), 'reserva semanal creada');
});

test('libres rechaza una franja mal formada', () => {
  assert.equal(
    run('libres', ['10-12']),
    'Franja horaria no válida: "10-12". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).',
  );
});

test('reservar rechaza una franja mal formada', () => {
  assert.equal(
    run('reservar', ['Norte', '24:00-24:30']),
    'Franja horaria no válida: "24:00-24:30". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).',
  );
});
```

- [ ] **Step 2: Build** — `node --test` no requiere build (sin transpilación). Verificar con `node --check src/app.js src/slot-format.js`. Esperado: sin errores.
- [ ] **Step 3: Verificación** — `node --test`. Esperado: todos los tests en verde, incluidos los 5 nuevos de `slot-format.test.js` y los 2 nuevos/1 actualizado de `app.test.js`.
- [ ] **Step 4: Commit** — `git add src/slot-format.js src/app.js test/slot-format.test.js test/app.test.js && git commit -m "feat(task-0009): validar el formato de la franja horaria en libres y reservar"`.

---

## 3. Validación final

- [ ] Build verde con `node --test`
- [ ] Verificación de los criterios de éxito de la spec: franja mal formada → mensaje exacto, sin consultar ni reservar, en `libres` y en `reservar`
- [ ] Spec satisfecha: el único requisito del delta (`room-booking` — ADDED) tiene su task (ver §4)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-task`)

---

## 4. Self-review (cobertura spec → tasks)

- Formato estricto `HH:MM-HH:MM`, horas 00–23, minutos 00–59 (spec, decisión 1) → Task 1, `isValidSlot`. ✓
- Mensaje único para `libres` y `reservar` (spec, decisión 2) → Task 1, `slotFormatError` usado en ambas ramas. ✓
- Una sola función de validación en módulo propio (spec, decisión 3) → Task 1, `src/slot-format.js`. ✓
- Delta `room-booking` ADDED — franja mal formada se rechaza en `libres`/`reservar` sin consultar ni reservar → Task 1, `run()` corta antes de `freeRooms`/`'reserva semanal creada'`. ✓
- No entra: validar que el inicio sea anterior al fin (spec, Scope) → N/A, confirmado en spec; `isValidSlot` no lo comprueba. ✓
