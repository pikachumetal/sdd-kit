---
id: 20261113-151444-feature-0010-lista-espera
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

🦆 Hoy, si Norte está ocupada el lunes de 10:00 a 12:00, tienes que ir ejecutando `libres` hasta que se libere. Con esta feature escribes `esperar Norte lun 10:00-12:00` y te apuntas a una lista de espera que se guarda en un fichero. Cuando esa franja se cancela con `cancelar lun 10:00-12:00`, la reserva pasa sola a Norte, también para las ejecuciones siguientes. Con `espera` ves a qué estás apuntado. Para que esto funcione las reservas también pasan a guardarse en ese fichero.

Validación: dev-lead — es una herramienta que usa una persona: hay que ver los textos y el paso de la lista a reserva.

## Capacidades

- Nuevas: `waitlist` — apuntarse a una sala ocupada y pasar a reservarla cuando se libera.
- Modificadas: ninguna.
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (más una segunda ronda por reescribir la decisión central) — señales: datos persistentes nuevos (`salas.json`), capacidad nueva · tamaño: ~80 líneas en 3 ficheros
- Dominio (sonnet): si la interacción cancelar–reservas–lista tiene escenarios con datos, y si algún texto se contradice entre decisiones y THEN (señal: capacidad nueva + datos)
- Mínimo razonable: sin revisión — deja sin mirar los huecos entre la lista, las reservas y la cancelación

1. **Cambio de alcance, la decisión central — valídala primero**: las reservas, que hoy son una constante en memoria de `src/app.js`, pasan a guardarse junto a la lista en **un solo fichero** `salas.json` (`{"reservas": [...], "espera": [...]}`). Sin esto, la reserva que nace al promocionar desaparecería al acabar el comando y la lista no serviría (lo vio la revisión). Si no existe el fichero, se crea con la reserva que hoy es la constante (`Norte lun 10:00-12:00`). Si prefieres no tocar las reservas, la alternativa es cortar la promoción y dejar solo el aviso; dímelo y reescribo la spec. `reservar` sigue sin crear reservas (hoy solo devuelve texto) y no entra: por eso las únicas reservas son la inicial y las de la promoción, y para probar escenarios con más reservas se escribe `salas.json` a mano.
2. **Comandos nuevos**: `esperar <sala> <día> <franja>` y `espera` (sin argumentos).
3. **`cancelar <día> <franja>`** quita todas las reservas de ese día y franja (hoy solo devuelve texto) y promociona las entradas de la lista de esa misma franja y día cuya sala acaba de quedar libre. Su texto `cancelada <día> <franja>` no cambia; por cada promoción añade una línea.
4. **«Ocupada» se mira por sala, día y franja** en `esperar`. `libres` sigue como hoy (mira solo la franja): con reservas en dos días de la misma franja, `libres` y `esperar` pueden discrepar. Es una incoherencia conocida; cambiar `libres` no entra.
5. **Precedencia en `esperar`**: argumentos (`uso`) → sala desconocida → sala libre → ya apuntada → apuntar. Los argumentos sobrantes se ignoran, igual que `espera` con argumentos. Los nombres distinguen mayúsculas (`Norte`, no `norte`). Con argumentos de menos responde `uso: esperar <sala> <día> <franja>`.
6. **Textos** (literales):
   - Apuntarse con sala ocupada: `apuntada en la lista de espera: Norte lun 10:00-12:00`
   - Sala libre: `Sur está libre lun 10:00-12:00: reserva directamente` (no se apunta nada)
   - Ya apuntada: `ya está en la lista de espera: Norte lun 10:00-12:00`
   - Sala desconocida: `sala desconocida: Oeste`
   - Lista vacía: `lista de espera vacía`
   - Promoción (línea tras `cancelada …`): `reservada desde la lista de espera: Norte lun 10:00-12:00`
   - `espera` con entradas: una por línea con el formato `<sala> <día> <franja>` (`Norte lun 10:00-12:00`), en el orden en que se apuntaron.
7. **Sin tope** de entradas y **sin caducidad**; sin comando para borrar una entrada (no entra). Una entrada solo se va al promocionarse. Se asume que quien libera la franja eres tú o el propio CLI con `cancelar`, porque PRODUCT dice que no hay más usuarios.
8. **Sin aviso por correo**: la 0008 (`src/correo.js`) queda aparte y esta feature no depende de ella.
9. **Fichero ausente**: el primer comando que lo necesita (cualquiera, también `libres` o `espera`) lo crea con la reserva inicial y la lista vacía. Si existe pero le falta una clave, esa clave se toma como vacía; un fichero corrupto no se trata (no entra).
10. **Variable de entorno** `SALAS_DATOS` sustituye la ruta de `salas.json` (directorio de trabajo); `run` la resuelve en cada llamada, no al importar el módulo. Los tests crean y borran un fichero temporal propio por test, para no compartir estado.
11. **README**: no entra; los comandos nuevos se documentan en otra pasada. **`.gitignore`**: entra, con `salas.json`, para que una ejecución real no ensucie el árbol.
12. **Enfoque**: C, frente a A y B (ver Approach).
13. **Capacidad nueva** `waitlist` (slug en inglés kebab-case por convención del kit; el castellano de la constitución rige para la interfaz y los documentos).
- Política de modelos: revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.

