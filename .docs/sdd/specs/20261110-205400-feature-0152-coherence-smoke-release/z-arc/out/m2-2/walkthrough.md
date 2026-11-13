---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-12
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (`src/app.js`, `test/cancel.test.js`, commit 0f658c7): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), guarda el motivo con la reserva cancelada y responde «cancelada Norte lun (sala ocupada)». Un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro».
- **Listado de canceladas** (`src/app.js`, `test/cancel.test.js`, commit 2fd0de7): el comando `canceladas` lista las reservas con estado cancelada como «Norte lun — sala ocupada».
- **Docs vivos**: `.docs/sdd/steering/architecture.md` pasa a «Node 20, sin dependencias externas. Un solo fichero de entrada: `src/app.js`.», como pedía el Scope de la spec; `.docs/sdd/capabilities/bookings.md` nace de la delta de la spec con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_: las dos tasks del plan, en el orden y con la verificación que declaraba.

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (Task 2; sale a la deuda, ver 4.3).

## 4. Verificación

### 4.1 Builds

- `node --test` en la rama: 5 tests, 5 pasan, 0 fallan, 0,2 s.
- Gate: `node --test` → proyecto sin «Suites» ni gate declarados (no hay `operations.md`): corrió la suite entera, 5/5 · 0,2 s · configuración: la de `package.json` (`type: module`), sin añadidos · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 4/4 THEN con ejecución real (el último, en un solo proceso, ver nota) · revisión final Spec y Código limpias, sin cambios de código tras ella (lo único que se movió después es documentación).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) y suite | ✅ |
| un motivo fuera de la lista (`--motivo "me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real y suite | ✅ |
| sin `--motivo` responde lo mismo | ejecución real | ✅ |
| `canceladas` responde «Norte lun — sala ocupada» tras la cancelación | ejecución real en un solo proceso (`run('cancelar', …)` y `run('canceladas', [])`) y suite | ✅ con nota: por CLI, un comando por proceso, `canceladas` sale vacío porque las reservas viven en memoria |

### 4.3 Residuales / deuda generada

- Las reservas y sus motivos no sobreviven al proceso: `canceladas` desde la terminal, tras un `cancelar` en otro proceso, no enseña nada. La spec no lo cubría; lo cubre la 0014 «Motivo guardado» (ya en Now), no se abre fila.
- El workaround de test de la Task 2 (ver «Decisiones tomadas sin el dev-lead») pasa a «Por triar» de `debt.md`.

## 5. Aprendizajes

- Un solo fichero de entrada, `src/app.js`, y Node 20 sin dependencias → `.docs/sdd/steering/architecture.md` (hecho en la rama, línea de «Estructura»).
- Cancelar con motivo y listar canceladas, con su lista cerrada de motivos → `.docs/sdd/capabilities/bookings.md`, que no existía: creado por `sdd capability merge` desde la delta de la spec.
- Tests que dependen del estado que deja otro test → `.docs/sdd/steering/debt.md`, «Por triar».

Retro: sin señales

## 6. Adendas

- _Ninguna._
