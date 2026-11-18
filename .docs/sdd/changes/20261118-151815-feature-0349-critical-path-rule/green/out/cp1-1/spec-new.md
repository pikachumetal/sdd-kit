---
id: 20261118-163152-feature-0040-cancel-cutoff
feature: 0040
title: Una reserva de hoy ya no se cancela
mode: full
profile: delegate
status: draft
created: 2026-11-18
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Una reserva de hoy ya no se cancela

🦆 Hasta ahora `cancelar Norte lun` anula la reserva siempre. Con este cambio, si hoy es lunes responde «ya no se puede cancelar Norte lun» y la reserva sigue activa; `cancelar Norte mar` (un día posterior) se cancela como siempre. Por dentro, `run` recibe el día de hoy como parámetro opcional para que los tests no dependan del reloj.

Validación: dev-lead — cambia lo que ve y puede hacer quien cancela.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva, con la regla de que la de hoy ya no se cancela.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: sin review (lo dijo el dev-lead) — señales: capacidad nueva · tamaño: ~15 líneas en 2 ficheros
- Mínimo razonable: sin review. Deja sin mirar si el THEN de «hoy» choca con algo no leído; el proyecto no tiene capacidades vigentes y la cancelación solo la toca el patch 0007.

1. Capacidad nueva `booking-cancellation` — el proyecto no tiene `capabilities/` y la regla necesita un sitio vivo.
2. Enfoque: A, frente a B y C (ver Approach).
3. «Hoy» se decide por día, no por horas: toda reserva del día en curso queda sin cancelar, sea cual sea su franja. El glosario habla de «antes de 24 h»; no lo toco (ver 8).
4. Los días anteriores a hoy (p. ej. `cancelar Norte dom` siendo lunes) siguen como ahora: se cancelan. Nadie dijo nada de ellos; solo bloqueo el día igual a hoy. **Pendiente de tu confirmación.**
5. El día de hoy se compara por la abreviatura de la reserva: `dom, lun, mar, mié, jue, vie, sáb`. En el código hoy solo hay `lun` y `mar`; `mié` y `sáb` con tilde es mi propuesta.
6. Orden de comprobaciones: primero «sin reserva» y después «de hoy»: `cancelar Sur lun` sin reserva sigue diciendo `sin reserva Sur lun`, aunque sea lunes.
7. `anular` (responsable de sala) no cambia: puede anular una reserva de hoy.
8. `PRODUCT.md` (término «Cancelación … antes de 24 h») no se edita en esta feature; queda como discrepancia de vocabulario para que decidas si pasa a «antes del día de la reserva».
9. **Camino crítico, cambio propuesto (la fila la edita una persona, en la validación):** el test `cancel.test.js › cancelar una reserva activa` usa `cancelar Norte lun`; con «hoy = lunes» fallaría, y sin reloj fijo fallaría solo los lunes. Propongo mantener la fila (A, la cancelación es el producto) y que el test fije el día: `run('cancelar', ['Norte', 'lun'], 'mar')` → `cancelada Norte lun`. Cambia el test, no el camino; lo apruebas tú al validar.
10. Tests nuevos, de feature (se borran al cerrar): reserva de hoy rechazada, día posterior cancelado, sin reserva con hoy = lunes. No propongo filas nuevas al camino crítico: la de hoy no es un camino feliz (criterio C) ni ha roto nada aún.
- Política de modelos: sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.
- Delta probado en una copia de `.docs/sdd` con `sdd capability merge`: 3 requisitos y 5 reglas añadidos a `booking-cancellation.md`, sin rechazos; el repo no cambia.

### Decisiones tomadas con el dev-lead

- Una reserva de hoy ya no se cancela — «una reserva de hoy ya no se cancela»
- Mensaje de rechazo — «`cancelar Norte lun`, siendo lunes, responde «ya no se puede cancelar Norte lun»»
- Días posteriores — «las de días posteriores se cancelan como hoy»
- Sin review — «Sin review»

## Intent

