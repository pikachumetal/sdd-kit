---
id: 20261109-162231-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar
mode: full
status: draft
created: 2026-11-09
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Motivo al cancelar

🦆 Hoy `cancelar Norte lun` cancela la reserva sin dejar constancia de por qué. Con este cambio hay que decir el motivo —`cancelar Norte lun "sala ocupada"`— y el programa solo acepta uno de tres: «cambio de planes», «sala ocupada» u «otro». Un comando nuevo, `canceladas`, lista las reservas canceladas con su motivo: `Norte lun 10:00-12:00 — sala ocupada`. Por dentro, la reserva guarda el motivo junto a su estado; no se persiste nada, porque las reservas viven en memoria.

Validación: dev-lead — es un comando que usa una persona y conviene verlo en la terminal.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo y listar las canceladas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — decidido por el dev-lead («Sin review»); no se despacha ningún revisor.

1. **Hoy no existe ningún listado de canceladas** (el programa solo tiene `libres`, `reservar --cada-semana`, `cancelar` y `anular`). Lo creo como comando nuevo, `canceladas`, sin argumentos. Es lo que más crece respecto a la fila del roadmap: dime si lo querías de otra forma.
2. **El motivo es el tercer argumento de `cancelar`**: `cancelar <sala> <día> <motivo>`, entre comillas si lleva espacios. Frente a un menú interactivo: el programa no lee entrada interactiva y se prueba por `run(cmd, params)`. Si querías el menú, es una enmienda.
3. **Motivos, literales y en minúscula**: `cambio de planes`, `sala ocupada`, `otro`. Comparación exacta, sin normalizar mayúsculas.
4. **El motivo es obligatorio.** Sin motivo, o con uno que no está en la lista, `cancelar` no cancela y responde: `motivo no válido: elige cambio de planes, sala ocupada u otro`. La reserva sigue activa.
5. **Orden de comprobaciones**: primero el motivo, después si hay reserva. Con motivo inválido y sin reserva responde el error del motivo.
6. **Respuesta de éxito**: `cancelada Norte lun (cambio de planes)`; cambia la actual `cancelada Norte lun`. La de falta de reserva no cambia: `sin reserva Sur mar`.
7. **Formato del listado**: una línea por reserva cancelada, `<sala> <día> <franja> — <motivo>`, en el orden de la lista interna de reservas (el de creación, no el de cancelación: no hay fecha de cancelación y nadie la pidió). Sin canceladas responde `sin canceladas`.
8. **Las anuladas no salen en `canceladas`** y `anular` no pide motivo: la anulación es del responsable de sala (`PRODUCT.md`) y es la fila 0011.
9. **Capacidad nueva `booking-cancellation`** (slug en inglés, contenido en castellano). Hoy ninguna capacidad recoge `cancelar`, así que todo el delta es `ADDED`; incluye el caso «sin reserva», que ya existe.
10. **Sin migración**: las reservas viven en memoria (`operations.md`), no hay canceladas anteriores sin motivo.
11. **Los dos tests existentes de `cancelar` cambian** (`test/cancel.test.js`): ahora pasan motivo y esperan la respuesta nueva.
12. **Enfoque**: A (tercer argumento validado contra una lista fija), frente a B (menú interactivo) y C (`--motivo=`); ver Approach.
- Política de modelos: revisores de la spec, ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
- Delta probado sobre una copia de `.docs/sdd` en una carpeta temporal: `capability merge` añade 4 requisitos y las 5 reglas de `booking-cancellation` sin errores, y `capability check` da «Capacidades válidas: 1»; el `capabilities/` del repo no cambia

### Decisiones tomadas con el dev-lead

- Al cancelar se elige un motivo de una lista: cambio de planes, sala ocupada, otro — «al cancelar una reserva se elige un motivo de una lista (cambio de planes, sala ocupada, otro)»
- El listado de canceladas enseña el motivo — «el listado de canceladas lo enseña»
- Sin review de la spec — «Sin review»

## Intent

Hoy cancelar una reserva no deja constancia de por qué. Se quiere que cada cancelación lleve un motivo de una lista cerrada (cambio de planes, sala ocupada, otro) y que se pueda ver después. Éxito: no se cancela sin motivo válido y `canceladas` muestra cada reserva cancelada con el suyo. Fracaso, aunque funcione: aceptar una cancelación sin motivo o con uno inventado, o que el listado muestre anuladas.

