---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-11-06
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

Revisión final: Spec opus+high, con fixes (2 Important: 1 a ✋, 1 corregido en el plan) · Código sonnet+high, limpia (7 Minor aplazados) · Arquitectura no (plan), sobre 5d247e9
Pasada de fix: línea «Se prueba en la aplicación» de la Task 2 del plan, solo documentación, revisado en el hilo, 0 hallazgos RED→GREEN

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | — | |
| 2 | Listado de canceladas | done | — | |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js` → `ℹ fail 0`
- [x] Task 2 — `node --test test/cancel.test.js` → `ℹ fail 0`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

Final: Ruling: Spec Important 1 (fila 2 del Anexo, «la reserva de otra persona no se toca», no vive en ningún sitio) — el código no modela dueños de reserva; cambiarlo es cambiar la spec, lo decide el dev-lead; el código queda como está y va a ✋ — si es erróneo: el Anexo afirma una regla que no se cumple hasta que haya dueños
Final: Ruling: Spec Important 2 (canceladas no se ve desde la terminal, estado en memoria) — es limitación previa del molde (operations.md: sin base de datos); se corrige la línea «Se prueba en la aplicación» de la Task 2 del plan, sin tocar código — si es erróneo: el Intent solo se cumple dentro de un proceso hasta que haya persistencia
Final: minor (deferred): decisión 3 del plan (motivo se valida antes que la reserva) sin test: cancelar Sur mar --motivo xyz
Final: minor (deferred): decisión 7 del plan (varias canceladas, una línea por reserva) sin test
Final: minor (deferred): Canceladas_ignora_anuladas no comprueba que anular devolvió «anulada Norte lun»
Final: minor (deferred): test/cancel.test.js pasó de CRLF a LF (diff ruidoso, finales mezclados con src/app.js)
Final: minor (deferred): fresh('<n>') con sufijo manual, sin protección ante repetidos
Final: minor (deferred): cancelar una reserva activa y Cancelar_pide_motivo_de_la_lista casi duplicados
Final: minor (deferred): estilos de nombre de test mezclados (frases y Snake_case)
Final: minor (deferred): literales 'active'/'cancelled' sin nombrar; REASONS/MOTIVOS en dos idiomas
Final: minor (deferred): optionValue lee --otro como valor y los posicionales asumen la bandera al final
