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
| 1 | Cancelar con motivo | done | (commit de la task 1) | afectada por enmienda 2026-11-12 → Task 3 |
| 2 | Listado de canceladas | done | 97f5245, 2978a13 | el segundo commit arregla un salto de línea mal escrito del primero |
| 3 | Enmienda 2026-11-12: cancelar con `--por` (Tras Task 1) | done | 15a41a1 | Ruling: se ejecuta antes de la Task 2 |

Revisión final: Spec opus+high, lista para merge, 0 críticos, 0 importantes · Código sonnet+high, con arreglos, 1 importante arreglado · Arquitectura no (plan), sobre c085dce
Pasada de fix: f9f2427, 1 hallazgo (sin RED natural, comprobado por mutación)

Re-revisión: c085dce..f9f2427, sdd-kit:effort-high + opus, aprobada

## Rulings

Task 3: Ruling: la enmienda aprobada 2026-11-12 va en la Task 3 y se ejecuta antes que la Task 2 — el listado necesita guardar quién cancela — si va mal, la Task 2 espera
Task 3: Ruling: `--por` obligatorio, se comprueba tras el motivo, error «falta quién cancela: usa --por <nombre>» — el dev-lead aprobó `--por` pero no si era obligatorio ni el texto — si no lo quiere obligatorio, se cambia una línea y un test
Task 3: Ruling: el test positivo con --por es el de la Task 1 actualizado, no uno nuevo — el estado en memoria se comparte y solo hay una reserva — si se quiere uno aparte, hay que reiniciar el estado
Task 2: Ruling: el test de canceladas usa la reserva que cancela el primer test del fichero — solo hay una reserva y el estado es en memoria — si se reordenan los tests, falla
Final: minor (deferred): optionOf toma otra opción como valor (--por --motivo otro deja by = «--motivo»)
Final: minor (deferred): canceladas sin canceladas imprime una línea vacía
Final: minor (deferred): cancelBooking con cuatro parámetros posicionales; posible objeto de opciones
Final: minor (deferred): línea larga del comando cancelar en run
Final: minor (deferred): el test de --por no demuestra que el rechazo deja la reserva activa
Final: Ruling: persistencia entre procesos (la app guarda en memoria, node src/app.js cancelar y luego canceladas en otro proceso no ve nada) — ya pasaba antes y la spec no pide persistencia; se avisa al dev-lead — si la 0012 espera datos entre ejecuciones, hará falta
Final: Ruling: mayúsculas en el motivo («Sala ocupada» se rechaza) — la lista es cerrada y la comparación exacta es lo esperable — un usuario que escriba en mayúsculas recibe el error con la lista
Final: Ruling: listado vacío, reserva ya cancelada y canceladas anteriores sin by — la enmienda aprobada los deja fuera de alcance — alguien verá una línea vacía o un undefined si aparece uno
Final: Ruling: anulaciones de 0011 y regla de 24 h — fuera de la spec — ninguno por ahora
Final: Ruling: commit 97f5245 con SyntaxError arreglado en 2978a13 — higiene de commits, el estado final es correcto — un bisect cae en un commit roto
Final: Ruling: fila de la 0010 del ROADMAP en ⏳ — la actualiza sdd-archive — ninguno
