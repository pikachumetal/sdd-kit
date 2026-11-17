---
id: 20261008-110000-feature-0011-void-others
feature: 0011
title: Anular reservas de otros
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: null
---

# Spec — Anular reservas de otros

## Capacidades

- Modificadas: `bookings` — `anular` exige `--como` y solo lo puede usar el responsable de sala; guarda quién anuló.
- Añadidas (dentro de `bookings`): `anuladas`, un listado nuevo de las reservas anuladas.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: MODIFIED, reglas de visibilidad o permiso, datos (quién anula), contrato público (la salida de `anular`) · tamaño: ~60 líneas en 3 ficheros
- Dominio (sonnet): que el cliente no pueda anular ni ver quién anuló (señal: permiso)
- Técnica (sonnet): que cada THEN de `anular` y `anuladas` sea verificable por `run(…)` (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios.
2. El rol es **global**, no por sala: el roadmap dice «responsable de cada sala», pero la app no tiene la relación sala-responsable ni usuarios; modelarla es otra feature. Con `--como responsable` se anula en cualquier sala.
3. `--como` es **obligatorio** en `anular`. Sin él: `falta --como <cliente|responsable>` y la reserva sigue activa. Rompe a quien hoy llama `anular` sin flag; se acepta porque sin rol no hay permiso que comprobar.
4. Un valor distinto de `cliente` o `responsable`: `rol desconocido` y la reserva sigue activa.
5. Las reservas no tienen dueño, así que **ningún cliente anula nada**, tampoco lo suyo.
6. `anuladas` es un comando nuevo (hoy no existe). Con `--como responsable` lista `<sala> <día> — anulada por responsable`; con `--como cliente` lista `<sala> <día>`, sin quién anuló. **Sin `--como` equivale a cliente** (a diferencia de `anular`): es una lectura que no enseña lo restringido, así que el valor seguro es el del rol que menos ve; `anular` modifica y por eso exige rol. Un valor inválido responde `rol desconocido`. **Valida en especial:** que el cliente vea qué reservas están anuladas (sin el «quién»); si no debe verlas, se prohíbe con `--como cliente` y se cambia el escenario.
7. En `anular`, el **orden de validación** es primero el rol (falta, desconocido, sin permiso) y después la reserva: `anular Norte lun --como cliente` responde `solo el responsable de sala puede anular` aunque la reserva no exista o ya esté anulada.
8. Anular una reserva ya anulada, cancelada, o de una sala o día sin reserva activa, responde `sin reserva <sala> <día>` (`findBooking` solo busca activas, comprobado en `src/app.js`), y no cambia quién anuló la primera vez. `anuladas` no incluye las canceladas.
9. `--como` va tras la sala y el día (`anular <sala> <día> --como <rol>`). Límites de sala y día: no aplica, no cambian.
10. El rol de quien anuló se guarda en la reserva, en memoria (`src/app.js`): no hay datos antiguos ni migración.
11. `--como` es **declarativo, no autenticación**: quien invoca se declara responsable. Esta feature fija el flujo y los mensajes, no protege nada; la validación y el walkthrough no lo presentan como seguridad.
12. `cancelar` no cambia y no exige `--como`: es la cancelación propia; su motivo es la 0010.
13. Los literales `solo el responsable de sala puede anular`, `falta --como <cliente|responsable>`, `rol desconocido`, `sin reserva <sala> <día>` (ya existente), `sin anuladas` y el sufijo `— anulada por responsable` son míos.

### Hallazgos de la review

Dominio (sonnet, 10):
- **Aceptado** — 1: rol global frente a «cada sala» → decisión 2 en ✋.
- **Aceptado** — 2: falta `--como` → decisión 3 y escenario.
- **Aceptado** — 3: cliente anulando lo propio → decisión 5 y escenario.
- **Aceptado** — 4: `anuladas` sin requisito propio → pasa a ADDED, con sus escenarios.
- **Aceptado** — 5: qué ve el cliente en `anuladas` → decisión 6 y escenario.
- **Aceptado** — 6: reservas anuladas antes → no existen (memoria), decisión 8; `--como` en `anuladas`, decisión 6.
- **Aceptado** — 7: valor inválido de `--como` → decisión 4 y escenario. «Reglas de la capacidad»: sin capabilities ni «Reglas de producto» en la constitución, no aplica salvo lo dicho en las decisiones 1–8.
- **Aceptado** — 8: `cancelar` → decisión 9.
- **Aceptado** — 9: línea técnica contradictoria → reescrita en el bloque de la review.
- **Aceptado** — 10: «de Ana» sin uso → quitado.

Técnica (sonnet, 9):
- **Aceptado** — 1: escenario único con tres efectos → separado en escenarios con su GIVEN/WHEN.
- **Aceptado** — 2 y 3: `--como` ausente o inválido → escenarios.
- **Aceptado** — 4: ya anulada o inexistente → escenario y decisión 7.
- **Aceptado** — 5: formato para anuladas antiguas → no hay (decisión 8).
- **Aceptado** — 6: decisiones sueltas en el cuerpo → pasadas a ✋ (10).
- **Aceptado** — 7: dónde se guarda quién anuló → decisión 8: en la reserva, en memoria.
- **Aceptado** — 8: contradicción de la línea técnica → ver dominio 9.
- **Aceptado** — 9: dónde se prueba `anuladas` y los tests existentes → sección «Dónde se prueba».

Segunda ronda (sonnet, 10, tras aceptar Críticos):
- **Aceptado** — 1 (Crítico): escenario de `anuladas` con dos estados → separado en tres, más uno con `--como` inválido.
- **Aceptado** — 2 (Crítico): orden de validación y «como hoy» → decisiones 7 y 8 (comprobado en el código), escenarios independientes de `anuladas`.
- **Aceptado** — 3: visibilidad del cliente en `anuladas` → decisión 6, marcada para validar en especial.
- **Aceptado** — 4: `anuladas` sin `--como` frente a `anular` → justificado en la decisión 6.
- **Rechazado** — 5: otros llamadores y ayuda de la CLI → `git grep` no encuentra `anular` fuera de `src/app.js` (ni README ni ayuda); no hay nada más que tocar.
- **Aceptado** — 6: sala o día sin reserva y orden de argumentos → decisiones 8 y 9 y escenario; límites: no aplica.
- **Aceptado** — 7: `--como` no es autenticación → decisión 11.
- **Rechazado** — 8, primera parte: mover el bloque de review fuera de ✋ → la rúbrica lo pone al abrir ✋. **Aceptado** la segunda: literales en decisión 13.
- **Aceptado** — 9: dónde vive el dato → decisión 10; se verifica por `anuladas`.
- **Aceptado** — 10: cancelada y luego anular → decisión 8 y escenario.

Nota: la review se hizo con Sonnet también en dominio por petición del dev-lead («he aceptado la review de dos revisores, el de dominio en Sonnet»); la rúbrica daría Opus por tocar roles.

## Intent

Hoy cualquiera anula cualquier reserva. El responsable de sala debe poder anular las de otros, y el cliente no.

## Scope

- Entra: `anular` con `--como` obligatorio; guardar quién anuló; el comando nuevo `anuladas`.
- No entra: `cancelar`; la relación sala-responsable; usuarios y dueños de reserva.

Ficheros que se tocan: `src/app.js`, `test/anular.test.js` (nuevo). Sin ayuda de CLI ni README que actualizar.

## Dónde se prueba

- Anular y anuladas: por `run('anular', …)` y `run('anuladas', …)`, en `test/anular.test.js`, como `test/cancel.test.js`.
- Ningún test existente llama a `anular`; los de `cancelar` no cambian. El gate es `node --test` entero.

## Delta de comportamiento

### Capacidad: `bookings`

**MODIFIED — Anular una reserva** (antes: `anular Norte lun` anulaba sin más)
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun`

**MODIFIED — Anular una reserva: el cliente no anula**
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como cliente`
- THEN responde `solo el responsable de sala puede anular`
- AND `anular Norte lun --como responsable` responde `anulada Norte lun` (la reserva seguía activa)

**MODIFIED — Anular una reserva: el rol es obligatorio y válido**
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun`
- THEN responde `falta --como <cliente|responsable>`
- WHEN `anular Norte lun --como admin`
- THEN responde `rol desconocido`
- AND en ambos casos la reserva sigue activa

**MODIFIED — Anular una reserva: ya anulada, cancelada o inexistente**
- GIVEN la reserva de Norte del lun ya anulada
- WHEN `anular Norte lun --como responsable`
- THEN responde `sin reserva Norte lun`
- GIVEN la reserva de Norte del lun cancelada, o ninguna de Sur del mar
- WHEN `anular Norte lun --como responsable` / `anular Sur mar --como responsable`
- THEN responde `sin reserva Norte lun` / `sin reserva Sur mar`

**MODIFIED — Anular una reserva: el rol se valida antes que la reserva**
- GIVEN ninguna reserva activa de Sur del mar
- WHEN `anular Sur mar --como cliente`
- THEN responde `solo el responsable de sala puede anular`

**ADDED — Listado de anuladas: responsable**
- GIVEN la reserva de Norte del lun anulada con `--como responsable`
- WHEN `anuladas --como responsable`
- THEN responde `Norte lun — anulada por responsable`

**ADDED — Listado de anuladas: cliente o sin rol**
- GIVEN la reserva de Norte del lun anulada con `--como responsable`
- WHEN `anuladas --como cliente` o `anuladas`
- THEN responde `Norte lun`

**ADDED — Listado de anuladas: vacío, cancelada y rol inválido**
- GIVEN ninguna reserva anulada y la de Norte del lun cancelada
- WHEN `anuladas --como responsable`
- THEN responde `sin anuladas`
- WHEN `anuladas --como admin`
- THEN responde `rol desconocido`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
