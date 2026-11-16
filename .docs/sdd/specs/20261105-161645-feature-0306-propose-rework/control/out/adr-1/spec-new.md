---
id: 20261105-211920-feature-0012-persistent-bookings
feature: 0012
title: Las reservas sobreviven al cierre de la terminal
mode: full
status: draft
created: 2026-11-05
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Las reservas sobreviven al cierre de la terminal

🦆 Hoy, si cancelas la reserva de Norte el lunes y cierras la terminal, al abrirla de nuevo `salas libres 10:00-12:00` vuelve a decir «Sur»: la cancelación se perdió y Norte vuelve a estar reservada. Con este cambio la cancelación (y la anulación) se queda guardada en un fichero JSON de tu carpeta personal, y `salas libres 10:00-12:00` dirá «Norte, Sur» también después de reabrir. Por dentro, `src/app.js` lee el fichero antes de cada comando y lo reescribe tras cada cambio; esto revierte la ADR 0003, que decidió «en memoria».

Validación: dev-lead — es lo que una persona hace con la terminal (cerrar, reabrir y mirar `libres`).

## Capacidades

- Nuevas: `bookings` — cómo se conservan las reservas entre arranques.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: datos o migración (fichero nuevo de datos persistentes), contrato público (formato del fichero JSON), capacidad nueva · tamaño: ~40 líneas en 3 ficheros (`src/app.js`, tests, `operations.md`)
- Dominio+técnica (sonnet): si el THEN del primer arranque y el del fichero ilegible dejan algún hueco, y si «Dónde se prueba» cubre el reinicio real del proceso (señal: datos persistentes)
- Mínimo razonable: sin revisión — deja sin mirar el caso de dos terminales a la vez y el fichero a medio escribir

