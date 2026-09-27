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

1. Modelo Sonnet (gama media, suelo del Art.6), effort bajo — el código de la única task ya está escrito en este plan; es un arreglo mecánico.
2. Ejecución por agente (`subagent-driven-development`, default del kit); no hay motivo para ir en línea.
3. En `reservar` la franja se lee de `params[1]` cuando no es el flag `--cada-semana`; si no hay ese posicional (caso actual `reservar --cada-semana` sin franja) no hay nada que validar — la spec no fija la posición del parámetro, esta es mi decisión.
4. Riesgos altos: ninguno — cambio aislado de una función pura, sin dependencias externas, cubierto por tests.
5. Coste estimado: ~0,5h de implementación; una sola task, despacho a un subagente sin coste relevante en tokens.

**Goal**: Rechazar con un mensaje claro cualquier franja horaria que no cumpla `HH:MM-HH:MM` (00–23 / 00–59) al usar `libres` o `reservar`, sin consultar ni reservar nada.

**Architecture**: Una función pura de validación en un módulo propio (`src/slot-format.js`), usada desde los dos puntos de entrada en `src/app.js` antes de cualquier efecto (filtrar salas libres o crear la reserva).

**Tech Stack**: Node 22, sin dependencias externas, `node --test`.

**Spec**: `./spec.md`

## Restricciones globales

- Formato estricto `HH:MM-HH:MM`, horas 00–23, minutos 00–59 (spec, decisión 1).
- Mensaje único para `libres` y `reservar`: `Franja horaria no válida: "<valor>". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).` (spec, decisión 2).
- Una sola función de validación, en un módulo propio, usada por los dos comandos (spec, decisión 3).
- No entra: validar que el inicio sea anterior al fin (spec, Scope).
- Constitution Art.2: tests antes que código; `node --test` en verde antes de cada commit.
- Constitution Art.4: texto de la interfaz en castellano.
- Constitution Art.5: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); funciones ≤20 líneas y ≤3 parámetros, early returns, sin duplicación.
- Constitution Art.6: política de modelos — modelo y effort declarados al despachar; gama media como suelo para revisores e implementadores.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una función pura + dos puntos de llamada; no hay forma más simple que cumpla la spec.
- [x] **YAGNI gate**: no se abstrae nada con menos de 3 usos — la validación tiene exactamente 2 usos (spec, decisión 3 la pide igualmente explícita).
- [x] **Constitution check**: respeta Art.2 (tests primero), Art.4 (castellano), Art.5 (funciones cortas, sin comentarios redundantes), Art.6 (modelo declarado).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `src/slot-format.js` — función pura `validateSlot(value)` que valida `HH:MM-HH:MM` y devuelve `null` si es válida o el mensaje de error si no.

**Modificar**:

- `src/app.js` — `run()` valida la franja en `libres` (antes de `freeRooms`) y en `reservar` (antes de crear la reserva semanal).
- `test/app.test.js` — añade los casos de franja mal formada para `libres` y `reservar`.

**NO se tocan** (constancia de lo que deliberadamente queda intacto):

- `cancelar` en `src/app.js` — fuera de Scope de la spec, no valida formato de franja.

### 1.6 Dependencias

Ninguna: módulo nuevo autocontenido, sin librerías externas (tech-stack: Node 22 sin dependencias).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Romper el test existente de `reservar --cada-semana` (sin franja) al añadir la validación | Baja | Medio | `reservarSlot()` solo valida cuando `params[1]` no es un flag; sin ese posicional no hay franja que validar (ver decisión técnica 3) |

### 1.8 Rollout

Directo: cambio de librería interna, sin toggle ni despliegue especial.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Validar formato de franja en `libres` y `reservar`

**Modelo**: Sonnet, effort bajo — código ya escrito en esta task, ajuste mecánico de wiring.
**Tests RED**: hilo principal · `test/app.test.js` (se escriben y commitean antes de despachar al implementador).

> Un test por escenario (THEN) de la spec; el THEN es único pero cubre varios valores de ejemplo y los dos comandos.

**Ficheros**: crear `src/slot-format.js`; modificar `src/app.js`, `test/app.test.js`.

- [ ] **Step 1: Implementación — módulo de validación**

`src/slot-format.js`:

```js
const SLOT_PATTERN = /^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/;

export function validateSlot(value) {
  if (SLOT_PATTERN.test(value)) return null;
  return `Franja horaria no válida: "${value}". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).`;
}
```

- [ ] **Step 2: Implementación — wiring en `run()`**

`src/app.js` (reemplaza el cuerpo actual):

```js
import { validateSlot } from './slot-format.js';

const [command, ...args] = process.argv.slice(2);
const rooms = ['Norte', 'Sur'];
const bookings = [{ room: 'Norte', day: 'lun', slot: '10:00-12:00' }];

function freeRooms(slot) {
  return rooms.filter((room) => !bookings.some((b) => b.room === room && b.slot === slot));
}

function reservarSlot(params) {
  return params[1] && !params[1].startsWith('--') ? params[1] : null;
}

export function run(cmd, params) {
  if (cmd === 'libres') {
    const error = validateSlot(params[0]);
    return error ?? freeRooms(params[0]).join(', ');
  }
  if (cmd === 'reservar') {
    const slot = reservarSlot(params);
    const error = slot && validateSlot(slot);
    if (error) return error;
    if (params.includes('--cada-semana')) return 'reserva semanal creada';
  }
  if (cmd === 'cancelar') return `cancelada ${params[0]} ${params[1]}`;
  return 'salas';
}

if (command) console.log(run(command, args));
```

- [ ] **Step 3: Tests — casos nuevos**

Añadir a `test/app.test.js` (junto a los existentes, que no cambian):

```js
test('libres rechaza una franja sin dos puntos', () => {
  assert.equal(
    run('libres', ['10-12']),
    'Franja horaria no válida: "10-12". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).'
  );
});

test('libres rechaza una franja con hora de un solo dígito', () => {
  assert.equal(
    run('libres', ['9:00-11:00']),
    'Franja horaria no válida: "9:00-11:00". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).'
  );
});

test('libres rechaza una hora fuera de rango', () => {
  assert.equal(
    run('libres', ['24:00-24:30']),
    'Franja horaria no válida: "24:00-24:30". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).'
  );
});

test('reservar rechaza una franja mal formada', () => {
  assert.equal(
    run('reservar', ['Norte', '10-12']),
    'Franja horaria no válida: "10-12". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).'
  );
});
```

- [ ] **Step 4: Build/tests**

Run: `node --test`
Expected: todos los tests en verde, incluidos los 3 existentes y los 4 nuevos.

- [ ] **Step 5: Commit**

```bash
git add src/slot-format.js src/app.js test/app.test.js
git commit -m "feat: validar formato de franja horaria en libres y reservar"
```

---

## 3. Validación final

- [ ] Build verde con `node --test`
- [ ] Verificación de los criterios de éxito de la spec (§2, delta de comportamiento)
- [ ] Spec satisfecha: el único THEN de la spec tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-task`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED "Una franja mal formada se rechaza" (`libres` y `reservar`, mensaje exacto, sin efecto) → Task 1. ✓
- Scope "no entra validar inicio < fin" → N/A, no se implementa (confirmado en spec). ✓
- Decisión spec "una sola función de validación en módulo propio" → Task 1, `src/slot-format.js`. ✓
