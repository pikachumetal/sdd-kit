---
id: 20260927-100000-feature-0012-franja
feature: "0012"
title: "Plan de implementación — Validar el formato de la franja"
spec: ./spec.md
status: draft
created: 2026-09-27
---

# Plan de implementación — Validar el formato de la franja

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort — Task 1**: `subagent_type: sdd-kit:effort-low` + `model: sonnet` — es un cambio mecánico (una función pura, una regex, un mensaje literal fijado por la spec), no hay prosa que interpretar.
2. **Modelo y effort — revisor final**: `sdd-kit:effort-high` + `model: opus`, fijo por política aunque el plan tenga una sola task (no hay otra revisión independiente).
3. **Ejecución**: `native`, porque es una única task sobre un solo fichero (`src/slots.js`); despachar un subagente para esto costaría más que ejecutarlo en el hilo principal. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el revisor final usa el modelo más capaz.
4. **Decisión técnica que la spec no fija**: formato exacto de `HH-HH` — dos dígitos a cada lado del guion (`/^\d{2}-\d{2}$/`), leído literalmente del nombre del formato y del ejemplo `10-12`. Una franja como `1012` (sin guion) o `9-10` (un solo dígito) no casa y falla.
5. **Riesgos altos**: ninguno — cambio de validación acotado a una función pura, sin efectos en I/O, red o persistencia.
6. **Coste estimado**: ~0.25h; una task nativa sin despacho de subagentes salvo el revisor final (effort-high + opus, orden de magnitud bajo en tokens).

**Goal**: que `reserve(room, slot)` rechace cualquier franja que no tenga el formato `HH-HH` con un error claro.

**Architecture**: validar `slot` contra una expresión regular al principio de `reserve()` y lanzar un `Error` con el mensaje exacto de la spec si no casa; sin cambios de firma ni de comportamiento para las franjas válidas.

**Tech Stack**: Node.js, `node --test` para la suite.

**Spec**: `./spec.md`

**Ejecución**: native, porque es una sola task mecánica sobre un fichero. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Mensaje de error literal y exacto: «Franja no válida: usa HH-HH, p. ej. 10-12» (spec).
- Sin comentarios que repitan el código o citen documentos (constitution, spec, task): la constitution del proyecto no tiene artículo de calidad de código propio, así que esta regla se aplica igualmente.
- Clean code: nombres claros, sin abstracciones para un único caso de uso (YAGNI).

### De proceso

- Commits: tipo/scope en inglés, título y cuerpo en castellano, nunca title-only (Art. I de la constitution).
- Perfil `delegate`: sin gate de aprobación de plan; se comprueba que el único escenario de la spec tiene su task y se sigue.
- Revisor final siempre `sdd-kit:effort-high` + `opus`, también con una sola task.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sí — una validación con regex y un `throw`, sin capas nuevas.
- [x] **YAGNI gate**: no se abstrae nada; un único caso de uso.
- [x] **Constitution check**: respeta Art. I (commits) y Art. II (suite `node --test` en verde).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/slots.js` — añade la validación de `slot` en `reserve()` antes de construir el resultado.

**NO se tocan**:

- `tests/slots.test.js` solo se amplía (no se reescribe): el test existente de franja válida sigue pasando sin cambios.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Interpretar `HH-HH` de forma distinta a la esperada por el dev-lead (p. ej. admitir un solo dígito) | Baja | Bajo | Regex estricta `/^\d{2}-\d{2}$/` documentada en la decisión técnica 4; test explícito con `1012` (el caso de la spec) |

### 1.8 Rollout

Directo: cambio de una función pura, sin toggle ni migración.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Validar el formato de la franja en `reserve()`

**Modelo**: `subagent_type: sdd-kit:effort-low` + `model: sonnet` (cambio mecánico; en `native` lo ejecuta el hilo principal).
**Tests RED**: hilo principal · `tests/slots.test.js`, escritos antes de tocar `src/slots.js`.

**Superficies**: backend (única función de dominio del proyecto).
**Verificación**: `node --test`
**Se prueba en la aplicación**: no, porque no existe todavía CLI (`bin/`) que invoque `reserve()` — el README describe el CLI previsto pero el repo solo tiene la función de dominio; la verificación es la suite.

**Interfaces**:
- Consume: nada (usa solo la firma existente `reserve(room, slot)` de `src/slots.js`).
- Produce: `reserve(room: string, slot: string): { room: string, slot: string }` — lanza `Error('Franja no válida: usa HH-HH, p. ej. 10-12')` si `slot` no casa con `/^\d{2}-\d{2}$/`; si casa, devuelve `{ room, slot }` igual que antes.

**Ficheros**: modificar `src/slots.js`; modificar `tests/slots.test.js`.

- [ ] **Step 1: Escribir el test que falla**

```js
test('rechaza una franja sin el formato HH-HH', () => {
  assert.throws(
    () => reserve('Norte', '1012'),
    { message: 'Franja no válida: usa HH-HH, p. ej. 10-12' }
  );
});
```

- [ ] **Step 2: Ejecutar la suite y confirmar que falla**

Run: `node --test`
Expected: FAIL — `reserve('Norte', '1012')` no lanza, devuelve `{ room: 'Norte', slot: '1012' }`.

- [ ] **Step 3: Implementar la validación en `reserve()` (`src/slots.js`)**

Firma sin cambios: `export function reserve(room, slot)`. Antes de construir el objeto de retorno, si `slot` no casa con `/^\d{2}-\d{2}$/`, lanzar `new Error('Franja no válida: usa HH-HH, p. ej. 10-12')`.

- [ ] **Step 4: Build**

No aplica (sin paso de build; Node ejecuta el código fuente directamente).

- [ ] **Step 5: Ejecutar la suite y confirmar que pasa**

Run: `node --test`
Expected: PASS — los dos tests de `tests/slots.test.js` en verde.

- [ ] **Step 6: Commit de la task**

```bash
git add src/slots.js tests/slots.test.js
git commit -m "feat(slots): valida el formato HH-HH de la franja al reservar"
```

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test` (suite completa del proyecto)
- [ ] Verificación del criterio de éxito de la spec: `reserve('Norte', '1012')` falla con el mensaje exacto
- [ ] Spec satisfecha: el único requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- Franja que no casa con `HH-HH` → falla con «Franja no válida: usa HH-HH, p. ej. 10-12» → Task 1. ✓
