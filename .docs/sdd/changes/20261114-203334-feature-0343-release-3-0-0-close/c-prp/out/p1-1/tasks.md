---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-11-15
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

Revisión final: Spec opus+high, With fixes (0 Critical, 0 Important, 1 Minor) · Código sonnet+high, Yes (0 Critical, 0 Important, 5 Minor) · Arquitectura no (plan), sobre f47ebcc

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | f038a98 | |
| 2 | Listado de canceladas | done | f47ebcc | |

## Verificación por task

- [x] Task 1 — `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`
- [x] Task 2 — `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

Final: minor (deferred): test/cancel.test.js cambió de CRLF a LF y src/app.js sigue en CRLF (fin de línea mezclado)
Final: minor (deferred): literales 'cancelled' y 'active' repetidos; una constante STATUS cuando la 0011 toque los estados
Final: minor (deferred): `reason` solo existe en la reserva cancelada (forma del objeto variable)
Final: minor (deferred): sin test de `cancelar Norte lun --motivo` sin valor
Final: minor (deferred): los tests dependen del estado compartido del módulo y de su orden (decisión 6 del plan)
Final: minor (deferred): sin test de que `canceladas` excluya las anuladas ni de varias líneas unidas por \n (decisión 5 del plan)
Final: Ruling: motivo sin comillas en el shell (`--motivo sala ocupada`) se rechaza — la spec fija la forma entrecomillada y el error lista los motivos válidos — coste si falla: una persona reintenta con comillas
Final: Ruling: motivo con otra capitalización («Sala ocupada») se rechaza — la lista es cerrada y exacta por decisión del dev-lead — coste si falla: una persona reintenta en minúsculas
Final: Ruling: argumentos en otro orden (`cancelar --motivo otro Norte lun`) responde «sin reserva --motivo otro» — la spec fija la sintaxis `cancelar <sala> <día> --motivo <motivo>` — coste si falla: mensaje poco claro, sin efecto sobre datos
Final: Ruling: reservas canceladas antes de la 0010 sin `reason` — no pueden existir: el almacén es en memoria — coste si falla: «undefined» en el listado
Final: Ruling: fin de línea de test/cancel.test.js, comentarios y tasks.md fuera del Código: formato/proceso, no comportamiento — coste si falla: diff ruidoso en blame
