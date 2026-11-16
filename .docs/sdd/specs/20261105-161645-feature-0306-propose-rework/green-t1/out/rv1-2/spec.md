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
  - name: TBD
    approved_at: null
---

# Spec — Anular reservas de otros

🦆 Hoy cualquiera escribe `anular Norte lun` y la reserva de la sala Norte del lunes queda anulada. Con este cambio, `anular Norte lun --como responsable` la anula y `anular Norte lun --como cliente` responde `solo el responsable puede anular` y la deja activa; sin `--como`, o con cualquier otro valor, también se deniega. Además, un comando nuevo, `anuladas`, lista lo anulado y quién lo hizo: `Norte lun — anulada por responsable`. Por dentro, la reserva guarda quién la anuló.

Validación: dev-lead — es una herramienta que usa una persona: quiere ver las respuestas en la terminal.

## Capacidades

- Nuevas: `bookings` — anular una reserva según el rol y listar las anuladas con quién las anuló.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: capacidad nueva (`bookings`), reglas de permiso (quién puede anular), datos (quién anuló, orden), contrato público (salida de `anular` y comando nuevo `anuladas`) · tamaño: ~70 líneas en 3 ficheros
- Dominio (opus): si el cliente queda sin poder anular ni siquiera lo suyo y si `anuladas` enseña a cualquiera quién anuló (señal: permiso)
- Técnica (sonnet): si `--como` ausente o con valor raro puede dejar anular, y si el orden de comprobación (rol antes que existencia) es coherente con la salida actual (señal: contrato público + datos)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

### Hallazgos de la review

- **Aceptado** — valor raro de `--como` (`responsabel`, `RESPONSABLE`, `admin`) sin escenario → AND añadidos y decisión 3.
- **Aceptado** — `--como` sin valor sin escenario → AND añadido.
- **Aceptado (Crítico)** — qué pasa después de anular (anular otra vez, `cancelar`, `libres`, `reservar`) → escenarios «Una reserva anulada deja de estar activa» y decisión 6: nada de eso cambia, solo se fija.
- **Aceptado** — el texto «de sala» sugería responsable por sala → ahora `solo el responsable puede anular`.
- **Aceptado** — `--como` no es una autorización → «No entra» y Términos.
- **Aceptado** — faltaban las cinco reglas → sección «Reglas de la capacidad — bookings».
- **Aceptado** — de dónde sale el orden de `anuladas` → decisión 5 y Approach (orden de anulación) más escenario con dos anuladas.
- **Aceptado** — gramática de `--como` y argumentos sobrantes → decisión 7 y Approach.
- **Aceptado** — `anuladas --como cliente` → AND en el requisito.
- **Aceptado** — tests existentes de `anular` → ninguno (`grep` sobre `test/`); anotado en «Lo que se retira o cambia de forma».
- **Aceptado** — GIVEN de `anuladas` con el estado de partida → dicho con el comando que lo crea.
- **Rechazado** — reservas anuladas antes del cambio sin `voidedBy` → las reservas viven en memoria (`operations.md`): no hay datos previos. Reglas: «Dónde viven los datos».
- **Rechazado** — aviso con la pista de `--como` en la denegación → cambiaría el texto que el dev-lead va a validar y nadie lo pidió; reglas: avisos «no aplica».
- **Aceptado (2.ª ronda)** — requisitos partidos en escenarios con su GIVEN; `cancelar` y `libres` fuera del delta (no regresión en el plan); Intent corregido a «quien se declare responsable»; razón de «no aplica»; formas raras de `--como` con escenario; sala o día sin dar, en decisión 7; orden en lista global.
- **Rechazado (2.ª ronda)** — mover review, fusión y política fuera de ✋ → es la forma de la plantilla; `reservar` sobre una sala anulada → `reservar` solo responde un literal y no crea reservas, no entra.
- **Rechazado** — cómo se aíslan los tests entre sí → es del plan, no de la spec.

