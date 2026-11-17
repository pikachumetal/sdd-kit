---
id: 20261018-103749-feature-0012-retire-void
feature: 0012
title: Retirar el comando anular
mode: full
profile: delegate
status: draft
created: 2026-10-18
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Retirar el comando anular

🦆 El comando `anular` deja de existir: quien escriba `anular Norte lun` ya no anula la reserva, solo recibe la respuesta de un comando desconocido (`salas`). `cancelar Norte lun` sigue igual y pasa a describirse como «Cancelar una reserva», sin el «propia». Se borra el código de `anular`, se actualiza la guía y se pone al día la capacidad `bookings`.

## Capacidades

- Modificadas: `bookings` — se retira el requisito «Anular una reserva» y «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva»

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: MODIFIED/REMOVED (el delta quita y renombra requisitos de `bookings`) · tamaño: ~25 líneas en 7 ficheros
- Coherencia: `sdd capability merge` sobre una copia de `.docs/sdd` → quitado «Cancelar una reserva propia», añadido «Cancelar una reserva», quitado «Anular una reserva» (rc 0)
- Mínimo razonable: ninguna (ya es el nivel propuesto) — deja sin mirar solo la coherencia de los literales, que he pasado yo con búsqueda en todo el repo

1. `anular` queda como cualquier comando desconocido: responde `salas`, sin mensaje propio de «comando retirado» — nadie pidió un aviso y la herramienta la usas solo tú.
2. El renombrado del requisito va como `REMOVED` del título viejo + `ADDED` del nuevo, con el mismo contenido (GIVEN/WHEN/THEN sin cambios): así lo exige la clave de fusión.
3. La línea de propósito de `bookings` pasa de «Reservar, cancelar y anular salas…» a «Reservar y cancelar salas desde la línea de comandos.» El merge no toca el propósito (comprobado), así que la edición va a mano en la implementación.
4. `PRODUCT.md`: se borra el término **Anulación**, porque su comando ya no existe. **Cancelación** no se toca (su definición menciona «el propio cliente»; si quieres alinearla con el renombrado, dímelo).
5. `README.md`: «Comandos: `cancelar` y `anular`» pasa a «Comando: `cancelar`».
6. `docs/guia.md`: se borra la línea de `anular` y `cancelar` pasa de «cancela tu reserva» a «cancela una reserva», coherente con el renombrado.
7. Las menciones históricas a «Cancelar una reserva propia» (v0.3.0 en `changelog.md` y `roadmap.md`) no se reescriben: son el registro de lo entregado.
8. La fila **0011** del roadmap («Anular reservas de otros: solo el responsable… anula») queda contradictoria con esta retirada. No la toco ni la cancelo: es tuya la decisión (cancelarla, reformularla o reordenarla con `sdd-roadmap`).
9. Datos: las reservas viven en memoria, así que el estado `voided` desaparece con el proceso; no hace falta migración.
- Política de modelos: sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo

### Decisiones tomadas con el dev-lead

- Se retira el comando `anular` — «se retira el comando anular»
- El requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva» — «pasa a llamarse «Cancelar una reserva»»
- Se actualiza `docs/guia.md` — «la guía docs/guia.md se actualiza»
- Perfil `delegate` — «Perfil delegate»

## Intent

Hoy `anular` anula la reserva de otra persona (la responsable de sala) y el requisito de cancelar dice «propia». La fila 0012 del roadmap decide que `anular` desaparece. Éxito: `anular` ya no cambia ninguna reserva, `cancelar` no cambia, y ningún documento ni capacidad sigue describiendo `anular`. Fracaso aunque los tests pasen: dejar `anular` en la guía, el README o la capacidad.

## Scope

- Entra: quitar `voidBooking` y la rama `anular` de `src/app.js`; delta de `bookings` y su línea de propósito (a mano); `docs/guia.md`; `README.md`; `PRODUCT.md` (término Anulación); un test de que `anular` ya no anula.
- No entra: la fila 0011; reescribir el histórico (changelog v0.3.0, roadmap «Releases cerradas»); un aviso de «comando retirado»; renombrar `cancelBooking`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Comando `anular` y `voidBooking` (estado `voided`) | `src/app.js:20-25`, `src/app.js:31` | Scope: se borran (decisión 9) |
| Requisito «Anular una reserva» | `.docs/sdd/capabilities/bookings.md:16-20` | delta, `REMOVED` |
| Requisito «Cancelar una reserva propia» | `.docs/sdd/capabilities/bookings.md:9`; `changelog.md:20` y `roadmap.md:34` (histórico de v0.3.0) | delta, `REMOVED` + `ADDED «Cancelar una reserva»`; el histórico se queda (decisión 7) |
| Propósito «…cancelar y anular salas…» | `.docs/sdd/capabilities/bookings.md:5` | decisión 3 |
| Término «Anulación» | `PRODUCT.md:10` | decisión 4 |
| `anular` en la lista de comandos | `README.md:5` | decisión 5 |
| Línea `anular` y «cancela tu reserva» | `docs/guia.md:7-8` | decisión 6 |
| Fila 0011 «Anular reservas de otros» | `.docs/sdd/roadmap.md:8` | decisión 8: queda fuera, la decide el dev-lead |

- Filas que implementa: 0012 → `docs/guia.md:8` («lo retira la 0012», se borra con la línea) y `roadmap.md:9` (se marca hecha al cerrar) | `0012` buscado en todo el repo: solo esas dos menciones

## Approach

Se borra el código de `anular` y se alinean capacidad, términos, README y guía con lo que queda. `anular` cae al caso por defecto de `run`. No se añade ninguna función nueva.

## Dónde se prueba

- `anular` ya no anula: `run('anular', ['Norte', 'lun'])` responde `salas` y la reserva sigue activa (un `cancelar Norte lun` posterior responde `cancelada Norte lun`), en `test/cancel.test.js` con `run`, como los tests de cancelar actuales.
- `cancelar` no cambia: los tests existentes de `test/cancel.test.js`.
- La guía sigue dentro de su tope: `test/words.test.js`.

## Términos y ADR

- Términos resueltos: **Anulación** deja de existir como término del producto
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

**REMOVED — Cancelar una reserva propia**
- motivo: se renombra a «Cancelar una reserva»

**ADDED — Cancelar una reserva**
- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `cancelar Norte lun`
- THEN la reserva queda cancelada y responde `cancelada Norte lun`
- AND sin reserva ese día responde `sin reserva Norte lun`

**REMOVED — Anular una reserva**
- motivo: el comando `anular` se retira (fila 0012 del roadmap)

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
