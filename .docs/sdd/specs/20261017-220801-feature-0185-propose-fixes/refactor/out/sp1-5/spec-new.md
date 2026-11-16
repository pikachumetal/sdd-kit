---
id: 20261018-103743-feature-0012-retire-void
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

🦆 El comando `anular` desaparece: quien escriba `anular Norte lun` ya no anula nada y recibe la respuesta de cualquier comando desconocido, `salas`; la reserva de Norte el lunes sigue activa. Lo único que se puede hacer con una reserva es cancelarla, así que el requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva», con el mismo comportamiento. Después se quita el código de anular y se actualizan la guía y el README.

## Capacidades

- Modificadas: `bookings` — se retira «Anular una reserva» y «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva»

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: `MODIFIED`/`REMOVED` (se retira un requisito y se renombra otro) · tamaño: ~20 líneas en 6 ficheros (2 de código, 1 de test, 3 de documentación)
- Mínimo razonable: es ya el mínimo (sin revisor) — no deja nada sin cubrir salvo la lectura de la propia coherencia, que hace el repaso previo a esta presentación.

1. Tras retirarlo, `anular <sala> <día>` responde `salas`, como cualquier comando desconocido (hoy `run` devuelve `salas` por defecto); no se añade un mensaje del tipo «anular ya no existe» — lo más simple y sin texto nuevo. Y la reserva no cambia de estado.
2. El renombrado del requisito va como `REMOVED` del título viejo + `ADDED` del nuevo (el título es la clave de fusión); el escenario es el mismo palabra por palabra, así que no cambia ningún comportamiento. Que la ejecute «la persona» sin comprobar de quién es la reserva ya era así: no hay comprobación de propietaria en el código y esta spec no la añade.
3. La línea de la guía pasa de «cancela tu reserva» a «cancela una reserva», para casar con el nuevo nombre del requisito.
4. El README también nombra `anular` (`Comandos: \`cancelar\` y \`anular\``): lo actualizo aunque solo se mencionó la guía.
5. El Propósito de `bookings` («Reservar, cancelar y anular salas…») pasa a «Reservar y cancelar salas desde la línea de comandos.» El Propósito no es un requisito y `capability merge` no lo toca: se edita a mano en la task de documentación.
6. La fila 0011 del roadmap («Anular reservas de otros: solo el responsable de cada sala anula…») parte de que `anular` existe y contradice esta retirada. No la toco: es planificación y decide el dev-lead (¿se retira, se reformula como otro comando?). Se avisa en el walkthrough.
7. El estado interno `voided` desaparece con el código de `voidBooking`: no persiste (las reservas viven en memoria), así que no hay migración.
8. El delta añade un requisito nuevo, «El comando anular no existe», para que el test de la decisión 1 tenga escenario en `bookings`. Si prefieres que la capacidad no lo recoja, se quita del delta y el test se queda sin escenario.
- Prueba del delta: `capability merge` sobre una copia de `.docs/sdd` en una carpeta temporal → quitado «Anular una reserva» y «Cancelar una reserva propia», añadido «Cancelar una reserva» y «El comando anular no existe», salida 0. (El Propósito no lo toca el merge: decisión 5.)
- Política de modelos: sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.

### Decisiones tomadas con el dev-lead

- Se retira el comando `anular` — «se retira el comando anular»
- El requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva» — «el requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva»»
- Se actualiza `docs/guia.md` — «la guía docs/guia.md se actualiza»
- Perfil delegate — «Perfil delegate»

## Intent

Hoy `anular` deja a cualquiera dar por anulada la reserva de otra persona, y la 0011 pensaba restringirlo al responsable de la sala. El dev-lead ha decidido que el comando no se queda: la fila 0012 lo retira. Éxito: `anular` ya no existe en el programa ni en la documentación, `cancelar` sigue exactamente igual, y `node --test` sigue en verde. Fracaso aunque compile: que `anular` siga anulando, que quede en la guía o el README, o que `cancelar` cambie.

## Scope

- Entra: quitar `voidBooking` y la rama `anular` de `src/app.js`; un test de que `anular` ya no hace nada; el delta de `bookings`; `docs/guia.md`, `README.md` y el Propósito de la capacidad.
- No entra: tocar `cancelar`; el motivo al cancelar (0010); el permiso del responsable (0011, ver decisión 6); mensajes nuevos; el changelog histórico.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Requisito «Anular una reserva» | `capabilities/bookings.md:16` | delta, `REMOVED` |
| Requisito «Cancelar una reserva propia» (título) | `capabilities/bookings.md:9`; `changelog.md:20` y `roadmap.md:34` (histórico: describen la release v0.3.0 ya cerrada) | delta, `REMOVED` + `ADDED` «Cancelar una reserva»; el histórico se queda |
| Propósito «…cancelar y anular salas…» | `capabilities/bookings.md:5`; índice de capacidades | decisión 5 |
| Comando `anular` y `voidBooking` | `src/app.js:20-24` y `:31` | Scope |
| Línea `anular` de la guía; «cancela tu reserva» | `docs/guia.md:7-8` | Scope; decisión 3 |
| `anular` en el README | `README.md:5` | Scope; decisión 4 |
| Fila «Anular reservas de otros» | `roadmap.md:8` (0011) | decisión 6 |

- Filas que implementa: 0012 → la nombran `roadmap.md:9` y `docs/guia.md:8` («lo retira la 0012», que se borra con la línea); las specs anteriores no la nombran (comprobado con `grep -rn "0012\|anul" .docs/sdd/specs capabilities`).

## Approach

Se quita `anular` del enrutado y su función; `anular` cae en el comportamiento por defecto de `run`. El requisito se retira del comportamiento vivo y el de cancelar se renombra sin cambiar su escenario. Guía, README y Propósito se ajustan a «cancelar» como única operación.

## Dónde se prueba

- `anular` ya no hace nada: por `run('anular', ['Norte','lun'])`, en `test/app.test.js`, como los tests de `libres` y `reservar`; comprueba `salas`, y que `run('cancelar', ['Norte','lun'])` aún responde `cancelada Norte lun`.
- `cancelar` no cambia: los tests actuales de `test/cancel.test.js`, sin tocar.
- Docs: tope de palabras de `docs/guia.md`, ya cubierto por `test/words.test.js`.

## Términos y ADR

- Términos resueltos: «anular» — comando retirado, ya no es vocabulario de la aplicación; «cancelar» — la única forma de dar de baja una reserva.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

**REMOVED — Anular una reserva**
- motivo: el dev-lead retira el comando `anular` (fila 0012)

**REMOVED — Cancelar una reserva propia**
- motivo: pasa a llamarse «Cancelar una reserva»; el comportamiento no cambia

**ADDED — Cancelar una reserva**
- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `cancelar Norte lun`
- THEN la reserva queda cancelada y responde `cancelada Norte lun`
- AND sin reserva ese día responde `sin reserva Norte lun`

**ADDED — El comando anular no existe**
- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `anular Norte lun`
- THEN responde `salas` y la reserva sigue activa

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/guia.md` | 42 / 60 | 18 | sin cambio (la edición lo acorta) |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