1. **Enfoque: fichero JSON** — frente a SQLite (dependencia nueva; la tech-stack dice «sin dependencias externas») y a seguir en memoria con un volcado al salir (se pierde si el proceso muere). JSON con `node:fs` no añade ninguna dependencia.
2. **Ubicación**: `~/.salas/reservas.json`, sobrescribible con la variable `SALAS_DATOS` (ruta completa del fichero). Home y no la carpeta actual, para que se vean las mismas reservas desde cualquier carpeta; la variable existe para que los tests no toquen el fichero real.
3. **Formato**: un array JSON con los mismos objetos de hoy: `{ "room": "Norte", "day": "lun", "slot": "10:00-12:00", "status": "active" }`. Sin versión de formato: nadie más lo lee.
4. **Sin fichero** (primer arranque, o fichero borrado): se parte de la reserva que hoy está en el código (Norte, lun, 10:00-12:00, activa). El fichero se crea en el primer cambio (cancelar o anular) y contiene entonces el array completo, con esa reserva; `libres` o un `cancelar` sin reserva no crean nada. Limitación aceptada: si borras el fichero, la reserva de Norte reaparece activa, como en un primer arranque.
5. **Cuándo se lee**: en cada comando, no al importar el módulo (así cada test usa su `SALAS_DATOS` y el aviso de fichero ilegible puede ser la respuesta del comando). Solo `libres`, `cancelar` y `anular` leen el fichero; `reservar`, un comando desconocido o ninguno no lo tocan. Dos terminales a la vez: como se relee antes de cada comando, solo se pisan si coinciden en el mismo instante; gana la última escritura; ni bloqueo ni fusión (Scope: no entra, es una sola persona, mission.md).
6. **Cuándo se escribe**: síncrona, el fichero entero, tras cada cambio, creando antes la carpeta (`~/.salas`, o la que contenga `SALAS_DATOS`) si no existe, y por un fichero temporal vecino (`<ruta>.tmp`) que se renombra al final, para que un corte a mitad no deje el JSON truncado. Se escribe antes de confirmar: si falla, el estado no cambia y el comando responde `no se pudo guardar el fichero de reservas: <ruta>`.
7. **Fichero ilegible**: no es JSON, no es un array o algún elemento no tiene `room`, `day`, `slot` y `status` como textos. También lo es cualquier error de lectura distinto de «no existe» (la ruta es una carpeta, sin permisos). Un fichero vacío cuenta como ilegible; `[]` es válido y significa «no hay reservas». Con un fichero ilegible, `libres`, `cancelar` y `anular` responden `fichero de reservas ilegible: <ruta>` y no sobrescriben el fichero.
8. **Cómo se señala un error**: `run` sigue devolviendo un texto. Los dos avisos (ilegible, no se pudo guardar) los imprime la línea de comandos por la salida de error (stderr), no por la normal, y el proceso sale con código 1; el resto sigue por stdout con código 0. Cambia lo que `node src/app.js` hace hoy (siempre 0) y se prueba lanzando el proceso.
9. **`reservar --cada-semana`** no entra: hoy solo devuelve un texto y no crea ninguna reserva, así que no hay nada que guardar. Crear reservas de verdad es otra feature.
10. **ADR**: este cambio revierte la ADR 0003 («en memoria»). Candidata: ADR 0004 que la sustituye (opciones: JSON, SQLite, memoria); la 0003 pasa a `superseded by 0004`. Su «Confirmación» («`src/` no importa `node:fs`») deja de valer. La escribe el cierre, no esta spec.
11. **Capacidad nueva `bookings`** (inglés kebab-case, como pide la plantilla) con nueve requisitos. Hoy no hay capacidades; el comportamiento sí lo ve la persona, por eso no lo dejo como «Ninguna».
12. **Tests existentes**: `test/app.test.js` y `test/cancel.test.js` llaman a `run` en el mismo proceso y cancelarían en el fichero real; fijan `SALAS_DATOS` a una ruta temporal al inicio del fichero de test (basta: se lee en cada comando, no al importar).
13. **Documentos que cambian de forma**: `operations.md` («las reservas viven en memoria») y la ADR 0003; ver la tabla de abajo. Hasta el cierre la ADR 0003 sigue `accepted` con su «Confirmación» incumplida: ventana asumida, la cierra la ADR 0004 al archivar.
14. **Delta probado sobre una copia** de `.docs/sdd`: `sdd capability merge` acepta los requisitos y las cinco reglas de `bookings` (exit 0); `git grep` de «memoria», «0003», «node:fs» fuera de `specs/` da solo la ADR 0003 y `operations.md:14`, ya en la tabla (`scripts/lint.mjs` solo cuenta tabuladores en `src/app.js`: no comprueba la ADR, el gate de cierre no se ve afectado por la ventana).
- Política de modelos: revisor de la spec en sonnet · revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo

### Hallazgos de la review

- **Aceptado** — Crítico: carga «al arrancar» no permite devolver el aviso ni aislar tests → decisión 5: se lee en cada comando, y el aviso de ilegible vale para `libres`, `cancelar` y `anular`.
- **Aceptado** — Crítico: nada crea `~/.salas` → decisión 6 y requisito «El fichero se guarda aunque su carpeta no exista».
- **Aceptado** — Importante: sin escenario de `anular`, de `sin reserva`, de escritura fallida ni de ruta por defecto → cuatro requisitos nuevos en el delta.
- **Aceptado** — Importante: «ilegible» solo cubría JSON roto → decisión 7 (no array, elementos sin forma, vacío; `[]` válido).
- **Aceptado** — Importante: error de Node en inglés y mutación antes de escribir → decisión 6 (aviso en castellano, código 1, se escribe antes de confirmar).
- **Aceptado** — Importante: «gana la última» contradecía «dos terminales fuera de alcance» → decisión 5 (se relee antes de cada comando; regla y Scope dicen lo mismo).
- **Aceptado** — Menor: el primer volcado incluye la reserva sembrada → decisión 4.

