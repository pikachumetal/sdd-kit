---
id: 20261018-103500-feature-0012-retire-void
feature: 0012
title: Retirar el comando anular
mode: full
profile: delegate
status: draft
created: 2026-10-18
author: <git-user>
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Retirar el comando anular

🦆 El comando `anular` desaparece de `salas`: `salas anular Norte lun` deja de anular la reserva y responde como cualquier comando desconocido (`salas`), con la reserva de Norte del lunes intacta. Cancelar sigue igual (`cancelar Norte lun` → `cancelada Norte lun`) y su requisito pasa a llamarse «Cancelar una reserva». Se quita el comando del código y se actualizan la capacidad, la guía, el README y la terminología.

> **Estado**: draft
> **Siguiente paso**: `plan.md`, siguiendo `plan-writing.md` de `sdd-propose`.

## Capacidades

- Modificadas: `bookings` — se retira el requisito «Anular una reserva» y «Cancelar una reserva propia» pasa a «Cancelar una reserva».

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: `MODIFIED` / `REMOVED` (un requisito retirado y uno renombrado) · tamaño: ~25 líneas en 5 ficheros
- Mínimo razonable: ninguna — deja sin mirar si la 0011 (dar `anular` al responsable de sala) queda bien descrita tras esta retirada; eso se ve en el roadmap, no en esta spec.

1. Tras retirar `anular`, `salas anular Norte lun` responde `salas`, la respuesta genérica de cualquier comando desconocido; no añado un mensaje propio de «comando retirado».
2. El renombrado del requisito va como `REMOVED «Cancelar una reserva propia»` + `ADDED «Cancelar una reserva»` con el mismo cuerpo: la clave de fusión es el título y no hay `RENAMED`. El comportamiento de `cancelar` no cambia.
3. En `docs/guia.md` la línea de `cancelar` pasa de «cancela tu reserva» a «cancela una reserva», coherente con el nuevo título.
4. En `PRODUCT.md` se retira el término **Anulación** (el comando que lo usaba desaparece); **Cancelación** se queda tal cual.
5. El Propósito de `bookings` pasa de «Reservar, cancelar y anular salas desde la línea de comandos.» a «Reservar y cancelar salas desde la línea de comandos.» El merge no toca el Propósito: se edita a mano al implementar.
6. En `README.md` la línea pasa de «Comandos: `cancelar` y `anular`; …» a «Comando: `cancelar`; …».
7. En el código se borran `voidBooking`, el estado `voided` y la rama `anular` de `run`; no hay datos que migrar (las reservas viven en memoria). Se añade una prueba de que `anular` ya no anula.
8. Las entradas ya cerradas (`changelog.md` v0.3.0 «Cancelar una reserva propia», «Releases cerradas» del roadmap) son historia y no se tocan.
9. La fila 0012 del roadmap la mueve el cierre (`sdd-archive`), no esta spec.
- Prueba del delta en copia temporal: `sdd capability merge` → quitado «Cancelar una reserva propia» · añadido «Cancelar una reserva» · quitado «Anular una reserva» (rc=0); el repo no cambia.
- Política de modelos: revisores de la spec: ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Se retira el comando `anular` — «se retira el comando anular»
- El requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva» — «pasa a llamarse «Cancelar una reserva»»
- Se actualiza `docs/guia.md` — «la guía docs/guia.md se actualiza»
- Perfil `delegate` — «Perfil delegate»

> ⚠️ **Conflicto con la fila 0011** («Anular reservas de otros: solo el responsable de cada sala anula reservas de otras personas»): da por hecho un comando `anular` que esta feature borra. No lo resuelvo yo: decide si la 0011 se reescribe (reintroduce el comando con permiso de responsable) o se retira.

## Intent

Hoy `anular` existe pero nada lo restringe al responsable de sala: cualquiera puede anular la reserva de otra persona. Se retira el comando. Éxito: `anular` ya no hace nada, `cancelar` se comporta igual que antes y ningún documento sigue mencionando `anular` como comando vigente. Fracaso aunque funcione: que la guía, el README o la capacidad describan un comando que ya no existe.

## Scope

- Entra: retirar el comando en `src/app.js`; una prueba de que ya no anula; actualizar `capabilities/bookings.md`, `docs/guia.md`, `README.md` y `PRODUCT.md`.
- No entra: la 0010 y la 0011; ningún cambio de comportamiento de `cancelar`; el changelog y las releases cerradas; un mensaje de «comando retirado».

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Comando `anular` | `src/app.js:20-25` (`voidBooking`, estado `voided`), `:31` (rama de `run`) | Scope; decisión 7 |
| Requisito «Anular una reserva» | `capabilities/bookings.md:16` | delta, `REMOVED` |
| Requisito «Cancelar una reserva propia» (título) | `capabilities/bookings.md:9` | delta, `REMOVED` + `ADDED` (decisión 2) |
| «anular» en el Propósito | `capabilities/bookings.md:5` | decisión 5 |
| Línea de `anular` y su «lo retira la 0012» | `docs/guia.md:8` | Scope |
| «cancela tu reserva» | `docs/guia.md:7` | decisión 3 |
| «`cancelar` y `anular`» | `README.md:5` | decisión 6 |
| Término **Anulación** | `PRODUCT.md:10` | decisión 4 |
| «Cancelar una reserva propia» histórico | `changelog.md:20`, `roadmap.md:34` | decisión 8: historia, no se toca |

- Filas que implementa: 0012 → `roadmap.md:9` (la mueve el cierre, decisión 9); `docs/guia.md:8` («lo retira la 0012») se borra con su línea; la 0011 (`roadmap.md:8`) depende del comando retirado: aviso arriba, fuera del Scope.

## Approach

Se borra el comando y su código muerto, se renombra el requisito y se ajustan los cuatro documentos que lo nombran. `cancelar` no se toca; `anular` cae en la respuesta genérica de `run`.

## Dónde se prueba

- `anular` ya no anula: por `run('anular', ['Norte','lun'])`, como `test/cancel.test.js`; comprueba que responde `salas` y que la reserva sigue activa (`run('cancelar', ['Norte','lun'])` aún responde `cancelada Norte lun`).
- `cancelar` sin cambios: las pruebas actuales de `test/cancel.test.js`.
- Guía: `test/words.test.js` (tope de 60).

## Términos y ADR

- Términos resueltos: se retira **Anulación** (decisión 4).
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

**REMOVED — Cancelar una reserva propia**
- motivo: el requisito pasa a llamarse «Cancelar una reserva»; mismo comportamiento.

**ADDED — Cancelar una reserva**
- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `cancelar Norte lun`
- THEN la reserva queda cancelada y responde `cancelada Norte lun`
- AND sin reserva ese día responde `sin reserva Norte lun`

**REMOVED — Anular una reserva**
- motivo: se retira el comando `anular`; `salas anular Norte lun` responde `salas`, como cualquier comando desconocido, y la reserva sigue activa.

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/guia.md` | 42 / 60 | 18 | sin cambio (la edición lo acorta) |

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
