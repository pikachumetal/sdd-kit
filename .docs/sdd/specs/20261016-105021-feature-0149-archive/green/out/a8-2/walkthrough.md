---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-16
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada: `src/app.js` (`977e219`).
- Comando `canceladas`: lista «sala día — motivo»: `src/app.js` y `test/cancel.test.js` (`a963cec`).
- El motivo se recorta (`reasonOf`, `?.trim()`): un motivo con espacios alrededor se acepta. Ese fix de validación, hecho tras la revisión final, no tenía test; el cierre añadió los dos de `test/cancel.test.js` (uno con espacios alrededor, otro de solo espacios) y la enmienda a la spec.
- El fix de validación pasó además todo `src/app.js` de CRLF a LF; no se ha revertido (ver 4.3).

## 3. Desviaciones del plan

- _Ninguna_ en las dos tasks. El fix de validación posterior a la revisión final y su test están en 1.

### Decisiones tomadas sin el dev-lead

- Correr la suite con `node --test --test-concurrency=1` — los tests comparten el almacén en memoria y dependen del orden — coste si está mal: la suite tarda el doble.
- Enmendar la spec aprobada con el requisito «El motivo se recorta» (`## Enmiendas` y delta de `bookings`) — el código ya recortaba y la capacidad tenía que decirlo — coste si está mal: si el dev-lead prefiere rechazar los motivos con espacios, se quita el `trim()` y el requisito.
- Dejar la conversión CRLF→LF de `src/app.js` como está y llevarla a la deuda, en vez de reescribir el commit del fix — coste si está mal: `git blame` de todo el fichero apunta al fix.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test --test-concurrency=1` → 7/7 · 0,18 s · sobre el código final de la rama (el commit de cierre solo añade `.docs/`).
- Test nuevo en RED sin el `trim()`: 6/7, falla `el motivo con espacios alrededor se acepta recortado`; en GREEN con él: 7/7.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-16 · verificado por el agente — suite 7/7, smoke 5/5 con ejecución real (`node src/app.js` y `run` en un mismo proceso para el listado), revisión final Spec y Código limpia sobre `a963cec`, re-revisión del tramo posterior con un Important arreglado. Nada lo ha probado el dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | verificado por el agente |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real (`--motivo "me aburro"`) | verificado por el agente |
| sin `--motivo` responde lo mismo | ejecución real | verificado por el agente |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (mismo proceso) | verificado por el agente |
| el motivo con espacios alrededor se acepta recortado; el de solo espacios se rechaza | suite + ejecución real | verificado por el agente |

### 4.3 Residuales / deuda generada

- Los tests comparten el almacén en memoria y dependen del orden (`canceladas enseña…` solo pasa tras el test de cancelación) → fila en la deuda del roadmap.
- `src/app.js` quedó en LF mientras `test/*.js`, `package.json` y los `.docs` siguen en CRLF, sin `.gitattributes` → fila en la deuda.
- `cancelBooking` exportada no recorta el motivo; solo la ruta de la línea de comandos → fila en la deuda.
- La spec dice que no hay revisión de spec «por dos señales (MODIFIED, datos)» pero su delta no tiene ningún `MODIFIED`; no cambia nada del resultado.

## 5. Aprendizajes

- El comportamiento nuevo es la capacidad `bookings` (cancelar con motivo, listado, recorte) → `capabilities/bookings.md`, creada con `sdd capability merge`.
- Revisión de skills: no aplica; miré y el proyecto no tiene `.claude/skills/`, y el trabajo no revela un patrón reutilizable.
- ADR: la spec no declaraba ninguna candidata; `sdd decision check` sin decisiones.
- Ninguno para `constitution.md`, `architecture.md` (no existe) ni `tech-stack.md`.

## 6. Adendas

- _Ninguna_
