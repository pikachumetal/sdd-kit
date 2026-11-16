---
id: 20261113-152003-feature-0010-lista-espera
feature: 0010
title: Lista de espera para una sala ocupada
mode: full
profile: delegate
status: draft
created: 2026-11-13
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Lista de espera para una sala ocupada

🦆 Hoy, si Norte está ocupada el lunes de 10:00 a 12:00, tienes que volver a ejecutar `libres` cada rato. Con esto escribes una vez `esperar Norte lun 10:00-12:00` y la herramienta lo apunta en un fichero; cuando después ejecutes `cancelar lun 10:00` y esa reserva se libere, Norte pasa a ser tuya y la salida te lo dice. Para que la espera sobreviva entre una ejecución y otra, las reservas y las esperas pasan a guardarse en un fichero, porque hoy cada comando arranca de cero.

Validación: dev-lead — es un comando que usa una persona; hay que ver las salidas en la terminal, en ejecuciones separadas.

## Capacidades

- Nuevas: `waitlist` — esperar una sala ocupada y quedársela cuando se libera.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: capacidad nueva · tamaño: ~60 líneas en 2 ficheros
- Dominio (sonnet): si `cancelar` deja huecos cuando no casa con ninguna reserva y si cada texto de salida está en ✋ (señal: capacidad nueva)
- Técnica (sonnet): no se despacha aparte; el revisor único cubre también el fichero de datos y el test «cancelar respeta el día» (señal: tamaño)
- Mínimo razonable: sin review — deja sin mirar el borde de una cancelación que no casa con ninguna reserva

1. **Enfoque rehecho tras la review: las reservas y las esperas se guardan en un fichero JSON.** La versión anterior las dejaba en memoria, como hoy `bookings`, y la review vio que `src/app.js` ejecuta un solo comando por proceso: `esperar` y `cancelar` nunca coincidirían en la terminal y la feature no te ahorraría nada. Cuesta más (se toca cómo `bookings` arranca), pero es lo que cumple tu motivo. Lo decidí yo; si prefieres otra cosa, dímelo antes de aprobar.
2. Fichero: `salas.json` en el directorio actual, o el que diga la variable de entorno `SALAS_DATOS`. Si no existe, se parte de las reservas de hoy (Norte lun 10:00-12:00). Se escribe solo tras `esperar` y `cancelar` que cambian algo. Nombre y variable son míos.
3. `run(cmd, params, datos)` acepta un tercer parámetro opcional con los datos (`{ bookings, waits }`), que `run` modifica en sitio y **no** escribe en disco; sin él, `run` lee el fichero y lo escribe tras `esperar` y `cancelar` que cambian algo. Así los tests no dependen de un fichero ni de un orden. Los tres tests actuales pasan a llamar a `run` con datos explícitos (mismas aserciones) para no leer un `salas.json` real; `salas.json` entra en `.gitignore`. Se usa `node:fs` síncrono: sin dependencias nuevas.
4. Capacidad nueva: `waitlist` (slug en inglés, contenido en castellano). Como no existe una capacidad de reservas, el nuevo comportamiento de `cancelar` también queda dentro de `waitlist`.
5. Comando `esperar <sala> <día> <franja>`; el nombre es mío. La espera se identifica por sala + día + franja.
6. Textos de salida: `en espera: Norte lun 10:00-12:00` · `Norte lun 10:00-12:00 está libre: no hace falta esperar` · `ya esperas Norte lun 10:00-12:00` · `sala desconocida: Oeste` · `uso: esperar <sala> <día> <franja>` · `cancelada lun 10:00 · Norte lun 10:00-12:00 pasa a tu reserva`.
7. Orden de comprobación de `esperar`: argumentos, sala, franja libre, duplicada. La franja se compara por igualdad exacta (`10:30-11:30` no se considera ocupada por una reserva `10:00-12:00`); no se valida el formato de día ni de franja (sigue la deuda «Sin validación del formato de franja horaria»).
8. `cancelar <día> <hora>` casa la hora con el inicio de la franja y el día; borra esa reserva (hoy solo escribe el texto), y si hubiera dos salas con la misma hora y día, solo la sala que tiene una espera, o la primera si ninguna. La espera que se promueve se elimina. Si no casa con ninguna reserva, sigue diciendo `cancelada <día> <hora>` como hoy.
9. **Supuesto a confirmar:** una sola persona usa la herramienta: no hay dueños de reserva ni cola entre personas. Quien cancela es quien espera; la reserva ajena la cancelas tú cuando te enteras de que se ha liberado. No hay tope de esperas.
9 bis. Si `salas.json` existe pero no es JSON válido, la salida es `datos ilegibles: <ruta>` y no se sobrescribe. El fichero tiene la forma `{ "bookings": [...], "waits": [...] }`.
10. `esperas` (listar), quitar una espera y mostrar `libres` por día no entran: no los pediste.
11. Política de modelos: un revisor de la spec (sonnet) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.

