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

1. **Ejecución: Native** — una sola task, un solo fichero de producción (`src/slots.js`) y un solo escenario; el despacho de un implementador + revisor por task, más la revisión final, es coste sin beneficio para un cambio de esta escala.
2. **Modelo y effort**: sesión en gama media (Sonnet, effort medium) para implementar; no hace falta revisor final en modelo más capaz porque no hay subagentes que auditar — el hilo principal revisa su propio diff contra los THEN de la spec antes de commitear.
3. **Formato exacto de `HH-HH`**: la spec no fija si la hora admite uno o dos dígitos. Decido `^\d{1,2}-\d{1,2}$` (acepta `9-11` y `10-12`) porque es la lectura literal de "franja horaria" y no añade una restricción que la spec no pide (YAGNI); no valido rangos horarios (p. ej. que la primera hora sea menor que la segunda) porque el único THEN de la spec es sobre el formato, no sobre el rango.
4. **Mecanismo de fallo**: `reserve()` lanza un `Error` de JavaScript con el mensaje exacto de la spec, en vez de devolver un valor de error, porque no hay un CLI ni un contrato de retorno ya establecido que fijar (el único caller hoy es el test).
5. **Riesgo**: bajo — un fichero, una función, un test nuevo; sin dependencias externas.
6. **Coste estimado**: < 30 min, sin dispatch de subagentes (no aplica orden de magnitud en tokens).

**Goal**: que `reserve()` rechace con un error claro cualquier franja que no case con `HH-HH`.

**Architecture**: `reserve()` valida `slot` contra una regexp antes de construir el objeto de reserva; si no casa, lanza `Error('Franja no válida: usa HH-HH, p. ej. 10-12')` y no llega a construirlo.

**Tech Stack**: Node.js (ESM), `node:test` + `node:assert` para tests. No hay `tech-stack.md` en el proyecto; no se crea para esta feature (YAGNI).

**Spec**: `./spec.md`

**Ejecución**: native, porque una sola task de un único fichero no justifica el coste de un implementador y un revisor por subagente (ver decisión 1). La sesión que ejecuta va bien en gama media (Sonnet, effort medium).

## Restricciones globales

### De código

- Mensaje de error literal: `Franja no válida: usa HH-HH, p. ej. 10-12` (spec, THEN único).
- Formato válido: `^\d{1,2}-\d{1,2}$` sobre el `slot` completo (decisión técnica 3 de arriba).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task); código limpio, sin abstracciones para un solo caso de uso.

### De proceso

- Commits: tipo/scope en inglés, título y cuerpo en castellano, nunca title-only (Constitution Art. I).
- Suite `node --test` en verde antes de fusionar (Constitution Art. II).
- Ejecución Native: sesión en gama media (Sonnet, effort medium); sin revisor final en subagente porque no hay dispatch que auditar.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sí — una regexp y un `throw` en la función existente, sin capas nuevas.
- [x] **YAGNI gate**: sin abstracciones nuevas; no se crea validador reusable porque hoy solo lo usa `reserve()`.
- [x] **Brownfield gate**: retrocompatible — la franja válida (`10-12`) sigue devolviendo el mismo objeto; solo se añade el camino de fallo.
- [x] **Constitution check**: respeta Art. I (commits) y Art. II (suite verde); no hay otros artículos.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/slots.js` — añade la validación del formato de `slot` al inicio de `reserve()`.
- `tests/slots.test.js` — añade el test del escenario de franja inválida; conserva el test existente de franja válida.

**NO se tocan**:

- Cualquier CLI o punto de entrada — no existe todavía en el repo (`README.md` lo describe pero no está implementado); fuera de alcance de esta spec.

### 1.6 Dependencias

Ninguna: sin librerías nuevas, sin specs previas de las que depender.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La regexp deja pasar una franja con formato inesperado (p. ej. espacios) | Baja | Bajo | El test de RED cubre exactamente el caso de la spec (`1012`); no se generaliza más allá de eso (YAGNI) |

### 1.8 Rollout

Directo: se fusiona a `develop` con el resto del flujo de cierre de la feature.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Validar el formato de la franja en `reserve()`

**Modelo**: Native — la sesión implementa esta task ella misma, gama media (Sonnet, effort medium); no hay despacho de subagente que declarar.
**Tests RED**: hilo principal · `tests/slots.test.js`, escrito antes de implementar (TDD del propio hilo, Native).

**Superficies**: backend (lógica pura, sin BD ni UI)
**Verificación**: `node --test`
**Se prueba en la aplicación**: no, porque no existe todavía un CLI que invoque `reserve()` (ver «NO se tocan»); se prueba con la suite de `node --test`, que es la única interfaz real hoy.

**Interfaces**:
- Consume: nada (task única, sin tasks previas)
- Produce: `reserve(room: string, slot: string): { room: string, slot: string }`, que lanza `Error('Franja no válida: usa HH-HH, p. ej. 10-12')` cuando `slot` no casa con `^\d{1,2}-\d{1,2}$`

**Ficheros**: modificar `src/slots.js`, `tests/slots.test.js`

- [ ] **Step 1: Escribir el test en rojo**

```js
test('rechaza una franja con formato inválido', () => {
  assert.throws(
    () => reserve('Norte', '1012'),
    { message: 'Franja no válida: usa HH-HH, p. ej. 10-12' }
  );
});
```

- [ ] **Step 2: Ejecutar la suite y comprobar que falla**

Run: `node --test`
Expected: FAIL — `reserve('Norte', '1012')` no lanza, la aserción `assert.throws` falla.

- [ ] **Step 3: Implementar la validación en `reserve(room, slot)` (`src/slots.js`)**

Al inicio de la función, si `slot` no casa con `^\d{1,2}-\d{1,2}$`, lanzar `throw new Error('Franja no válida: usa HH-HH, p. ej. 10-12')` antes de construir el objeto de retorno.

- [ ] **Step 4: Ejecutar la suite y comprobar que pasa**

Run: `node --test`
Expected: PASS — los dos tests de `tests/slots.test.js` en verde.

- [ ] **Step 5: Commit de la task**

Convención Art. I: tipo/scope en inglés, título y cuerpo en castellano.

```bash
git add src/slots.js tests/slots.test.js
git commit -m "feat(slots): valida el formato de la franja al reservar

Rechaza una franja que no case con HH-HH con un mensaje claro,
en vez de reservarla sin sentido."
```

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test` (única suite del proyecto)
- [ ] Verificación del criterio de éxito de la spec: `reserve('Norte', '1012')` falla con «Franja no válida: usa HH-HH, p. ej. 10-12»
- [ ] Spec satisfecha: el único requisito (`ADDED — La franja se valida al reservar`) tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- `ADDED — La franja se valida al reservar` (GIVEN franja que no casa con `HH-HH` / WHEN se reserva / THEN falla con el mensaje exacto) → Task 1. ✓
- Franja válida (`10-12`) sigue reservando igual → cubierto por el test existente en `tests/slots.test.js`, sin tocarlo. ✓
