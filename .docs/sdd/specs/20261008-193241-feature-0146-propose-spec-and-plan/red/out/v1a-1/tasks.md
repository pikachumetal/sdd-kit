---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-10-08
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 6dacb06 | |
| 2 | Listado de canceladas | done | 007479b | |

Revisión final: code-reviewer + opus, limpia, sobre 007479b (sha no anotado al volver; reconstruido: último commit de código)
Re-revisión: 007479b..31d34e0, general-purpose + opus (effort: no disponible en este harness, hereda el de la sesión), con hallazgos: 2 Important (rulings que el historial no respalda, retirados abajo), 1 Minor (sha de la revisión final reconstruido)

## Rulings

- Corrección tras la re-revisión: se retiran dos rulings de la Task 2 que el historial contradice (007479b solo toca `src/app.js` y `test/cancel.test.js`; 6dacb06 ya traía los mensajes de error de la Task 1). Ningún commit de la feature toca `test/app.test.js`.
- `test/cancel.test.js`: el test «canceladas» depende del estado que deja el test «cancelar con un motivo de la lista» (suelto, falla). Sin cambiar: los RED son contrato; queda para el dev-lead.
