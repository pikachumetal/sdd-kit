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
> (default del kit).

## Decisiones que he tomado yo — valida estas

1. **Módulo nuevo `src/slot.js`** con una única función `slotError(slot)` — así cumple la decisión 3 de la spec ("una sola función de validación, en un módulo propio, que usan los dos comandos") sin tocar la lógica de negocio de `app.js`.
2. **Posición de la franja en `reservar`**: la spec no fija dónde va la franja en los parámetros de `reservar`. Hoy `reservar` solo tiene la rama `--cada-semana` y el test existente la llama como `['Norte', '--cada-semana']`, sin franja. Defino la franja como `params[1]` **cuando ese valor no empieza por `--`**; si `params[1]` es un flag o no existe, no hay franja que validar y el comportamiento actual (reserva semanal sin franja) se mantiene intacto. Así no rompo el test existente y dejo la puerta abierta a validar cuando sí se pase una franja.
3. **Modelo y effort — Task 1**: Sonnet, effort medio. Gama media como suelo (constitution art. 6); no hace falta más: es una función pura + dos puntos de llamada + tests.
4. **Ejecución**: agente, vía `subagent-driven-development` (default del kit) — no hay motivo para desviarse a en línea.
5. **Coste estimado**: ~0.5h de implementación, 1 task, riesgo bajo.

**Goal**: rechazar con un mensaje claro cualquier franja horaria que no cumpla `HH:MM-HH:MM` (horas 00–23, minutos 00–59) en `libres` y en `reservar`, sin consultar ni reservar nada.

**Architecture**: función pura `slotError(slot)` en `src/slot.js`, con una expresión regular que valida el formato completo. `src/app.js` la invoca al principio de las ramas `libres` y `reservar`; si devuelve un mensaje de error, `run()` lo devuelve y corta ahí sin llegar a `freeRooms` ni a la reserva.

**Tech Stack**: Node 22 sin dependencias externas, `node --test`.

**Spec**: `./spec.md`

## Restricciones globales

- Formato estricto `HH:MM-HH:MM`, horas 00–23, minutos 00–59 (spec, decisión 1).
- Mensaje único, igual en `libres` y `reservar`: `Franja horaria no válida: "<valor>". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).` (spec, decisión 2).
- Una sola función de validación, en un módulo propio, usada por los dos comandos (spec, decisión 3).
- No entra en esta task validar que el inicio sea anterior al fin (spec, Scope).
- Tests antes que código: `node --test` en verde antes de cada commit (constitution art. 2).
- Texto de la interfaz en castellano (constitution art. 4).
- Calidad de código (constitution art. 5): sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, capacidad); funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación. El revisor marca el incumplimiento como Important.
- Política de modelos (constitution art. 6): al despachar un subagente se declaran modelo y effort; gama media como suelo para revisores e implementadores.
- Modo de ejecución por defecto: `subagent-driven-development`; una task va en línea solo si el plan lo declara con motivo (no es el caso aquí).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sí — una función pura con una regex, sin capas nuevas.
- [x] **YAGNI gate**: no se abstrae nada con menos de 3 usos; la función la usan `libres` y `reservar`, los dos casos que pide la spec.
- [x] **Brownfield gate**: retrocompatible — el test existente de `reservar --cada-semana` sin franja sigue pasando (ver decisión 2); respeta el patrón del proyecto (fichero único `app.js` + módulos pequeños importados, como ya hace el propio `app.js`).
- [x] **Constitution check**: cumple arts. 2, 4, 5 y 6 (ver Restricciones globales).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `src/slot.js` — expone `slotError(slot)`: `null` si `slot` cumple `HH:MM-HH:MM` (horas 00–23, minutos 00–59), o el mensaje de error en castellano si no.

**Modificar**:

- `src/app.js` — en la rama `libres`, llamar a `slotError(params[0])` antes de `freeRooms`; en la rama `reservar`, llamar a `slotError(params[1])` cuando `params[1]` exista y no empiece por `--`, antes de comprobar `--cada-semana`. Si `slotError` devuelve un mensaje, `run()` lo devuelve tal cual.
- `test/app.test.js` — añadir los dos tests RED de esta task (uno por comando).

**NO se tocan**:

- `bookings`, `rooms`, `freeRooms()` — la validación pasa antes de llegar a esta lógica; no cambia.
- La rama `cancelar` — fuera del Scope de la spec.

### 1.6 Dependencias

