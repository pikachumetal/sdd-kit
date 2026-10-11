---
id: 20261011-194910-feature-0008-lista-espera
feature: 0008
title: Lista de espera para una sala ocupada
mode: full
status: draft
created: 2026-10-11
author: <git-user>
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Lista de espera para una sala ocupada

🦆 Hoy, si la sala que quieres está ocupada en tu franja, no tienes dónde dejar apuntado que la quieres. Con esto escribes `salas espera Norte lun 10:00-12:00` y la sala queda en tu lista de espera; si después cancelas esa reserva, la respuesta te avisa de que «Norte» ha quedado libre y de que estabas esperándola. La lista vive en memoria, igual que las reservas de hoy: se pierde al cerrar el programa.

## Capacidades

- Nuevas: `waitlist` — apuntarse a la espera de una sala ocupada en una franja y enterarse de que se ha liberado.
- Modificadas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec: ninguna — señales: capacidad nueva (1 de 8) · tamaño: ~40 líneas en 2 ficheros (`src/app.js`, `test/app.test.js`). Mínimo razonable: el mismo; no hay nivel por debajo.

Pediste empezar ya, sin entrevista: todo lo de abajo es mío y es lo que tienes que mirar.

1. **Capacidad nueva `waitlist`** — no hay ninguna capacidad en `capabilities/` y esto no cabe en otra; el nombre en inglés kebab-case por ser nombre de fichero.
2. **Comando nuevo `salas espera <sala> <día> <franja>`** — en vez de que `reservar` te apunte solo: apuntarte es un efecto que no pediste al reservar, y `reservar` sin `--cada-semana` hoy no hace nada.
3. **La espera es por sala + día + franja**, igual que las reservas (`Norte lun 10:00-12:00`). `libres` hoy ignora el día; no lo toco.
4. **Textos literales de las respuestas**:
   - apuntado: `en espera: Norte lun 10:00-12:00`
   - ya estaba apuntado: `ya estás en espera: Norte lun 10:00-12:00`
   - la sala está libre: `Norte está libre lun 10:00-12:00: no hace falta esperar`
   - sala que no existe: `sala desconocida: Oeste`
   - faltan datos: `uso: salas espera <sala> <día> <franja>`
   - cancelar libera una sala con espera: `cancelada lun 10:00; Norte ha quedado libre lun 10:00-12:00 y estabas en espera`
5. **Sin posiciones ni turnos** — la herramienta la usas tú solo (misión): una lista de espera es la lista de salas/franjas que quieres, no una cola con orden.
6. **Una vez avisado, la entrada sale de la lista** — el aviso se da una sola vez; reservar la sala libre queda fuera (ver «No entra»).
7. **El aviso va en la respuesta de `cancelar`**, no en un correo ni en una notificación — no hay proceso residente ni canal; el correo es la fila 1 del roadmap.
8. **`cancelar <día> <hora>` pasa a quitar de verdad la reserva que coincide en día y hora** — hoy solo devuelve el texto y no borra nada, así que no hay forma de que una sala se libere. Sin reserva que coincida, la respuesta sigue siendo `cancelada <día> <hora>` como hoy. Es un cambio de comportamiento de `cancelar` que va dentro de esta feature porque sin él el aviso no ocurre nunca; si prefieres que sea un patch aparte, dímelo.
9. **La lista vive en memoria**, como las reservas del programa hoy — es lo coherente con el código actual, pero con una CLI que arranca de cero en cada ejecución **la espera no sobrevive entre una orden y la siguiente**. Es el hueco más importante de esta spec: si lo quieres útil de verdad, hace falta persistir reservas y espera, y eso es otra feature (la parto si lo confirmas).
10. **Capacidad nueva, un solo requisito de cancelar dentro de `waitlist`** — el aviso por cancelación vive solo ahí; no creo capacidad de `cancelar`.

## Intent

