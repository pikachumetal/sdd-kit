---
id: 20261118-234325-feature-0010-salas-libres-franja
feature: 0010
title: Ver qué salas están libres en una franja (con día y solape)
mode: full
status: draft
created: 2026-11-19
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Ver qué salas están libres en una franja (con día y solape)

🦆 Hoy `libres 10:00-12:00` dice `Sur` aunque la reserva de Norte sea del lunes y preguntes por el martes, y no ve que 10:30-11:30 choca con 10:00-12:00. Con esta feature, `libres mar 10:30-11:30` da `Norte, Sur` y `libres lun 10:30-11:30` da `Sur`. Sin día sigue valiendo como hasta ahora: mira cualquier día. Por dentro, la comprobación de la franja pasa de igualdad a solape y se filtra por día.

Validación: dev-lead — es un comando que usa una persona y lo que imprime lo ve ella.

## Capacidades

- Nuevas: `room-availability` — qué salas están libres en una franja, con día opcional

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: capacidad nueva · tamaño: ~30 líneas en 3 ficheros (`src/app.js`, `test/app.test.js`, la spec)
- Dominio (sonnet): si el solape de «Una franja que solapa ocupa la sala» deja libre la sala cuando las franjas solo se tocan (12:00 con 12:00), y si «Sin día» no contradice el comando que ya existe (señal: capacidad nueva)
- Mínimo razonable: sin revisor — deja sin mirar los escenarios que pasan sin implementar nada, que es lo que encontró la review

1. **El comando ya existe y no creo otro**: `salas libres <franja>` está en `src/app.js` (feature 0006, cerrada) y responde (`libres 10:00-12:00` → `Sur`). Tu petición decía que no existe y la mantuviste. Amplío ese comando en vez de añadir uno nuevo con el mismo fin, que duplicaría la lógica. **Pendiente**: si querías otra cosa (p. ej. las franjas libres de una sala), dilo en el gate.
2. **Alcance: día y solape** — son los dos fallos que he visto en `libres`; no los pediste tal cual.
3. **Sintaxis**: `libres [día] <franja>`; el día es opcional y va primero (`lun`, `mar`…, como en `cancelar`). Sin día, mira cualquier día: no rompe `libres 10:00-12:00`.
4. **Borde**: dos franjas que solo se tocan (10:00-12:00 y 12:00-14:00) no solapan.
5. **Sin salas libres** imprime `ninguna sala libre` (hoy imprime vacío).
6. **No valida el formato** de la franja ni del día: sigue en la deuda por triar. Franja invertida o vacía (`12:00-10:00`), día desconocido (`foo`): comportamiento no definido, sin escenario, igual que hoy.
7. **Firma y detección**: `freeRooms(slot)` pasa a `freeRooms(day, slot)` y `run` cambia para repartir los argumentos (entra en Scope). Con un argumento es la franja; con dos, el primero es el día; `libres` sin argumentos o con más de dos: no definido, como hoy. El día se compara por igualdad exacta con el valor guardado (`lun` ≠ `lunes`, `Lun`). Cualquier palabra vale como día; las reservas ya guardan `day` (`src/app.js:3`) y solo `run` llama a `freeRooms`.
8. **Solape en minutos**: se convierte `HH:MM` a minutos y ocupa si `ini < fin' && ini' < fin`. Se asume que las franjas guardadas son `HH:MM-HH:MM` válidas (están fijadas en el código); una que no se pueda convertir no está definida.
- **Salas y orden**: las salas son `Norte` y `Sur` (`src/app.js:2`), la salida las lista en ese orden separadas por `, `.
9. **Sin base en `capabilities/`**: la 0006 no dejó capacidad, así que todo va como `ADDED`; no hay requisito vivo que `MODIFIED` pueda sustituir.
- Enfoque: ampliar `freeRooms` frente a un comando nuevo y frente a un módulo aparte (ver Approach).
- Capacidad nueva: `room-availability`.
- Delta probado en una copia con `sdd capability merge`: 5 requisitos añadidos a `room-availability.md`, sin rechazos.
- Política de modelos: un revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

Ronda 1:

1. **Rechazado** (Crítico) — `ADDED` que en realidad es `MODIFIED` de la 0006 → no hay capacidad previa en el repo (`sdd capability index`: «Sin capacidades») y `capability merge` rechaza un `MODIFIED` sin requisito vivo; queda en la decisión 9.
2. **Aceptado** (Crítico) — «Sin día» pasa hoy sin implementar nada → se añade el escenario «Sin día y franja solapada»; el actual queda como regresión.
3. **Aceptado** — salida vacía y frase del Approach → corregida (ningún test fija la salida vacía).
4. **Aceptado** — «tres casos» → «cada escenario».
5. **Aceptado** — firma, solape y detección del día → decisiones 7 y 8.
6. **Aceptado** — datos de reserva y consumidores → decisión 7.
7. **Aceptado** — casos límite → decisión 6.
8. **Rechazado** — sacar el Pendiente a pregunta bloqueante → el gate es esa pregunta, y el dev-lead ya mantuvo su petición una vez.
9. **Aceptado** — 🦆 unificado y sin detalle interno.
10. **Rechazado** — el bloque de review abre ✋ por la plantilla del kit.

