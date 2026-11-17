---
id: 20260923-100000-task-0012-franja
feature: 0012
title: Walkthrough — Validar el formato de la franja
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-27
---

# Walkthrough — Validar el formato de la franja

## 1. Cambios realizados

- Backend (`src/slots.js`): `reserve(room, slot)` y `free(slot)` lanzan «Franja no válida: usa HH-HH, p. ej. 10-12» cuando la franja no casa con `/^\d{2}-\d{2}$/`. La validación vive en `assertSlot()`, compartida por las dos funciones (bd0205f, b31233c, 9796f08).
- Tests: `tests/slot-format.test.js` (reserve), `tests/free-format.test.js` (free) — franja inválida en cada vía (bd0205f, b31233c).

## 3. Desviaciones del plan

- _Ninguna_ — plan ejecutado tal cual: dos tasks Native sobre el mismo fichero.

### Decisiones tomadas sin el dev-lead

- Diferir tras la revisión final el minor «la validación y el mensaje se repiten en reserve y free» en vez de arreglarlo antes del commit de cierre — por qué: refactor de bajo riesgo, sin cambio de comportamiento observable — coste si está mal: ninguno; ya resuelto en 9796f08 antes de presentar la validación.
- Diferir el minor «ningún test cubre una franja válida como 10-12» — por qué: el delta de la spec solo pide el THEN de franja inválida; el caso feliz de `reserve` ya estaba cubierto por un test previo (`tests/slots.test.js`) y el de `free` no bloquea el comportamiento pedido — coste si está mal: `free` queda sin cobertura de su caso feliz; pasa a deuda técnica (ver 4.3).
- Re-revisar en el hilo, en vez de despachar un subagente, el tramo `b31233c..9796f08` (el commit de refactor quedó fuera de la revisión final) — por qué: el despacho de subagentes no está disponible en esta sesión («Despacho no disponible en esta campaña»); el commit no entra en la excepción de commits pequeños de `.docs/` (toca `src/slots.js`) — coste si está mal: un extract-method de 8 líneas sin revisión independiente; mitigado con el diff leído a mano y `node --test` en verde (3/3). Veredicto: Ready (0 Critical, 0 Important, 0 Minor).

## 4. Verificación

### 4.1 Builds

- `node --test tests/` → pass 3, fail 0 (181ms).

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-27 · probó `salas reservar Norte 1012` y `salas libres 1012`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| La franja se valida al reservar | ejecución real (dev-lead: `salas reservar Norte 1012`) | Falla con «Franja no válida: usa HH-HH, p. ej. 10-12» |
| La franja se valida al consultar libres | ejecución real (dev-lead: `salas libres 1012`) | Falla con el mismo mensaje |

### 4.3 Residuales / deuda generada

- `free` no tiene test de franja válida (p. ej. `10-12`) — deferred minor de la revisión final, no resuelto por 9796f08 → fila de deuda técnica en el roadmap.
- La spec de esta feature no declara el bloque «## Capacidades» (convención posterior a esta spec, sin uso previo en el proyecto): `sdd-end-feature` no crea `capabilities/booking.md` por su cuenta (regla 2 de `capability-template.md`, y «nunca una capacidad que la spec no declare») → fila de deuda técnica en el roadmap, a resolver por la próxima spec que toque `booking` o por un retrofit explícito del dev-lead.

## 5. Aprendizajes

- _Ninguno estructural._ Revisión de skills: `.claude/skills/` no existe en el proyecto — mirado, no por omisión —; esta feature (validación de formato + refactor menor) no reveló un patrón reutilizable que justifique crear la primera → no aplica.

## 6. Adendas

- _Ninguna._
