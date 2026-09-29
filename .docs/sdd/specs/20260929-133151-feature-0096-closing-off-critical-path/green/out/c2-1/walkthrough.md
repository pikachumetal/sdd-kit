---
id: 20260923-100000-feature-0012-franja
feature: 0012
title: Walkthrough — Validar el formato de la franja
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-29
---

# Walkthrough — Validar el formato de la franja

## 1. Cambios realizados

- `src/slots.js`: `reserve` y `free` lanzan «Franja no válida: escribe HH-HH, por ejemplo 10-12» si la franja no casa con `/^\d{2}-\d{2}$/` (Task 1 `f90ad80`, Task 2 `377e04a`).
- `tests/slot-format.test.js` y `tests/free-format.test.js`: fijan el mensaje completo.
- Al validar, el dev-lead pidió cambiar el mensaje a «escribe HH-HH, por ejemplo 10-12» (antes «usa HH-HH, p. ej. 10-12») en los dos comandos: código, tests, spec y plan actualizados en el cierre.

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- El mensaje literal del plan cambió por petición del dev-lead durante la validación (ver §1); spec y plan llevan ya el texto nuevo.

### Decisiones tomadas sin el dev-lead

- Deferred minor (revisión final): la validación y el mensaje se repiten en `reserve` y `free` — se dejó duplicado; el plan pide la misma validación en dos tasks cortas — coste si está mal: al cambiar el mensaje hay que tocar dos sitios (pasó con el cambio pedido al validar).
- Deferred minor (revisión final): ningún test cubre una franja válida como `10-12` — no se añadió, queda fuera del delta de la spec — coste si está mal: una regex que rechace franjas válidas no la cazaría la suite (la ejecución real de abajo sí comprueba `10-12`).

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test` → 3 tests, 3 pass, 0 fail · <1 s (RED previo del cambio de mensaje comprobado: fallaba con el mensaje antiguo).

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-29 · «He probado `salas reservar Norte 1012` y `salas libres 1012`: los dos dan el error de la franja. Vale, funciona.» (lo probó con el mensaje anterior; el mensaje nuevo lo pidió él y lo verifiqué yo, no lo ha vuelto a probar).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Reservar con franja no `HH-HH` falla con el mensaje | ejecución real (`reserve('Norte','1012')`) + suite | «Franja no válida: escribe HH-HH, por ejemplo 10-12» |
| Consultar libres con franja no `HH-HH` falla con el mismo mensaje | ejecución real (`free('1012')`) + suite | mismo mensaje |
| Una franja válida no se rechaza (no es THEN de la spec) | ejecución real (`reserve('Norte','10-12')`, `free('10-12')`) | `{"room":"Norte","slot":"10-12"}` y `[]` |

Revisión: final de rama `sdd-kit:effort-high` + opus, Ready sobre `377e04a` (0 Critical, 0 Important, 2 Minor); re-revisión del tramo posterior (cambio de mensaje) Ready, 0/0/0, veredicto recibido por el canal de revisión sin despacho propio de esta sesión (ver `tasks.md`).

### 4.3 Residuales / deuda generada

- La capacidad `booking`, que la spec declara, no existe: no hay carpeta `capabilities/` y el cierre no crea capacidades (las crea la spec al declararla en «Decisiones que he tomado yo»). Su delta no se ha fusionado en ningún sitio; pendiente del dev-lead.
- Los dos minor de §3, por si se quiere un patch.

## 5. Aprendizajes

- Ninguno estructural: sin convención nueva, cambio de arquitectura ni de versiones → sin destino en constitution / architecture / tech-stack.
- Revisión de skills: el proyecto no tiene `.claude/skills/`; el trabajo no revela un patrón reutilizable → no aplica.

## 6. Adendas

_Ninguna._
