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

- `src/app.js`: lista cerrada `reasons` (cambio de planes, sala ocupada, otro); `cancelar` lee `--motivo`, rechaza un motivo fuera de la lista o ausente y guarda el motivo en la reserva (0d7912c); comando `canceladas`, que lista `<sala> <día> — <motivo>` de las reservas canceladas (c421846).
- `test/cancel.test.js`: tests de cancelar con motivo válido, fuera de la lista y sin `--motivo`, de cancelar sin reserva, y del listado de canceladas, que prepara su propia cancelación (los tres últimos, de la pasada de fix de la revisión final, juntada en el commit de cierre).
- `capabilities/bookings.md`: nueva, fusionada desde el delta de la spec.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- La revisión final (Spec opus+high y Código sonnet+high, sobre c421846) pidió arreglos: la THEN «sin `--motivo`» no tenía test, se había perdido el test «sin reserva» y el test de `canceladas` dependía del orden. Una pasada de fix con los tres RED→GREEN; la re-revisión (opus+high) la dio limpia.
- «Capacidades» de la spec declaraba `bookings` como Modificada sin fichero en `capabilities/`: pasa a Nuevas en el cierre.

### Decisiones tomadas sin el dev-lead

- `tasks.md` no se escribió antes de la Task 1 (dos tasks) — se escribió en el cierre — si está mal, el registro vivo de la ejecución solo lo dan el ledger y git log, que coinciden.
- ¿El test borrado era la regresión del patch 0007? (no verificado del eje Spec) — verificado: en 971c128 el único test de cancelar sin reserva era `cancelar sin reserva lo dice` (Sur mar) y vuelve en el cierre con motivo válido — si está mal, el caso misma sala otro día del 0007 sigue sin test propio, como ya estaba en la base.
- `--motivo` antes de sala y día responde «sin reserva --motivo otro» — la spec fija la forma `cancelar <sala> <día> --motivo <motivo>` y la app lee por posición en todos sus comandos — si está mal, un usuario que ponga la opción primero recibe un mensaje confuso.
- Cancelar dos veces la misma reserva responde «sin reserva» — comportamiento previo a la 0010 — si está mal, el mensaje no distingue «ya cancelada».
- El motivo vive en memoria y `canceladas` en otra invocación de la CLI sale vacío — es el modelo de datos que la app ya tenía; la persistencia es la 0014 — si el dev-lead esperaba ver canceladas entre invocaciones, la feature no se nota en uso real hasta la 0014.
- Un motivo inválido sobre una reserva que no existe responde «motivo no válido» antes que «sin reserva» — la spec no fija el orden y validar la entrada antes de buscar es defendible — si está mal, el usuario corrige el motivo y después descubre que no había reserva.
- Reescribir los tests viejos de `cancel.test.js` no tocaba tests RED de esta feature — la 0010 cambia la salida de `cancelar` y su THEN los reescribe — si está mal, se perdió cobertura previa, ya devuelta en el cierre.
- `bookings` pasa de Modificada a Nueva en «Capacidades» de la spec — no tenía fichero en `capabilities/` y `capability merge` no fusiona sin él — si está mal, el requisito vivía en otro sitio que no he encontrado.

Minors diferidos de la revisión: el orden motivo-antes-que-reserva sin test; `canceladas` vacío imprime una línea en blanco; `--motivo sala ocupada` sin comillas se rechaza sin pista; línea larga en `cancelledList`; `voidBooking` no toca `booking.reason`; la lista de decisiones de la spec saltaba del 1 al 3; el test de `canceladas` sigue compartiendo estado de módulo (fila en la deuda).

## 4. Verificación

### 4.1 Builds

- Gate: `node --test` → 7/7 · 0,1 s · configuración: la del gate · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 7/7 · smoke 3/4 THEN con ejecución real por la CLI y 1 con ejecución real en un proceso · revisión final Spec y Código sobre c421846, re-revisión limpia

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | ok |
| Motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) | ok |
| Sin `--motivo` responde lo mismo | ejecución real (`node src/app.js cancelar Norte lun`) | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real en un proceso (`run('cancelar', …)` y `run('canceladas', [])`); por la CLI, en una invocación aparte, imprime una línea vacía: el estado es en memoria hasta la 0014 | ok en un proceso |

### 4.3 Residuales / deuda generada

- Tests de `cancel.test.js` con estado de módulo compartido y sin reinicio → «Por triar» de `debt.md`.

## 5. Aprendizajes

- El estado de la app vive en memoria por proceso: lo que un comando deja (una cancelación) no se ve desde otra invocación de la CLI hasta la persistencia de la 0014 → `steering/architecture.md`

Retro: documento o skill desmentido → corregido en la misma spec: «Capacidades» declaraba `bookings` como Modificada sin fichero en `capabilities/`; pasa a Nuevas (spec.md)

## 6. Adendas
