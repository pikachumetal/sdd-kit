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

1. Formato válido: dos dígitos, guion, dos dígitos (`^\d{2}-\d{2}$`) — es la única lectura de "HH-HH" compatible con el ejemplo de la spec (`10-12` válido, `1012` inválido); la spec no pide validar que las horas sean un rango real (`00-23`), así que no lo añado.
2. Una sola task — el cambio es una guarda de formato sobre una función existente, sin dependencias entre piezas.
3. Modelo y effort: `sdd-kit:effort-low` + `sonnet` — el regex y el mensaje de error ya vienen fijados letra a letra por la spec y por este plan; es un arreglo mecánico, no interpretación de prosa.
4. Ejecución: Native — una sola task no deja nada que una revisión intermedia por subagente aproveche; el coste de un subagente completo (implementador + revisor) no se justifica.
5. Riesgo: bajo. Coste estimado: < 0,5 h.

**Goal**: Que `reserve` rechace cualquier franja que no tenga la forma `HH-HH` con un mensaje de error claro.

**Architecture**: Guarda de validación al principio de `reserve()` en `src/slots.js`: si `slot` no matchea `/^\d{2}-\d{2}$/`, lanza `Error` con el texto exacto de la spec; si matchea, sigue el comportamiento actual sin cambios.

**Tech Stack**: Node.js, ESM (`export function`), tests con `node --test` (Art. II de la constitution).

**Spec**: `./spec.md`

**Ejecución**: native, porque es una sola task sin interfaces que compartir con otra, y el coste de un ciclo completo de subagente (implementador + revisor) no se justifica frente al de una guarda de una línea. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y la task no tiene su línea `complete` en el ledger, no la hagas tú: despáchala con `subagent-driven-development` sobre el mismo ledger.

## Restricciones globales

### De código

- Mensaje de error exacto y literal: `Franja no válida: usa HH-HH, p. ej. 10-12` (spec, único THEN).
- Formato válido de franja: dos dígitos, guion, dos dígitos (`HH-HH`); cualquier otra cadena es inválida. La spec no exige validar que las horas formen un rango real.
- La constitution del proyecto no tiene artículo de calidad de código; se aplican igual las dos reglas base: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task), clean code sin abstracciones para un único caso de uso.

### De proceso

