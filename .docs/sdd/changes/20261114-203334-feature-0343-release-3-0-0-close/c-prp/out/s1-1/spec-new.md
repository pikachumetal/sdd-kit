---
id: 20261115-190805-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar
mode: full
profile: delegate
status: draft
created: 2026-11-15
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Motivo al cancelar

🦆 Al cancelar una reserva hay que decir por qué, eligiendo una de tres opciones: cambio de planes, sala ocupada u otro. Por ejemplo, `cancelar Norte lun sala-ocupada` cancela la reserva de Norte del lunes con ese motivo; sin motivo, o con uno que no está en la lista, no cancela y avisa de las tres opciones. Un comando nuevo, `canceladas`, enseña cada reserva cancelada con su motivo: `Norte lun 10:00-12:00 · sala ocupada`. Las anulaciones del responsable de sala no cambian ni salen en ese listado. El motivo se guarda junto a la reserva, en memoria como todo lo demás.

Validación: dev-lead — cambia lo que ve y puede hacer quien cancela y quien lista las canceladas.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo de una lista y listar las canceladas con su motivo.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Revisión de la spec: ninguna, por orden del dev-lead («Sin review»). Queda sin cubrir lo que habría mirado un revisor externo: huecos y contradicciones que mi repaso de coherencia no vea.

1. **Los motivos y sus claves**: `cambio-de-planes` («cambio de planes»), `sala-ocupada` («sala ocupada»), `otro` («otro»). El dev-lead dio los tres nombres; las claves en kebab-case y el texto del listado los pongo yo.
2. **El motivo va como tercer argumento**: `cancelar <sala> <día> <motivo>`. Dos argumentos pasan a ser tres.
3. **El motivo es obligatorio.** El dev-lead dijo «se elige un motivo»; lo leo como que no se cancela sin él. Sin motivo: `falta el motivo: elige cambio-de-planes, sala-ocupada u otro`.
4. **Motivo fuera de la lista**: `motivo no válido «<lo escrito>»: elige cambio-de-planes, sala-ocupada u otro`. No cancela.
5. **El motivo se comprueba antes de buscar la reserva.** Con `cancelar Sur mar` (sin reserva y sin motivo) sale el aviso del motivo, no «sin reserva».
6. **Lo que dice `cancelar` al cancelar no cambia**: `cancelada Norte lun`, sin repetir el motivo.
7. **El listado es un comando nuevo, `canceladas`**, porque hoy no hay ningún listado de reservas. Una línea por reserva cancelada: `<sala> <día> <franja> · <motivo en texto>`, en el orden en que se cancelaron. Sin ninguna: `sin canceladas`.
8. **`anular` no cambia y las anuladas no salen en `canceladas`.** `PRODUCT.md` separa cancelación (el cliente) de anulación (el responsable); el dev-lead habló solo de cancelar.
9. **«Otro» sin texto libre.** La lista es cerrada; no se pide ni se guarda explicación.
10. **Capacidad nueva `booking-cancellation`** (inglés, kebab-case). El proyecto no tiene `capabilities/`; la crea esta spec al cerrarse, con solo lo que añade. La cancelación sin motivo que existe hoy no está documentada en ninguna capacidad, por eso todo va como `ADDED`.
11. **Enfoque**: A, guardar `reason` en la propia reserva, frente a B y C (ver Approach).
12. **Los dos tests actuales de `cancelar` cambian** (pasan de dos a tres argumentos). No es una enmienda: es la consecuencia de la decisión 2.
13. **Orden del listado**: el de cancelación, no el de la lista de reservas.
- Política de modelos: sin revisores de la spec · ejes de la revisión final según el plan · sin otros despachos en paralelo.
- Repaso de coherencia: `git grep` de `cancel`, `motivo` y `0010` fuera de `specs/`; ver «Lo que se retira…». Delta en copia: ver la nota al final de «Delta de comportamiento».

### Decisiones tomadas con el dev-lead

- Al cancelar se elige un motivo de una lista (cambio de planes, sala ocupada, otro) y el listado de canceladas lo enseña — «al cancelar una reserva se elige un motivo de una lista (cambio de planes, sala ocupada, otro) y el listado de canceladas lo enseña»
- Sin review de la spec — «Sin review»

## Intent

Hoy `cancelar` anula la reserva y no deja rastro del porqué; quien mira las canceladas no sabe si fue un cambio de planes o un problema con la sala. Se quiere que cada cancelación diga por qué, con una lista corta para que sea un gesto y los motivos se puedan contar. Éxito: toda reserva cancelada desde esta versión sale en `canceladas` con uno de los tres motivos, y ninguna se cancela sin él. Fracasaría, aunque funcionara, si `cancelar` no avisara de qué falta cuando se usa como antes, o si `canceladas` mezclara las anuladas.

## Scope

