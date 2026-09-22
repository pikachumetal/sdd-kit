---
id: 20260921-090000-task-0009-slot-format
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

1. Modelo `sonnet` / effort medio para la única task — cambio mecánico (regex + dos call sites) pero exige leer `app.js` completo para no romper `libres`/`reservar`/`cancelar`. Perfil vigente `delegate` (default del proyecto, `sdd-kit.json` sin `control.profile`): sin gate en el plan, sigo tras comprobar cobertura.
2. Ejecución en línea (no se despacha subagente) — una sola task, un solo fichero de producción (`src/app.js`, 17 líneas) y su test; el coste de dispatch supera el de escribirlo directo.
3. Validación centralizada en una función `isValidSlot(slot)` reutilizada por `libres` y `reservar` — la spec exige el mismo mensaje en ambos, y `app.js` ya comparte lógica entre comandos en un único `run()`.
4. Riesgo alto: ninguno. Coste estimado: ~15 min.

**Goal**: rechazar con un mensaje de error claro cualquier franja horaria que no cumpla `HH:MM-HH:MM` (horas 00–23, minutos 00–59) al usarse en `libres` o `reservar`.

**Architecture**: una función pura de validación por regex en `src/app.js`, invocada al principio de las ramas `libres` y `reservar` de `run()`; si falla, se devuelve el mensaje de error sin tocar `bookings` ni `freeRooms`.

**Tech Stack**: Node 22 sin dependencias, `node --test`.

**Spec**: `./spec.md`

## Restricciones globales

- Mensaje exacto: `Franja horaria no válida: "<valor>". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).` (spec, delta de comportamiento).
- Formato válido: `HH:MM-HH:MM`, horas `00`–`23`, minutos `00`–`59` (spec, decisión 1).
- No entra: validar que el inicio sea anterior al fin (spec, Scope).
- Un único mensaje para `libres` y `reservar` (spec, decisión 2).
- Tests antes que código: `node --test` en verde antes de cada commit (constitution, art. 2).
- Texto de la interfaz en castellano (constitution, art. 4).
- Comentarios: no repetir en comentarios lo que el código ya dice, ni citar documentos (constitution, spec, task, capacidad); nombres descriptivos en vez de comentarios explicativos.
- Modelo por defecto: gama media (`sonnet`) si hay que interpretar prosa; tier más barato solo si el código ya viene escrito. `fable` y `opus xhigh` prohibidos sin justificación escrita.
- Ejecución por defecto: `superpowers:subagent-driven-development`; en línea solo con motivo (ver decisión 2 arriba).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sí — una función de validación con regex, sin capa nueva.
- [x] **YAGNI gate**: no se abstrae nada con menos de 3 usos; la función se usa 2 veces (`libres`, `reservar`), justo lo que pide la spec.
- [x] **Brownfield gate**: retrocompatible (no cambia comportamiento con franjas válidas); respeta el patrón de fichero único de `app.js`; sin refactor fuera de scope.
- [x] **Constitution check**: cumple art. 1 (flujo SDD), art. 2 (tests antes que código), art. 4 (castellano).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — añade `isValidSlot(slot)` y la comprueba al inicio de las ramas `libres` y `reservar` de `run()`.
- `test/app.test.js` — añade los tests de la franja mal formada.

**NO se tocan**:

- La rama `cancelar` de `run()` — fuera de Scope (la spec solo cubre `libres` y `reservar`).
- `freeRooms()` y `bookings` — no cambian de forma; siguen operando solo sobre franjas ya válidas.

### 1.6 Dependencias

Ninguna. Sin librerías nuevas.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Regex deja pasar un caso límite (p. ej. `23:60`) | Baja | Medio | Tests explícitos con los tres ejemplos de la spec (`10-12`, `9:00-11:00`, `24:00-24:30`) más un caso de minutos fuera de rango |

### 1.8 Rollout

Directo: se mergea con el resto de la task, sin toggle ni despliegue especial.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Validar formato de franja en `libres` y `reservar`

**Modelo**: `sonnet`, effort medio.
**Ejecución**: en línea — ver decisión 2 arriba (task única, fichero de 17 líneas).
**Tests RED**: hilo principal · `test/app.test.js`, escritos y commiteados antes de implementar (TDD del propio hilo, al ir en línea).

**Ficheros**: modificar `src/app.js`, `test/app.test.js`