### Hallazgos de la review

Ronda 1:
- **Aceptado** — Crítico: la reserva promovida no se persistía → decisión 1 y enfoque C (reservas y lista en `salas.json`).
- **Aceptado** — Crítico: estado compartido entre tests → decisión 10 (fichero temporal por test, ruta resuelta en cada `run`).
- **Aceptado** — escenarios de `cancelar` (día distinto, sin lista) → «La sala liberada…» y «Cancelar sin lista solo cancela».
- **Aceptado** — `libres` ignora el día → decisión 4 con la incoherencia anotada y un escenario con otro día.
- **Aceptado** — decisiones ocultas (argumentos, precedencia, mayúsculas, formato de `espera`) → decisiones 5, 6 y 9; escenarios de `uso` y de varias entradas.
- **Aceptado** — contratos sin declarar (`node:fs`, variable de entorno, esquema) → Scope y decisiones 1 y 10; README fuera en la decisión 11.
- **Aceptado** — alcance del revisor y decisión de verificación → bloque de review ampliado; el repaso de coherencia pasa a «Dónde se prueba».
- **Aceptado con matiz** — quién libera la franja → decisión 7 (asume que eres tú con `cancelar`; PRODUCT dice un solo usuario).

Ronda 2 (sin Críticos):
- **Aceptado** — `reservar` no persiste → decisión 1. Parte del seed en «Cancelar sin lista» → escenario aclarado.
- **Aceptado** — creación del fichero y claves ausentes → decisión 9. Ruta por llamada → decisión 10.
- **Aceptado** — `uso` primero y argumentos sobrantes → decisión 5. Formato de la entrada de `espera` → decisión 6 y regla «Avisos».
- **Aceptado** — «a tu nombre» sin titular → quitado del 🦆. `.gitignore` → decisión 11. Slug en inglés → decisión 13.
- **Rechazado en parte** — un escenario de varias salas en la misma franja: la decisión 3 lo cubre y el caso no se alcanza sin `reservar`; se probará desde `salas.json` en el plan.

### Decisiones tomadas con el dev-lead

- Carril y perfil: feature, modo full, delegate — «sí, adelante: feature full con delegate»
- Qué pasa al liberarse la sala: la reserva pasa a la sala apuntada (opción recomendada, aceptada con esta motivación) — «cuando Norte está ocupada tengo que volver a mirar libres a mano cada rato»

## Intent

Hoy, si la sala que quieres está ocupada, la única forma de saber cuándo se libera es repetir `libres`. Importa porque lo haces a mano, cada rato. Éxito: te apuntas una vez y, cuando se cancela esa franja, la sala queda reservada y lo sigue estando en las ejecuciones siguientes. Fracaso aunque funcione: que el mensaje diga «reservada» y la reserva no exista en la siguiente ejecución, o que se promocione una sala que no estaba apuntada.

## Scope

- Entra: `esperar`, `espera`; `salas.json` como almacén de reservas y lista de espera, con ruta `SALAS_DATOS`; la promoción al cancelar con su línea; que `cancelar` quite las reservas de ese día y franja; leer y escribir el fichero (`node:fs`) desde `run`; `salas.json` en `.gitignore`.
- No entra: avisos por correo, quitar una entrada de la lista, caducidad, tope, validar el formato de la franja (deuda ya anotada), cambiar `libres`, el README, tratar un fichero corrupto.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Las reservas como constante en memoria | `src/app.js:3` (`bookings`) | Decisión 1: pasan a `salas.json` |
| `cancelar` (solo texto → quita y promociona) | `src/app.js:13`, `test/app.test.js:14` («cancelar respeta el día») | Scope y decisión 3; el texto de retorno no cambia |
| `libres` (lee las reservas) | `src/app.js:5-7`, `test/app.test.js:5` | Sigue igual, lee las reservas de `salas.json`; el resultado `Sur` para `10:00-12:00` no cambia |

- Filas que implementa: ninguna → nada: comprobado con `git grep -in "espera" -- src test README.md` (sin resultados)

## Approach

