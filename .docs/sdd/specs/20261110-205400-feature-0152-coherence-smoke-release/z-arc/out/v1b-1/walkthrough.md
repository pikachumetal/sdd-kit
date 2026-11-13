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

- **Cancelar con motivo** (`a9edd49`): `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro). Sin motivo o con uno fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro». Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (`d7c79f5`): el comando `canceladas` lista las reservas canceladas como «Norte lun — sala ocupada». Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Capacidad**: nace `capabilities/bookings.md` con los dos requisitos de la spec, fusionada con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Pasa a la deuda («Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` en la rama, sobre el commit de cierre: 5/5 pasan, 0 fallos (salida completa guardada en el scratchpad de la sesión). `operations.md` no existe, así que no hay «Suites» ni gate declarados: la suite entera es la del runner de Node.
- Revisión final (`tasks.md`): Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre `d7c79f5`. Desde entonces solo se movió `tasks.md` (documentación): sin re-revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 4/4 con ejecución real · revisión final Spec y Código limpia sobre `d7c79f5`; `canceladas` probado en el mismo proceso porque el estado vive en memoria.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Norte lun --motivo "porque sí"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | cancelar y luego `canceladas` en un mismo proceso → `Norte lun — sala ocupada` |

Las cuatro filas las verificó el agente; nada reportado por el usuario.

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del estado que deja el primer test (ver «Decisiones tomadas sin el dev-lead»): fila en «Por triar» de la deuda.
- Las reservas viven en memoria: cada llamada al CLI es un proceso nuevo y `canceladas` no ve lo cancelado en otra llamada. Es lo que ya hacía el producto; lo cubre la 0014 («Motivo guardado»).

## 5. Aprendizajes

- El comportamiento nuevo (motivo y listado) vive en la capacidad → `capabilities/bookings.md`.
- Sin convención ni cambio estructural nuevos: nada va a `constitution.md` ni a `architecture.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_.