1. **La 0011 del roadmap dice «el responsable de cada sala»; lo he reducido a un rol global.** La app no tiene usuarios ni salas con responsable (`mission.md`: la usa una sola persona), así que el rol sale de `--como <cliente|responsable>` y vale para todas las salas. Si querías un responsable por sala, es otra feature.
2. **Las reservas no guardan de quién son**, así que «reservas de otros» no se puede distinguir de las propias: el responsable anula cualquiera y el cliente no anula ninguna, tampoco la suya (para eso sigue `cancelar`, que no cambia). Que `cancelar`, `libres` y `reservar` sigan igual tras anular se prueba como no regresión en el plan, no es requisito de `bookings`.
3. Solo anula `--como responsable`, escrito exactamente así. Sin `--como`, con `--como` sin valor, o con cualquier otro valor (`cliente`, `admin`, `Responsable`), se trata como cliente y se deniega. Es un cambio de lo de hoy: `anular Norte lun` a secas ya no anula.
4. El texto de la denegación es `solo el responsable puede anular`, y se comprueba antes de mirar si la reserva existe: un cliente sobre `Sur mar` (sin reserva) recibe la denegación, no `sin reserva Sur mar`.
5. `anuladas` es un comando nuevo, sin `--como`: lo puede ejecutar cualquiera (con o sin `--como`, responde igual) y enseña quién anuló. Formato `<sala> <día> — anulada por <rol>`, una reserva por línea, en el orden en que se anularon. Sin ninguna, responde `sin anuladas`.
6. Una reserva ya anulada se comporta como hoy: `anular`, `cancelar` y `libres` no la ven como activa (`sin reserva …`, y la sala sale libre). No lo cambio, solo lo dejo escrito.
7. Forma del comando: `anular <sala> <día> [--como <rol>]`, con `--como` detrás de sala y día. Otras formas (`--como=responsable`, `--como` antes de la sala) no cuentan como rol, así que se deniegan. Argumentos de más se ignoran. Con sala o día sin dar, la respuesta es la de hoy, pero el rol se comprueba antes (un cliente recibe la denegación).
8. `bookings` nace como capacidad con solo estos requisitos: `cancelar`, `libres` y `reservar` no se documentan aquí (no entran en el cambio).
9. El nombre `--como`, los valores `cliente` y `responsable` y el nombre `anuladas` los he puesto yo.
- Prueba de la fusión del delta (`sdd capability merge` sobre una copia de `.docs/sdd` en una carpeta temporal): seis requisitos añadidos a `bookings.md` (anular solo como responsable · el cliente no puede anular · anular una reserva que no existe · una reserva anulada deja de estar activa · listar las anuladas · listar sin anuladas), sin rechazos. La spec no cambia el `capabilities/` del repo.
- Política de modelos: revisores de la spec — dominio Opus, técnica Sonnet, en paralelo · revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar.

## Intent

Hoy cualquiera anula cualquier reserva con `anular <sala> <día>`. Se quiere que solo quien se declare responsable (`--como responsable`) pueda anular y que quede dicho quién anuló. Éxito: `anular Norte lun --como cliente` no cambia nada y `anular Norte lun --como responsable` anula y aparece en `anuladas` como `Norte lun — anulada por responsable`. Fracaso aunque «funcione»: que un cliente consiga anular con un `--como` ausente o mal escrito.

## Scope

- Entra: `anular` con `--como`; la reserva guarda quién la anuló y una lista global guarda el orden; comando `anuladas`.
- No entra: `cancelar`, `libres` y `reservar` (no cambian); usuarios o responsables por sala; saber de quién es cada reserva; autenticar el rol: `--como` lo escribe quien usa la herramienta, es un freno contra errores y no una autorización.
- Ficheros: `src/app.js` (`voidBooking` y `run`, más el listado de anuladas), `test/anular.test.js` (nuevo) y `.docs/sdd/capabilities/bookings.md` (lo crea el cierre).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `anular <sala> <día>` anula sin rol | `src/app.js:20-25` (`voidBooking`), `src/app.js:31` (`run`); ningún test lo llama hoy (`test/`) | delta, `ADDED` «Anular una reserva solo como responsable»; decisión 3 |
| Fila 0011: «el responsable de cada sala» | `.docs/sdd/roadmap.md:9` | decisión 1 (rol global) |

