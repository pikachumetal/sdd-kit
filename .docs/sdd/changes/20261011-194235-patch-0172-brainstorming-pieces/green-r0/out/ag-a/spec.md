---
id: 20261011-194452-feature-0008-lista-espera
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

🦆 Hoy, si pides una sala que ya está ocupada, la herramienta no te dice nada útil. Con esto, pedir la Norte el lunes de 10:00 a 12:00 cuando ya está ocupada te apunta en una lista de espera y te dice tu posición («posición 1»). Si luego se cancela esa reserva indicando la sala, la sala pasa al primero de la lista y el aviso lo dice. La lista vive solo mientras el programa está en marcha, igual que las reservas de hoy.

> **Estado**: draft.
> **Siguiente paso**: aprobación de la spec → `plan.md`.

## Capacidades

- Nuevas: `waitlist` — qué pasa al pedir una sala ocupada y al liberarse.
- Modificadas: ninguna (no hay `capabilities/` todavía; el listado de libres, la reserva semanal y la cancelación sin sala no cambian).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva (`waitlist`) · tamaño: ~40 líneas en 2 ficheros
- Mínimo razonable: ninguna — deja sin mirar solo que `waitlist` no contradiga reglas aún no escritas en `capabilities/` (no existe ninguna).

Pediste empezar ya sin más preguntas, así que lo que sigue lo he decidido yo; rechaza lo que no te cuadre:

1. **Capacidad nueva `waitlist`** (inglés, kebab-case) — no hay capacidades vivas; esta es la primera.
2. **Forma de pedir la sala**: `salas reservar <sala> <día> <franja>`, p. ej. `reservar Norte lun 10:00-12:00`. Hoy ese comando no existe más que con `--cada-semana`; el orden de parámetros imita a `cancelar <día> <franja>`.
3. **Sala libre**: responde `reservada Norte lun 10:00-12:00` y queda reservada (decisión mía; hoy ese caso cae en el texto genérico `salas`).
4. **Sala ocupada**: responde `Norte lun 10:00-12:00 ocupada: en lista de espera, posición 1`.
5. **Orden**: por llegada (primero en pedir, primero en recibir); una lista por sala+día+franja. Sin tope de longitud.
6. **Liberar**: `cancelar <día> <franja> <sala>` — añado un tercer parámetro **opcional** `<sala>`. Hoy `cancelar` no recibe sala, así que no sé qué sala se libera sin él. Sin sala, `cancelar` se comporta exactamente como hoy (`cancelada mar 10:00`) y **no** promociona a nadie.
7. **Al promocionar**: la respuesta es `cancelada lun 10:00-12:00; Norte pasa al primero de la lista de espera`.
8. **Sin identidad**: las entradas no llevan nombre (la misión dice que lo usa una sola persona); no hay forma de salir de la lista ni de listarla.
9. **Persistencia**: en memoria, como `bookings` hoy. Cada ejecución del comando es un proceso nuevo, así que **en la práctica la lista no sobrevive entre comandos de línea**; solo se prueba dentro de un mismo proceso (tests). Guardarla en disco es otra feature. Esto es lo que más conviene que valides.
10. **Textos**: en castellano (constitución, art. 4); los literales de arriba son los de los THEN.

## Intent

Hoy pedir una sala ocupada no deja rastro: no sabes si te la darán cuando se libere. Se quiere que quien pide una sala ocupada quede apuntado en orden y que, al liberarse, la sala pase al primero.

## Scope

- Entra: pedir sala con `reservar <sala> <día> <franja>`; lista de espera por sala+día+franja en orden de llegada; promoción al cancelar con sala.
- No entra: persistencia en disco; avisos por correo (fila 1 del roadmap); salir de la lista o listarla; identidad de quien espera; cambiar `libres` o `--cada-semana`.

## Approach

Estado en memoria junto a las reservas actuales en `src/app.js`: al reservar, si la sala+día+franja ya tiene reserva se añade a la cola de esa clave; al cancelar con sala, se retira la reserva y, si hay cola, el primero ocupa su lugar. Cómo se estructura va en el plan.

## Dónde se prueba

- Reservar sala libre, ocupada y promoción al cancelar: por `run()` en `test/app.test.js`, como los tests actuales.
- Sin cambios para `libres`, `--cada-semana` y `cancelar` sin sala: los tests actuales siguen en verde.

## Términos y ADR

- Términos resueltos: lista de espera — cola, por sala+día+franja, de peticiones sobre una sala ocupada.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `waitlist`

**ADDED — Reservar una sala libre**
- GIVEN la sala Norte sin reserva el lun 10:00-12:00
- WHEN `reservar Norte lun 10:00-12:00`
- THEN responde `reservada Norte lun 10:00-12:00`

**ADDED — Reservar una sala ocupada entra en lista de espera**
- GIVEN la sala Norte reservada el lun 10:00-12:00 y nadie esperando
- WHEN `reservar Norte lun 10:00-12:00`
- THEN responde `Norte lun 10:00-12:00 ocupada: en lista de espera, posición 1`
- AND una segunda petición igual responde `… posición 2`

**ADDED — Promoción al cancelar**
- GIVEN Norte reservada el lun 10:00-12:00 y una persona en la lista de espera de esa misma sala y franja
- WHEN `cancelar lun 10:00-12:00 Norte`
- THEN responde `cancelada lun 10:00-12:00; Norte pasa al primero de la lista de espera`
- AND la lista de esa sala+franja queda sin ese primero

**ADDED — Cancelar sin sala no promociona**
- GIVEN Norte reservada el lun 10:00-12:00 con alguien esperando
- WHEN `cancelar lun 10:00-12:00`
- THEN responde `cancelada lun 10:00-12:00`
- AND la lista de espera no cambia

**Reglas de la capacidad**
- **Dónde viven los datos**: en memoria del proceso, junto a las reservas; no persisten.
- **Idioma de los nombres**: castellano, como el resto de la interfaz.
- **Límites**: sin tope de longitud de la lista.
- **Avisos**: los literales de los THEN de arriba.
- **Regla ante conflicto**: orden de llegada.

## Enmiendas

(ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
