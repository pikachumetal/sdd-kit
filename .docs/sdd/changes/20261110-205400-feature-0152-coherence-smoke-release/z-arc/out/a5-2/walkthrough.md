---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-12
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (Task 1, `fc0fd80`): `src/app.js` — `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (`cambio de planes`, `sala ocupada`, `otro`), guarda el motivo con la reserva cancelada y responde «cancelada Norte lun (sala ocupada)»; un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro». Tests en `test/cancel.test.js`.
- **Listado de canceladas** (Task 2, `0e1e2b6`): `src/app.js` — comando `canceladas`, una línea por reserva cancelada: «Norte lun — sala ocupada». Test en `test/cancel.test.js`.
- Pieza de la 0009 (`parent: 0009`); lo que queda de la madre es la 0016 (fotos de las salas).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.
- Review de spec: no · hallazgos 0, aceptados 0 (decisión 3 de la spec: sin review de spec, por dos señales — MODIFIED, datos).

## 3. Desviaciones del plan

- _Ninguna_ en tasks ni ficheros: dos tasks, Native, como decía el plan.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Comprobado en el cierre: `node --test --test-name-pattern="canceladas" test/cancel.test.js` solo → 0 pass, 1 fail. Fila en «Por triar» de `debt.md`.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5 tests, 5 pass, 0 fail (≈0,16 s), sobre `92b416b`; salida completa guardada en el scratchpad de la sesión.
- Gate: `node --test` → node --test: corrió 5/5 · configuración: la del plan (§3), sin añadidos · sobre `92b416b` (lo posterior es solo documentación).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpias sobre `0e1e2b6`, sin re-revisión: los commits posteriores solo tocan `.md` · nada `no probado`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) + suite | ✅ |
| Motivo fuera de la lista (`--motivo "me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (la entrada que falla) + suite | ✅ |
| Sin `--motivo` responde lo mismo | ejecución real (`node src/app.js cancelar Norte lun`); sin test propio | ✅ |
| `canceladas` responde «Norte lun — sala ocupada» tras cancelar con «sala ocupada» | ejecución real (cancelar + `canceladas` en un mismo proceso: el estado vive en memoria) + suite | ✅ |

### 4.3 Residuales / deuda generada

- El caso «sin `--motivo`» no tiene test propio (lo cubre solo el smoke) → «Por triar» de `debt.md`.
- Test de `canceladas` dependiente del orden (ruling de la Task 2) → «Por triar» de `debt.md`.
- La spec numera sus decisiones 1 y 3 (falta la 2): errata de la spec ya aprobada, no se reescribe.

## 5. Aprendizajes

- La 0010 cambia comportamiento observable de `bookings` → capacidad `capabilities/bookings.md`, con `sdd capability merge`.
- Sin aprendizajes de convención, estructura ni versiones: `constitution.md` y `architecture.md` no cambian (`operations.md` no existe y nada pide crearlo).

Retro: sin señales

## 6. Adendas

- _Ninguna._