- Filas que implementa: 0011 → `.docs/sdd/roadmap.md` (la fila) y su destino en el cierre | comprobado con `grep -rniE "anular|anulad|voided" .` (solo `src/app.js`, `roadmap.md` y esta spec; ni README ni PRODUCT.md ni `capabilities/`, que no existe)

## Approach

- La reserva anulada guarda quién la anuló (`cliente` no puede anular, así que el valor guardado es `responsable`) y el orden en que se anuló, en una lista global de anuladas: `anuladas` la recorre en ese orden.
- El rol es `responsable` solo si `--como` va tras sala y día con ese valor exacto; en cualquier otro caso es `cliente`.

## Dónde se prueba

- Anular y listar anuladas: por `run('anular', …)` y `run('anuladas', …)`, en `test/anular.test.js`, como `test/cancel.test.js`.

## Términos y ADR

- Términos resueltos: rol — `cliente` o `responsable`, dicho con `--como`; no hay usuarios, y el rol no se autentica | ninguno más
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Anular una reserva solo como responsable

> `bookings` es una capacidad nueva: no hay requisito vigente que modificar, por eso va `ADDED`. El comportamiento de hoy (`anular` sin rol anula) se retira de hecho: queda dicho en «Lo que se retira o cambia de forma» y en la decisión 3.

- GIVEN la reserva activa de Norte el lun
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva queda anulada, guardando `responsable`
- AND con un argumento de más tras el valor (`anular Norte lun --como responsable extra`) anula igual

#### ADDED — El cliente no puede anular

- GIVEN la reserva activa de Norte el lun
- WHEN `anular Norte lun --como cliente`
- THEN responde `solo el responsable puede anular` y la reserva sigue activa
- AND lo mismo responde, y la reserva sigue activa, con cada una de estas formas: `anular Norte lun` (sin `--como`), `anular Norte lun --como` (sin valor), `--como responsabel`, `--como RESPONSABLE`, `--como admin`, `--como=responsable` y `anular --como responsable Norte lun` (`--como` antes de la sala)

#### ADDED — Anular una reserva que no existe

- GIVEN que Sur no tiene reserva el mar
- WHEN `anular Sur mar --como responsable`
- THEN responde `sin reserva Sur mar`
- AND con `anular Sur mar --como cliente` responde `solo el responsable puede anular` (el rol se comprueba antes que la reserva)

#### ADDED — Una reserva anulada deja de estar activa

- GIVEN la reserva de Norte el lun anulada con `anular Norte lun --como responsable`
- WHEN `anular Norte lun --como responsable`
- THEN responde `sin reserva Norte lun`

#### ADDED — Listar las reservas anuladas

- GIVEN las reservas activas de Norte el lun y de Sur el mar, y `anular Sur mar --como responsable` seguido de `anular Norte lun --como responsable`
- WHEN `anuladas`
- THEN responde dos líneas, en el orden en que se anularon: `Sur mar — anulada por responsable` y `Norte lun — anulada por responsable`
- AND `anuladas --como cliente` responde lo mismo

#### ADDED — Listar sin reservas anuladas

- GIVEN ninguna reserva anulada
- WHEN `anuladas`
- THEN responde `sin anuladas`

### Reglas de la capacidad — bookings

- **Dónde viven los datos**: en memoria, en la propia reserva (quién anuló) y en el orden de anulación; no hay datos persistidos previos.
- **Idioma de los nombres**: castellano (`anular`, `anuladas`, `--como`, `cliente`, `responsable`), como el punto 4 de la constitución.
- **Límites**: no aplica: una persona, en memoria, sin tope práctico.
- **Avisos**: no aplica: la denegación es la respuesta, no un aviso aparte.
- **Regla ante conflicto**: anular algo ya anulado responde `sin reserva <sala> <día>`.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
