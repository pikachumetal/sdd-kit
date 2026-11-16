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

🦆 Hoy `anular Norte lun` anula la reserva sin preguntar quién eres. Con esta feature hay que decirlo con `--como`: `anular Norte lun --como responsable` anula (`anulada Norte lun`) y `anular Norte lun --como cliente` se niega (`solo el responsable de sala puede anular`) y deja la reserva activa. Un comando nuevo, `anuladas`, lista lo anulado y el rol que lo anuló: `Norte lun — anulada por responsable`. Ojo con lo que NO hace: el rol es una declaración, no un login (quien escribe `--como responsable` anula), y como las reservas viven en memoria, `anuladas` solo ve lo anulado en la misma ejecución. Por dentro: `run` lee `--como <valor>` como ya lee `--cada-semana`, y `voidBooking` guarda `voidedBy`.

Validación: dev-lead — es un comando que usa una persona y el permiso es una regla de negocio.

## Capacidades

- Nuevas: `bookings` — anular una reserva según el rol declarado y listar las anuladas con el rol que las anuló. Queda parcial a propósito: `reservar`, `cancelar` y `libres` no se describen aquí.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores (más una segunda ronda de uno) — señales: capacidad nueva (`bookings`), reglas de visibilidad o permiso (qué NO puede el cliente), datos (`voidedBy`), contrato público (salida de `anular` y comando `anuladas`) · tamaño: ~60 líneas en 2 ficheros + la capacidad
- Dominio (opus): qué NO puede hacer el cliente, y si «de cada sala» del roadmap queda cubierto por un rol global (señal: permiso)
- Técnica (sonnet): que `anular` sin `--como` y el formato de `anuladas` no rompan la salida actual de `anular` (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios ni login (`operations.md`, «sin login»). `--como` consume el argumento siguiente, va en cualquier posición, y solo vale en minúsculas y exacto.
2. **Rol global, no por sala.** El roadmap dice «el responsable de cada sala», pero no hay modelo de salas con responsable: `--como responsable` vale para cualquier sala. Por eso `voidedBy` solo puede valer `responsable` hoy (campo redundante, guardado para cuando haya responsables por sala). «Por sala» queda fuera.
3. **El rol es autodeclarado.** Nada impide que el cliente escriba `--como responsable`: lo que se promete es un control de uso, no de seguridad. Un login real queda fuera.
4. La reserva no guarda dueño en el código (aunque `PRODUCT.md` la define «a nombre de quien la pide»): «de otros» significa que el responsable anula cualquiera, también las suyas, y el criterio es el rol, no el dueño. El cliente sigue teniendo `cancelar` para lo suyo (vía distinta, sin cambio). Guardar el dueño queda fuera.
5. `anular` sin `--como`, con `--como` sin valor o con un valor distinto de `cliente` y `responsable`, responde `indica --como <cliente|responsable>` y no anula. Cambia el comportamiento de hoy (anulaba sin preguntar). La salida de éxito `anulada <sala> <día>` y `sin reserva <sala> <día>` son las de hoy, sin cambio.
6. **Orden de las comprobaciones**: rol válido → permiso → existencia. Así `anular Sur mar --como cliente` sin reserva responde `solo el responsable de sala puede anular`. Una reserva ya anulada cuenta como inexistente (`findBooking` solo ve activas): volver a anularla responde `sin reserva` y no cambia `voidedBy`.
7. `anuladas` es un comando nuevo, sin `--como`: lo ve cualquier rol, incluido quién anuló. Formato `<sala> <día> — anulada por <rol>`, una línea por reserva, en el orden en que se anularon; sin ninguna responde `sin anuladas`.
8. **Constancia en memoria**: las reservas viven en memoria (`operations.md`), cada ejecución de la CLI empieza de cero, así que `anuladas` solo ve lo anulado en el mismo proceso (los tests, por `run`). Persistir queda fuera, como ya pasa con `cancelar`.
9. Una reserva anulada no vuelve a bloquear la sala en `libres` (hoy ya es así: solo cuentan las activas) y `cancelar` sobre una anulada responde `sin reserva` (hoy también). Se dejan como están, fuera de la capacidad y sin escenario: no cambian.
10. Capacidad nueva: `bookings` (nombre en inglés, kebab-case: es un nombre de fichero). Hoy no existe en `capabilities/`, y el comportamiento vigente de `anular` no está descrito en ninguna, por eso el delta es `ADDED`.
11. Identificadores de código en inglés (`voidedBy`, `voidBooking`), como el resto de `src/app.js`; la regla de castellano de la constitución se aplica al texto de la interfaz y de los documentos.
12. Enfoque: A, `--como` leído en `run`, frente a B (variable de entorno) y C (fichero de roles) (ver Approach).
- Política de modelos: dos revisores de la spec (dominio opus, técnica sonnet) y una segunda ronda con uno (sonnet) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`.
- Delta probado en una copia de `.docs/sdd` con `sdd capability merge`: sale bien, crea `bookings.md` (requisitos y las 5 reglas de la capacidad; se vuelve a probar tras esta corrección).

### Hallazgos de la review

Primera ronda (técnica y dominio):

- **Aceptado** — técnica 1: el orden de `anuladas` no se prueba con una sola anulada → escenario con dos anuladas (Sur mar y luego Norte lun).
- **Aceptado** — técnica 2 y dominio 3: `voidedBy` solo puede valer `responsable`; el test no distingue guardado de literal → decisión 2 lo declara redundante, y decisión 3 recoge que el rol es autodeclarado (Intent reformulado).
- **Aceptado** — técnica 3, 4 y dominio 6: orden de comprobaciones, `--como` sin valor, mayúsculas, ya anulada → decisiones 1, 5 y 6, y escenarios separados.
- **Aceptado** — técnica 5 y 9, dominio 9: salida de `anular` y `sin reserva` → decisión 5, «Lo que se retira o cambia de forma».
- **Aceptado** — técnica 6 y dominio 5: visibilidad de `anuladas` → decisión 7.
- **Aceptado** — técnica 7: `voidBooking` solo lo llama `run` y no hay tests de `anular` hoy → fila nueva de la tabla.
- **Aceptado** — técnica 9 (bookings parcial) → línea en Capacidades.
- **Aceptado** — técnica 6, dominio 7: reserva anulada vuelta a reservar, `cancelar`, `libres` → decisión 9. «Volver a reservar» no se prueba: `reservar` solo crea la semanal y queda fuera.
- **Aceptado** — dominio 2: dueño → decisión 4.
- **Aceptado** — dominio 4: datos en memoria → decisión 8, Intent y 🦆 lo dicen.
- **Aceptado** — dominio 8: cifra de ficheros → corregida a 2 + la capacidad.
- **Aceptado** — dominio 9: texto `sin reserva` y `voidedBy` → decisiones 5 y 2.
- **Aceptado** — técnica 10: `--cada-semana` con `--como` → No entra (`reservar` no usa `--como`).
- **Rechazado** — dominio 1: renombrar `bookings`/`voidedBy` a castellano → el slug de capacidad es un nombre de fichero en inglés por la regla de la plantilla, y el código ya está en inglés (`cancelBooking`, `status`): decisión 11.
- **Rechazado** — dominio 10: quitar el nombre de `approvers` → es el dev-lead real del proyecto, ya estaba en el frontmatter que recibí.

Segunda ronda (un revisor, sin Críticos; no hay tercera):

- **Aceptado** — nº 2: posición de `--como` sin escenario → escenario nuevo «`--como` va en cualquier posición».
- **Aceptado** — nº 1: «ignora argumentos extra» sin escenario → promesa quitada de la decisión 7.
- **Aceptado** — nº 4: `cancelar`/`libres` sin escenario → decisión 9 lo dice («sin escenario: no cambian»).
- **Aceptado** — nº 5: anular frente a cancelar → decisión 4.
- **Aceptado** — nº 6: aviso de que la constancia se pierde → regla «Avisos» lo dice.
- **Aceptado** — nº 10: test débil de `voidedBy` → nota en «Dónde se prueba».
- **Aceptado** — nº 8 y 9: recuento de revisores y `PRODUCT.md` (no se toca: ya dice quién anula) → bloque y tabla.
- **Rechazado** — nº 3: partir los tres WHEN de rol inválido → son filas de una misma regla y cada WHEN es su propio test (nota en «Dónde se prueba»); `anular` sin sala o día queda como hoy, fuera de Scope.
- **Rechazado** — nº 7: quitar «Laura» → es el dev-lead real del proyecto y ya estaba en el frontmatter (el dato personal lo puso el proyecto, no la spec).

### Decisiones tomadas con el dev-lead

- Ninguna: no hubo entrevista; la spec parte del roadmap («solo el responsable de cada sala anula reservas de otras personas»).

## Intent

Hoy cualquiera anula cualquier reserva. El responsable de sala debe poder anular las de otros y el cliente no, y debe quedar constancia del rol que anuló. Éxito: `anular --como cliente` nunca cambia el estado de una reserva y `anuladas` muestra lo anulado con su rol. Límite asumido: el rol es declarado (decisión 3), y la constancia dura una ejecución (decisión 8). Fracaso aunque funcione: que `anular` sin `--como` siga anulando.

## Scope

- Entra: `anular` con `--como`; guardar `voidedBy`; comando `anuladas`; `src/app.js` y `test/anular.test.js`.
- No entra: `cancelar` (la cancelación es del propio cliente, `PRODUCT.md`), `reservar` (`--cada-semana` no se combina con `--como`) y `libres`, responsable por sala, autenticación real, dueño de la reserva, persistencia entre ejecuciones.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `anular <sala> <día>` sin `--como` deja de anular | `src/app.js:voidBooking`, `src/app.js:run` | delta («Anular exige decir el rol»), decisión 5 |
| Firma `voidBooking(room, day)` → `voidBooking(room, day, role)` | `src/app.js:voidBooking`; único llamador: `run` | Scope, decisión 5; sin tests de `anular` hoy (`test/` solo tiene `cancel` y `app`) |
| Términos «Anulación» y «Cancelación» | `PRODUCT.md:13-14` | sin cambio: ya dicen quién anula; `PRODUCT.md` no se toca |

- Filas que implementa: 0011 → `ROADMAP.md:8` (la nombra, sin «Toca») | comprobado con `git grep -n 0011 -- . ':!.docs/sdd/specs'`.

## Approach

- A: `--como` leído en `run`, como `--cada-semana` — no necesita nada nuevo, se prueba por `run`; el rol se puede mentir (no hay login).
- B: variable de entorno `SALAS_ROL` — oculta el rol en el entorno y cada llamada lo hereda sin verlo; es peor para probar y para el dev-lead que mira el comando.
- C: fichero de roles — modelo que hoy no hay y que no pide el roadmap.
- Elegido: A — es la costura que ya usa la app y la única que no añade estado.

`run` extrae `--como` y su valor de `params` antes de leer los posicionales; `voidBooking(room, day, role)` comprueba rol válido → permiso → existencia, guarda `voidedBy: role` en la reserva; `anuladas` filtra `status === 'voided'`, en orden de anulación, y escribe `voidedBy`.

## Dónde se prueba

- Anular y anuladas: por `run('anular', …)` y `run('anuladas', [])`, en `test/anular.test.js`, como `test/cancel.test.js`; cada WHEN de un escenario es su propio test. Límite conocido: como `voidedBy` solo puede valer `responsable`, el test de `anuladas` no distingue el dato guardado de un literal (decisión 2).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Anular una reserva siendo responsable

- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva queda anulada

#### ADDED — `--como` va en cualquier posición

- GIVEN la reserva activa de Norte del lun
- WHEN `anular --como responsable Norte lun`, o `anular Norte --como responsable lun`
- THEN responde `anulada Norte lun` y la reserva queda anulada

#### ADDED — El cliente no anula

- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como cliente`
- THEN responde `solo el responsable de sala puede anular` y la reserva sigue activa
- AND con Sur del mar sin reserva, `anular Sur mar --como cliente` responde lo mismo

#### ADDED — Anular exige decir el rol

- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun` sin `--como`
- THEN responde `indica --como <cliente|responsable>` y la reserva sigue activa

#### ADDED — Anular rechaza un rol que no existe

- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como invitado`, `anular Norte lun --como Responsable` o `anular Norte lun --como`
- THEN responde `indica --como <cliente|responsable>` y la reserva sigue activa

#### ADDED — Anular sin reserva lo dice

- GIVEN que no hay reserva activa de Sur el mar
- WHEN `anular Sur mar --como responsable`
- THEN responde `sin reserva Sur mar`

#### ADDED — Una anulada no se anula otra vez

- GIVEN Norte lun ya anulada con `--como responsable`
- WHEN `anular Norte lun --como responsable`
- THEN responde `sin reserva Norte lun`

#### ADDED — Listar las anuladas

- GIVEN Sur mar y después Norte lun anuladas con `--como responsable`
- WHEN `anuladas`
- THEN responde las dos líneas, en ese orden: `Sur mar — anulada por responsable` y `Norte lun — anulada por responsable`
- AND sin ninguna anulada responde `sin anuladas`

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: en memoria (`operations.md`), `voidedBy` en la reserva
- **Idioma de los nombres**: texto de la interfaz en castellano (constitution 4); identificadores de código en inglés
- **Límites**: no aplica
- **Avisos**: no aplica: `anuladas` no avisa de que la lista se pierde al terminar la ejecución
- **Regla ante conflicto**: se comprueba rol válido → permiso → existencia

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