Hoy cualquiera cancela una reserva el mismo día en que se usa la sala, y la sala queda vacía sin tiempo de reasignarla. El dev-lead decidió que la reserva de hoy ya no se cancela. Éxito: el lunes, `cancelar Norte lun` no cambia nada y lo dice; `cancelar Norte mar` sigue funcionando. Anti-objetivo: que el test del camino crítico falle según el día en que se ejecuta.

## Scope

- Entra: `cancelBooking` rechaza la reserva activa del día de hoy con `ya no se puede cancelar <sala> <día>`; `run` y `cancelBooking` reciben «hoy» como parámetro opcional (por defecto, el día real) en `src/app.js`; los tests de feature y el ajuste del test del camino crítico (decisión 9).
- No entra: `anular`; reglas por horas o por antelación; días anteriores a hoy (decisión 4); `PRODUCT.md`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` ya no cancela siempre | `src/app.js:13-18` (`cancelBooking`), `src/app.js:30` (`run`) | Scope + delta `ADDED` (no hay capacidad vigente que modificar) |
| Test que da por buena la cancelación de `lun` sin fijar el día | `test/cancel.test.js:5-7`, `.docs/sdd/steering/critical-path.md:5` | decisión 9 |
| Texto «antes de 24 h» de Cancelación | `PRODUCT.md` (Terminology) | decisión 8: no se edita |

- Filas que implementa: nada: comprobado con `git grep -n 0040` (solo la rama; el roadmap no tiene fila 0040).

## Approach

- A. Parámetro opcional `today` en `run(cmd, params, today = diaDeHoy())`; `diaDeHoy()` mapea `Date#getDay()` a las abreviaturas. Cuesta un argumento más en `run`; los tests fijan el día sin tocar el reloj ni el entorno.
- B. Variable de entorno `SALAS_HOY`: cuesta estado global en los tests y un contrato oculto en la CLI.
- C. Simular el reloj (`mock.timers` de `node:test`): acopla los tests a una API de Node y a la implementación de `Date`.
- Elegido: A — `run` ya es una función que los tests llaman directamente y A no añade estado.

La CLI (`node src/app.js cancelar Norte lun`) usa el día real.

## Dónde se prueba

- Reserva de hoy rechazada: `cancel.test.js`, `run('cancelar', ['Norte','lun'], 'lun')`; de feature, se borra al cerrar.
- Día posterior cancelado: `run('cancelar', ['Norte','lun'], 'dom')` → `cancelada Norte lun`; de feature, se borra al cerrar.
- Sin reserva con hoy = lunes: `run('cancelar', ['Sur','lun'], 'lun')` → `sin reserva Sur lun`; de feature, se borra al cerrar.
- Camino crítico: el test existente fija `today = 'mar'` (decisión 9); fila propuesta nueva: ninguna.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — La reserva de hoy no se cancela

- GIVEN hoy es lunes y hay una reserva activa Norte lun
- WHEN `cancelar Norte lun`
- THEN responde `ya no se puede cancelar Norte lun` y la reserva sigue activa

#### ADDED — Las reservas de días posteriores se cancelan

- GIVEN hoy es domingo y hay una reserva activa Norte lun
- WHEN `cancelar Norte lun`
- THEN responde `cancelada Norte lun` y la reserva queda cancelada

#### ADDED — Cancelar sin reserva lo dice

- GIVEN hoy es lunes y no hay reserva activa Sur lun
- WHEN `cancelar Sur lun`
- THEN responde `sin reserva Sur lun`

#### Reglas de la capacidad — booking-cancellation

- **Dónde viven los datos**: las reservas viven en memoria (`operations.md`).
- **Idioma de los nombres**: castellano (constitución, art. 4).
- **Límites**: solo se cancelan reservas de días posteriores a hoy; la de hoy no.
- **Avisos**: `ya no se puede cancelar <sala> <día>` · `cancelada <sala> <día>` · `sin reserva <sala> <día>`.
- **Regla ante conflicto**: no aplica.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