Hoy, con la sala ocupada, solo sabes que no puedes tenerla y tienes que acordarte tú. Quiero que puedas dejar dicho «esta sala, este día, esta franja» y que, cuando se libere, salga el aviso. Éxito: apuntarse es una orden y, al cancelar la reserva que la ocupa, la respuesta lo dice. Sería un fracaso que la orden diga «en espera» y luego nada pueda avisar, por eso queda dicho arriba (decisión 9) que sin persistencia el valor es limitado.

## Scope

- Entra: comando `espera`; lista en memoria; aviso al cancelar; `cancelar` que quita la reserva coincidente.
- No entra: reservar automáticamente al liberarse; correo o cualquier notificación (fila 1 del roadmap); persistencia de reservas y de la espera; orden o prioridades entre varias esperas; un comando para ver o borrar la lista; validar el formato de la franja (deuda ya anotada en el roadmap).

## Approach

Una función de ocupación compartida: la sala está ocupada en `sala + día + franja` si hay una reserva igual. `espera` consulta eso y guarda la entrada si no existe; `cancelar` quita la reserva coincidente y, si había una entrada para esa sala, día y franja, la saca de la lista y lo dice en la respuesta.

## Dónde se prueba

- `espera` y los avisos de `cancelar`: por `run(cmd, params)`, como los tests actuales de `test/app.test.js`; sin pantalla ni captura (es CLI de texto).

## Términos y ADR

- Términos resueltos: lista de espera — la sala + día + franja que quieres y hoy está ocupada.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `waitlist`

**ADDED — Apuntarse a la espera de una sala ocupada**
- GIVEN la sala Norte está reservada lun 10:00-12:00 y la lista de espera está vacía
- WHEN ejecutas `espera Norte lun 10:00-12:00`
- THEN responde `en espera: Norte lun 10:00-12:00`
- AND si repites la misma orden responde `ya estás en espera: Norte lun 10:00-12:00` y la lista sigue con una sola entrada

**ADDED — No se espera una sala libre**
- GIVEN la sala Sur no tiene reserva lun 10:00-12:00
- WHEN ejecutas `espera Sur lun 10:00-12:00`
- THEN responde `Sur está libre lun 10:00-12:00: no hace falta esperar` y no se apunta nada

**ADDED — Sala desconocida y datos incompletos**
- GIVEN las salas son Norte y Sur
- WHEN ejecutas `espera Oeste lun 10:00-12:00`
- THEN responde `sala desconocida: Oeste` y no se apunta nada
- AND `espera Norte lun` responde `uso: salas espera <sala> <día> <franja>`

**ADDED — Aviso al liberarse una sala en espera**
- GIVEN Norte reservada lun 10:00-12:00 y `espera Norte lun 10:00-12:00` ya apuntada
- WHEN ejecutas `cancelar lun 10:00`
- THEN responde `cancelada lun 10:00; Norte ha quedado libre lun 10:00-12:00 y estabas en espera`
- AND la entrada sale de la lista: repetir `espera Norte lun 10:00-12:00` responde `Norte está libre lun 10:00-12:00: no hace falta esperar`

**ADDED — Cancelar quita la reserva que coincide**
- GIVEN Norte reservada lun 10:00-12:00 y ninguna espera
- WHEN ejecutas `cancelar lun 10:00`
- THEN responde `cancelada lun 10:00` y `libres 10:00-12:00` pasa a incluir Norte
- AND `cancelar mar 10:00` (sin reserva ese día) responde `cancelada mar 10:00` y la reserva del lunes sigue

**Reglas de la capacidad**
- **Dónde viven los datos**: en memoria del proceso, como las reservas; se pierde al cerrar.
- **Idioma de los nombres**: comandos y respuestas en castellano (constitution, art. 4).
- **Límites**: no aplica.
- **Avisos**: el aviso de sala liberada sale una vez, en la respuesta de `cancelar`.
- **Regla ante conflicto**: no aplica.

## Enmiendas

(ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
