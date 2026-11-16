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

- **Cancelar con motivo** (`src/app.js`, `test/cancel.test.js`, f343675): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda en la reserva y responde «cancelada <sala> <día> (<motivo>)»; un motivo fuera de la lista responde «motivo no válido: …».
- **Listado de canceladas** (`src/app.js`, `test/cancel.test.js`, 61df1c4): comando `canceladas`, una línea «<sala> <día> — <motivo>» por reserva cancelada.
- **Capacidad** `bookings` creada en `.docs/sdd/capabilities/bookings.md` con los dos requisitos del delta.

## 2. Tiempo y coste: estimado vs real

- Pendiente: lo completa `sdd-archive`.

## 3. Desviaciones del plan

- _Ninguna_ en el código.

### Decisiones tomadas sin el dev-lead

- Pasar «Capacidades» de «Modificadas» a «Nuevas: bookings» — el proyecto no tenía capacidades y el merge lo exige — la capacidad nace en esta feature.
- Persistencia entre ejecuciones fuera — el estado en memoria es el de la base — el motivo no sobrevive entre llamadas de la shell (deuda para la 0012).
- Coincidencia estricta del motivo (mayúsculas y tildes) — lectura literal de la lista cerrada — el usuario reescribe el motivo.
- Test «cancelar con un motivo de la lista» depende de ser el primero — node:test respeta el orden de fichero — reordenar lo pone en rojo.
- El resto (CHANGELOG/README, anular, numeración de la spec, glosario, política de modelos, tasks.md tardío): en `tasks.md` § Rulings.

Revisión final: Spec opus+high y Código sonnet+high sobre 61df1c4, con fixes; pasada de fix 938ea30 (3 hallazgos RED→GREEN); re-revisión opus+high 61df1c4..938ea30 limpia.

## 4. Verificación

- Pendiente: lo completa `sdd-archive` (gate `node --test`, smoke por THEN y validación).

## 5. Aprendizajes

- Pendiente.

## 6. Adendas