- Entra: motivo obligatorio y cerrado en `cancelar`; comando `canceladas`; guardar el motivo en la reserva.
- No entra: `anular` (queda igual, sin motivo y fuera del listado); texto libre en «otro»; listar reservas activas o anuladas; persistencia fuera de la memoria; cambiar el mensaje de confirmación de `cancelar`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` pasa a `cancelar <sala> <día> <motivo>` | `src/app.js:13` (`cancelBooking`), `src/app.js:30` (`run`) | Scope y decisión 2 |
| Test «cancelar una reserva activa» | `test/cancel.test.js:5` | decisión 12: pasa a tres argumentos |
| Test «cancelar sin reserva lo dice» | `test/cancel.test.js:9` | decisiones 5 y 12: pasa a tres argumentos con motivo válido |
| «Cancelar una reserva propia» (0.3.0) | `CHANGELOG.md:20` | histórico de una release cerrada: no se toca; la entrada nueva la escribe el corte de la release |

- Filas que implementa: 0010 → `ROADMAP.md:7` (su estado lo mueve el cierre). Nadie más nombra la 0010: comprobado con `git grep -n "0010"` fuera de `specs/` (solo `ROADMAP.md`).

## Approach

- A. **`reason` dentro de la reserva** y `canceladas` filtra por estado cancelado — un campo más y una función; el listado sale de los mismos datos, sin segunda fuente que mantener.
- B. **Registro aparte de cancelaciones** (una lista con sala, día, franja y motivo) — duplica datos de la reserva y obliga a mantener dos sitios al cancelar.
- C. **Un estado por motivo** (`cancelled-plans`, `cancelled-room`…) — mezcla el estado con el porqué y rompe las comparaciones con `'cancelled'` que ya hay.
- Elegido: A — es el cambio mínimo y coherente con una app que guarda todo en `bookings`; B y C añaden estructura que nadie pidió.

Lo que fija A: la lista de motivos es una constante (clave → texto) en `src/app.js`; `cancelBooking(room, day, reasonKey)` valida el motivo, busca la reserva y guarda `reason` con la clave; `canceladas` devuelve las líneas en el orden de cancelación (se guarda un número de orden al cancelar). `anular` no cambia.

## Dónde se prueba

- Cancelar con motivo, sin motivo y con motivo no válido: por `run('cancelar', …)`, como `test/cancel.test.js`.
- Listado de canceladas (con datos, vacío, sin anuladas): por `run('canceladas', [])`, en `test/cancel.test.js`. El estado vive en memoria compartida entre los tests del fichero: cada test usa sus propias salas y días o prepara su estado.
- «Sin reserva» con motivo válido: el test actual, con tres argumentos.

## Términos y ADR

- Términos resueltos: **motivo** — la razón de una cancelación, una de tres de una lista cerrada. Se dice «cancelación» y «anulación», nunca «baja» (`PRODUCT.md`).
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar una reserva con motivo

- GIVEN una reserva activa en Norte el lunes
- WHEN el cliente cancela con `cancelar Norte lun sala-ocupada`
- THEN responde `cancelada Norte lun` y la reserva queda cancelada con el motivo «sala ocupada»
- AND con `cambio-de-planes` el motivo guardado es «cambio de planes», y con `otro`, «otro»

#### ADDED — El motivo es obligatorio y de la lista

- GIVEN una reserva activa en Norte el lunes
- WHEN el cliente cancela con `cancelar Norte lun` (sin motivo)
- THEN responde `falta el motivo: elige cambio-de-planes, sala-ocupada u otro` y la reserva sigue activa
- AND con `cancelar Norte lun vacaciones` responde `motivo no válido «vacaciones»: elige cambio-de-planes, sala-ocupada u otro` y la reserva sigue activa
- AND con `cancelar Sur mar` (sin reserva y sin motivo) responde el aviso de motivo, no `sin reserva Sur mar`

#### ADDED — Cancelar una reserva que no existe

- GIVEN no hay reserva activa en Sur el martes
- WHEN el cliente cancela con `cancelar Sur mar otro`
- THEN responde `sin reserva Sur mar` y no guarda ninguna cancelación

#### ADDED — Listar las canceladas con su motivo

- GIVEN canceladas Norte lun (10:00-12:00) por `sala-ocupada` y, después, Sur mar (14:00-16:00) por `cambio-de-planes`
- WHEN el cliente ejecuta `canceladas`
- THEN responde dos líneas, en ese orden: `Norte lun 10:00-12:00 · sala ocupada` y `Sur mar 14:00-16:00 · cambio de planes`
- AND con ninguna reserva cancelada responde `sin canceladas`
- AND una reserva anulada por el responsable (`anular`) no sale en el listado

#### Reglas de la capacidad — booking-cancellation

- **Dónde viven los datos**: en memoria, junto a la reserva, como el resto de reservas.
- **Idioma de los nombres**: claves de motivo en castellano y kebab-case (`cambio-de-planes`, `sala-ocupada`, `otro`); mensajes en castellano.
- **Límites**: tres motivos, lista cerrada; sin texto libre.
- **Avisos**: `falta el motivo: elige cambio-de-planes, sala-ocupada u otro` · `motivo no válido «<motivo>»: elige cambio-de-planes, sala-ocupada u otro` · `sin canceladas`.
- **Regla ante conflicto**: el aviso de motivo gana al de «sin reserva».

Delta probado en una copia de `.docs/sdd` con `sdd capability merge`: 4 requisitos y 5 reglas añadidos a `booking-cancellation.md`, sin rechazos; el `capabilities/` del repo no cambia.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