Segunda ronda (sin tercera):
- **Aceptado** — Crítico: el código de salida no cabe en `run` (devuelve un texto) → decisión 8: los avisos van por stderr con código 1 desde la línea de comandos, y se prueban lanzando el proceso («Dónde se prueba»).
- **Aceptado** — Importante: formas del fichero sin escenario → requisito «La forma del fichero decide si es legible».
- **Aceptado** — Importante: Scope y 🦆 decían «al arrancar» → «antes de cada comando».
- **Aceptado** — Importante: escritura truncada por un corte → decisión 6: fichero temporal y renombrado.
- **Aceptado** — Importante: errores de lectura distintos de «no existe» → decisión 7 (cuentan como ilegible).
- **Aceptado** — Importante/Menor: fijar `SALAS_DATOS` al inicio del test basta (decisión 12), lo comprobado de `scripts/lint.mjs` (decisión 14), la regla de conflicto pasa a «no definida» y el Home ya no se justifica con dos terminales, solo `libres`/`cancelar`/`anular` leen el fichero (decisión 5), el borrado del fichero es una limitación aceptada (decisión 4).
- **Rechazado** — Importante: ADR 0004 y `superseded` dentro de la feature → las escribe el cierre (plantilla de ADR y «Términos y ADR»); la ventana queda declarada en la decisión 13.
- **Rechazado** — Importante: guard que haga fallar los tests sin `SALAS_DATOS` → excesivo para una herramienta de una persona; lo cubre el test de la ruta por defecto con `HOME` temporal.
- **Rechazado** — Menor: sacar las decisiones 13-14 y la política de modelos de ✋ → las exige la plantilla del gate.

## Intent

Hoy las reservas viven en memoria del proceso (ADR 0003): cerrar la terminal las pierde, y una cancelación hecha ayer deja de existir hoy. Se quiere que lo cancelado o anulado se conserve entre arranques. Éxito: tras `cancelar Norte lun`, un proceso nuevo que ejecuta `libres 10:00-12:00` responde `Norte, Sur`. Fracaso aunque «funcione»: perder o sobrescribir reservas cuando el fichero está roto, o que `node --test` escriba en el fichero real de la persona.

## Scope

- Entra: leer las reservas del fichero antes de cada `libres`/`cancelar`/`anular`, escribirlas (con fichero temporal y renombrado) tras cada cancelar/anular, `SALAS_DATOS`, los avisos de fichero ilegible y de no poder guardar (por stderr, con código de salida 1), crear la carpeta del fichero, los tests existentes aislados con `SALAS_DATOS`, actualizar `operations.md`.
- No entra: `reservar --cada-semana` (no crea reservas), dos terminales a la vez, bloqueo de fichero, versionado o migración de formato, otros motores (SQLite), exportar a `.ics` (B1), escribir la ADR 0004 (la escribe el cierre).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «Las reservas viven en memoria; cerrar la terminal las pierde» | `.docs/sdd/decisions/0003-bookings-in-memory.md:8,16,22,27`; `.docs/sdd/operations.md:14` | decisión 10 (la ADR 0004 la sustituye, la escribe el cierre) · `operations.md` en Scope |
| «`src/` no importa `node:fs`» (Confirmación de la ADR 0003) | `.docs/sdd/decisions/0003-bookings-in-memory.md:31` | decisión 10: la ADR 0004 trae su propia confirmación |
| Estado inicial fijo en `const bookings` | `src/app.js:3` | pasa a ser el valor de partida del primer arranque, decisión 4 |

- Filas que implementa: 0012 no tiene fila de roadmap (id reservado con `sdd id next --reserve`) → nada la nombra fuera de esta carpeta.

## Approach

El estado de reservas sigue siendo el array de hoy. Se carga del fichero en cada comando (decisiones 2-5); `cancelBooking` y `voidBooking` lo reescriben entero antes de confirmar (6). La forma de organizar el código (un módulo aparte o dentro de `app.js`) queda para el plan.

## Dónde se prueba

- Cancelar y reabrir: lanzando dos procesos `node src/app.js` en secuencia con `SALAS_DATOS` temporal (el primero `cancelar Norte lun`, el segundo `libres 10:00-12:00`), por la línea de comandos como se usa de verdad.
- Sin fichero, `anular`, `sin reserva`, carpeta que no existe, formas del fichero (vacío, `[]`, `{}`, sin `slot`, carpeta en lugar de fichero) y ruta por defecto: como los tests actuales, llamando a `run` con `SALAS_DATOS` temporal (la ruta por defecto, con `HOME` y `USERPROFILE` apuntando a una carpeta temporal).
- Los avisos con código de salida 1 y por stderr (fichero ilegible, no se pudo guardar): lanzando `node src/app.js` como proceso, porque `run` solo devuelve el texto.
- Aislamiento de los tests existentes: `node --test` entero en verde sin tocar `~/.salas`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: guardar las reservas en un fichero JSON (alternativas descartadas: SQLite, seguir en memoria); sustituye a la 0003.

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Las reservas se conservan entre arranques