## Scope

- Entra: `cancelar` pide y valida el motivo y la reserva lo guarda; comando nuevo `canceladas` (ambos en `src/app.js`); tests: `test/cancel.test.js` actualizado y `test/canceladas.test.js` nuevo.
- No entra: texto libre para «otro»; motivo en `anular` (fila 0011); la regla de las 24 h de `PRODUCT.md`, que el código no aplica hoy; fecha de cancelación; persistencia entre ejecuciones; menú interactivo; `README.md`, que no documenta comandos.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Respuesta `cancelada <sala> <día>` | `src/app.js:17`, `test/cancel.test.js:6` | Decisión 6; test actualizado en la Task 1 |
| `cancelar` con dos argumentos funciona | `src/app.js:30`, `test/cancel.test.js:6,10` | Decisión 4 (el motivo es obligatorio); tests actualizados |
| `cancelBooking(room, day)` | `src/app.js:13,30` | Pasa a `cancelBooking(room, day, reason)`; sin otros usos: comprobado con `git grep cancelBooking` |

- Filas que implementa: 0010 → `.docs/sdd/roadmap.md:7`, que se actualiza al cerrar (`sdd-archive`) | ningún otro fichero la nombra: comprobado con `git grep -n 0010 -- . ':!.docs/sdd/specs'`.

## Approach

- A. Tercer argumento de `cancelar`, validado contra una lista fija en `src/app.js` — es como el programa ya recibe sala y día; se prueba con `run('cancelar', [...])`; cuesta que un motivo con espacios exija comillas.
- B. Menú interactivo que pregunta el motivo — es lo más literal de «se elige de una lista», pero necesita leer la entrada estándar y otro mecanismo de pruebas; el programa hoy no lee nada.
- C. Opción `--motivo=<…>` — como `--cada-semana`, pero aquí el motivo es obligatorio y una opción obligatoria no aporta sobre A.
- Elegido: A — la más pequeña y la que se prueba por la costura existente (`run`).

Partes del cómo: una constante con los tres motivos; `cancelBooking` valida el motivo antes de buscar la reserva y guarda `reason` en ella; `canceladas` filtra por estado `cancelled` (no `voided`) y formatea.

## Dónde se prueba

- Cancelar con motivo, sin motivo, con motivo inválido y sin reserva: por `run('cancelar', …)`, como el `test/cancel.test.js` actual.
- Listado de canceladas: por `run('canceladas', [])`, mismo patrón, en `test/canceladas.test.js`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar una reserva con motivo

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun "sala ocupada"`
- THEN responde `cancelada Norte lun (sala ocupada)` y la reserva deja de estar activa

#### ADDED — El motivo de cancelación es obligatorio y de la lista

- GIVEN reserva activa Norte lun
- WHEN `cancelar Norte lun` (sin motivo) o `cancelar Norte lun "me aburro"`
- THEN responde `motivo no válido: elige cambio de planes, sala ocupada u otro` y la reserva sigue activa

#### ADDED — Cancelar sin reserva

- GIVEN sin reserva Sur mar
- WHEN `cancelar Sur mar "otro"`
- THEN responde `sin reserva Sur mar`

#### ADDED — Listar las reservas canceladas

- GIVEN Norte lun 10:00-12:00 cancelada por «sala ocupada»
- WHEN `canceladas`
- THEN responde la línea `Norte lun 10:00-12:00 — sala ocupada`
- GIVEN ninguna reserva cancelada
- WHEN `canceladas`
- THEN responde `sin canceladas`
- GIVEN Norte lun anulada por el responsable de sala
- WHEN `canceladas`
- THEN no sale en la respuesta

#### Reglas de la capacidad — booking-cancellation

- **Dónde viven los datos**: en memoria, junto a la reserva; no se guardan entre ejecuciones
- **Idioma de los nombres**: castellano en los motivos y los mensajes
- **Límites**: solo tres motivos: cambio de planes, sala ocupada, otro; sin texto libre
- **Avisos**: `motivo no válido: elige cambio de planes, sala ocupada u otro` cuando falta el motivo o no está en la lista
- **Regla ante conflicto**: no aplica

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
