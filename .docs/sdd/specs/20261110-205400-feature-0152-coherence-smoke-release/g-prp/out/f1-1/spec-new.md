---
id: 20261112-151905-feature-0010-motivo-cancelar
feature: 0010
title: Motivo al cancelar una reserva
mode: full
status: approved
created: 2026-11-12
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-12
---

# Spec — Motivo al cancelar una reserva

🦆 Al cancelar una reserva ahora hay que decir por qué, eligiendo de una lista: `node src/app.js cancelar Norte lun sala-ocupada` responde `cancelada Norte lun (sala ocupada)`. Sin motivo, o con uno fuera de la lista, no cancela y dice cuáles valen. Un comando nuevo, `canceladas`, lista las reservas canceladas con su motivo: `Norte lun 10:00-12:00 · sala ocupada`. Por dentro, la reserva guarda el motivo junto a su estado `cancelled`.

Validación: dev-lead — es un comando que usa una persona y lo que responde se ve en la terminal.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo y listar las canceladas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva · tamaño: ~40 líneas en 2 ficheros (`src/app.js` y tests), sin contrato público consumido por otro sistema ni `MODIFIED`
- Único (sonnet): si los textos de error y la salida de `canceladas` tienen un escenario con datos y si falta alguna decisión aquí (señal: capacidad nueva)
- Mínimo razonable: este mismo — deja sin cubrir la segunda lente de dominio (reglas de negocio de roles), que aquí no existen

1. Nueva capacidad `booking-cancellation`, slug en inglés kebab-case; el delta solo declara lo que esta feature añade (la cancelación vigente no está documentada en ninguna capacidad).
2. El motivo es **obligatorio**: sin él no se cancela. El roadmap dice «se elige un motivo», y uno opcional dejaría canceladas sin dato en el listado.
3. Sintaxis: `cancelar <sala> <día> <motivo>`, con el motivo como clave sin espacios: `cambio-de-planes`, `sala-ocupada`, `otro`. Se muestra con espacios: «cambio de planes», «sala ocupada», «otro».
4. Textos: sin motivo → `indica un motivo: cambio-de-planes, sala-ocupada, otro`; motivo desconocido `xyz` → `motivo no válido: xyz; usa cambio-de-planes, sala-ocupada, otro`; éxito → `cancelada Norte lun (sala ocupada)`.
5. El motivo se valida antes de buscar la reserva: con motivo inválido no se informa de si la reserva existe.
6. Comando nuevo `canceladas` (el roadmap habla del «listado de canceladas» y hoy no existe): una línea por cancelada, `<sala> <día> <franja> · <motivo>`, en el orden de la lista de reservas; sin ninguna, `sin canceladas`. Solo cancelaciones: las anuladas (`anular`) no salen ni piden motivo.
7. Enfoque: A, frente a B (ver Approach).
8. `canceladas` sale por el orden de la lista de reservas (el de inserción), no el cronológico de cancelación: no se guarda cuándo se canceló.
9. Cambio incompatible: `cancelar <sala> <día>` sin motivo deja de funcionar y no hay modo de compatibilidad (la herramienta la usa solo su autor).
10. Un motivo con espacios o un argumento de más cuenta como motivo no válido: se toma solo el tercer argumento como motivo y los demás se ignoran. Sin plazo de 24 h ni control de «ya cancelada» en esta feature: hoy `cancelar` no los tiene y siguen fuera (una reserva ya cancelada responde `sin reserva …`).
11. Delta probado sobre una copia de `.docs/sdd` con `sdd capability merge`: añade 4 requisitos y 5 reglas a `booking-cancellation`, sin rechazos.
- Política de modelos: revisor de la spec: uno, sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

- **Aceptado** — validar el motivo antes que la reserva no tenía escenario → escenario nuevo «Motivo inválido antes que reserva inexistente».
- **Aceptado** — el orden del listado solo se probaba con una reserva → el escenario del listado lleva dos canceladas, una activa y los motivos `otro` y `sala-ocupada`.
- **Aceptado** — `status: approved` antes de los hallazgos → el estado se fija al cerrar la review; la parada tras la Task 1 va en decisiones del dev-lead, no en la aprobación.
- **Aceptado** — el orden de inserción era una decisión oculta → decisión 8.
- **Aceptado** — plazo de 24 h y cancelar dos veces sin tratar → decisión 10 (fuera de alcance, hoy no existen).
- **Aceptado** — «el mar» ambiguo → «Sur mar» como en el WHEN.
- **Aceptado** — nombres en inglés frente a «Idioma de los nombres» → la regla cubre solo mensajes y claves de motivo.
- **Aceptado** — motivo con espacios y límite de la lista → decisión 10 y «Límites» declara la lista cerrada de tres.
- **Aceptado** — cambio incompatible solo en la tabla → decisión 9.
- **Aceptado** — canceladas anteriores sin `reason` → línea en Scope: sin persistencia no hay datos previos que migrar.

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación — «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.»
- Motivos de la lista: cambio de planes, sala ocupada, otro — «de una lista: cambio de planes, sala ocupada, otro»
- Parar tras el commit de la Task 1 — «cuando tengas el commit de la Task 1, para»

