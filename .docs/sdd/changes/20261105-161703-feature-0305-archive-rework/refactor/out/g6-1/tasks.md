---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 2584d99 | |
| 2 | Listado de canceladas | done | 362d4f4 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 362d4f4

Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 2 Important de registro en este fichero (commit de la Task 1; Ruling sin aplicar) corregidos en el cierre

## Rulings

- Task 2: Ruling retirado en el cierre. Decía `node --test --test-concurrency=1` en el gate para esquivar una carrera sobre el almacén compartido, pero nunca se aplicó (`gate.json` sigue sin ella) y la causa no era una carrera: `node --test` corre cada fichero en su proceso y los tests de `cancel.test.js` van en serie; lo que hay es un acoplamiento por orden, `canceladas` depende del estado que deja el test de cancelar. Queda como deuda en el roadmap.