- GIVEN `SALAS_DATOS` apunta a un fichero que no existe
- WHEN `cancelar Norte lun` y después, en un proceso nuevo, `libres 10:00-12:00`
- THEN el primero responde `cancelada Norte lun` y el segundo `Norte, Sur`
- AND el fichero contiene la reserva `{ "room": "Norte", "day": "lun", "slot": "10:00-12:00", "status": "cancelled" }`

#### ADDED — El primer arranque parte de la reserva inicial

- GIVEN `SALAS_DATOS` apunta a un fichero que no existe
- WHEN `libres 10:00-12:00`
- THEN responde `Sur`
- AND el fichero sigue sin existir

#### ADDED — Un fichero ilegible no se sobrescribe

- GIVEN `SALAS_DATOS` apunta a un fichero cuyo contenido es `{no es json`
- WHEN `cancelar Norte lun` (o `libres 10:00-12:00`, o `anular Norte lun`)
- THEN el proceso escribe en stderr `fichero de reservas ilegible: <la ruta de SALAS_DATOS>` y sale con código 1
- AND el contenido del fichero sigue siendo `{no es json`

#### ADDED — Una anulación también se conserva

- GIVEN `SALAS_DATOS` apunta a un fichero que no existe
- WHEN `anular Norte lun` y después, en un proceso nuevo, `libres 10:00-12:00`
- THEN el primero responde `anulada Norte lun` y el segundo `Norte, Sur`
- AND el fichero contiene la reserva con `"status": "voided"`

#### ADDED — Cancelar sin reserva no escribe

- GIVEN `SALAS_DATOS` apunta a un fichero que no existe
- WHEN `cancelar Sur mar`
- THEN responde `sin reserva Sur mar`
- AND el fichero sigue sin existir

#### ADDED — El fichero se guarda aunque su carpeta no exista

- GIVEN `SALAS_DATOS` es `<carpeta temporal>/nueva/reservas.json` y `nueva` no existe
- WHEN `cancelar Norte lun`
- THEN responde `cancelada Norte lun`
- AND existe `<carpeta temporal>/nueva/reservas.json`

#### ADDED — Si no se puede guardar, no se cambia nada

- GIVEN `SALAS_DATOS` es una ruta cuya carpeta padre es un fichero normal (no se puede crear)
- WHEN `cancelar Norte lun`
- THEN el proceso escribe en stderr `no se pudo guardar el fichero de reservas: <la ruta de SALAS_DATOS>` y sale con código 1
- AND no existe ningún fichero en esa ruta

#### ADDED — La forma del fichero decide si es legible

- GIVEN `SALAS_DATOS` apunta a un fichero cuyo contenido es `[]`
- WHEN `libres 10:00-12:00`
- THEN responde `Norte, Sur`
- AND con el contenido vacío, `{}`, `[{"room":"Norte","day":"lun","status":"active"}]` (sin `slot`) o una carpeta en lugar del fichero, el mismo comando sale con el aviso de fichero ilegible y código 1

#### ADDED — Sin SALAS_DATOS se usa la carpeta personal

- GIVEN `SALAS_DATOS` sin definir y `HOME` y `USERPROFILE` apuntan a una carpeta temporal `<h>`
- WHEN `cancelar Norte lun`
- THEN existe `<h>/.salas/reservas.json`

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: `~/.salas/reservas.json`, o la ruta de `SALAS_DATOS` si está definida
- **Idioma de los nombres**: no aplica
- **Límites**: no aplica
- **Avisos**: `fichero de reservas ilegible: <ruta>` · `no se pudo guardar el fichero de reservas: <ruta>`
- **Regla ante conflicto**: no definida; dos terminales a la vez quedan fuera de alcance (se relee antes de cada comando, y si coinciden gana la última escritura)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
