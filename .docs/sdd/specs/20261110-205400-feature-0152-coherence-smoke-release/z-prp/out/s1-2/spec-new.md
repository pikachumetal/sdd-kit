---
id: 20261112-162228-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar
mode: full
profile: delegate
status: draft
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Motivo al cancelar

🦆 Hoy `cancelar Norte lun` cancela la reserva sin más. Con el cambio hay que decir por qué: `cancelar Norte lun sala-ocupada`; si falta el motivo o no es de la lista, avisa y la reserva sigue activa. Un comando nuevo, `canceladas`, enseña cada reserva cancelada con su motivo: `Norte lun 10:00-12:00 · sala ocupada`. Las que anula el responsable de sala no salen ahí. Por dentro, la reserva guarda el motivo al cancelarse y el listado filtra las canceladas.

Validación: dev-lead — es una herramienta que usa una persona desde la terminal; quiere ver los textos y el listado con sus ojos.

## Capacidades

- Nuevas: `cancellations` — cancelar una reserva con motivo y listar las canceladas.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Revisión de la spec: ninguna, por petición del dev-lead (ver abajo). Lo que no cubre una review: los literales de abajo y el nombre del comando nuevo los fijo yo sin segunda lectura.

1. Enfoque: motivo como tercer argumento de `cancelar`, frente a un flag `--motivo` o una pregunta interactiva (ver Approach).
2. Motivos válidos, escritos en la terminal: `cambio-de-planes`, `sala-ocupada`, `otro`. Van con guiones para no partir el argumento; la lista del dev-lead no fijó la forma.
3. El motivo es obligatorio: sin él no se cancela. «Se elige un motivo de una lista» no dice si puede omitirse; elijo que no, para que el listado nunca tenga huecos.
4. Texto de error, sin motivo o con uno fuera de la lista: `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`. La reserva sigue activa.
5. Orden de comprobación: primero el motivo, luego si hay reserva. Con motivo inválido y sin reserva sale el error del motivo.
6. Nombre del comando nuevo: `canceladas`, sin argumentos.
7. Línea del listado: `<sala> <día> <franja> · <motivo con espacios>`, una por reserva, en el orden en que se hicieron las reservas. Ejemplo: `Norte lun 10:00-12:00 · sala ocupada`. El motivo se enseña con espacios y sin guiones, como texto para leer.
8. Sin canceladas, el listado dice: `sin canceladas`.
9. Solo entran en el listado las canceladas por el cliente; las anuladas (`anular`) quedan fuera, porque en `PRODUCT.md` son otro concepto (Anulación) y no llevan motivo en esta feature.
10. El éxito de `cancelar` no cambia: `cancelada Norte lun`; el motivo solo se ve en el listado.
11. Capacidad nueva: `cancellations`, en inglés y kebab-case por ser nombre de fichero.
12. Los dos tests actuales de `cancelar` (`test/cancel.test.js`) se reescriben con motivo: ya no describen el comportamiento vigente.
- Política de modelos: revisores de la spec, ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
- Delta probado en una copia de `.docs/sdd` fuera del repo: `sdd capability merge` sin errores: `cancellations.md` creada con 5 requisitos añadidos y 3 reglas (Límites, Avisos, Dónde viven los datos); el `capabilities/` del repo no cambia.

### Decisiones tomadas con el dev-lead

- Al cancelar se elige un motivo de una lista: cambio de planes, sala ocupada, otro — «al cancelar una reserva se elige un motivo de una lista (cambio de planes, sala ocupada, otro)»
- El listado de canceladas enseña el motivo — «y el listado de canceladas lo enseña»
- Sin review de la spec — «Sin review.»

## Intent

Hoy `cancelar` anula una reserva sin dejar rastro de por qué, y no existe forma de ver las canceladas. Con el motivo, quien lleva la sala sabe qué pasa con las reservas que se caen (planes que cambian, sala ocupada). Éxito: toda reserva cancelada aparece en `canceladas` con uno de los tres motivos. Fracaso aunque funcione: que una cancelación quede sin motivo, o que una reserva siga activa tras un motivo rechazado.

