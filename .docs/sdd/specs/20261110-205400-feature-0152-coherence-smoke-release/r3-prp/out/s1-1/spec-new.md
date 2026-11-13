---
id: 20261111-190233-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar una reserva
mode: full
status: draft
created: 2026-11-11
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Motivo al cancelar una reserva

🦆 Hoy `salas cancelar Norte lun` anula la reserva sin más. Con esto, al cancelar hay que decir por qué, eligiendo de una lista: `salas cancelar Norte lun sala-ocupada`. Un listado nuevo, `salas canceladas`, enseña cada reserva cancelada con su motivo: `Norte lun 10:00-12:00 · sala ocupada`. Por dentro, la reserva guarda el motivo al pasar a cancelada y el listado filtra por ese estado.

Validación: dev-lead — es un comando que una persona usa en la terminal y lo que ve (mensajes, listado) lo juzga ella.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo de una lista y listar las canceladas con su motivo.
- Modificadas: ninguna.
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Revisión de la spec: ninguna, a petición del dev-lead («Sin review»). Lo que queda sin cubrir: nadie más lee esta spec antes de tu aprobación.

1. Capacidad nueva `booking-cancellation` (inglés kebab-case): hoy `capabilities/` está vacío y la cancelación no está descrita en ninguna, así que el delta solo tiene `ADDED`.
2. El motivo se pasa como tercer argumento: `cancelar <sala> <día> <motivo>`, con los valores `cambio-de-planes`, `sala-ocupada`, `otro` (con guiones, para que sea una sola palabra en la terminal). El listado los enseña con espacios: «cambio de planes», «sala ocupada», «otro».
3. El motivo es **obligatorio**: sin él no se cancela nada y sale `motivo obligatorio: cambio-de-planes, sala-ocupada, otro`. Un valor fuera de la lista: `motivo no válido: cambio-de-planes, sala-ocupada, otro`. Elijo obligatorio porque «se elige un motivo» no dice que sea opcional; rompe a quien hoy cancela sin motivo (único usuario: tú).
4. El motivo se valida **antes** de buscar la reserva: `cancelar Sur mar` (sin motivo) dice `motivo obligatorio…` aunque no exista reserva.
5. El mensaje de éxito no cambia: `cancelada Norte lun` (no pediste enseñar el motivo al cancelar).
6. El listado es un comando nuevo, `canceladas`, porque hoy no existe ningún listado de canceladas. Una línea por reserva cancelada, `<sala> <día> <franja> · <motivo con espacios>`, en el orden en que están las reservas; sin ninguna, `sin canceladas`.
7. `canceladas` no incluye las anuladas por el responsable (estado `voided`, comando `anular`): «Cancelación» y «Anulación» son cosas distintas en `PRODUCT.md`; el motivo de anular iría con la 0011, si se quiere.
8. **Límite que no resuelvo:** las reservas viven en memoria y cada `node src/app.js …` arranca de cero, así que `salas cancelar …` seguido de `salas canceladas` en dos ejecuciones separadas **no** enseña la cancelación. Funciona dentro de un mismo proceso (los tests y la comprobación de «Dónde se prueba»). Persistirlas es otra feature y no entra; si lo necesitas para validar desde la terminal, dímelo.
9. Enfoque: A, frente a B y C (ver Approach).
10. Validación a cargo del dev-lead, no del agente: es lo que una persona usa.
- Delta probado sobre una copia de `.docs/sdd` en una carpeta temporal: `sdd capability merge` añade los 4 requisitos a `booking-cancellation.md` sin rechazos; el `capabilities/` del repo no cambia.
- Política de modelos: sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- Motivos: cambio de planes, sala ocupada, otro; se elige de una lista al cancelar — «al cancelar una reserva se elige un motivo de una lista (cambio de planes, sala ocupada, otro) y el listado de canceladas lo enseña»
- Sin revisión de la spec — «Sin review»

## Intent

