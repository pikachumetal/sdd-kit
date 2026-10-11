---
id: 20261011-194727-feature-0008-lista-espera
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

🦆 Hoy, si la sala que quieres está ocupada, no puedes hacer nada más que volver a mirar. Con esto dices `salas esperar Norte lun 10:00-12:00` y la herramienta te apunta en espera; si alguien cancela esa reserva, la sala pasa a ser tuya y te lo dice al cancelar. Se hace con un comando nuevo (`esperar`) y un pequeño cambio en `cancelar`.

> **Estado**: draft.
> **Siguiente paso**: aprobación de la spec → `plan.md`.

## Capacidades

- Nuevas: `waitlist` — apuntarse en espera de una sala ocupada y pasar a reserva cuando se libera.
- Modificadas: ninguna (`capabilities/` está vacío; el comportamiento de reservar y cancelar vive hoy en las specs 0005 y 0007, y esta feature solo añade un efecto al cancelar).

## ✋ Decisiones que he tomado yo — valida estas

Pediste empezar ya, sin más preguntas: estos son los huecos que he rellenado yo.

Review de spec propuesta: ninguna — señales: capacidad nueva (1 de 8) · tamaño: ~40 líneas en 2 ficheros
- Mínimo razonable: ninguna — no deja nada sin cubrir que las señales marquen.

1. **Capacidad nueva `waitlist`** — es un sustantivo del dominio y hoy no hay capacidades; el slug va en inglés kebab-case.
2. **Comando `salas esperar <sala> <día> <franja>`** — mismo orden y estilo que `reservar` y `cancelar`; el nombre del comando no salió de ti.
3. **Una entrada de espera es una terna sala + día + franja**; no hay cola ni posición, porque la usas solo tú y la misma terna no se repite (decisión 6).
4. **Al cancelar la reserva de esa terna, la espera pasa a reserva automáticamente**, sin pedir confirmación — interpreto «lista de espera» como «me la quedo si se libera»; la alternativa era solo avisar.
5. **Textos de respuesta**, literales (en castellano, Art. 4 de la constitución):
   - sala ocupada → `en espera: Norte lun 10:00-12:00`
   - sala libre → `Norte está libre lun 10:00-12:00: reserva directamente`
   - ya en espera → `ya estás en espera: Norte lun 10:00-12:00`
   - sala inexistente → `sala desconocida: Oeste`
   - cancelación que libera una espera → `cancelada lun 10:00; en espera → reservada: Norte lun 10:00-12:00`
6. **Apuntarse dos veces a la misma terna se rechaza** (mensaje de arriba), no se duplica.
7. **Los datos viven en memoria, como las reservas de hoy** — no añado persistencia a disco que no existe en el resto de la herramienta.
8. **`cancelar` sigue sin llevar sala**: toma día y hora de inicio como hasta ahora; si esa reserva tiene una espera, se promueve. No cambio su firma.
9. **No entra**: listar la espera (`salas esperando`), darse de baja de ella, avisos por correo (ya es la fila 1 del roadmap) y mostrar la espera en `libres`.

### Decisiones tomadas con el dev-lead

- Carril feature, modo full, sin más preguntas — «Carril feature, modo full: añade una lista de espera para cuando la sala que quiero está ocupada. Empieza ya, no me preguntes más.»

## Intent

Hoy, cuando la sala que quieres está ocupada, la herramienta no te deja dejar constancia de que la querías: tienes que acordarte de volver a mirar `libres`. Se quiere poder apuntarse en espera de una terna sala + día + franja ocupada y que, si esa reserva se cancela, la sala pase a ser tuya sin hacer nada más. El éxito: cancelar la reserva ocupante deja la sala reservada a tu nombre en el mismo comando. Fracasaría aunque funcionara si te apuntara en espera de una sala que está libre (debería decirte que reserves) o si dejara una reserva fantasma al cancelar.

## Scope

- Entra: comando `esperar`; promoción de la espera a reserva al cancelar la reserva de esa terna; sus mensajes.
- No entra: listar o quitar esperas, avisos por correo, persistencia a disco, cambios a `libres`, `reservar` o a la firma de `cancelar`.

## Approach

Una espera es una entrada aparte de las reservas. `esperar` la crea solo si la sala está ocupada en esa franja; `cancelar`, al quitar una reserva, mira si hay una espera de la misma terna y, si la hay, la convierte en reserva. El cómo va en `plan.md`.

## Dónde se prueba

- `esperar` y sus mensajes: por `run()` en `test/app.test.js`, como los tests actuales de `libres` y `reservar`.
- Promoción al cancelar: por `run()` encadenando `esperar` y `cancelar`, con la misma costura.

## Términos y ADR

- Términos resueltos: espera — entrada sala + día + franja de una sala ocupada, que pasa a reserva al liberarse.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `waitlist`

**ADDED — Apuntarse en espera de una sala ocupada**
- GIVEN la sala Norte reservada el lun de 10:00-12:00
- WHEN `esperar Norte lun 10:00-12:00`
- THEN responde `en espera: Norte lun 10:00-12:00`

**ADDED — No esperar una sala libre**
- GIVEN la sala Sur sin reservas el lun de 10:00-12:00
- WHEN `esperar Sur lun 10:00-12:00`
- THEN responde `Sur está libre lun 10:00-12:00: reserva directamente` y no crea ninguna espera

**ADDED — No duplicar la espera**
- GIVEN en espera de Norte lun 10:00-12:00
- WHEN `esperar Norte lun 10:00-12:00` otra vez
- THEN responde `ya estás en espera: Norte lun 10:00-12:00` y sigue habiendo una sola espera

**ADDED — Sala desconocida**
- GIVEN las salas Norte y Sur
- WHEN `esperar Oeste lun 10:00-12:00`
- THEN responde `sala desconocida: Oeste` y no crea ninguna espera

**ADDED — La espera pasa a reserva al cancelar**
- GIVEN Norte reservada el lun 10:00-12:00 y en espera de esa terna
- WHEN `cancelar lun 10:00`
- THEN responde `cancelada lun 10:00; en espera → reservada: Norte lun 10:00-12:00`
- AND Norte consta reservada ese lun 10:00-12:00 y la espera desaparece

**ADDED — Cancelar sin espera no cambia**
- GIVEN Norte reservada el lun 10:00-12:00 y sin esperas
- WHEN `cancelar lun 10:00`
- THEN responde `cancelada lun 10:00` como hasta ahora

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