## Scope

- Entra: `cancelar <sala> <día> <motivo>` con validación del motivo; guardar el motivo en la reserva; comando `canceladas`; tests de ambos.
- No entra: motivo en `anular`; texto libre en «otro»; filtrar o ordenar el listado; la regla de las 24 h de `PRODUCT.md`; cambiar el texto de éxito de `cancelar`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js:13-18` (`cancelBooking`), `src/app.js:30` (despacho) | Scope y decisiones 3-5: ahora exige motivo |
| Tests de `cancelar` sin motivo | `test/cancel.test.js:5-7`, `test/cancel.test.js:9-11` | decisión 12: se reescriben con motivo |

- Filas que implementa: 0010 → `ROADMAP.md:7` (la fila 0010; el cierre la marca) | comprobado con `git grep -n "0010"`: solo esa fila y esta spec.
- Sin más sitios: `git grep -n cancel` fuera de `.docs/sdd/specs/` da `src/app.js`, `test/cancel.test.js`, `ROADMAP.md` y `CHANGELOG.md:14` (histórico del patch 0007, no cambia). `README.md` no nombra `cancelar`.

## Approach

- A. Tercer argumento posicional: `cancelar Norte lun sala-ocupada` — encaja con cómo se pasan ya sala y día en `run`; cuesta que el motivo es obligatorio y de orden fijo.
- B. Flag `--motivo sala-ocupada` — más explícito, pero la CLI no tiene parser de flags (solo `--cada-semana` se busca con `includes`); habría que añadir uno para un valor.
- C. Pregunta interactiva — no encaja: `run(cmd, params)` es síncrono y se prueba sin terminal.
- Elegido: A — es lo mínimo con lo que ya hay y se prueba por `run` como los tests actuales.

Cómo: `cancelBooking(room, day, reason)` valida `reason` contra la lista antes de buscar la reserva; si es válido y hay reserva, pone `status = 'cancelled'` y guarda `reason`. `run('canceladas')` filtra `bookings` por `status === 'cancelled'` y formatea cada una.

## Dónde se prueba

- Cancelar con motivo, motivo inválido o ausente, sin reserva: por `run('cancelar', …)`, como `test/cancel.test.js`.
- Listado `canceladas`, con y sin canceladas, y que una anulada no sale: por `run('canceladas', [])` en el mismo fichero.

## Términos y ADR

- Términos resueltos: Cancelación (la del cliente) y Anulación (la del responsable) siguen separadas; solo la cancelación lleva motivo.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `cancellations`

#### ADDED — Cancelar con motivo

- GIVEN la reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun sala-ocupada`
- THEN responde `cancelada Norte lun`
- AND la reserva deja de estar activa y guarda el motivo `sala-ocupada`

#### ADDED — Motivo obligatorio y de la lista

- GIVEN la reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun` o `cancelar Norte lun porque-si`
- THEN responde `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`
- AND la reserva sigue activa

#### ADDED — Cancelar lo que no existe

- GIVEN no hay reserva activa Sur mar
- WHEN `cancelar Sur mar otro`
- THEN responde `sin reserva Sur mar`

#### ADDED — Listado de canceladas

- GIVEN Norte lun 10:00-12:00 cancelada con `sala-ocupada` y Sur mar 14:00-15:00 cancelada con `cambio-de-planes`
- WHEN `canceladas`
- THEN responde dos líneas, `Norte lun 10:00-12:00 · sala ocupada` y `Sur mar 14:00-15:00 · cambio de planes`, en orden de reserva
- AND una reserva anulada con `anular` no sale

#### ADDED — Listado vacío

- GIVEN ninguna reserva cancelada
- WHEN `canceladas`
- THEN responde `sin canceladas`

#### Reglas de la capacidad — cancellations

- **Límites**: motivos válidos `cambio-de-planes`, `sala-ocupada`, `otro`; sin texto libre.
- **Avisos**: `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`; `sin canceladas`.
- **Dónde viven los datos**: en memoria, con la reserva.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
