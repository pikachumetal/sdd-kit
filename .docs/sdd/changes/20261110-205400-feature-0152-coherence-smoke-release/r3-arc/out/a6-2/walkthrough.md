---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-11
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (`src/app.js`, `test/cancel.test.js`): `cancelar <sala> <día> --motivo <motivo>` acepta solo «cambio de planes», «sala ocupada» u «otro»; un motivo fuera de la lista o sin `--motivo` responde «motivo no válido: …». El motivo se guarda en la propia reserva. Task 1, commit fc06854.
- **Listado de canceladas** (`src/app.js`, `test/cancel.test.js`): `canceladas` lista «<sala> <día> — <motivo>» de las reservas canceladas. Task 2, commit 7c3b821.
- **Docs**: `capabilities/bookings.md` creada con el delta de la spec; ADR 0003 (el motivo vive en la reserva); a la ADR 0002 se le añadió la sección «Confirmación» que `sdd decision check` exigía.

## 3. Desviaciones del plan

- _Ninguna_ en spec ni plan. La spec recibió después de aprobarse la sección «Términos y ADR» (sin cambiar ningún requisito, THEN ni alcance).

### Decisiones tomadas sin el dev-lead

- Task 2: el ruling del gate con `node --test --test-concurrency=1` (carrera sobre el almacén en memoria) lo retiré al cerrar, tras señalarlo la re-revisión: el flag no se aplicó en ningún sitio, la suite pasa 5/5 sin él en 5 pasadas y cada fichero corre en su proceso — coste si me equivoco: ninguno, el gate sigue siendo el de la constitución.
- Spec: sin review de spec (dos señales: MODIFIED, datos) — decisión 3 de «Decisiones que he tomado yo».
- Al cerrar, añadí «### Confirmación» a la ADR 0002, que no era de esta feature, para que `sdd decision check` diera exit 0.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, exit 0, 0,18 s, repetido 5 veces sin fallo, sobre el commit de cierre.
- Gate: `node --test` → suite: corrió 5/5 · 0,18 s · configuración: la del gate, sin añadidos · sobre el commit de cierre
- `sdd decision check` → «Decisiones válidas»; `sdd capability check` → «Capacidades válidas: 1».
- Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia, sobre 7c3b821. Re-revisión del rango posterior (tasks.md, ADR y sección de la spec; solo docs): 1 Important (el ruling del gate, infundado: retirado) y 3 Minor (commit de la Task 1 mal anotado: corregido; ADR 0002 sin «Confirmación»: corregida; frontmatter de tasks.md fuera de plantilla: no se toca). Las correcciones son de docs, menos de 20 líneas, revisadas en el hilo.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpia sobre 7c3b821, re-revisión con 1 Important y 3 Minor, resueltos o ledgeados arriba. Todo verificado por el agente; el dev-lead no ha probado nada.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | ok |
| Un motivo fuera de la lista («me aburro») responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| Sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` tras cancelar responde «Norte lun — sala ocupada» | ejecución real, en un solo proceso (el almacén vive en memoria) | ok |

### 4.3 Residuales / deuda generada

- El test `canceladas enseña sala, día y motivo` solo pasa si el test anterior ya canceló Norte lun (dependencia de orden dentro de `test/cancel.test.js`): fila en «Por triar» de `debt.md`.
- El THEN «sin `--motivo` responde lo mismo» no tiene test propio (solo ejecución real): mismo destino, deuda.
- La fila 0014 del roadmap («el motivo se guarda en el almacén de reservas») ya queda cubierta por esta feature: la decide el dev-lead.

## 5. Aprendizajes

- El motivo de una cancelación vive en la propia reserva → `decisions/0003-cancel-reason-on-booking.md`.
- ADR: El motivo de una cancelación se guarda en la propia reserva → decisions/0003-cancel-reason-on-booking.md
- Comportamiento observable nuevo (cancelar con motivo, listado de canceladas) → `capabilities/bookings.md`, creada con `sdd capability merge`.
- No existe `operations.md` y no hay workaround que registrar: el ruling del gate se retiró.

Retro: sin señales

## 6. Adendas

- _(ninguna)_
