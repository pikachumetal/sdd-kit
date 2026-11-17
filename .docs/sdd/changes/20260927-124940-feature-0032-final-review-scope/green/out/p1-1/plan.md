---
id: 20260927-100000-feature-0012-franja
feature: "0012"
title: Plan de implementación — Validar el formato de la franja
spec: ./spec.md
status: draft
created: 2026-09-27
---

# Plan de implementación — Validar el formato de la franja

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort de la Task 1**: `sdd-kit:effort-low` + `sonnet` — es un arreglo mecánico (una validación de formato con regex y un mensaje de error literal, ambos fijados por la spec), no hay prosa que interpretar.
2. **Ejecución**: `native`, porque el plan tiene una sola task pequeña (un fichero de producción + su test), sin interfaces que coordinar entre tasks ni beneficio de una revisión de subagente por task.
3. **Decisión técnica que la spec no fija**: la validación se implementa como una función `isValidSlot(slot)` con regex `/^\d{1,2}-\d{1,2}$/`, invocada al principio de `reserve()`, que lanza un `Error` con el mensaje literal de la spec.
4. **Riesgos**: bajo — cambio acotado a un fichero existente de 3 líneas, con un único escenario y su test.
5. **Coste estimado**: ~0.2h de implementación (una task).

**Goal**: Que `reserve(room, slot)` rechace franjas que no cumplan el formato `HH-HH` con un error claro.

**Architecture**: `slots.js` gana una comprobación de formato al inicio de `reserve()`; si la franja no casa con `HH-HH`, lanza un `Error` con el mensaje exacto de la spec en vez de construir la reserva.

**Tech Stack**: Node.js, ESM (`import`/`export`), `node --test` + `node:assert` para tests.

**Spec**: `./spec.md`

**Ejecución**: native, porque el plan tiene una sola task pequeña y autocontenida (ver decisión 2 arriba).

## Restricciones globales

### De código

- Mensaje de error exacto de la spec: `Franja no válida: usa HH-HH, p. ej. 10-12` (sin variarlo).
- Sin comentarios que repitan el código ni citen documentos (constitution, spec, task, capacidad) — Art. X (equivalente aplicado aunque la constitution del proyecto no lo declare explícito, por ser la práctica por defecto del kit).
- Commits: tipo/scope en inglés, título y cuerpo en castellano, nunca title-only — Art. I de `.docs/sdd/constitution.md`.

### De proceso

- Ejecución por defecto: `native` (ver decisión 2).
- Suite del proyecto: `node --test`, todo verde antes de fusionar — Art. II de `.docs/sdd/constitution.md`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sí — una comprobación de formato antes de construir la reserva, nada más.
- [x] **YAGNI gate**: no se abstrae nada; un solo uso real (`reserve`).
- [x] **Constitution check**: respeta Art. I (commits) y Art. II (suite `node --test` en verde).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/slots.js` — añade la validación del formato `HH-HH` al inicio de `reserve()`.
- `tests/slots.test.js` — añade el test del escenario de franja inválida.

**NO se tocan**:

- Ningún otro fichero — la feature es un único escenario acotado a `slots.js`.

### 1.6 Dependencias

Ninguna — capacidad `booking` ya existente, sin dependencias externas nuevas.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Regex demasiado laxa u onerosa acepte formatos no deseados (p. ej. `100-200`) | Baja | Bajo | El test RED cubre exactamente el ejemplo de la spec (`1012`); regex simple `/^\d{1,2}-\d{1,2}$/` |

### 1.8 Rollout

Directo — cambio de una función pura, sin toggle ni migración.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Validar el formato de la franja en `reserve()`

**Modelo**: `subagent_type: sdd-kit:effort-low` + `model: sonnet`
**Tests RED**: hilo principal · `tests/slots.test.js`, escritos antes de implementar (Native: TDD del propio hilo)

- `reserva una franja con formato inválido` — `assert.throws(() => reserve('Norte', '1012'), { message: 'Franja no válida: usa HH-HH, p. ej. 10-12' })`

**Superficies**: backend (lógica de dominio, sin BD/UI)
**Verificación**: `node --test`
**Se prueba en la aplicación**: no aplica — no hay CLI/UI en el repo todavía; el comportamiento se verifica con la suite (`node --test`).

**Interfaces**:
- Consume: `reserve(room, slot)` existente en `src/slots.js` — nada más.
- Produce: `reserve(room, slot)` sigue devolviendo `{ room, slot }` cuando `slot` casa con `HH-HH`; lanza `Error('Franja no válida: usa HH-HH, p. ej. 10-12')` en caso contrario. Ninguna task futura depende de esto salvo la propia capacidad `booking`.

**Ficheros**: modificar `src/slots.js`, `tests/slots.test.js`

- [ ] **Step 1: Escribir el test RED** en `tests/slots.test.js`:
  ```js
  test('reserva una franja con formato inválido', () => {
    assert.throws(
      () => reserve('Norte', '1012'),
      { message: 'Franja no válida: usa HH-HH, p. ej. 10-12' }
    );
  });
  ```
- [ ] **Step 2: Ejecutar `node --test` y comprobar que este test falla** (la reserva se construye sin validar).
- [ ] **Step 3: Implementar la validación en `src/slots.js`** — al inicio de `reserve(room, slot)`, si `slot` no casa con `/^\d{1,2}-\d{1,2}$/`, lanzar `new Error('Franja no válida: usa HH-HH, p. ej. 10-12')` antes de construir el objeto de retorno.
- [ ] **Step 4: Ejecutar `node --test` y comprobar que todos los tests pasan** (el existente `reserva una sala en una franja` y el nuevo).
- [ ] **Step 5: Commit de la task** — `git add src/slots.js tests/slots.test.js` + commit con tipo/scope en inglés, cuerpo en castellano (Art. I).

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test` (suite completa del proyecto)
- [ ] Verificación del criterio de éxito de la spec: `reserve('Norte', '1012')` lanza `Franja no válida: usa HH-HH, p. ej. 10-12`
- [ ] Spec satisfecha: el único requisito ADDED de `booking` tiene su Task 1 (ver §4)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED — La franja se valida al reservar (formato `HH-HH`, error `Franja no válida: usa HH-HH, p. ej. 10-12`) → Task 1. ✓
