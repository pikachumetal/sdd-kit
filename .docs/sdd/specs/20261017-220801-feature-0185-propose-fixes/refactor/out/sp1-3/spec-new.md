---
id: 20261018-103534-feature-0012-retire-void
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

🦆 El comando `anular` desaparece de la herramienta: `salas anular Norte lun` deja de anular la reserva y responde lo mismo que cualquier comando desconocido, `salas`, sin tocar la reserva. `cancelar Norte lun` sigue igual (`cancelada Norte lun`). La guía y el README dejan de nombrar `anular`, y el requisito de la capacidad pasa a llamarse «Cancelar una reserva», sin el «propia».

## Capacidades

- Modificadas: `bookings` — se retira «Anular una reserva» y «Cancelar una reserva propia» pasa a «Cancelar una reserva»

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: `REMOVED` (un requisito de `bookings`) · tamaño: ~30 líneas en 5 ficheros
- Mínimo razonable: ninguna — deja sin mirar solo lo que el repaso de coherencia ya recorrió (un requisito retirado, sin datos ni contrato)

1. `anular` deja de ser un comando con mensaje propio: cae al caso por defecto y responde `salas`, como cualquier comando desconocido — nadie fijó una respuesta para el comando retirado; evita inventar un texto («comando retirado…») que habría que mantener.
2. El renombrado se hace como `REMOVED` del título viejo + `ADDED` del nuevo, con el escenario literal de hoy (mismos datos, mismas respuestas) — es la forma que fija la plantilla; el comportamiento de `cancelar` no cambia.
3. `docs/guia.md`: se borra la línea de `anular` y la de `cancelar` pasa de «cancela tu reserva» a «cancela una reserva» — sigue el renombrado sin «propia». El tope de 60 palabras no se toca (hoy 42, baja).
4. `README.md`: «Comandos: `cancelar` y `anular`» → «Comando: `cancelar`» — deja de nombrar `anular`.
5. `PRODUCT.md` no se toca: la entrada «Anulación» (la hace el responsable de sala) es el vocabulario que reintroduce la fila 0011.
6. El Propósito de `bookings` («Reservar, cancelar y anular salas…») pasa a «Reservar y cancelar salas desde la línea de comandos» — el Propósito no es un requisito y el delta no lo fusiona: lo edita el cierre a mano.
7. **Alerta para el dev-lead, sin decidir yo**: la fila 0011 («Anular reservas de otros») presupone un `anular` que la 0012 retira; al cerrar la 0012 quedará sin base y habrá que replantearla (comando nuevo, o reintroducir `anular`). No toco el roadmap: es planificación, de `sdd-roadmap`.
8. Las menciones históricas («Cancelar una reserva propia» en `changelog.md` v0.3.0 y en el roadmap) se quedan: son la memoria de una release cerrada.
- Política de modelos: sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- Se retira el comando `anular` — «se retira el comando anular»
- El requisito «Cancelar una reserva propia» pasa a «Cancelar una reserva» — «pasa a llamarse «Cancelar una reserva»»
- Se actualiza `docs/guia.md` — «la guía docs/guia.md se actualiza»
- Perfil `delegate` — «Perfil delegate»

## Intent

Hoy `salas anular <sala> <día>` marca como anulada la reserva activa de otra persona y responde `anulada …`. El dev-lead decidió retirar el comando. Éxito: tras el cambio `anular` no modifica ninguna reserva, `cancelar` y `libres` se comportan igual, y ni el código, ni la guía, ni el README, ni la capacidad nombran el comando. Fracaso aunque funcione: que quede el estado `voided` o `voidBooking` como código muerto, o la guía diciendo que existe.

## Scope

- Entra: quitar `voidBooking` y la rama `anular` de `src/app.js`; retirar el requisito «Anular una reserva» y renombrar «Cancelar una reserva propia» en `bookings`; actualizar `docs/guia.md` y `README.md`; el Propósito de `bookings`.
- No entra: reemplazar `anular` por otra cosa (fila 0011, aparte); el listado de motivos (0010); `PRODUCT.md`; el historial del changelog y del roadmap; un mensaje propio para el comando retirado.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Comando `anular` y `voidBooking` | `src/app.js:20-25`, `src/app.js:31` | Scope (código) |
| Estado `voided` y respuesta `anulada …` | `src/app.js:23-24` | Scope (código); delta `REMOVED` |
| Requisito «Anular una reserva» | `capabilities/bookings.md:16-20` | delta `REMOVED` |
| Título «Cancelar una reserva propia» | `capabilities/bookings.md:9` | delta `REMOVED` + `ADDED` (decisión 2) |
| Propósito «…cancelar y anular salas…» | `capabilities/bookings.md:5` | decisión 6 |
| Línea de `anular` y «cancela tu reserva» | `docs/guia.md:7-8` | decisión 3 |
| «Comandos: `cancelar` y `anular`» | `README.md:5` | decisión 4 |
| Término «Anulación» | `PRODUCT.md:10` | decisión 5: se queda |
| «Cancelar una reserva propia» | `changelog.md:20`, `roadmap.md:34` | decisión 8: se queda |
| Fila 0011 «Anular reservas de otros» | `roadmap.md:8` | decisión 7: aviso al dev-lead |

- Filas que implementa: 0012 → la nombra `docs/guia.md:8` («lo retira la 0012»), que desaparece con la línea; `roadmap.md:9` la marca el cierre. Comprobado con `grep -rniE "anula|void|0012|propia"` sobre el repo (el proyecto no lleva `skills/`).

## Approach

Quitar el comando y su función, sin mensaje propio (decisión 1), y poner la documentación y la capacidad al día con lo que el dev-lead decidió. Sin migración: las reservas viven en memoria.

## Dónde se prueba

- `anular` ya no existe: `run('anular', ['Norte', 'lun'])` devuelve `salas` y la reserva sigue activa (un `cancelar Norte lun` posterior responde `cancelada Norte lun`) — por `run`, como `test/cancel.test.js`.
- `cancelar` no cambia: los dos tests de `test/cancel.test.js`, que ya existen.
- La guía y el README: lectura en la validación; el tope de `docs/guia.md` lo mide `test/words.test.js`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

**REMOVED — Anular una reserva**
- motivo: el dev-lead retira el comando `anular` (fila 0012).

**REMOVED — Cancelar una reserva propia**
- motivo: pasa a llamarse «Cancelar una reserva»; el comportamiento no cambia.

**ADDED — Cancelar una reserva**
- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `cancelar Norte lun`
- THEN la reserva queda cancelada y responde `cancelada Norte lun`
- AND sin reserva ese día responde `sin reserva Norte lun`

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/guia.md` | 42 / 60 | 18 | sin cambio (la edición lo reduce) |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