### Hallazgos de la review

Ronda 1 (sonnet):

- **Aceptado** (Crítico) — un comando por proceso: la espera en memoria no sirve desde la terminal → enfoque rehecho con fichero JSON (decisiones 1-3, Approach B, escenario «La espera sobrevive entre ejecuciones»).
- **Aceptado** — los AND no observables (escenarios 2, 3, 7) → reescritos con el comando siguiente; «Dónde se prueba» lo dice.
- **Aceptado** — el AND de `libres` se cumplía sin la feature → sustituido por un segundo `cancelar` que prueba la reserva.
- **Aceptado** — estado global y orden de tests → tercer parámetro de `run` (decisión 3) y `SALAS_DATOS` en el test del fichero.
- **Aceptado** — faltaban escenarios de espera que no casa, espera consumida y entrada inválida → añadidos.
- **Aceptado** — decisiones del cuerpo ausentes de ✋ (igualdad exacta, orden de comprobaciones, misma hora en dos salas, espera consumida, sin validar formato) → decisiones 7 y 8.
- **Aceptado** — `cancelar` cobijado por `waitlist` → decisión 4.
- **Aceptado** — reglas idioma y límites → corregidas.
- **Aceptado** — la antigua decisión 10 es verificación, no decisión → salió de ✋: el delta se probó sobre una copia de `.docs/sdd` y `sdd capability merge` lo acepta (10 requisitos ADDED y 5 reglas, sin rechazos: lo verifica el repaso de coherencia, no es una decisión).
- **Aceptado** — referencia a la 0008 → quitada del Scope.

Ronda 2 (sonnet), sin tercera ronda:

- **Aceptado** (Crítico) — los escenarios de espera que no casa partían de una espera imposible (Norte mar sin reserva) → el GIVEN ahora reserva Norte el martes.
- **Aceptado** (Crítico) — el AND de «No esperar una sala libre» no se observaba → sustituido por repetir el `esperar`.
- **Aceptado** (Crítico) — no se decía si `run` modifica `datos` ni si escribe → decisión 3 y regla «Dónde viven los datos».
- **Aceptado** (Crítico) — los tests actuales leerían un `salas.json` real → pasan datos explícitos y `salas.json` va a `.gitignore` (decisión 3, Scope).
- **Aceptado** — sin escenario del desempate entre dos salas → añadido; JSON corrupto y forma del fichero → decisión 9 bis, escenario y regla; Scope aclarado sobre `libres`; supuesto de la decisión 9 marcado «a confirmar»; cifra del merge corregida.
- **Rechazado** — escenario de franja distinta de la reserva → la comparación por igualdad exacta está en la decisión 7 y se queda sin escenario propio: es lo que ya hace `libres` hoy.
- **Rechazado** — `PRODUCT.md` no existe → está en la raíz del repo, no en `steering/`; no hay nada que cambiar.

### Decisiones tomadas con el dev-lead