- A: lista en `espera.json`, reservas en memoria — mínimo, pero la reserva promovida se pierde al acabar el comando (lo señaló la revisión): no cumple el objetivo.
- B: un módulo `src/espera.js` aparte — separa mejor, pero `operations.md` fija un solo fichero de entrada y el código son 16 líneas.
- C: reservas y lista en un solo `salas.json`, lógica en `src/app.js` — es lo mínimo que cumple el objetivo y respeta «un solo fichero de entrada».
- Elegido: C — porque es la única de las tres en la que la reserva promovida existe después.

## Dónde se prueba

- Todo por `run('esperar'|'espera'|'cancelar'|'libres', …)`, como los tests actuales, con `SALAS_DATOS` apuntando a un fichero temporal distinto en cada test.
- Repaso de coherencia: `sdd capability merge` sobre una copia → 6 requisitos y 5 reglas añadidos a `waitlist.md`, sin rechazos (con esta versión).

## Términos y ADR

- Términos resueltos: lista de espera — entradas (sala, día, franja) pendientes de una sala ocupada.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `waitlist`

#### ADDED — Apuntarse a una sala ocupada

- GIVEN Norte reservada el lunes de 10:00-12:00 y la lista vacía
- WHEN `esperar Norte lun 10:00-12:00`
- THEN responde `apuntada en la lista de espera: Norte lun 10:00-12:00` y una ejecución posterior de `espera` responde `Norte lun 10:00-12:00`
- AND `esperar Norte mar 10:00-12:00` responde `Norte está libre mar 10:00-12:00: reserva directamente`, porque la ocupación cuenta el día

#### ADDED — Sala libre no se apunta

- GIVEN Sur sin reserva el lunes de 10:00-12:00
- WHEN `esperar Sur lun 10:00-12:00`
- THEN responde `Sur está libre lun 10:00-12:00: reserva directamente` y `espera` responde `lista de espera vacía`

#### ADDED — Sin duplicados ni salas inventadas

- GIVEN la lista con `Norte lun 10:00-12:00`
- WHEN `esperar Norte lun 10:00-12:00`
- THEN responde `ya está en la lista de espera: Norte lun 10:00-12:00` y la lista sigue con una entrada
- AND `esperar Oeste lun 10:00-12:00` responde `sala desconocida: Oeste`
- AND `esperar Norte` responde `uso: esperar <sala> <día> <franja>`

#### ADDED — Ver la lista de espera

- GIVEN las entradas `Norte lun 10:00-12:00` y, después, `Norte mar 10:00-12:00` (con Norte reservada también el martes)
- WHEN `espera`
- THEN responde dos líneas, `Norte lun 10:00-12:00` y `Norte mar 10:00-12:00`, en ese orden
- AND con la lista vacía responde `lista de espera vacía`

#### ADDED — La sala liberada se reserva desde la lista

- GIVEN Norte reservada lun 10:00-12:00 y mar 10:00-12:00, y la lista con `Norte lun 10:00-12:00` y `Norte mar 10:00-12:00`
- WHEN `cancelar lun 10:00-12:00`
- THEN responde `cancelada lun 10:00-12:00` y una segunda línea `reservada desde la lista de espera: Norte lun 10:00-12:00`
- AND la entrada de lunes sale de la lista y la de martes se queda
- AND en una ejecución posterior Norte sigue reservada el lunes: `esperar Norte lun 10:00-12:00` responde `apuntada en la lista de espera: Norte lun 10:00-12:00`

#### ADDED — Cancelar sin lista solo cancela

- GIVEN `salas.json` recién creado (solo Norte reservada el lunes 10:00-12:00) y la lista vacía
- WHEN `cancelar lun 10:00-12:00`
- THEN responde solo `cancelada lun 10:00-12:00` y `libres 10:00-12:00` en una ejecución posterior responde `Norte, Sur`
- AND `cancelar mar 10:00-12:00` (sin reservas ese día) responde solo `cancelada mar 10:00-12:00`

#### Reglas de la capacidad — waitlist

- **Dónde viven los datos**: reservas y lista de espera en `salas.json` en el directorio de trabajo (o en la ruta de `SALAS_DATOS`)
- **Idioma de los nombres**: castellano en comandos y mensajes (el slug de la capacidad va en inglés por convención del kit)
- **Límites**: sin tope de entradas ni caducidad
- **Avisos**: `apuntada en la lista de espera: <sala> <día> <franja>`, `<sala> está libre <día> <franja>: reserva directamente`, `ya está en la lista de espera: <sala> <día> <franja>`, `sala desconocida: <sala>`, `uso: esperar <sala> <día> <franja>`, `lista de espera vacía`, `reservada desde la lista de espera: <sala> <día> <franja>` y, en `espera`, una línea `<sala> <día> <franja>` por entrada; solo en la salida del comando
- **Regla ante conflicto**: una entrada por sala, día y franja; no se admiten duplicados

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
