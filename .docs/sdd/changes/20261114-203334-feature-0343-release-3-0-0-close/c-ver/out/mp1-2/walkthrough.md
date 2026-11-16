---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-15
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (`cambio de planes`, `sala ocupada`, `otro`), lo guarda en la reserva cancelada y lo devuelve en la respuesta — `src/app.js`, `test/cancel.test.js` (Task 1, `934b6e8`).
- Comando nuevo `canceladas`: lista las reservas canceladas con su motivo, `<sala> <día> — <motivo>` — `src/app.js`, `test/cancel.test.js` (Task 2, `689b312`).
- Capacidad viva `bookings` creada en `.docs/sdd/capabilities/bookings.md` con los dos requisitos del delta.

## 2. Tiempo y coste: estimado vs real

_Se completa en el cierre (`sdd-archive`)._

## 3. Desviaciones del plan

- _Ninguna_ en las tasks: las dos se ejecutaron en Native, en el orden del plan.
- `tasks.md` no se escribió antes de la Task 1, aunque el plan tiene dos tasks: el ledger del workspace llevó el estado.

### Decisiones tomadas sin el dev-lead

- La señal «datos» no sube el eje Arquitectura — la spec la declaraba antes de que el plan fijara «no»; el campo vive en memoria y no cruza módulos — si me equivoco, un problema de modelo de datos llega al merge sin el ojo de arquitectura.
- «Capacidades» de la spec pasa de «Modificadas: bookings» a «Nuevas: bookings» — el proyecto no tenía `capabilities/` y `sdd capability merge` no puede modificar una capacidad que no existe — si me equivoco, `bookings` debía documentarse antes, desde las features 0005-0007.
- `anular` no pide motivo — es la 0011, fuera de Scope — ninguno.
- `bookings` y `reasons` siguen en el módulo de la CLI — la app es un solo módulo — si me equivoco, la separación llega con la feature que persista datos.
- Los tests previos de `cancelar` cambiaron en `934b6e8` — eran anteriores a la feature y la spec cambia su salida — la cobertura de «sin reserva» se recuperó en la pasada de fix.
- El motivo no persiste entre invocaciones de la CLI — `bookings` ya vivía en memoria antes de la feature; la persistencia queda fuera de Scope — si me equivoco, `canceladas` en otra invocación sale vacío y la feature no deja rastro real hasta que haya persistencia (deuda).
- Mayúsculas, espacios, motivo sin comillas o `--motivo` antes de sala y día se rechazan — la lista es cerrada y el mensaje enseña los válidos — un reintento del usuario.
- Orden de las líneas de `canceladas`: el de inserción — la spec no lo fija — ninguno.
- El test «cancelar con un motivo de la lista» falla si se reordena tras el de `canceladas` — `node:test` ejecuta en orden de declaración; la causa es el estado de módulo sin reset — un rojo falso si alguien reordena (deuda).
- `6614e3b` normaliza `test/cancel.test.js` de CRLF a LF (`core.autocrlf=true`) — el diff real son 9 líneas añadidas — el blame de esas 15 líneas apunta a `6614e3b`.

## 4. Verificación

- Revisión final: Spec opus+high, With fixes · Código sonnet+high, With fixes · Arquitectura no (plan), sobre `689b312`.
- Pasada de fix: `6614e3b`, 3 hallazgos RED→GREEN (THEN «sin `--motivo`» con test, «cancelar sin reserva» recuperado, `canceladas` sin depender del orden); `node --test` → 7/7.
- Re-revisión: `689b312..6614e3b`, sdd-kit:effort-high + opus, 3/3 resueltos, 2 Minor (con ruling).

_El gate, el smoke y la validación se completan en `sdd-archive`._

### 4.3 Residuales / deuda generada

- Minors aplazados de la revisión final:
  - `canceladas` sin canceladas imprime una línea vacía; un texto nuevo cambiaría una salida que la spec no fija.
  - Falta test de «`--motivo` sin valor».
  - «motivo no válido» cuando falta el motivo; «motivo obligatorio» sería más claro, pero cambia un THEN aprobado.
  - `cancelledList` con una línea de ~115 caracteres.
  - `run` crece como cadena de `if`.
  - La numeración de «Decisiones que he tomado yo» de la spec salta de 1 a 3.
- Deuda candidata:
  - Persistencia de reservas entre invocaciones.
  - Reset del estado del módulo para los tests.

## 5. Aprendizajes

_Se completa en el cierre._

## 6. Adendas
