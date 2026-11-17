---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | fc06854 | |
| 2 | Listado de canceladas | done | 7c3b821 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 7c3b821
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 1 Important (ruling infundado, corregido en el cierre) y 3 Minor

## Rulings

- Task 2: Ruling retirado en el cierre: `--test-concurrency=1` no se aplicó en ningún script ni config, el gate es `node --test` (plan y constitución §2), y la suite pasa 5/5 sin el flag en 5 pasadas seguidas; `node --test` ejecuta cada fichero en su propio proceso, así que no hay almacén compartido entre ficheros. El acoplamiento real es el orden de los tests dentro de `test/cancel.test.js` (deuda en «Por triar»).
