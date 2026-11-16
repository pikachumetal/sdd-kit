---
id: 20261108-215707-feature-0008-lista-espera
feature: 0008
title: Lista de espera para una sala ocupada
mode: full
status: draft
created: 2026-11-08
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Lista de espera para una sala ocupada

🦆 Hoy, si quieres una sala y está ocupada por otra persona, no hay forma de dejar constancia de que la quieres. Con esto, `reservar Norte lun 10:00-12:00` con la sala ocupada te apunta en una lista de espera («Norte ocupada lun 10:00-12:00: en lista de espera»), `espera` te enseña tus esperas y, cuando se cancela esa reserva, tu espera pasa sola a ser reserva. Si la franja ya es tuya, te dice «ya tienes reservada…» y no te apunta. Por dentro: una lista `waitlist` en `src/app.js`, junto a `bookings`, y tres cambios en `run()`.

Validación: dev-lead (tú, único usuario y desarrollador) — es un comando que usa una persona; lo que sale por pantalla lo tiene que ver ella.

## Capacidades

- Nuevas: `waitlist` — apuntarse a una sala ocupada, ver las esperas y pasar a reserva cuando se libera.
- Modificadas: ninguna (aún no existe ninguna capacidad en `capabilities/`; la forma nueva de `reservar` y el cambio de salida de `cancelar` están en «Lo que se retira o cambia de forma»).
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec: un revisor (dominio, Opus) más una segunda ronda (Sonnet) por haber aceptado Críticos — señales: capacidad nueva · tamaño: ~60 líneas en 2 ficheros (`src/app.js`, `test/app.test.js`)
- Dominio (opus): si el paso automático a reserva no se contradice con `cancelar` (que hoy solo compara día y hora) ni con el duplicado, y si la spec dice qué NO ocurre (señal: capacidad nueva con reglas de flujo)
- Mínimo razonable: sin revisor — dejaba sin mirar si la promoción al cancelar choca con el comportamiento actual de `cancelar`

Pediste «empieza ya, no me preguntes más», así que todo lo que no dijiste es mío:

1. **Forma del comando**: `reservar <sala> <día> <franja>` (p. ej. `reservar Norte lun 10:00-12:00`). Hoy `reservar` solo existe con `--cada-semana` (con otros parámetros cae en la respuesta genérica `salas`); la forma nueva convive con ella sin tocarla. La franja es la misma cadena que ya usa `libres`.
2. **Reservar una sala libre** también entra: la reserva se crea (marcada como tuya) y responde `reservada Sur lun 10:00-12:00`. Sin esto no hay forma de probar la espera de punta a punta.
3. **Quién ocupa la sala**: las salas pueden estar ocupadas por otras personas del coworking (como la reserva de `Norte` que ya trae `bookings`), que esta herramienta no distingue por nombre. Las reservas que haces tú con `reservar` quedan marcadas como propias. **Reservar una franja que ya es tuya** responde `ya tienes reservada Sur lun 10:00-12:00` y no crea espera (si no, esperarías por tu propia reserva y `cancelar` la volvería a reservar).
4. **Sala ocupada por otra persona ⇒ te apunta solo**, sin preguntar «¿quieres esperar?». Texto: `Norte ocupada lun 10:00-12:00: en lista de espera`.
5. **«Ocupada» = misma sala, mismo día y misma franja, por coincidencia exacta de texto**, igual que `libres`. No hay solape de franjas (`10:00-11:00` no choca con `10:00-12:00`). `reservar --cada-semana` hoy no guarda ninguna reserva, así que no ocupa nada.
6. **Sin posiciones ni cola**: eres la única persona que usa la herramienta (misión) y, sin duplicados, cada sala+día+franja tiene a lo sumo una espera. `espera` las lista por orden de alta (el del array).
7. **Duplicado**: apuntarte dos veces a lo mismo no añade nada y responde `ya estás en la lista de espera de Norte lun 10:00-12:00`.
8. **Comando nuevo `espera`** (sin parámetros), una espera por línea: `Norte lun 10:00-12:00`; sin ninguna, `sin esperas`.
9. **Al cancelar**: `cancelar <día> <franja> [sala]` — la sala es un tercer parámetro opcional nuevo. Sin sala, se cancela solo si hay exactamente una reserva en ese día y franja; con varias y sin sala **no se borra ninguna reserva**, no se promociona nada y la salida es la de hoy. `cancelar` afecta a cualquier reserva, propia o ajena. Si se cancela una reserva y hay espera de esa sala, día y franja, pasa a reserva y se añade una segunda línea `lista de espera: Norte lun 10:00-12:00 pasa a reservada`. Si no hay espera, o la reserva no existía, la salida es la de hoy (`cancelada mar 10:00` no cambia: `10:00` no coincide con `10:00-12:00`). La promoción crea una reserva marcada como tuya, así que después `reservar` esa franja responde `ya tienes reservada …`. Como una espera solo nace sobre una sala ocupada y la única forma de liberar una reserva con espera es `cancelar` con sala, que siempre promociona, **no puede haber esperas huérfanas**.
10. **Entrada no válida**: una sala que no existe responde `sala desconocida: Oeste` y no crea nada; los nombres de sala distinguen mayúsculas (`Norte`, `Sur`). `cancelar` no valida la sala (`cancelar lun 10:00-12:00 Oeste` da la salida de hoy). Otras entradas mal formadas (día o franja inventados, parámetros que faltan) no se validan: es la deuda «Sin validación del formato de franja horaria» del roadmap.
11. **Sin aviso externo**: no se manda correo; el paso a reserva solo se ve en la salida de `cancelar`. Los avisos por correo son el ítem 1 del roadmap.
12. **Sin tope** de longitud de la lista y **sin darse de baja** de una espera (no hay forma de cancelarla): no lo pediste y a un único usuario le basta; si estorba, es otra feature.
13. **Datos en memoria**, igual que `bookings` hoy; una espera es `{ room, day, slot }` y una reserva gana un campo `own` (verdadero si la hiciste tú). Persistir es otra feature.
14. **Nombre de la capacidad**: `waitlist` (inglés, kebab-case: el slug es un nombre de fichero); el contenido va en castellano.
15. **`libres` no cambia**: tener esperas no oculta ni muestra salas (una espera no es una reserva).
16. **Repaso de coherencia**: quité «posición» y FIFO de la primera versión (con un solo usuario no tenían escenario); `git grep` sin resultados para lo que se retira; `sdd capability merge` sobre una copia de `.docs/sdd` pasó sin rechazos; **repetirlo sobre una copia al aprobar**, porque la spec puede cambiar.
17. **Estado inicial de `bookings`**: el de hoy, una sola reserva ajena `Norte lun 10:00-12:00`. Los escenarios con otras reservas ajenas (martes, `Sur`) parten de ese estado ampliado en el test; cómo se prepara es cosa del plan.
18. **Un solo carril/tamaño**: ~3 tasks previstas (reservar con espera, espera, cancelar con promoción), así que no propongo partir la feature ni hago las secciones de diseño.
- Política de modelos: revisor de la spec Opus (dominio, uno solo) y segunda ronda con un revisor Sonnet por haber aceptado Críticos · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

1. **Aceptado** (Crítico) — esperar por tu propia reserva → decisión 3 y escenario «Reservar una franja que ya es tuya».
2. **Aceptado** (Crítico) — `cancelar` sin sala ni formato de clave → decisión 9, escenarios «Cancelar con dos salas a la misma hora» y «La franja de cancelar es exacta».
3. **Aceptado** — faltaban cancelar de reserva inexistente y espera de otra franja → escenario «Cancelar otra franja no promociona» y decisión 9 (sin esperas huérfanas).
4. **Aceptado** — definición de «ocupada» → decisión 5 y escenario «El solape no cuenta».
5. **Aceptado** — `reservar` y `cancelar` cambian de forma → tabla de «Lo que se retira o cambia de forma».
6. **Aceptado en parte** — sala inexistente y `libres` sin cambios → decisiones 10 y 15 y dos escenarios; el resto de entradas mal formadas queda fuera (deuda del roadmap).
7. **Aceptado** — contradicción orden/«sin cola» → decisión 6 aclara que `espera` lista por orden de alta.
8. **Aceptado** — forma del dato, mayúsculas y validación de sala → decisiones 10 y 13.
9. **Aceptado en parte** — falta el aviso `reservada …` → añadido a Avisos; el nombre `waitlist` se mantiene en inglés por la regla del kit (decisión 14).
10. **Aceptado** — la verificación cambiaba el estado → el escenario comprueba con `libres` (solo lectura).

### Segunda ronda (Sonnet)

1. **Aceptado** (Crítico) — estado tras `cancelar` sin sala → decisión 9 y escenario «Cancelar con dos salas» (no se borra nada).
2. **Aceptado** (Crítico) — GIVEN inalcanzables → reescritos con `Norte` ocupada; «Cancelar lo que no existe» se fundió en «Cancelar otra franja».
3. **Aceptado** — esperas huérfanas → decisión 9 (no pueden existir).
4. **Aceptado** — estado inicial de `bookings` → decisión 17.
5. **Aceptado en parte** — `cancelar` con sala inexistente → fuera de alcance (decisión 10, Scope).
6. **Aceptado** — propiedad tras promoción → decisión 9 y escenario «Tras la promoción la franja es tuya».
7. **Aceptado** — avisos y límite → reglas de la capacidad.
8. **Aceptado** — resultado de ejecución incrustado → decisión 16.
9. **Aceptado** — línea de review → cabecera.
10. **Aceptado** — «dev-lead» → Validación.

