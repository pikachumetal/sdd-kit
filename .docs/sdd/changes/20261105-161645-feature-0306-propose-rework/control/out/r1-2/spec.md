---
id: 20261008-110000-feature-0011-void-others
feature: 0011
title: Anular reservas de otros
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: null
---

# Spec — Anular reservas de otros

🦆 Hoy `anular` anula lo que le pidas, sin preguntar quién eres. Con esta feature, antes de anular tendrás que decir quién eres con `--como`, y el programa mirará en `data/managers.json` si eres el responsable de esa sala. Si lo eres, se anula; si no, te dice quién sí puede y la reserva sigue como estaba. `cancelar` no cambia. No comprueba que seas quien dices ser: es una regla para evitar errores, no una cerradura.

## Capacidades

- Nuevas: `responsables-de-sala` — quién es responsable de cada sala.
- Nuevas: `reservas` — la anulación de una reserva la hace solo el responsable de la sala. El proyecto aún no tiene `capabilities/`: hoy `anular` existe solo en `src/app.js` (`voidBooking`), sin requisito escrito, así que se documenta con la regla ya incluida.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva, contrato público (`anular` exige `--como`; `data/managers.json` es formato nuevo), MODIFIED en el fondo (hoy cualquiera anula), datos (`data/managers.json`), reglas de visibilidad (quién no puede anular) · tamaño: ~60 líneas en 4 ficheros
- Dominio (opus): qué NO puede hacer quien no es responsable, y si el Intent promete más de lo que el `--como` autodeclarado cumple (señal: reglas de visibilidad)
- Técnica (sonnet): si cada THEN es verificable y los bordes de `data/managers.json` y del parseo de `--como` (señal: contrato público + datos)
- Mínimo razonable: solo técnica — deja sin mirar el complemento del rol (qué no puede hacer el que no es responsable)

### Decisiones

1. Capacidades nuevas `responsables-de-sala` y `reservas`, en castellano y con el vocabulario de `PRODUCT.md` (no `room-managers` / `bookings`). `capabilities/` está vacío y el merge rechaza modificar una capacidad sin fichero, así que `reservas` nace con `ADDED` y recoge el comportamiento actual de `anular` más la regla nueva.
2. **Anular es solo del responsable.** Según `PRODUCT.md`, Anulación es lo que hace el responsable de sala; lo que hace quien reservó es Cancelación (`cancelar`, que no se toca). Las reservas no guardan titular, así que `anular` no distingue «de otra persona»: lo ejecuta el responsable o se rechaza. El ticket decía «reservas de otras personas»; esto lo he fijado yo.
3. Quien ejecuta se identifica con `--como <nombre>`, en cualquier posición tras el comando. El valor es el token siguiente; si falta, está vacío (`--como ""`) o empieza por `--`, responde «falta --como y quién anula». Si `--como` está repetido, vale el primero.
4. **Identidad autodeclarada.** `--como` no se verifica: cualquiera puede escribir `--como Ana`. La restricción es de conducta, no de seguridad, y quien se haga pasar por el responsable se salta también el plazo de 24 h de Cancelación: riesgo aceptado. `mission.md` dice que la usa una sola persona y `PRODUCT.md` habla de equipos de oficina; **pregunta abierta para Laura**: qué fuente manda. Si el producto va a equipos, hace falta una feature de autenticación.
5. `data/managers.json` es un mapa sala → un único responsable (cadena no vacía), `{"Norte": "Ana", "Sur": "Luis"}`. Se versiona con esos valores de ejemplo. Comparación de nombres exacta, distingue mayúsculas y acentos. Cualquier otra forma (array, valor que no es cadena, responsable vacío) cuenta como ilegible.
6. Firmas nuevas en `src/app.js`: `managerOf(sala, managers)`, `voidBooking(room, day, quien, managers)` y `run(cmd, params, managers)`; `managers` es opcional y, si falta, se lee `data/managers.json` relativo a `src/app.js` (no al directorio de trabajo). Los tests de `node --test` pasan `managers` y no dependen del fichero real. `managerOf` de una sala ausente da `undefined`; con fichero ilegible lanza error.
7. **Orden de comprobaciones de `anular`:** `--como` → fichero legible → la sala tiene responsable → quien anula es ese responsable → la reserva existe. La respuesta sale por stdout con código de salida 0, como el resto de comandos. El estado de la reserva se comprueba con `libres 10:00-12:00`.
8. **Contrato:** `anular` pasa a exigir `--como`; rompe a quien lo invoque hoy sin él (scripts, documentación). No hay más consumidores conocidos (`mission.md`).
9. Las cinco reglas: datos: `data/managers.json` · nombres: en castellano · límites: un responsable por sala; Anulación sin plazo (el de 24 h es de Cancelación y no aplica) · avisos: no aplica, no hay notificación a nadie · conflicto: sala sin responsable o fichero ilegible → nadie anula.

### Hallazgos de la review

Primera ronda (dominio y técnica):