## Intent

Hoy `cancelar` anula la reserva sin dejar rastro de por qué y no hay forma de ver las canceladas. Con el motivo guardado y un listado, se sabe por qué se liberan las salas. Éxito: toda cancelada lleva uno de los tres motivos y `canceladas` los enseña. Fracaso: que quede una cancelada sin motivo o que una anulada aparezca en el listado.

## Scope

- Entra: motivo obligatorio en `cancelar`, validado contra la lista; guardado en la reserva; comando `canceladas`; actualizar los tests de `cancelar` a la nueva sintaxis.
- No entra: migración de datos (sin persistencia no hay canceladas previas sin motivo); pedir motivo en `anular`; motivos libres; filtrar o ordenar `canceladas`; persistencia (las reservas viven en memoria).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Sintaxis `cancelar <sala> <día>` (ahora exige motivo) y salida `cancelada Norte lun` | `src/app.js:13-18,30`; `test/cancel.test.js:6,10`; `CHANGELOG.md:20` (histórico) | Scope y decisiones 2–4: los dos tests se actualizan; el CHANGELOG histórico no se toca, lo escribe el corte de la release |
| Términos «Cancelación» / «Anulación» | `PRODUCT.md:13-14` | Sin cambio: el motivo solo aplica a la cancelación |

- Filas que implementa: 0010 → `ROADMAP.md:7` (la propia fila, la cierra el archivo) · nada más la nombra: comprobado con `git grep -n 0010`

## Approach

- A: un campo `reason` en la reserva, junto a `status: 'cancelled'`, y `canceladas` filtra las reservas por estado — cuesta un campo y una función; reutiliza el modelo actual.
- B: un registro aparte de cancelaciones — cuesta mantener dos listas sincronizadas con las reservas; sin ventaja con datos en memoria.
- Elegido: A, porque el estado y el motivo viven en el mismo dato y no hay nada que sincronizar.

Los motivos son una constante en `src/app.js` (clave → texto mostrado). `cancelBooking(room, day, reason)` valida el motivo y luego busca la reserva. `listCancelled()` recorre las reservas en su orden de la lista (el de inserción); el orden exacto de cancelación no se guarda y se acepta.

## Dónde se prueba

- cancelar con motivo, sin motivo, con motivo inválido, sin reserva: por `run('cancelar', …)`, como `test/cancel.test.js` actual.
- listado `canceladas`: por `run('canceladas', [])`, en el mismo fichero de test.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar una reserva con motivo

- GIVEN la reserva activa Norte lun 10:00-12:00
- WHEN se ejecuta `cancelar Norte lun sala-ocupada`
- THEN responde `cancelada Norte lun (sala ocupada)` y la reserva queda cancelada con ese motivo

#### ADDED — El motivo es obligatorio y de la lista

- GIVEN la reserva activa Norte lun 10:00-12:00
- WHEN se ejecuta `cancelar Norte lun`
- THEN responde `indica un motivo: cambio-de-planes, sala-ocupada, otro` y la reserva sigue activa
- AND con `cancelar Norte lun xyz` responde `motivo no válido: xyz; usa cambio-de-planes, sala-ocupada, otro` y la reserva sigue activa

#### ADDED — Cancelar una reserva que no existe

- GIVEN que no hay reserva activa de Sur mar
- WHEN se ejecuta `cancelar Sur mar otro`
- THEN responde `sin reserva Sur mar`

#### ADDED — Motivo inválido antes que reserva inexistente

- GIVEN que no hay reserva activa de Sur mar
- WHEN se ejecuta `cancelar Sur mar xyz`
- THEN responde `motivo no válido: xyz; usa cambio-de-planes, sala-ocupada, otro`

#### ADDED — Listado de canceladas

- GIVEN las reservas Norte lun 10:00-12:00 y Sur mar 09:00-10:00 canceladas por `sala-ocupada` y `otro`, y Norte mié 14:00-15:00 activa
- WHEN se ejecuta `canceladas`
- THEN responde dos líneas, `Norte lun 10:00-12:00 · sala ocupada` y `Sur mar 09:00-10:00 · otro`, en ese orden, sin la activa
- AND sin ninguna cancelada responde `sin canceladas`
- AND una reserva anulada con `anular Norte lun` no aparece

#### Reglas de la capacidad — booking-cancellation

- **Dónde viven los datos**: en memoria, en la propia reserva (`reason`)
- **Idioma de los nombres**: castellano en los mensajes; claves de motivo en minúsculas con guiones
- **Límites**: lista cerrada de tres motivos: `cambio-de-planes`, `sala-ocupada`, `otro`
- **Avisos**: motivo ausente o fuera de la lista: `indica un motivo: …` o `motivo no válido: …`, con la lista de claves
- **Regla ante conflicto**: no aplica

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-12 | aprobada por delegación: «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» |