- [ ] **Step 1: Escribir los tests en RED**

```js
test('libres rechaza una franja sin dos puntos', () => {
  assert.equal(
    run('libres', ['10-12']),
    'Franja horaria no válida: "10-12". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).'
  );
});

test('reservar rechaza una franja con hora de un solo dígito', () => {
  assert.equal(
    run('reservar', ['Norte', '9:00-11:00']),
    'Franja horaria no válida: "9:00-11:00". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).'
  );
});

test('libres rechaza una franja con hora fuera de rango', () => {
  assert.equal(
    run('libres', ['24:00-24:30']),
    'Franja horaria no válida: "24:00-24:30". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).'
  );
});
```

Añadir al final de `test/app.test.js`, tras el test de `cancelar`.

- [ ] **Step 2: Ejecutar y confirmar RED**

Run: `node --test`
Esperado: FAIL en los 3 tests nuevos (los mensajes actuales no coinciden — `libres` devuelve `''` o una sala, `reservar` no valida nada).

> **Ruling (ejecución)**: `params.find((p) => !p.startsWith('--'))` para localizar la franja en `reservar` es incorrecto — el primer parámetro sin `--` es el nombre de la sala (`'Norte'`), no la franja. La franja siempre es `params[1]`. No cambia la spec ni el Scope; corrige un error de este mismo plan.

- [ ] **Step 3: Implementar la validación**

```js
const SLOT_PATTERN = /^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/;

function invalidSlotMessage(slot) {
  return `Franja horaria no válida: "${slot}". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).`;
}

function isValidSlot(slot) {
  return SLOT_PATTERN.test(slot);
}
```

En `run()`, al principio de cada rama que recibe una franja:

```js
export function run(cmd, params) {
  if (cmd === 'libres') {
    if (!isValidSlot(params[0])) return invalidSlotMessage(params[0]);
    return freeRooms(params[0]).join(', ');
  }
  if (cmd === 'reservar') {
    const slot = params[1];
    if (!isValidSlot(slot)) return invalidSlotMessage(slot);
    if (params.includes('--cada-semana')) return 'reserva semanal creada';
  }
  if (cmd === 'cancelar') return `cancelada ${params[0]} ${params[1]}`;
  return 'salas';
}
```

> Nota: el test existente `reservar --cada-semana crea la reserva semanal` llama `run('reservar', ['Norte', '--cada-semana'])` sin franja — con `params.find` sobre `'Norte'` (no empieza por `--`), `slot` sería `'Norte'`, que no matchea `SLOT_PATTERN` y rompería ese test. Ajustar esa llamada del test existente a `run('reservar', ['Norte', '10:00-12:00', '--cada-semana'])` para que pase una franja válida real, ya que la spec exige validar toda franja usada en `reservar`.

- [ ] **Step 4: Ajustar el test existente de `reservar`**

En `test/app.test.js`, cambiar:

```js
test('reservar --cada-semana crea la reserva semanal', () => {
  assert.equal(run('reservar', ['Norte', '--cada-semana']), 'reserva semanal creada');
});
```

por:

```js
test('reservar --cada-semana crea la reserva semanal', () => {
  assert.equal(run('reservar', ['Norte', '10:00-12:00', '--cada-semana']), 'reserva semanal creada');
});
```

- [ ] **Step 5: Ejecutar y confirmar GREEN**

Run: `node --test`
Esperado: todos los tests en verde (los 3 nuevos + los 3 existentes ajustados).

- [ ] **Step 6: Commit**

```bash
git add src/app.js test/app.test.js
git commit -m "feat(salas): validar el formato de la franja horaria en libres y reservar"
```

---

## 3. Validación final

- [ ] Build verde con `node --test`
- [ ] Verificación del criterio de éxito de la spec: franja mal formada → mensaje exacto, sin consultar ni reservar
- [ ] Spec satisfecha: el único escenario (`ADDED — Una franja mal formada se rechaza`) tiene su task (ver §4)
- [ ] Cierre de rama según `sdd-end-task`

---

## 4. Self-review (cobertura spec → tasks)

- `ADDED — Una franja mal formada se rechaza` (GIVEN franja mal formada, WHEN `libres`/`reservar`, THEN mensaje exacto y no se consulta ni reserva) → Task 1. ✓
- No entra: validar inicio < fin → N/A, confirmado en spec (Scope), sin task. ✓