### Decisiones tomadas con el dev-lead

- Añadir una lista de espera para cuando la sala que se quiere está ocupada — «añade una lista de espera para cuando la sala que quiero está ocupada»
- Seguir sin más preguntas — «Empieza ya, no me preguntes más»

## Intent

Hoy, cuando la sala que quieres está ocupada por otra persona, no puedes dejar constancia de que la quieres y tienes que volver a mirar a mano. Importa porque las reservas se cancelan y la franja queda libre. Éxito: apuntarte con una orden y que, al cancelarse esa reserva, tu espera pase a reserva sin que repitas nada. Fracaso, aunque funcione técnicamente: que una espera deje una sala reservada sin que se vea, que esperes por tu propia reserva, o que `cancelar` cambie su salida cuando no hay esperas.

## Scope

- Entra: `reservar <sala> <día> <franja>` (libre ⇒ reserva propia; ocupada por otra persona ⇒ espera; propia ⇒ aviso), el comando `espera`, y `cancelar <día> <franja> [sala]` con promoción. `src/app.js` y `test/app.test.js`.
- No entra: avisos por correo, persistencia, darse de baja de una espera, tope de la lista, validar día o franja mal formados, validar la sala en `cancelar`, solape de franjas, tocar `reservar --cada-semana` ni `libres`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `reservar <sala> <día> <franja>`: hoy cae en la respuesta genérica `salas` (rama final de `run()`); pasa a reservar o a apuntar a la espera | `src/app.js` (`run`), `test/app.test.js` | Scope y decisión 1; ADDED «Reservar una sala libre» y «Apuntarse a una sala ocupada» |
| Salida de `cancelar`: puede ganar una segunda línea de promoción y un tercer parámetro opcional `[sala]` | `src/app.js` (`run`), test «cancelar respeta el día» | Decisión 9; ADDED «Al cancelar…» y «La franja de cancelar es exacta» (el test actual no cambia) |

- Filas que implementa: nada: el roadmap no tiene fila de esta feature; comprobado con `git grep -niE "espera|0008" -- .docs/sdd/roadmap.md` (sin resultados)

## Approach

Alternativas: (a) una lista `waitlist` junto a `bookings`, procesada en `run()` — elegida por ser lo que ya hace el fichero; (b) un campo `status` en `bookings` — descartada, mezcla reservas y esperas y `libres` tendría que filtrarlas; (c) un módulo aparte — descartada, el stack dice «un solo fichero de entrada». La espera se guarda como `{ room, day, slot }`.

## Dónde se prueba

- Reservar libre, reservar ocupada, propia, duplicado, sala desconocida y `espera`: por `run()`, como los tests actuales de `test/app.test.js`.
- Promoción al cancelar, cancelar sin espera, con dos salas y franja exacta: por `run()`, como el test «cancelar respeta el día».

## Términos y ADR

- Términos resueltos: espera — petición de una sala ocupada por otra persona, que pasa a reserva al cancelarse; reserva — lo que ya existe en `bookings`, propia si la hiciste con `reservar`
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `waitlist`

#### ADDED — Reservar una sala libre

- GIVEN `Sur` sin reservas el lunes de 10:00-12:00
- WHEN `reservar Sur lun 10:00-12:00`
- THEN la salida es `reservada Sur lun 10:00-12:00`

#### ADDED — Apuntarse a una sala ocupada

- GIVEN `Norte` reservada por otra persona el lunes de 10:00-12:00 (la reserva que trae `bookings`) y ninguna espera
- WHEN `reservar Norte lun 10:00-12:00`
- THEN la salida es `Norte ocupada lun 10:00-12:00: en lista de espera`
- AND `espera` muestra `Norte lun 10:00-12:00`

#### ADDED — Reservar una franja que ya es tuya

- GIVEN `Sur` reservada por ti con `reservar Sur lun 10:00-12:00`
- WHEN `reservar Sur lun 10:00-12:00` otra vez
- THEN la salida es `ya tienes reservada Sur lun 10:00-12:00` y `espera` muestra `sin esperas`

#### ADDED — El solape no cuenta

