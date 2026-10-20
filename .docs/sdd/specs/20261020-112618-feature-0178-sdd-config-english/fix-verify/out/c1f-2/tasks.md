---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 3a06a5a | |
| 2 | Listado de canceladas | done | 6a433ca | |


Revisión final: Spec opus+high, listo para fusionar (1 Minor) · Código sonnet+high, con arreglos (1 Important) · Arquitectura no (plan), sobre 6a433ca
Pasada de fix: 6d86e99, 2 hallazgos RED→GREEN
Re-revisión: 6a433ca..6d86e99, sdd-kit:effort-high + opus, todo atendido, sin Critical/Important nuevos

## Rulings
Final: Ruling: el commit del fix 6d86e99 pasó app.js y cancel.test.js de CRLF a LF (Minor de la re-revisión) — no hay segunda pasada de fix; el contenido es el correcto y git normaliza con autocrlf — si me equivoco, un diff ruidoso en blame
Final: Ruling: Task 1 apunta a 6a433ca en tasks.md (Minor de la re-revisión) — la Task 1 es 3a06a5a; se corrige en tasks.md porque es documentación — coste si me equivoco: ninguno
Final: Ruling: el AND «sin --motivo» no tiene test (observación de la re-revisión, preexistente) — el comportamiento es correcto y se comprobó; no se añade test tras la re-revisión única — coste si me equivoco: una regresión sin red
Final: Ruling: test de recorte indirecto (solo prueba que la validación pasa, «sin reserva Sur mar») — detecta el fallo, queda así — coste si me equivoco: no vigila que el motivo se guarde recortado
