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

- Nueva: `reservas` — recoge `anular` (que hoy no está escrito en ninguna capacidad) con el permiso del responsable de sala, y el comando `anuladas`. Cambio incompatible: `anular` sin `--como` deja de funcionar. Se crea en `capabilities/reservas.md` al cerrar.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: MODIFIED, reglas de visibilidad o permiso, datos (quién anula), contrato público (la salida de `anular`) · tamaño: ~60 líneas en 3 ficheros
- Dominio (opus): que el cliente no pueda anular y qué ve cada rol (señal: permiso)
- Técnica (sonnet): que cada escenario del delta falle sin el comportamiento (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios ni autenticación, así que el flag es de confianza.
2. Capacidad nueva `reservas`, en castellano (Terminology de PRODUCT: «Reserva», no «booking»). Como `capabilities/` no existe, el comportamiento actual de `anular` entra como `ADDED` junto con el cambio.
3. Se guarda el **rol** que anuló (`responsable`), no una persona: no hay identidades. Vive en el registro de la reserva, en memoria, como `voidedBy`; no hay datos antiguos que migrar.
4. `anular` sin `--como` se rechaza (`falta --como <cliente|responsable>`) y con un valor distinto, también (`rol desconocido <valor>`). Rompe el uso actual sin flag; se acepta porque no hay otros usuarios (PRODUCT).
5. `anuladas` es un comando nuevo, igual para todos, sin `--como`: lo que el cliente no puede es anular, no ver.
6. El rechazo es texto devuelto por `run`, como `sin reserva …`: la app no tiene códigos de salida ni canal de error y no se introducen.
7. `cancelar` no cambia para ningún rol (no lleva `--como`). Las reservas no tienen dueño en el modelo, así que «anular las propias» no se plantea.
8. Orden de comprobación: primero el rol (ausente, inválido o `cliente`), luego la reserva; un cliente que anula una reserva inexistente recibe el rechazo de permiso.
9. `anuladas` lista por orden de anulación, solo las anuladas (las canceladas no salen), y el estado se observa por `run` (`anuladas`, o una nueva `anular` que responde `sin reserva …`). Volver a reservar una reserva anulada no entra: la app no crea reservas (`reservar` es un stub).
10. Divergencia con PRODUCT: la «Cancelación» dice «antes de 24 h», pero el código no aplica ese límite. No se toca aquí; el rechazo al cliente no menciona `cancelar`.

### Hallazgos de la review

- **Aceptado** (Crítico, dominio y técnica) `bookings` no existe en `capabilities/` → capacidad nueva `reservas`, con el comportamiento actual como `ADDED` (decisión 2).
- **Aceptado** (Crítico, dominio) faltaba «Reglas de la capacidad» → añadida con las cinco reglas.
- **Aceptado** (Crítico, técnica) un escenario mezclaba tres comportamientos → separados en escenarios propios.
- **Aceptado** (Crítico, dominio) «quién anuló» era el rol, no una persona → Intent, Capacidades y Scope hablan de rol (decisión 3).
- **Aceptado** (Crítico/Importante, ambos) sin `--como` o con valor inválido → escenarios y decisión 4.
- **Aceptado** (Importante, dominio) nombre `bookings` → `reservas`.
- **Aceptado** (Importante, técnica) `anuladas` con una sola fila pasa con un literal → escenario con dos anulaciones y uno sin anuladas.
- **Aceptado** (Importante, dominio) reserva ya anulada o inexistente → escenario.
- **Aceptado** (Menor, técnica) dónde se prueba `anuladas` → añadido.
- **Rechazado** (Crítico, técnica) código de salida y canal del rechazo → la app no los tiene (`run` devuelve texto); se prueba el texto (decisión 6).
- **Rechazado** (Importante, técnica) `anuladas` cambia un contrato existente → es un comando nuevo; no hay formato previo (`src/app.js` no lo tiene).
- **Rechazado** (Importante, dominio) migración de anuladas antiguas, y el límite de 24 h de `cancelar` → todo es memoria sin persistencia (decisión 3); el límite de 24 h no existe en el código y `cancelar` no cambia (decisión 7).
- **Rechazado** (Importante, dominio) responsable anulando las propias → las reservas no tienen dueño (decisión 7).
- **Rechazado** (Importante, técnica) falta un data-model → un campo en memoria no lo justifica (decisión 3).
- **Segunda ronda, aceptado** (Crítico) «Anular sin reserva activa» mezclaba casos → tres escenarios (inexistente, ya anulada, cancelada).
- **Segunda ronda, aceptado** (Crítico) el orden rol-antes-que-reserva sin escenario → escenarios con reserva inexistente y rol `cliente` o sin `--como`.
- **Segunda ronda, aceptado** (Crítico) cómo se observa `voidedBy` → solo por `run` (decisión 9) y los tests reinician el estado.
- **Segunda ronda, rechazado** (Crítico) escenario de volver a reservar una reserva anulada → `reservar` es un stub y no crea reservas (decisión 9).
- **Segunda ronda, aceptado** (Crítico) cambio incompatible sin marcar → declarado en Capacidades y en el delta (`anular` sin `--como` deja de funcionar).
- **Segunda ronda, aceptado** (Importante) orden de `anuladas` → por orden de anulación, solo anuladas, escenario con orden no alfabético.
- **Segunda ronda, aceptado** (Importante) «Límites» sin justificar y el cliente ve el rol → justificado en las reglas (decisión 5).
- **Segunda ronda, aceptado** (Importante) Intent hablaba de «otros» sin dueño → Intent reformulado; el título se conserva, es el de la fila del roadmap.
- **Segunda ronda, aceptado** (Importante) 24 h de PRODUCT → divergencia declarada (decisión 10); **rechazado** que el rechazo mencione `cancelar`: el texto lo fija la spec.
- **Segunda ronda, aceptado** (Menor) estado entre tests → «Dónde se prueba».
- **Aceptado** (Importante, dominio) el MODIFIED sin texto anterior → ya no es MODIFIED: el requisito entra como `ADDED` con su comportamiento actual.

## Intent

Hoy cualquiera anula cualquier reserva, y las reservas no tienen dueño en el modelo. La anulación pasa a depender del rol: el responsable de sala anula cualquier reserva y el cliente no. Hay que dejar anotado qué rol anuló y poder verlo.

## Scope

- Entra: `anular` con `--como`, `voidedBy` en la reserva y el comando nuevo `anuladas`.
- No entra: `cancelar`, autenticación, persistencia, códigos de salida.

## Dónde se prueba

- `anular`: por `run('anular', …)`, en `test/anular.test.js`, como `test/cancel.test.js`.
- `anuladas`: por `run('anuladas', [])`, en `test/anuladas.test.js`.
- Cada test parte de un estado limpio: `sin anuladas` no depende del orden de ejecución.

## Reglas de la capacidad

- Dónde vive el dato: `voidedBy` en el registro de la reserva, en memoria.
- Idioma de los nombres: castellano (`--como`, `cliente`, `responsable`, mensajes).
- Límites: no aplica: sin cantidad ni plazo; la reserva se identifica por sala y día, como hoy. El cliente puede ver `anulada por responsable`.
- Avisos: `solo el responsable de sala puede anular`, `falta --como <cliente|responsable>`, `rol desconocido <valor>`.
- Regla ante conflicto: sin reserva activa para sala y día (inexistente, cancelada o ya anulada), `sin reserva <sala> <día>`.

## Delta de comportamiento

### Capacidad: `reservas`

**ADDED — Anular una reserva** (sustituye el comportamiento actual, sin rol)
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva queda anulada con `voidedBy = responsable`

**ADDED — Un cliente no anula**
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como cliente`
- THEN responde `solo el responsable de sala puede anular` y la reserva sigue activa
- AND con la reserva de Sur del mar inexistente responde lo mismo, no `sin reserva Sur mar`

**ADDED — Anular exige un rol válido**
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun` sin `--como`
- THEN responde `falta --como <cliente|responsable>` y la reserva sigue activa
- AND con `--como admin` responde `rol desconocido admin` y la reserva sigue activa
- AND sin `--como` sobre la reserva inexistente de Sur del mar responde `falta --como <cliente|responsable>`

**ADDED — Anular sin reserva activa**
- GIVEN ninguna reserva de Sur del mar
- WHEN `anular Sur mar --como responsable`
- THEN responde `sin reserva Sur mar`
- AND con la reserva de Norte del lun ya anulada, `anular Norte lun --como responsable` responde `sin reserva Norte lun` y `anuladas` sigue listándola una sola vez
- AND con la de Norte del lun cancelada, responde `sin reserva Norte lun`

**ADDED — Listar las anuladas**
- GIVEN anuladas por el responsable, por este orden, Sur del mar y Norte del lun, y cancelada la de Sur del mié
- WHEN `anuladas`
- THEN responde dos líneas, por orden de anulación, `Sur mar — anulada por responsable` y `Norte lun — anulada por responsable`
- AND sin ninguna anulada responde `sin anuladas`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