Ronda 2 (sin tercera ronda):

- **Aceptado** — el escenario del otro día pasaba sin filtro → ahora Sur reservada el martes y salida `Norte`.
- **Aceptado** — contiguos y «sin día» pasan hoy → el primero cubre también 08:00-10:00; el segundo queda marcado como regresión; los que fallan hoy son el solape, con y sin día.
- **Aceptado** — parseo de `run` y casos de argumentos → decisión 7 y Scope.
- **Aceptado** — comparación del día y franja guardada → decisiones 7 y 8.
- **Aceptado** — salas y orden → decisión 8.
- **Aceptado, y es la primera pregunta del gate** — alcance sujeto a la decisión 1.
- **Aceptado** — nombre de la capacidad ajustado.
- **Aceptado** — alternativa `freeRooms(slot, day?)` en Approach, descartada con motivo.
- **Aceptado** — tamaño y ficheros unificados, mínimo razonable corregido.
- **Aceptado** — fila del CHANGELOG quitada y comprobación en `ROADMAP.md`.

### Decisiones tomadas con el dev-lead

- El comando de salas libres no existe y quiere que se añada — «mantengo lo que dije». Contradice el repo: ver decisión 1.

## Intent

Hoy el comando de salas libres solo compara la franja exacta y no mira el día: una reserva del lunes oculta la sala el martes y una franja que solapa sin ser igual no cuenta. Quiero que responda bien a «¿qué salas puedo reservar el martes de 10:30 a 11:30?». Éxito: cada escenario de la sección Delta da la salida escrita. Fracaso aunque «funcione»: que `libres 10:00-12:00` deje de dar `Sur`.

## Scope

- Entra: día opcional y solape de franjas en `libres`, con el reparto de argumentos en `run`; mensaje cuando no queda ninguna sala; tests. El alcance «día y solape» depende de la respuesta a la decisión 1.
- No entra: validar el formato de franja o día; reservar; otro comando.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Comparación de franja exacta (`b.slot === slot`) | `src/app.js:6` | Scope y requisito «Una franja que solapa ocupa la sala» |
| Salida vacía sin salas libres | `src/app.js:10` | Decisión 5 |

- Filas que implementa: ninguna → nada: comprobado con `grep -n 0010 ROADMAP.md`: sin fila

## Approach

- Ampliar `freeRooms(slot)` a `freeRooms(day, slot)` — cuesta ~15 líneas y un parámetro (firma `freeRooms(day, slot)`); el test actual de `libres` sigue valiendo (comprueba `Sur`; ningún test fija la salida vacía).
- `freeRooms(slot, day?)`, sin cambiar el orden de los argumentos — con el día opcional al final no hace falta contar argumentos en `run`, pero el comando se escribe `libres <franja> [día]`, al revés que `cancelar`; descartado por la coherencia con `cancelar`.
- Comando nuevo (`disponibles`) — duplica `libres` y deja dos comandos que dicen cosas distintas.
- Módulo `overlap.js` aparte — innecesario para una comparación de dos números.
- Elegido: ampliar `freeRooms` — es el mínimo y no rompe nada de lo hecho.

El solape compara horas de inicio y fin como minutos: ocupa si `ini < fin' && ini' < fin`.

## Dónde se prueba

- Día y solape: por `run('libres', …)`, como el test actual de `libres`, en `test/app.test.js`.
- Sin salas libres: igual, con una franja que cubre ambas salas.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-availability`

#### ADDED — Una franja que solapa ocupa la sala

- GIVEN Norte reservada el lunes de 10:00 a 12:00
- WHEN `libres lun 10:30-11:30`
- THEN la salida es `Sur`

#### ADDED — Otro día no ocupa la sala

- GIVEN Norte reservada el lunes de 10:00 a 12:00 y Sur reservada el martes de 10:00 a 12:00
- WHEN `libres mar 10:00-12:00`
- THEN la salida es `Norte`

#### ADDED — Sin día se mira cualquier día (regresión: ya se cumple hoy)

- GIVEN Norte reservada el lunes de 10:00 a 12:00
- WHEN `libres 10:00-12:00`
- THEN la salida es `Sur`

#### ADDED — Sin día y franja solapada

- GIVEN Norte reservada el lunes de 10:00 a 12:00
- WHEN `libres 10:30-11:30`
- THEN la salida es `Sur`

#### ADDED — Franjas contiguas no solapan

- GIVEN Norte reservada el lunes de 10:00 a 12:00
- WHEN `libres lun 12:00-14:00` y `libres lun 08:00-10:00`
- THEN la salida de ambas es `Norte, Sur`

#### ADDED — Sin salas libres

- GIVEN Norte reservada el lunes de 10:00 a 12:00 y Sur reservada el lunes de 10:00 a 12:00
- WHEN `libres lun 10:00-12:00`
- THEN la salida es `ninguna sala libre`

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
