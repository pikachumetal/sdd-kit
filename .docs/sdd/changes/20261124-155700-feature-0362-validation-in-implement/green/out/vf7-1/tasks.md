---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | cf4aa70 | |
| 2 | Listado de canceladas | done | 461a9d1 | |
| 3 | Revisión final: canceladas vacía sin línea en blanco | done | 04de48e | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, 1 Important: `canceladas` con la lista vacía imprime una línea en blanco, sobre 42f88f5

## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
- Task 3: Ruling: la spec calla sobre la lista vacía — no imprimir nada, sin texto nuevo de interfaz — si es errónea, el dev-lead pedirá un mensaje tipo «sin canceladas»
- Task 3: Ruling: el test usa un proceso nuevo (spawnSync) para tener estado vacío sin depender del orden de los otros tests