- **Aceptado** — `responsables-de-sala` sin escenario verificable → `managerOf` y ruta relativa (decisión 6).
- **Aceptado** — sala ausente, fichero ausente o JSON malformado sin definir → escenarios y decisión 5.
- **Aceptado** — parseo de `--como` incompleto → decisión 3.
- **Aceptado** — qué pasa si quien reservó usa `anular` → decisión 2 y escenario; en `PRODUCT.md` eso es Cancelación.
- **Aceptado** — `--como` sin autenticación → decisión 4.
- **Aceptado** — nombres de capacidad en inglés y vocabulario de `PRODUCT.md` → decisión 1.
- **Aceptado** — comportamiento actual prometido pero no escrito → escenario de reserva inexistente.
- **Aceptado** — mensajes, nombres de sala y reglas sin declarar → decisiones 5, 7 y 9.
- **Aceptado** — canal de salida y estado de la reserva → decisión 7.
- **Aceptado** — contradicción `mission.md` / `PRODUCT.md` → decisión 4, como pregunta abierta.
- **Aceptado** — «merge probado» no es decisión → fuera de la lista: el merge sobre copia de `.docs/sdd` falló al principio (`bookings` sin fichero; hueco `<nombre>`), se corrigió y pasa.

Segunda ronda (una revisora, Sonnet):

- **Aceptado** (Crítico) — la promesa de que el titular conserva `cancelar` no se verificaba → el Intent ya no la promete y el Scope dice que `cancelar` no se toca.
- **Aceptado** (Crítico) — escenarios no fijaban el orden → decisión 7 con el orden completo y escenario de sala sin responsable, haya reserva o no.
- **Aceptado** (Crítico) — parseo de `--como` en bordes → decisión 3 y escenarios con `--como ""` y `--como --como Ana`.
- **Aceptado** — riesgo del plazo de 24 h y conducta frente a seguridad → decisión 4.
- **Aceptado** — contradicción de fuentes → decisión 4, pregunta abierta para Laura; no la cierro yo.
- **Aceptado** — mensajes de `anular` mal ubicados → pasan a `reservas`; `responsables-de-sala` queda con `managerOf`.
- **Aceptado** — dónde se lee el fichero y formas inválidas → decisiones 5 y 7.
- **Aceptado** — firmas y contrato → decisiones 6 y 8.
- **Aceptado** — reglas mezcladas y aviso mal formulado → decisión 9.
- **Aceptado** — «de Pedro» no construible → quitado de los GIVEN; escenarios del titular y del no responsable fundidos.
- **Rechazado** — sacar el bloque de la review de «Decisiones»: el bloque abre la ✋ por convención del kit.

## Intent

Hoy cualquiera anula cualquier reserva. Solo el responsable de cada sala debe poder anular reservas.

## Scope

- Entra: `anular <sala> <día> --como <nombre>` (`voidBooking`, `run` y `managerOf` en `src/app.js`); `data/managers.json`; sus tests en `test/`.
- No entra: `cancelar`, que no se toca; autenticar a quien anula.

## Approach

`anular` lee `--como`, consulta `managerOf(sala)` en `data/managers.json` y rechaza a quien no es responsable de la sala.

## Delta de comportamiento

### Capacidad: `responsables-de-sala`

**ADDED — Cada sala tiene un responsable**
- GIVEN `managers` con `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN `managerOf("Norte")`
- THEN es Ana
- AND `managerOf("Este")` es `undefined`

**ADDED — Fichero ilegible**
- GIVEN `data/managers.json` ausente, con JSON inválido o con forma incorrecta
- WHEN `managerOf("Norte")`
- THEN lanza error «no se puede leer data/managers.json»

### Capacidad: `reservas`

**ADDED — Anular una reserva es cosa del responsable**
- GIVEN Norte con reserva el lunes y Ana responsable de Norte
- WHEN `anular Norte lun --como Luis`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue activa (`libres 10:00-12:00` no incluye Norte)
- AND `anular Norte lun --como Pedro` responde lo mismo, sea quien sea Pedro
- AND `anular Norte lun --como Ana` responde «anulada Norte lun»

**ADDED — Anular exige decir quién anula**
- GIVEN Norte con reserva el lunes
- WHEN `anular Norte lun`, `anular Norte lun --como`, `anular Norte lun --como ""` o `anular Norte lun --como --como Ana`
- THEN responde «falta --como y quién anula» y la reserva sigue activa

**ADDED — Sala sin responsable**
- GIVEN `managers` con `{"Sur": "Luis"}`
- WHEN `anular Norte lun --como Luis`, haya reserva o no
- THEN responde «Norte no tiene responsable» y nada cambia

**ADDED — Sin fichero legible nadie anula**
- GIVEN `data/managers.json` ausente o ilegible
- WHEN `anular Norte lun --como Ana`
- THEN responde «no se puede leer data/managers.json» y la reserva sigue activa

**ADDED — Anular una reserva que no existe**
- GIVEN Sur sin reserva el martes y Luis responsable de Sur
- WHEN `anular Sur mar --como Luis`
- THEN responde «sin reserva Sur mar»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