- Carril feature, modo full, perfil delegate — «sí, adelante: feature full con delegate»
- Motivo — «cuando Norte está ocupada tengo que volver a mirar libres a mano cada rato»

## Intent

Cuando la sala que quieres está ocupada, hoy lo único que se puede hacer es volver a ejecutar `libres` a mano cada rato. Se quiere que la herramienta recuerde esa espera, también entre ejecuciones, y que al cancelarse la reserva que ocupa la sala, la reserve por ti. Es un éxito si, tras `esperar Norte lun 10:00-12:00` en una ejecución y `cancelar lun 10:00` en otra, la salida dice que Norte pasa a ser tuya. Fracasaría si la espera se perdiera entre ejecuciones y siguieras teniendo que mirar a mano.

## Scope

- Entra: comando `esperar`; que `cancelar` borre la reserva que casa y reserve la espera correspondiente; guardar reservas y esperas en un fichero JSON; el tercer parámetro opcional de `run`; que los tres tests actuales pasen datos explícitos; `salas.json` en `.gitignore`.
- No entra: listar o quitar esperas; avisos por correo; cambiar `reservar` (sigue sin escribir reservas) ni la salida de `libres` (solo lee del fichero); validar formatos.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `bookings` deja de ser una constante en memoria: se lee del fichero | `src/app.js:3` | Scope y decisión 2 |
| `cancelar` deja de ser solo un texto: borra la reserva que casa | `src/app.js:12`, test «cancelar respeta el día» | Decisión 8; el test sigue valiendo (no casa con ninguna reserva) |

- Filas que implementa: nada: comprobado con `git grep -niE "waitlist|esperar" -- . ':!.docs/sdd/changes'` (sin resultados; el roadmap no tiene fila para esta feature y su id 0010 lo reservó `sdd id next`)

## Approach

- A. Esperas en memoria, como `bookings` — pequeña, pero no funciona desde la terminal (un comando por proceso). Descartada tras la review.
- B. Reservas y esperas en un fichero JSON leído y escrito por cada comando — funciona entre ejecuciones; coste: toca cómo arrancan las reservas y añade un fichero y una variable de entorno.
- C. Solo avisar o solo consultar — no te ahorra mirar `libres`.
- Elegido: B — es el único que cumple el motivo del dev-lead («tengo que volver a mirar libres a mano cada rato»).

`run(cmd, params, datos)` toma los datos del tercer parámetro o, si no vienen, los lee del fichero y los guarda tras `esperar` y `cancelar` si cambiaron. `esperar` y `cancelar` siguen las decisiones 7 y 8.

## Dónde se prueba

- Todas las salidas: por `run()` con datos pasados como tercer parámetro, como los tests de `test/app.test.js`; lo que cambia entre dos comandos se observa con el comando siguiente (p. ej. repetir `esperar`).
- El fichero: un test que ejecuta `esperar` y después `cancelar` en dos llamadas sin datos pasados, con `SALAS_DATOS` apuntando a un fichero temporal.

## Términos y ADR

- Términos resueltos: espera — petición de reservar una sala ocupada en un día y una franja concretos, que pasa a reserva cuando se libera.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `waitlist`

#### ADDED — Apuntarse a la espera de una sala ocupada

- GIVEN Norte tiene reserva el lunes de 10:00-12:00
- WHEN ejecutas `esperar Norte lun 10:00-12:00`
- THEN la salida es `en espera: Norte lun 10:00-12:00`
- AND si lo ejecutas otra vez, la salida es `ya esperas Norte lun 10:00-12:00`

#### ADDED — No esperar una sala libre

- GIVEN Sur no tiene reserva el lunes de 10:00-12:00
- WHEN ejecutas `esperar Sur lun 10:00-12:00`
- THEN la salida es `Sur lun 10:00-12:00 está libre: no hace falta esperar`
- AND repetir el mismo `esperar` da lo mismo: no se apuntó ninguna espera

#### ADDED — Entrada no válida en esperar

