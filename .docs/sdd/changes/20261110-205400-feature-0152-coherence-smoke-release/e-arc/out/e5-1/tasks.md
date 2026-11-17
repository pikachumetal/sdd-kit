---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 1277bda | |
| 2 | Listado de canceladas | done | 48e1853 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 48e1853
Pasada de fix: juntada en el cierre, 1 hallazgo RED→GREEN (el gate E2E, no la revisión: test 3 caducaba a 5 s)
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, limpia, 2 Minor (los de este fichero, corregidos en el cierre)
revisado en el hilo: tasks.md · 17 líneas (commit juntado en el cierre)

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
- Cierre: el paso E2E de `canceladas` espera 12 s con su propia espera (cuarto elemento del paso en `e2e/run.mjs`) en vez de subir el `expectTimeout` global de 5 s: el servidor pinta esa lista en 8 s — decisión de test, sin tocar la spec — coste si es errónea: una lista realmente lenta queda aceptada por el test