- GIVEN `Norte` reservada por otra persona el lunes de 10:00-12:00
- WHEN `reservar Norte lun 10:00-11:00`
- THEN la salida es `reservada Norte lun 10:00-11:00` y `espera` muestra `sin esperas`

#### ADDED — Sala desconocida

- GIVEN las salas `Norte` y `Sur`
- WHEN `reservar Oeste lun 10:00-12:00`
- THEN la salida es `sala desconocida: Oeste` y `espera` muestra `sin esperas`

#### ADDED — Varias esperas a la vez

- GIVEN `Norte` reservada por otra persona el lunes y el martes de 10:00-12:00
- WHEN `reservar Norte lun 10:00-12:00` y después `reservar Norte mar 10:00-12:00`
- THEN `espera` muestra dos líneas, `Norte lun 10:00-12:00` y `Norte mar 10:00-12:00`, en el orden en que te apuntaste

#### ADDED — No se duplica una espera

- GIVEN una espera de `Norte` el lunes de 10:00-12:00
- WHEN `reservar Norte lun 10:00-12:00` otra vez
- THEN la salida es `ya estás en la lista de espera de Norte lun 10:00-12:00` y `espera` sigue mostrando una sola línea

#### ADDED — Ver las esperas

- GIVEN ninguna espera
- WHEN `espera`
- THEN la salida es `sin esperas`

#### ADDED — Al cancelar, la espera pasa a reserva

- GIVEN `Norte` reservada por otra persona el lunes de 10:00-12:00 y una espera de `Norte` ese día y franja
- WHEN `cancelar lun 10:00-12:00`
- THEN la salida es `cancelada lun 10:00-12:00` y una segunda línea `lista de espera: Norte lun 10:00-12:00 pasa a reservada`
- AND `espera` muestra `sin esperas` y `libres 10:00-12:00` no incluye `Norte`

#### ADDED — Tras la promoción la franja es tuya

- GIVEN la espera de `Norte` lun 10:00-12:00 recién promovida a reserva por `cancelar lun 10:00-12:00`
- WHEN `reservar Norte lun 10:00-12:00`
- THEN la salida es `ya tienes reservada Norte lun 10:00-12:00` y `espera` muestra `sin esperas`

#### ADDED — Cancelar con dos salas a la misma hora

- GIVEN `Norte` y `Sur` reservadas el lunes de 10:00-12:00 y una espera de `Norte` ese día y franja
- WHEN `cancelar lun 10:00-12:00` sin sala
- THEN la salida es `cancelada lun 10:00-12:00` sin segunda línea, no se borra ninguna reserva (`libres 10:00-12:00` sigue sin incluir `Norte` ni `Sur`) y la espera sigue en `espera`
- AND `cancelar lun 10:00-12:00 Norte` pasa la espera de `Norte` a reserva

#### ADDED — Cancelar otra franja no promociona

- GIVEN `Norte` reservada por otra persona el lunes de 10:00-12:00 con una espera, y ninguna reserva de `Norte` el martes
- WHEN `cancelar mar 10:00-12:00 Norte`
- THEN la salida es `cancelada mar 10:00-12:00` sin segunda línea y la espera del lunes sigue en `espera`

#### ADDED — La franja de cancelar es exacta

- GIVEN `Norte` reservada por otra persona el lunes de 10:00-12:00 con una espera
- WHEN `cancelar mar 10:00`
- THEN la salida es `cancelada mar 10:00`, como hoy, y `10:00` no se toma como `10:00-12:00`

#### ADDED — Tener esperas no cambia las salas libres

- GIVEN una espera de `Norte` el lunes de 10:00-12:00
- WHEN `libres 10:00-12:00`
- THEN la salida es `Sur`, igual que sin la espera

#### Reglas de la capacidad — waitlist

- **Dónde viven los datos**: en memoria del proceso, junto a `bookings` en `src/app.js`
- **Idioma de los nombres**: castellano en la salida (constitución, punto 4); `waitlist` solo como nombre de capacidad (nombre de fichero)
- **Límites**: sin tope de esperas; solo una espera por sala, día y franja
- **Avisos**: `cancelada <día> <franja>` (la de hoy, sin cambios) · `reservada Sur lun 10:00-12:00` · `ya tienes reservada Sur lun 10:00-12:00` · `Norte ocupada lun 10:00-12:00: en lista de espera` · `ya estás en la lista de espera de Norte lun 10:00-12:00` · `sala desconocida: Oeste` · `sin esperas` · `lista de espera: Norte lun 10:00-12:00 pasa a reservada`
- **Regla ante conflicto**: una sala, día y franja tiene a lo sumo una espera (la repetida no entra)

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
