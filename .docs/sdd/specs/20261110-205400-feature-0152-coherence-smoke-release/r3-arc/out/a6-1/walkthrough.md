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

- **Cancelar con motivo** (`bf75bc7`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva. Sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (`43e3d5d`): el comando `canceladas` lista «sala día — motivo». `src/app.js`, `test/cancel.test.js`.
- **Capacidad nueva** `bookings` (`.docs/sdd/capabilities/bookings.md`), mezclada con `sdd capability merge`.
- **ADR** `decisions/0003-reason-stored-on-booking.md`. Los ADR 0001 y 0002 ya venían en la rama (decisiones del proyecto).

## 3. Desviaciones del plan

- _Ninguna_ en el código: dos tasks, Native, como decía el plan.
- La sección «Términos y ADR» se añadió al spec después de su aprobación (commit de documentación posterior a la revisión final). No cambia comportamiento ni alcance: solo registra la ADR candidata.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar una carrera sobre el almacén compartido — la medición del cierre la desmiente: `node --test` y la variante con `--test-concurrency=1` dan 5/5, y cada fichero de test corre en su proceso. El gate vigente es el del plan, `node --test`. Lo real es un acoplamiento por orden dentro de `test/cancel.test.js`, que va a la deuda — coste si está mal: ninguno medido.
- Cierre: escribí el ADR 0003 a partir de la ADR candidata del spec, con la alternativa descartada que ella nombra — coste si está mal: reescribir un ADR `accepted` (hay que sustituirlo por otro).
- Cierre: añadí «Confirmación» al ADR 0002 (`node --test`), porque su ausencia frenaba `sdd decision check` — coste si está mal: reescribir esa sección.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5, 0 fallos, 0.11 s. También con `--test-concurrency=1`: 5/5.
- Gate: `node --test` → suite: corrió 5/5 · 0.11 s · configuración: la del plan §3 · sobre el commit de cierre (no hay cambios de código desde `43e3d5d`)

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite 5/5 · smoke con ejecución real de 3 de los 4 THEN por la CLI y el cuarto en proceso (ver nota) · revisión final Spec y Código sobre `43e3d5d` limpia · re-revisión de los dos commits de documentación posteriores con hallazgos (2 Important, 1 Minor), tratados en el cierre

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | «cancelada Norte lun (sala ocupada)» |
| un motivo fuera de la lista («me aburro») responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | igual al literal |
| sin `--motivo` responde lo mismo | ejecución real | igual al literal |
| `canceladas` tras cancelar Norte lun con «sala ocupada» responde «Norte lun — sala ocupada» | ejecución real en un solo proceso (`run('cancelar')` y `run('canceladas')`) | «Norte lun — sala ocupada» |

- Nota del cuarto THEN: la CLI no conserva las reservas entre invocaciones (ADR 0001, almacén en memoria), así que `node src/app.js canceladas` suelto responde vacío; el GIVEN solo se monta en el mismo proceso. Esto es lo previsto por el ADR, no un fallo, pero el usuario no puede verlo por dos comandos de terminal seguidos.
- Hallazgos de la re-revisión: (1) `tasks.md` daba `43e3d5d` a la Task 1: corregido a `bf75bc7`. (2) El Ruling de la Task 2 no cuadraba con el gate ni con la medición: anotado en `tasks.md` y a la deuda. (3) El ADR 0002 no llevaba «Confirmación» como el 0001: Minor que además frena `sdd decision check`; añadí la sección con un texto factual (la suite `node --test`).

### 4.3 Residuales / deuda generada

- Acoplamiento por orden de `test/cancel.test.js` y almacén compartido entre pruebas del fichero: fila en `debt.md` («Por triar»).
- La fila 0014 del roadmap («Motivo guardado») pide guardar el motivo en el almacén de reservas, que la 0010 ya hace (`booking.reason`, ADR 0003). La 0014 puede estar cubierta: lo decide el dev-lead.

## 5. Aprendizajes

- El motivo vive en la propia reserva → `decisions/0003-reason-stored-on-booking.md`.
- La CLI no ve reservas entre invocaciones: es consecuencia ya recogida en `decisions/0001-bookings-in-memory.md`.
- Un cambio de comportamiento observable (cancelar con motivo, listado) → `capabilities/bookings.md`.
- ADR: El motivo de una cancelación se guarda en la propia reserva — alternativa descartada: una tabla de motivos aparte → decisions/0003-reason-stored-on-booking.md

Retro: documento o skill desmentido → corregido en el mismo documento (`.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/tasks.md`: el Ruling de la Task 2 hablaba de una carrera que la medición desmiente)

## 6. Adendas

- _Ninguna._
