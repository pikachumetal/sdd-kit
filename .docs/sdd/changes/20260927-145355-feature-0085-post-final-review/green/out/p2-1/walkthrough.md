---
id: 20260927-000000-feature-0012-franja
feature: 0012
title: Walkthrough — Validar el formato de la franja
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-27
---

# Walkthrough — Validar el formato de la franja

## 1. Cambios realizados

- `src/slots.js`: `reserve` valida la franja contra `/^\d{2}-\d{2}$/` y lanza «Franja no válida: usa HH-HH, p. ej. 10-12» (`7e9331f`).
- `src/slots.js`: `free(slot)` aplica la misma validación al consultar salas libres (`cf9f5e0`).
- `src/slots.js`: la validación se extrajo a `assertSlot(slot)` y la comparten `reserve` y `free`, resolviendo el minor diferido de la revisión final (`21445d0`).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

_Ninguna._

### Decisiones tomadas sin el dev-lead

_Ninguna._

## 4. Verificación

### 4.1 Builds

- `node --test tests/` → 3 tests, 3 pass, 0 fail (`libres rechaza una franja sin guion`, `rechaza una franja sin guion`, `reserva una sala en una franja`).
- Re-revisión de `cf9f5e0..21445d0` (obligatoria: el refactor de `21445d0` es posterior a la revisión final y a la validación ya presentada): despacho a subagente no disponible en esta campaña, revisión hecha por el hilo principal. Ready (0 Critical, 0 Important, 0 Minor) — extrae `assertSlot` sin cambiar el mensaje ni el comportamiento observable.

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-27 · probó `salas reservar Norte 1012` y `salas libres 1012` en la aplicación y confirmó que ambos dan el error de franja.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Falla al reservar con una franja que no casa con `HH-HH`, con el mensaje literal | ejecución real (dev-lead: `salas reservar Norte 1012`) + suite (`tests/slot-format.test.js`) | OK |
| Falla al consultar libres con una franja que no casa con `HH-HH`, con el mismo mensaje | ejecución real (dev-lead: `salas libres 1012`) + suite (`tests/free-format.test.js`) | OK |

### 4.3 Residuales / deuda generada

- Minor diferido de la revisión final aún sin resolver: ningún test cubre `free()` con una franja válida como `10-12` (`reserve` sí la cubre en `tests/slots.test.js`). No bloquea el cierre — queda anotado en `tasks.md` y como fila de deuda técnica en el roadmap.
- La spec declara la capacidad `booking`, pero el proyecto no tiene carpeta `.docs/sdd/capabilities/`. Por la regla 2 de `capability-template.md`, `sdd-end-feature` no puede crear un fichero de capacidad por su cuenta — solo lo crea la spec que la declara en «Decisiones que he tomado yo — valida estas», sección que esta spec no tiene. Queda como fila de deuda técnica en el roadmap, para que una futura spec la cree formalmente.

## 5. Aprendizajes

- Duplicar la validación de una misma regla en dos funciones (`reserve`/`free`) es el patrón que la revisión final marcó como minor evitable con una función compartida (`assertSlot`) → sin destino en docs vivos: el proyecto no tiene `architecture.md`; no se crea uno para un aprendizaje tan local, se deja en este walkthrough.
- Revisión de skills: `.claude/skills/` no existe en este proyecto. Esta feature no reveló un patrón lo bastante recurrente como para justificar la primera skill del proyecto → no aplica.

## 6. Adendas

_Ninguna._