Ninguna. No depende de otras specs ni de librerías externas.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Asumir mal la posición de la franja en `reservar` (decisión 2) rompe el test existente de reserva semanal | Baja | Medio | El test `reservar --cada-semana crea la reserva semanal` (sin franja) se deja sin tocar y se ejecuta en la verificación de la Task 1; si falla, revisar la posición asumida antes de seguir. |

### 1.8 Rollout

Directo: se mergea y se despliega como cualquier otro cambio de esta herramienta de un solo usuario.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Validar el formato de la franja horaria

**Modelo**: Sonnet, effort medio.
**Ejecución**: agente (default).
**Tests RED**: hilo principal · `test/app.test.js`, escritos y commiteados antes de despachar.

**Interfaces**:
- Consume: nada (task única, sin tasks previas en este plan).
- Produce: `slotError(slot: string): string | null` en `src/slot.js`, usada por `run()` en `src/app.js`.

**Ficheros**: crear `src/slot.js`; modificar `src/app.js`, `test/app.test.js`.

- [ ] **Step 1: Escribir los tests RED**

Añadir a `test/app.test.js`, sin tocar los tests existentes:

```javascript
test('libres rechaza una franja mal formada', () => {
  assert.equal(
    run('libres', ['10-12']),
    'Franja horaria no válida: "10-12". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).'
  );
});

test('reservar rechaza una franja mal formada', () => {
  assert.equal(
    run('reservar', ['Norte', '9:00-11:00', '--cada-semana']),
    'Franja horaria no válida: "9:00-11:00". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).'
  );
});
```

- [ ] **Step 2: Ejecutar los tests y comprobar que fallan**

Run: `node --test`
Esperado: FAIL en los dos tests nuevos (`slotError` no existe todavía / `run` no valida nada).

- [ ] **Step 3: Crear `src/slot.js`**

```javascript
const SLOT_PATTERN = /^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/;

export function slotError(slot) {
  if (SLOT_PATTERN.test(slot)) return null;
  return `Franja horaria no válida: "${slot}". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).`;
}
```

- [ ] **Step 4: Modificar `src/app.js`**

```javascript
import { slotError } from './slot.js';

const [command, ...args] = process.argv.slice(2);
const rooms = ['Norte', 'Sur'];
const bookings = [{ room: 'Norte', day: 'lun', slot: '10:00-12:00' }];

function freeRooms(slot) {
  return rooms.filter((room) => !bookings.some((b) => b.room === room && b.slot === slot));
}

function reservar(params) {
  const slot = params[1];
  if (slot && !slot.startsWith('--')) {
    const error = slotError(slot);
    if (error) return error;
  }
  if (params.includes('--cada-semana')) return 'reserva semanal creada';
  return 'salas';
}

export function run(cmd, params) {
  if (cmd === 'libres') {
    const error = slotError(params[0]);
    if (error) return error;
    return freeRooms(params[0]).join(', ');
  }
  if (cmd === 'reservar') return reservar(params);
  if (cmd === 'cancelar') return `cancelada ${params[0]} ${params[1]}`;
  return 'salas';
}

if (command) console.log(run(command, args));
```

- [ ] **Step 5: Ejecutar los tests y comprobar que pasan**

Run: `node --test`
Esperado: PASS en todos los tests (los 2 nuevos y los 3 existentes, incluido `reservar --cada-semana crea la reserva semanal`).

- [ ] **Step 6: Commit**

```bash
git add src/slot.js src/app.js test/app.test.js
git commit -m "feat: validar el formato de la franja horaria en libres y reservar"
```

---

## 3. Validación final

- [ ] Build verde con `node --test`
- [ ] Verificación de los criterios de éxito de la spec: franja mal formada rechazada en `libres` y en `reservar`, con el mensaje exacto, sin consultar ni reservar nada
- [ ] Spec satisfecha: el único requisito de la spec (ADDED — franja mal formada se rechaza) tiene su task
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-task`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED — Una franja mal formada se rechaza (`libres` y `reservar`, mensaje exacto) → Task 1. ✓
- Formato estricto `HH:MM-HH:MM`, horas 00–23, minutos 00–59 → Task 1, `SLOT_PATTERN`. ✓
- Mensaje único para `libres` y `reservar` → Task 1, misma función `slotError` en ambas ramas. ✓
- Una sola función de validación en módulo propio → Task 1, `src/slot.js`. ✓
- No entra: validar que el inicio sea anterior al fin → N/A, confirmado en spec (Scope). ✓