- Perfil de control: `delegate` (`.docs/sdd/sdd-kit.json`) — sin gate en el plan; se comprueba escenario → task (ver Self-review) y se sigue sin parar.
- `execution`: `auto` (default del proyecto, sin fijar) — método recomendado por el handoff de `writing-plans`, ver arriba.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, nunca title-only (Art. I).
- Modelo por defecto: gama media (Sonnet, effort medium) salvo arreglo mecánico o prosa ya resuelta por el plan, como esta task (effort low).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sí — una guarda con una expresión regular, sin capas nuevas.
- [x] **YAGNI gate**: no se abstrae nada; un único punto de validación con un único uso real.
- [x] **Brownfield gate**: retrocompatible (`reserve('Norte', '10-12')` sigue devolviendo `{ room: 'Norte', slot: '10-12' }`); respeta el patrón del módulo (función exportada en ESM, sin clases ni capas nuevas); sin refactor fuera de scope.
- [x] **Constitution check**: Art. I (commits) y Art. II (`node --test`, todo verde) respetados por el plan.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/slots.js` — añade la guarda de formato al principio de `reserve()`.
- `tests/slots.test.js` — añade los tests que fijan el rechazo del formato inválido.

**NO se tocan**:

- Cualquier capa de CLI (`salas reservar …`) — el README la describe pero no existe todavía en el repo; la spec valida `reserve()`, no una interfaz de línea de comandos que aún no está implementada.

### 1.2 Modelo de datos — N/A (sin schema, sin persistencia).

### 1.3 Migraciones — N/A.

### 1.4 Contratos API — N/A (no hay capa HTTP).

### 1.5 UX — N/A (no hay interfaz de usuario en este repo).

### 1.6 Dependencias

Ninguna: usa `node:test` y `node:assert`, ya presentes en `tests/slots.test.js`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Confundir "formato inválido" con "rango de horas inválido" y validar de más (p. ej. rechazar `25-30`) | Baja | Bajo (comportamiento extra no pedido por la spec) | El regex solo comprueba dígitos y guion; el test de franja válida (`10-12`) y el nuevo test de formato inválido fijan el límite exacto. |

### 1.8 Rollout

Directo: cambio de librería sin toggle ni despliegue especial.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Validar el formato de la franja en `reserve()`

**Modelo**: Native — la sesión implementa directamente. Si se despachara como subagente: `subagent_type: sdd-kit:effort-low` + `model: sonnet` (task mecánica: regex y mensaje ya fijados por este plan).
**Tests RED**: `tests/slots.test.js` — dos tests nuevos, escritos antes de tocar `src/slots.js`.

**Superficies**: backend (librería `src/slots.js`).
**Verificación**: `node --test`. Esperado: todo verde (test existente de franja válida + los dos nuevos).
**Se prueba en la aplicación**: no, porque no existe todavía una capa de CLI o UI en el repo que ejecute `reserve()`; se prueba con la suite (`node --test`), que es la única interfaz actual de la función.

**Interfaces**:
- Consume: nada.
- Produce: `reserve(room: string, slot: string): { room: string, slot: string }` — sin cambio de firma; ahora lanza `Error` con `message: 'Franja no válida: usa HH-HH, p. ej. 10-12'` cuando `slot` no matchea `/^\d{2}-\d{2}$/`.

**Ficheros**: modificar `src/slots.js`, `tests/slots.test.js`.

- [ ] **Step 1: Escribir los tests en rojo**

```js
test('rechaza una franja con el formato del ejemplo de la spec', () => {
  assert.throws(
    () => reserve('Norte', '1012'),
    { message: 'Franja no válida: usa HH-HH, p. ej. 10-12' }
  );
});

test('rechaza cualquier franja que no tenga la forma HH-HH', () => {
  for (const slot of ['', '9-12', '10-1', '10:12', '100-120']) {
    assert.throws(
      () => reserve('Norte', slot),
      { message: 'Franja no válida: usa HH-HH, p. ej. 10-12' }
    );
  }
});
```

- [ ] **Step 2: Ejecutar y comprobar que fallan**

Run: `node --test`
Expected: FAIL — `reserve('Norte', '1012')` no lanza (código actual siempre devuelve el objeto).

- [ ] **Step 3: Implementar la guarda en `reserve(room, slot)` (`src/slots.js`)**

Añadir, antes del `return` existente, una comprobación con `/^\d{2}-\d{2}$/`: si `slot` no matchea, `throw new Error('Franja no válida: usa HH-HH, p. ej. 10-12')`.

- [ ] **Step 4: Ejecutar y comprobar que pasan**

Run: `node --test`
Expected: PASS — los 3 tests (el existente de franja válida y los 2 nuevos).

- [ ] **Step 5: Commit de la task**

```bash
git add src/slots.js tests/slots.test.js
git commit -m "fix(slots): validar el formato de la franja al reservar

Rechaza cualquier franja que no tenga la forma HH-HH con un mensaje
de error claro, en vez de aceptar valores sin sentido como 1012.

Feature 0012."
```

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test` (suite completa del proyecto).
- [ ] Verificación de los criterios de éxito de la spec: `reserve('Norte', '1012')` lanza `Error` con el mensaje exacto; `reserve('Norte', '10-12')` sigue funcionando.
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review).
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`).

---

## 4. Self-review (cobertura spec → tasks)

- ADDED — La franja se valida al reservar (GIVEN franja que no casa con `HH-HH` / WHEN se reserva / THEN falla con «Franja no válida: usa HH-HH, p. ej. 10-12») → Task 1. ✓
- Comportamiento existente (`reserve('Norte', '10-12')` sigue devolviendo `{ room, slot }`) → N/A, sin cambios (confirmado por el test ya existente en `tests/slots.test.js`, que la Task 1 no modifica). ✓
