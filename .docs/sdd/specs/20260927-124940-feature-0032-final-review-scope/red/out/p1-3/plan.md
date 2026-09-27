---
id: 20260927-100000-feature-0012-franja
feature: 0012
title: Plan de implementación — Validar el formato de la franja
spec: ./spec.md
status: draft
created: 2026-09-27
---

# Plan de implementación — Validar el formato de la franja

## Decisiones que he tomado yo — valida estas

1. `reserve()` lanza un `Error` (no devuelve un objeto de error) cuando la franja no casa con `HH-HH` — es el mecanismo de fallo más simple y el único que ya usa `node:test`/`assert.throws` sin introducir un tipo de retorno nuevo.
2. Regex de validación: `/^\d{1,2}-\d{1,2}$/` — acepta horas de una o dos cifras (`9-10`, `10-12`); la spec solo fija el ejemplo `10-12` y el caso inválido `1012`, y no exige rechazar horas de una cifra.
3. Modelo y effort de la Task 1: `subagent_type: sdd-kit:effort-low` + `model: sonnet` — arreglo mecánico y acotado a un fichero, sin ambigüedad de requisitos.
4. Ejecución: native, porque la feature es una sola task pequeña y autocontenida (un fichero, una función), sin interfaces que compartir entre tasks ni beneficio de una revisión aislada por task.
5. Riesgo: bajo — cambio de una función pura, sin estado ni I/O.
6. Coste estimado: ~15 min de implementación.

**Goal**: Que `reserve()` rechace con un mensaje claro cualquier franja que no tenga el formato `HH-HH`.

**Architecture**: Añadir una validación por regex al principio de `reserve()` en `src/slots.js`; si la franja no casa, lanzar un `Error` con el mensaje exacto de la spec antes de construir el objeto de reserva.

**Tech Stack**: Node.js, `node --test` (Art. II de la constitution).

**Spec**: `./spec.md`

**Ejecución**: native, porque la feature tiene una sola task pequeña y autocontenida, sin necesidad de revisión aislada por task. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Mensaje de error exacto: `Franja no válida: usa HH-HH, p. ej. 10-12` (spec, THEN).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.

### De proceso

- Commits: tipo/scope en inglés, título y cuerpo en castellano, nunca title-only (Art. I).
- Suite `node --test` en verde antes de fusionar (Art. II).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sí — una validación por regex al principio de la función existente, sin nuevas abstracciones.
- [x] **YAGNI gate**: no se abstrae nada; una sola regla de validación con un solo uso.
- [x] **Constitution check**: respeta Art. I (commits) y Art. II (suite verde).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/slots.js` — `reserve()` valida `slot` contra `HH-HH` antes de construir la reserva; lanza `Error` si no casa.

**NO se tocan**:

- `tests/slots.test.js:5-7` (test existente de reserva válida) — sigue pasando sin cambios, la validación no altera el caso feliz.

### 1.6 Dependencias

Ninguna — sin librerías nuevas, sin specs previas relacionadas.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La regex rechaza formatos válidos no contemplados en la spec (p. ej. `09-10`) | Baja | Bajo | Regex acepta 1 o 2 dígitos por lado (`\d{1,2}`); test añadido para franja de un dígito |

### 1.8 Rollout

Directo — cambio de una función pura sin toggle ni migración.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Validar formato de franja en `reserve()`

**Modelo**: `subagent_type: sdd-kit:effort-low` + `model: sonnet`
**Tests RED**: hilo principal · `tests/slots.test.js`, escritos antes de implementar (Native: TDD del propio hilo)

**Superficies**: backend
**Verificación**: `node --test`
**Se prueba en la aplicación**: no, porque es una función pura sin interfaz de usuario — la verificación es la suite.

**Interfaces**:
- Consume: nada.
- Produce: `reserve(room: string, slot: string): { room: string, slot: string }` — lanza `Error('Franja no válida: usa HH-HH, p. ej. 10-12')` si `slot` no casa con `/^\d{1,2}-\d{1,2}$/`.

**Ficheros**: modificar `src/slots.js`, `tests/slots.test.js`

- [ ] **Step 1: Escribir el test que falla**

```js
test('rechaza una franja sin el formato HH-HH', () => {
  assert.throws(
    () => reserve('Norte', '1012'),
    { message: 'Franja no válida: usa HH-HH, p. ej. 10-12' }
  );
});
```

- [ ] **Step 2: Ejecutar el test y comprobar que falla**

Run: `node --test`
Expected: FAIL — `reserve('Norte', '1012')` no lanza, devuelve `{ room: 'Norte', slot: '1012' }`.

- [ ] **Step 3: Implementar la validación**

En `src/slots.js`, al principio de `reserve(room, slot)`: si `slot` no casa con `/^\d{1,2}-\d{1,2}$/`, lanzar `new Error('Franja no válida: usa HH-HH, p. ej. 10-12')` antes de construir el objeto de retorno.

- [ ] **Step 4: Build**

No aplica (sin paso de build en este proyecto).

- [ ] **Step 5: Ejecutar la suite y comprobar que pasa**

Run: `node --test`
Expected: PASS — los dos tests (`reserva una sala en una franja`, `rechaza una franja sin el formato HH-HH`) en verde.

- [ ] **Step 6: Commit de la task**

```bash
git add src/slots.js tests/slots.test.js
git commit -m "feat(slots): validar formato HH-HH de la franja al reservar"
```

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test` (suite completa del proyecto)
- [ ] Verificación del criterio de éxito de la spec: `reserve('Norte', '1012')` falla con «Franja no válida: usa HH-HH, p. ej. 10-12»
- [ ] Spec satisfecha: el único requisito (validación de franja) tiene su Task 1 (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- Franja que no casa con `HH-HH` falla con «Franja no válida: usa HH-HH, p. ej. 10-12» → Task 1. ✓
- Reserva con franja válida sigue funcionando (caso feliz, test existente) → Task 1 (NO se tocan `tests/slots.test.js:5-7`). ✓