- GIVEN las salas son Norte y Sur
- WHEN ejecutas `esperar Oeste lun 10:00-12:00`
- THEN la salida es `sala desconocida: Oeste`
- AND con `esperar Norte lun` la salida es `uso: esperar <sala> <día> <franja>`

#### ADDED — La espera pasa a reserva al liberarse la sala

- GIVEN Norte tiene reserva el lunes de 10:00-12:00 y esperas Norte lun 10:00-12:00
- WHEN ejecutas `cancelar lun 10:00`
- THEN la salida es `cancelada lun 10:00 · Norte lun 10:00-12:00 pasa a tu reserva`
- AND un segundo `cancelar lun 10:00` dice `cancelada lun 10:00` y `libres 10:00-12:00` incluye entonces a Norte

#### ADDED — Una espera que no casa no se promueve

- GIVEN Norte tiene reserva el lunes y el martes de 10:00-12:00 y esperas Norte mar 10:00-12:00
- WHEN ejecutas `cancelar lun 10:00`
- THEN la salida es `cancelada lun 10:00`
- AND repetir `esperar Norte mar 10:00-12:00` da `ya esperas Norte mar 10:00-12:00`

#### ADDED — Con dos salas a la misma hora pasa la que tiene espera

- GIVEN Norte y Sur tienen reserva el lunes de 10:00-12:00 y esperas Sur lun 10:00-12:00
- WHEN ejecutas `cancelar lun 10:00`
- THEN la salida es `cancelada lun 10:00 · Sur lun 10:00-12:00 pasa a tu reserva`

#### ADDED — Cancelar sin espera libera la sala

- GIVEN Norte tiene reserva el lunes de 10:00-12:00 y no esperas nada
- WHEN ejecutas `cancelar lun 10:00`
- THEN la salida es `cancelada lun 10:00`
- AND `libres 10:00-12:00` incluye a Norte

#### ADDED — Cancelar sin reserva que case no cambia nada

- GIVEN no hay reserva el martes a las 10:00 y esperas Norte lun 10:00-12:00
- WHEN ejecutas `cancelar mar 10:00`
- THEN la salida es `cancelada mar 10:00`
- AND repetir `esperar Norte lun 10:00-12:00` da `ya esperas Norte lun 10:00-12:00`

#### ADDED — Datos ilegibles

- GIVEN `salas.json` existe y no es JSON válido
- WHEN ejecutas cualquier `esperar` o `cancelar`
- THEN la salida es `datos ilegibles: salas.json` y el fichero no cambia

#### ADDED — La espera sobrevive entre ejecuciones

- GIVEN el fichero de datos no existe
- WHEN ejecutas `esperar Norte lun 10:00-12:00` y, en otra ejecución, `cancelar lun 10:00`
- THEN la segunda salida es `cancelada lun 10:00 · Norte lun 10:00-12:00 pasa a tu reserva`

#### Reglas de la capacidad — waitlist

- **Dónde viven los datos**: en `salas.json` del directorio actual, o en el fichero de `SALAS_DATOS`; reservas y esperas juntas, con la forma `{ "bookings": [...], "waits": [...] }`; `run` modifica en sitio los datos que recibe y solo escribe el fichero cuando no los recibe
- **Idioma de los nombres**: campos internos en inglés (`room`, `day`, `slot`), como `bookings`; salidas en castellano
- **Límites**: una espera por sala, día y franja; sin tope de esperas
- **Avisos**: `en espera: <sala> <día> <franja>` al apuntarse; `<sala> <día> <franja> está libre: no hace falta esperar` si no hacía falta; `ya esperas <sala> <día> <franja>` si se repite; `sala desconocida: <sala>`; `uso: esperar <sala> <día> <franja>` si faltan argumentos; `cancelada <día> <hora> · <sala> <día> <franja> pasa a tu reserva` cuando una espera se convierte en reserva
- **Regla ante conflicto**: la espera repetida se rechaza al apuntarse; al cancelar solo pasa la espera que casa en sala, día y franja, y se elimina

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
