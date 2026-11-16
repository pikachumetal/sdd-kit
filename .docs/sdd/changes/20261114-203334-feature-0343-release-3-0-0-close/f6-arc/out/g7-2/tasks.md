---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | e51d50d | |
| 2 | Listado de canceladas | done | 557e155 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 557e155
Re-revisión: de lo posterior a 557e155, juntada en el cierre, sdd-kit:effort-high + opus, limpia (3 menores)

## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
- Cierre: script `cancelar` en `package.json`, fuera del plan — añadido de conveniencia, sin efecto en gate ni suite — coste si es erróneo: quitar una línea
