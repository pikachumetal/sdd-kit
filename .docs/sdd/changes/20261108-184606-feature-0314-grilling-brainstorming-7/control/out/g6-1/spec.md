---
id: 20261108-215123-feature-0008-lista-espera
feature: 0008
title: Lista de espera para una sala ocupada
mode: full
profile: delegate
status: in-review
created: 2026-11-08
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Lista de espera para una sala ocupada

🦆 Hoy, si la sala que quieres está reservada, solo puedes volver a mirar `libres` a mano. Con esto te apuntas: `espera Norte lun 10:00-12:00` → `Norte ocupada lun 10:00-12:00; en espera`. Cuando después cancelas esa reserva, el propio `cancelar` te lo dice: `cancelada lun 10:00; libre: Norte lun 10:00-12:00`, y la sala queda de verdad libre. Solo te avisa: la reserva la haces tú con `reservar`. La lista vive en memoria, como las reservas de hoy: no sobrevive entre una ejecución del comando y la siguiente.

Validación: dev-lead — es una herramienta que usa una persona y lo observable es la salida de los comandos.

## Capacidades

- Nuevas: `waitlist` — apuntarse a una sala/franja ocupada, ver las esperas y el aviso al liberarse.
- Modificadas: ninguna (no hay `capabilities/` todavía; ver decisión 10).
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: capacidad nueva (`waitlist`) · tamaño: ~50 líneas en 2 ficheros (`src/app.js`, `test/app.test.js`), sin contrato público
- Único (sonnet): si los literales de salida de los requisitos son consistentes entre sí y con la salida actual de `cancelar` (`cancelada mar 10:00`), y si falta algún caso límite (sala desconocida, doble apuntado, cancelar sin reserva) (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin cubrir la coherencia de los literales entre requisitos, que son los que el código copiará tal cual

1. **Qué pasa al liberarse: solo avisa, no reserva** — es la opción 2️⃣ que recomendé; tomo tu «sí, adelante» como aceptarla, pero no elegiste número: **valídala**. Reservar sola (1️⃣) sería una decisión grande para una herramienta de una persona.
2. **La lista vive en memoria, como `bookings`** — hoy las reservas son un array en `src/app.js` y cada ejecución del comando arranca de cero. **Consecuencia que debes validar:** `espera` y el aviso de `cancelar` solo se ven dentro del mismo proceso (en los tests); desde la terminal, un `espera` y un `cancelar` en dos ejecuciones separadas no se ven, así que **para uso real desde la terminal esta feature no sirve hasta que haya persistencia**. Guardar en fichero es otra feature (datos persistentes) que habría que añadir al roadmap.
3. **Sin orden de cola** — la herramienta la usas solo tú (mission.md), así que no hay «1.º en espera» como en mi ejemplo de antes: la lista son las franjas que esperas, sin turnos. Corrijo así lo que mostré en la pregunta.
4. **Nombres de comando nuevos:** `espera <sala> <día> <franja>` para apuntarse y `en-espera` (sin argumentos) para ver la lista — nadie los dijo.
5. **Textos de salida (literales, ver los THEN):** `Norte ocupada lun 10:00-12:00; en espera` · `Norte libre lun 10:00-12:00; usa reservar` · `ya estás en espera de Norte lun 10:00-12:00` · `sala desconocida: Oeste` · `en espera: Norte lun 10:00-12:00` · `sin esperas` · sufijo de `cancelar`: `; libre: Norte lun 10:00-12:00`. `; ` separa el estado del sufijo (en `espera` y en `cancelar`); `, ` separa los elementos de una lista, que siguen el orden en que te apuntaste.
6. **`cancelar` ahora libera de verdad** *(cambia un comportamiento existente — valídala)* — hoy `cancelar` solo devuelve texto y no toca `bookings`, así que decir «libre» sería falso. Decido que `cancelar <día> <hora>` quita de `bookings` las reservas de ese día cuya franja empieza en esa hora (`cancelar` no lleva sala, así que son todas las de esa hora), y que solo avisa de las esperas que coinciden exactamente (sala, día y franja) con una reserva quitada. **Ojo, es un borrado por hora:** `cancelar lun 10:00` también quita una reserva de otra sala que empiece a esa hora aunque no tengas espera de ella (requisito «Cancelar quita las reservas de esa hora»). Alternativa que puedes pedir: sala como argumento opcional de `cancelar`. Alternativa descartada: dejar `cancelar` como está y avisar igualmente, pero entonces el aviso miente y `espera`/`libres` seguirían viendo la sala ocupada.
7. **Ocupada = hay una reserva de esa sala, día y franja exactos en `bookings`.** Una reserva de otro día, o de otra franja que empieza a la misma hora (`10:00-11:00` frente a `10:00-12:00`), no cuenta. `libres` hoy ignora el día; no lo toco.
8. **Salas válidas = las de `rooms` (`Norte`, `Sur`)**, con mayúscula inicial tal cual; `norte` es sala desconocida. No valido el formato de día ni de franja ni los argumentos que falten (ya hay una deuda técnica en el roadmap para la franja): entra lo que se escriba.
9. **Capacidad nueva `waitlist`** (slug en inglés, kebab-case) — a validar.
10. **El cambio de `cancelar` va como requisito ADDED de `waitlist`, no como MODIFIED** — no existe ninguna capacidad que documente `cancelar` (`capabilities/` está vacío); crear una capacidad base de reservas queda fuera. Si prefieres crearla, es otra feature.
11. **Después de avisar, la espera se quita de la lista**, también con varias esperas; solo se avisa de esperas que casan con una reserva quitada en ese `cancelar`.
12. **Precedencia en `espera`:** sala desconocida, luego sala libre, luego espera duplicada, luego alta.
13. **Cómo se preparan los GIVEN:** hoy `reservar` no añade reservas a `bookings` y solo hay una de partida (`Norte lun 10:00-12:00`); los tests de esta spec preparan el estado (reservas y esperas) directamente, y cómo lo hacen (exponer los arrays o una función de reinicio) lo decide el plan.

*Nota:* sin `§Frontend` ni paralelismo que declarar: es una CLI sin pantalla.

- Política de modelos: revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.
- Resultado de la fusión del delta sobre una copia de `.docs/sdd`: `sdd capability merge` salió con 0 — `waitlist.md`: 11 requisitos añadidos y 5 reglas añadidas.

### Hallazgos de la review

- **Aceptado** — Crítico: `cancelar` no toca `bookings`, así que «libre» era falso → decisión 6 (`cancelar` quita de verdad las reservas de ese día y hora) y requisito «Aviso al cancelar».
- **Aceptado** — Crítico: el scenario de cancelar no tenía la reserva en el GIVEN ni cubría cancelar sin reserva → GIVEN con la reserva y nuevo requisito «Cancelar sin reserva no avisa».
- **Aceptado** — Importante: varias esperas dentro de un AND, sin orden → requisito propio «Aviso con varias esperas», orden de apuntado.
- **Aceptado** — Importante: salas válidas y argumentos inválidos sin definir → decisión 8 y «No entra».
- **Aceptado** — Importante: reglas de coincidencia evasivas → decisiones 7 y 8 y «Reglas de la capacidad».
- **Aceptado** — Importante: «ocupada» y la misma hora de inicio con otra franja sin scenario → requisitos «Ocupada es sala, día y franja exactos» y «Cancelar solo avisa de la franja exacta».
- **Rechazado** — Importante: tratar el cambio de `cancelar` como MODIFIED y crear la capacidad base → decisión 10: no existe capacidad que lo documente y crearla es otra feature.
- **Aceptado** — Menor: dejar explícito que no funciona entre ejecuciones → decisión 2 y regla «Dónde viven los datos». Rechazado añadir persistencia: es decisión tuya y va como feature aparte.
- **Aceptado** — Menor: `cancelar lun 14:00` en su propio scenario → «Cancelar sin reserva no avisa».
- **Aceptado** — Menor: separadores → decisión 5 (`, ` para listas, `; ` solo antes del aviso).

Segunda ronda (un revisor, sonnet):

- **Rechazado** — Crítico: el cambio de `cancelar` debería ser MODIFIED → no hay capacidad previa que modificar (`capabilities/` vacío) y `sdd capability merge` no puede modificar lo que no existe; queda a tu validación en la decisión 10.
- **Aceptado** — Crítico: el borrado por hora de inicio es destructivo y estaba escondido en un AND → requisito propio «Cancelar quita las reservas de esa hora» y aviso en la decisión 6, con la alternativa de sala opcional.
- **Aceptado** — Importante: no se decía que las esperas avisadas se quitan → decisión 11 y regla ante conflicto.
- **Aceptado** — Importante: la aserción sobre `libres` usaba un literal no especificado → sustituida por `espera Norte lun 10:00-12:00` → `Norte libre lun 10:00-12:00; usa reservar`.
- **Aceptado** — Importante: separadores → decisión 5.
- **Aceptado** — Importante: precedencia de comprobaciones → decisión 12.
- **Rechazado** — Importante: invertir el orden de «Aviso con varias esperas» → ya es `Sur` antes que `Norte`, que no coincide ni con el orden de `rooms` (`Norte`, `Sur`) ni con el alfabético.
- **Aceptado** — Menor: preparar los GIVEN sin `reservar` → decisión 13.
- **Aceptado** — Menor: decisiones no listadas y numeración → decisiones 11 a 13 y nota.

### Decisiones tomadas con el dev-lead

- Carril feature, modo full, perfil delegate — «sí, adelante: feature full con delegate»

## Intent

Hoy, con la sala ocupada, solo se puede volver a consultar `libres` a mano. Se quiere apuntarse a esa sala y franja y que, al cancelar la reserva que la ocupaba, la salida de `cancelar` lo diga y la sala quede libre. Éxito: tras `espera Norte lun 10:00-12:00` y `cancelar lun 10:00` (con esa reserva existente), la salida incluye `libre: Norte lun 10:00-12:00`. Fracaso aunque funcione: que la herramienta reserve sola sin que lo pidas, que avise de una espera de otro día u hora, o que avise de «libre» sin que la reserva haya existido.

## Scope

- Entra: comando `espera`; comando `en-espera`; `cancelar` quita las reservas de ese día y hora y añade el sufijo de aviso; tests en `test/app.test.js`.
- No entra: reservar automáticamente al liberarse; persistir la lista entre ejecuciones; avisos por correo (fila 1 del roadmap); turnos o varios usuarios; quitar una espera a mano; validar formato de día, franja o argumentos que falten; solapes de franjas; cambiar `libres`; crear una capacidad base de reservas.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar` pasa a quitar reservas de `bookings` y a añadir un sufijo si hay espera coincidente | `src/app.js:12`, `test/app.test.js:14` | Requisitos «Aviso al cancelar» y «Cancelar sin reserva no avisa» del delta; decisión 6. Sin reserva coincidente la salida no cambia (`cancelada mar 10:00`) |

- Filas que implementa: nada — comprobado con `git grep -iE "espera|waitlist"` fuera de `specs/` (sin resultados) y con `git grep cancelada` (solo `src/app.js:12` y `test/app.test.js:14`).

## Approach

Una lista de esperas `{ room, day, slot }` junto a `bookings` en `src/app.js`, y tres ramas nuevas en `run()` (`espera`, `en-espera`, y la parte de `cancelar` que quita reservas y añade el sufijo), sin ficheros ni dependencias. Alternativas descartadas: reservar sola al liberarse (decisión 1, demasiado para una herramienta de una persona), solo guardar el orden sin avisar (no evita estar pendiente) y avisar sin liberar (decisión 6, el aviso mentiría).

## Dónde se prueba

- `espera`, `en-espera` y el aviso de `cancelar`: por `run()`, como los tests actuales de `test/app.test.js`; las esperas y las reservas se acumulan entre llamadas del mismo proceso; los GIVEN con más reservas que la de partida se preparan en el test (decisión 13).

## Términos y ADR

- Términos resueltos: espera — franja de una sala ocupada a la que te has apuntado | ninguno más
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `waitlist`

#### ADDED — Apuntarse a una sala ocupada

- GIVEN `Norte` reservada el `lun` en `10:00-12:00`
- WHEN `espera Norte lun 10:00-12:00`
- THEN la salida es `Norte ocupada lun 10:00-12:00; en espera`
- AND `en-espera` devuelve `en espera: Norte lun 10:00-12:00`

#### ADDED — Ocupada es sala, día y franja exactos

- GIVEN `Norte` reservada el `lun` en `10:00-12:00`
- WHEN `espera Norte mar 10:00-12:00`
- THEN la salida es `Norte libre mar 10:00-12:00; usa reservar` (otro día)
- AND `espera Norte lun 10:00-11:00` da `Norte libre lun 10:00-11:00; usa reservar` (otra franja)
- AND no se añade ninguna espera

#### ADDED — Apuntarse a una sala libre

- GIVEN `Sur` sin reserva el `lun` en `10:00-12:00`
- WHEN `espera Sur lun 10:00-12:00`
- THEN la salida es `Sur libre lun 10:00-12:00; usa reservar`
- AND no se añade ninguna espera

#### ADDED — Una espera no se duplica

- GIVEN `Norte` reservada el `lun` en `10:00-12:00` y ya estás en espera de esa franja
- WHEN `espera Norte lun 10:00-12:00`
- THEN la salida es `ya estás en espera de Norte lun 10:00-12:00`
- AND `en-espera` sigue mostrando una sola espera

#### ADDED — Sala desconocida

- GIVEN las salas `Norte` y `Sur`
- WHEN `espera Oeste lun 10:00-12:00` o `espera norte lun 10:00-12:00`
- THEN la salida es `sala desconocida: Oeste` (o `sala desconocida: norte`)
- AND no se añade ninguna espera

#### ADDED — Ver las esperas

- GIVEN `Norte` reservada el `lun` y el `mar` en `10:00-12:00`, y esperas apuntadas primero a `Norte mar 10:00-12:00` y luego a `Norte lun 10:00-12:00`
- WHEN `en-espera`
- THEN la salida es `en espera: Norte mar 10:00-12:00, Norte lun 10:00-12:00` (orden de apuntado)
- AND sin esperas la salida es `sin esperas`

#### ADDED — Aviso al cancelar

- GIVEN `Norte` reservada el `lun` en `10:00-12:00` y espera de `Norte lun 10:00-12:00`
- WHEN `cancelar lun 10:00`
- THEN la salida es `cancelada lun 10:00; libre: Norte lun 10:00-12:00`
- AND la reserva se ha quitado: `espera Norte lun 10:00-12:00` da ahora `Norte libre lun 10:00-12:00; usa reservar`
- AND esa espera se quita de la lista (`en-espera` → `sin esperas`)

#### ADDED — Aviso con varias esperas

- GIVEN `Norte` y `Sur` reservadas el `lun` en `10:00-12:00`, con espera de `Sur lun 10:00-12:00` apuntada antes que la de `Norte lun 10:00-12:00`
- WHEN `cancelar lun 10:00`
- THEN la salida es `cancelada lun 10:00; libre: Sur lun 10:00-12:00, Norte lun 10:00-12:00` (orden de apuntado)
- AND `en-espera` devuelve `sin esperas`

#### ADDED — Cancelar solo avisa de la franja exacta

- GIVEN `Norte` reservada el `lun` en `10:00-12:00`, `Sur` reservada el `lun` en `10:00-11:00`, y solo espera de `Norte lun 10:00-12:00`
- WHEN `cancelar lun 10:00`
- THEN la salida es `cancelada lun 10:00; libre: Norte lun 10:00-12:00`
- AND la reserva de `Sur` también se quita (empieza a las 10:00), pero no sale en el aviso porque no hay espera suya
- AND `en-espera` devuelve `sin esperas`

#### ADDED — Cancelar quita las reservas de esa hora

- GIVEN `Norte` reservada el `lun` en `10:00-12:00` y `Sur` reservada el `lun` en `10:00-11:00`, sin esperas
- WHEN `cancelar lun 10:00`
- THEN la salida es `cancelada lun 10:00`
- AND ambas reservas se han quitado (`espera Norte lun 10:00-12:00` y `espera Sur lun 10:00-11:00` dan `libre … usa reservar`)

#### ADDED — Cancelar sin reserva no avisa

- GIVEN `Norte` reservada el `lun` en `10:00-12:00` y espera de `Norte lun 10:00-12:00`
- WHEN `cancelar mar 10:00` (otro día) o `cancelar lun 14:00` (otra hora)
- THEN la salida es `cancelada mar 10:00` (o `cancelada lun 14:00`), sin sufijo
- AND la espera sigue en la lista y la reserva de `Norte` sigue en `bookings`

#### Reglas de la capacidad — waitlist

- **Dónde viven los datos**: en memoria del proceso, junto a `bookings`; no persisten entre ejecuciones (desde la terminal, dos comandos separados no se ven).
- **Idioma de los nombres**: textos de salida en castellano (constitución, art. 4); comandos `espera` y `en-espera`.
- **Límites**: sin tope de esperas; salas válidas las de `rooms` (con mayúscula tal cual); sin validar formato de día o franja.
- **Avisos**: los textos de los requisitos de arriba; las listas se separan con `, ` y siguen el orden de apuntado.
- **Regla ante conflicto**: en `espera` se comprueba, por este orden: sala desconocida, sala libre, espera duplicada, alta; apuntarse dos veces a lo mismo no duplica; las esperas avisadas por `cancelar` se quitan; una espera casa con una reserva solo por sala, día y franja exactos; `cancelar` casa reservas por día y hora de inicio.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