Hoy se cancela una reserva sin dejar rastro de por qué (`src/app.js:13`). Pasa a elegirse un motivo de una lista cerrada y a poder consultarlo. Éxito: tras `cancelar Norte lun sala-ocupada`, en el mismo proceso `canceladas` devuelve `Norte lun 10:00-12:00 · sala ocupada`. Fracaso aunque «funcione»: que se pueda cancelar sin motivo, o que las anuladas se cuelen en el listado.

## Scope

- Entra: motivo obligatorio y de lista cerrada en `cancelar`; comando `canceladas`; reescribir los dos tests de `test/cancel.test.js` al nuevo formato; capacidad `booking-cancellation`.
- No entra: persistir reservas entre ejecuciones; motivo al anular (0011); motivo de texto libre; filtrar u ordenar el listado; mostrar el motivo en el mensaje de éxito.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js:13-18` y `:30` | Scope, decisión 3 y requisito «El motivo es obligatorio y de la lista» |
| Los dos tests con la forma antigua | `test/cancel.test.js:5-11` | Scope: se reescriben con motivo |
| «Cancelar una reserva propia» (0.3.0) | `CHANGELOG.md:20` | historial de una versión publicada: se queda; la entrada nueva va en `Unreleased` al cerrar |

- Filas que implementa: 0010 → `ROADMAP.md:7` (la única que la nombra; la cierra `sdd-archive`) · comprobado con `git grep -niE "cancel|0010|motivo"`: `README.md` no describe el comando y `PRODUCT.md:13-14` definen términos que no cambian.

## Approach

- A — guardar el motivo en la propia reserva (`booking.reason`) y un `canceladas` que filtra `status === 'cancelled'`: cambio mínimo en `src/app.js`, sin estructuras nuevas.
- B — un registro aparte de cancelaciones (`cancellations[]`): duplica el estado de la reserva y puede desincronizarse.
- C — validar el motivo solo en `run` y no en `cancelBooking`: deja la función exportada aceptando cualquier motivo.
- Elegido: A, con la validación dentro de `cancelBooking`, para que quien la use directamente también quede protegido.

Los valores válidos viven en una constante `reasons` en `src/app.js`; el texto con espacios del listado sale de cambiar `-` por espacio.

## Dónde se prueba

- Cancelar con motivo, motivo ausente o inválido, y cancelar sin reserva: por `run('cancelar', …)`, como los tests actuales de `test/cancel.test.js`.
- Listado: por `run('canceladas', [])`, tras cancelar en el mismo proceso, en `test/cancel.test.js`.
- Validación del dev-lead, en un solo proceso: `node -e "import('./src/app.js').then(a=>{console.log(a.run('cancelar',['Norte','lun','sala-ocupada']));console.log(a.run('canceladas',[]))})"` → `cancelada Norte lun` y `Norte lun 10:00-12:00 · sala ocupada`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar con motivo

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun sala-ocupada`
- THEN sale `cancelada Norte lun` y la reserva queda cancelada con el motivo «sala ocupada»

#### ADDED — El motivo es obligatorio y de la lista

- GIVEN reserva activa Norte lun
- WHEN `cancelar Norte lun`
- THEN sale `motivo obligatorio: cambio-de-planes, sala-ocupada, otro` y la reserva sigue activa
- AND con `cancelar Norte lun lluvia` sale `motivo no válido: cambio-de-planes, sala-ocupada, otro` y la reserva sigue activa
- AND con `cancelar Sur mar` (sin reserva y sin motivo) sale `motivo obligatorio: cambio-de-planes, sala-ocupada, otro`

#### ADDED — Cancelar sin reserva

- GIVEN no hay reserva activa en Sur mar
- WHEN `cancelar Sur mar otro`
- THEN sale `sin reserva Sur mar`

#### ADDED — Listado de canceladas

- GIVEN Norte lun 10:00-12:00 cancelada con `cambio-de-planes`, Sur mar 09:00-10:00 cancelada con `otro` y Sur mie 09:00-10:00 anulada
- WHEN `canceladas`
- THEN salen `Norte lun 10:00-12:00 · cambio de planes` y `Sur mar 09:00-10:00 · otro`, sin la anulada
- AND sin ninguna cancelada, `canceladas` sale `sin canceladas`

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
