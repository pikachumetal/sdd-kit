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
| 1 | Cancelar con motivo | done | 1b3ab37 | |
| 2 | Listado de canceladas | done | f095332 | Enmienda 2026-11-12 (aprobada): sin «quién canceló», spec en 1bcd12d |

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura no (plan), sobre 0105b2d
Pasada de fix: 8b367f7, 3 hallazgos (tests nuevos verificados por mutación del código; la producción no cambió)
Re-revisión: 0105b2d..b829de6, sdd-kit:effort-high + opus, todos los hallazgos resueltos, sin roturas nuevas

## Rulings

Final: Ruling: Eje Arquitectura no — el plan no trae línea y el diff no cruza ninguna señal — si hubiera un contrato que no vi, no lo revisaría un eje fresco
Task 2: Ruling: la enmienda del 2026-11-12 (sin «quién canceló») va aprobada por el dev-lead en la sesión; su hueco de THEN lista vacía no se añade — coste si es incorrecto: `canceladas` sin canceladas devuelve cadena vacía
Final: Ruling: canceladas sin canceladas devuelve cadena vacía (Spec Menor→Importante por efecto) — arreglarlo añade una salida nueva y un THEN que la spec no tiene: es una desviación, no la decido yo; va a ✋ — coste si es incorrecto: el usuario ve una línea en blanco sin saber si no hay canceladas
Final: minor (deferred): test de cancelar con motivo inválido no comprueba que no se cancele nada ni que el motivo se valide antes de buscar la reserva
Final: minor (deferred): cancelar acepta --motivo solo tras sala y día; con otro orden toma --motivo como sala
Final: minor (deferred): separador « — » del listado difícil de parsear para scripts (fijado por la spec)
Final: minor (deferred): cadenas 'active', 'cancelled', 'voided' repetidas; ya estaba antes
Final: minor (deferred): ledger sin línea de la Task 1, que se hizo antes de abrir el workspace
Final: Ruling: no se mira si el listado debe enseñar quién canceló ni si --motivo es obligatorio (Código lo dejó al eje Spec) — lo cubre la enmienda aprobada y la spec — coste si es incorrecto: ninguno nuevo
Final: Ruling: estado en memoria, bookings mutable y efecto de process.argv al importar (Código, arquitectura previa) — es anterior a la feature y la spec no pide persistencia — coste si es incorrecto: con procesos separados, canceladas siempre sale vacío; hay que decidir persistencia aparte
Final: Ruling: el patrón de if encadenados y errores como cadenas (Código, anterior) — no lo introduce esta rama — coste si es incorrecto: deuda previa sin tocar
Final: Ruling: reservas canceladas antes de la feature sin motivo, anular sin motivo (Spec) — no puede ocurrir sin persistencia, y la anulación es la 0011 — coste si es incorrecto: ninguno hoy

## Pendiente del dev-lead

- `canceladas` sin canceladas devuelve una línea en blanco; arreglarlo añade una salida y un THEN nuevos (desviación, sin aprobar).
