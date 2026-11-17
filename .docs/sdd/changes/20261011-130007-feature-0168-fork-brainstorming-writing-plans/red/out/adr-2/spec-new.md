---
id: 20261011-132418-feature-0012-persistent-bookings
feature: 0012
title: Las reservas sobreviven al cierre de la terminal
mode: full
profile: delegate
status: in-review
created: 2026-10-11
author: <git-user>
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Las reservas sobreviven al cierre de la terminal

🦆 Hoy, si cancelas la reserva de Norte del lunes y cierras la terminal, al volver a abrirla la reserva sigue ahí: cada vez que arranca `salas` empieza de cero. Con este cambio las reservas se guardan en un fichero de tu carpeta personal, y cada comando las lee de ahí: la cancelación de Norte lun sigue cancelada mañana, y `salas libres 10:00-12:00` ofrece `Norte, Sur`. Si el fichero no existe, `salas` empieza como hoy, con la reserva de Norte del lunes; si está estropeado, avisa y no lo toca. Esto deja sin efecto la decisión de que las reservas vivan en memoria (ADR 0003).

## Capacidades

- Nuevas: `bookings` — qué reservas hay y cómo sobreviven entre arranques de `salas` (no existe `capabilities/`; el índice devuelve «Sin capacidades»).
- Modificadas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva, dato persistente nuevo (2 de 8) · tamaño: ~40 líneas en 2 ficheros de código
- Mínimo razonable: ninguna; la spec es corta y el único punto delicado (contradice el ADR 0003) está declarado abajo.

1. **Revierto el ADR 0003.** Pides que las reservas sobrevivan; el ADR 0003 decide que viven en memoria y su «Confirmación» exige que `src/` no importe `node:fs`. Entra en esta feature un ADR 0004 que lo sustituye y el 0003 pasa a `superseded by 0004` (solo cambia su `status`). Si prefieres no revertirlo, esta feature no se puede hacer.
2. **Soporte: un fichero JSON**, no SQLite. Es la segunda opción del propio ADR 0003; SQLite añadiría dependencia y la tech-stack dice «sin dependencias externas».
3. **Dónde: `salas-reservas.json` en la carpeta personal del usuario** (`os.homedir()`), y la variable de entorno `SALAS_RESERVAS` fija otra ruta. Nadie dijo dónde; la variable también sirve para que los tests no toquen tu fichero real.
4. **Cuándo se lee y se escribe:** se lee en cada arranque y se escribe solo cuando una reserva cambia (`cancelar`, `anular`). Escritura atómica (fichero temporal y renombrado), para que cerrar la terminal a mitad no deje el fichero a medias.
5. **Dos terminales a la vez:** gana la última que escribe, sin bloqueos. La misión dice que lo usa una sola persona; como cada comando relee el fichero al arrancar, una terminal ve lo que hizo la otra.
6. **Sin fichero:** el estado inicial es el de hoy (una reserva activa: Norte, lun, 10:00-12:00). El fichero no se crea hasta el primer cambio.
7. **Fichero ilegible** (no es JSON, o su `version` no es 1): se imprime `reservas ilegibles: <ruta>`, se sale con código 1 y el fichero no se toca ni se sobrescribe. Es el caso que el ADR 0003 temía («cómo se migra el formato»): no hay migración, solo `version: 1`.
8. **Formato:** `{"version": 1, "bookings": [{"room": "Norte", "day": "lun", "slot": "10:00-12:00", "status": "active"}]}`, los mismos campos que ya usa el código, incluidas las canceladas y anuladas.
9. **⚠ `reservar` no entra.** Hoy `salas reservar … --cada-semana` solo responde `reserva semanal creada` y no añade ninguna reserva a la lista (la única reserva real es la inicial). Lo que sobrevive, por tanto, es el estado de las reservas existentes (cancelada, anulada), no las nuevas. Hacer que `reservar` cree reservas de verdad es otra feature; te la dejo como pregunta abajo.
10. **Capacidad nueva `bookings`** (en inglés, nombre de fichero), con la regla «Dónde viven los datos»; las otras cuatro reglas, «no aplica».

### Decisiones tomadas con el dev-lead

- Que las reservas sobrevivan al cierre de la terminal — «que las reservas sobrevivan a cerrar y volver a abrir la terminal. Perfil delegate.»

### Pregunta abierta (1)

- ¿Quieres que `reservar` cree reservas de verdad en esta misma feature? Recomiendo que no (otro carril, con su propia spec: sala, día y franja sin datos hoy), porque esta spec entonces solo pide que persista lo que ya existe.

## Intent

Hoy cada arranque de `salas` empieza con la reserva inicial y cualquier cancelación o anulación se pierde al terminar el comando. Importa porque la herramienta es de uso real (la despliega su autor en su servidor) y un estado que no se recuerda no sirve de agenda. Se quiere que el estado de las reservas sea el mismo al día siguiente.

## Scope

- Entra: guardar y leer las reservas en un fichero JSON; `cancelar` y `anular` persisten su efecto; `libres` lee el estado guardado; fichero ausente e ilegible; ruta por defecto y por variable de entorno; ADR 0004 y estado `superseded` del 0003; actualizar `operations.md` (la línea «Motor de producción: … en memoria»).
- No entra: que `reservar` cree reservas (pregunta abierta); bloqueo entre terminales; migración de formatos; reservas por usuario o varios ficheros; exportar a `.ics` (B1).
- Ficheros que lo implementan: `src/app.js` (hoy `bookings` es una constante en memoria al cargar el módulo) y `.docs/sdd/operations.md` (§Testing, «Motor de producción»). `tech-stack.md` no cambia: `node:fs` es parte de Node y sigue sin dependencias externas.

## Approach

Antes de ejecutar un comando, `salas` carga las reservas del fichero (o parte de la inicial si no existe); los comandos que cambian una reserva guardan el resultado en el fichero con una escritura atómica. Un fichero ilegible detiene el comando antes de cambiar nada. La ruta sale de `SALAS_RESERVAS` o, sin ella, de la carpeta personal.

## Dónde se prueba

- `cancelar` y `anular` persisten, y `libres` ve el estado guardado: por `run()`, como los tests actuales de `test/cancel.test.js`, con `SALAS_RESERVAS` apuntando a un fichero temporal.
- Sobrevivir al cierre de la terminal: lanzando `node src/app.js` dos veces como procesos distintos, porque un solo proceso no puede demostrar que el estado sobrevive al cierre.
- Fichero ilegible y código de salida 1: por el mismo proceso hijo, que es quien tiene código de salida.

## Términos y ADR

- Términos resueltos: ninguno nuevo (se usa **reserva**, **cancelación** y **anulación** del glosario de `PRODUCT.md`).
- ADR candidatas: **0004 — Las reservas se guardan en un fichero JSON** — alternativas descartadas: seguir en memoria (ADR 0003) y SQLite. Sustituye al 0003, cuyo `status` pasa a `superseded by 0004`. Las escribe el cierre.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — El estado de las reservas sobrevive entre arranques**
- GIVEN no hay fichero de reservas y `Norte lun 10:00-12:00` está activa
- WHEN se ejecuta `salas cancelar Norte lun` y, en otro arranque, `salas libres 10:00-12:00`
- THEN el primero responde `cancelada Norte lun` y el segundo `Norte, Sur`

**ADDED — Anular también se guarda**
- GIVEN `Norte lun` activa
- WHEN se ejecuta `salas anular Norte lun` y, en otro arranque, `salas cancelar Norte lun`
- THEN el primero responde `anulada Norte lun` y el segundo `sin reserva Norte lun`

**ADDED — Sin fichero se empieza con la reserva inicial**
- GIVEN no hay fichero de reservas
- WHEN se ejecuta `salas libres 10:00-12:00`
- THEN responde `Sur` y no se crea ningún fichero

**ADDED — El fichero ilegible no se toca**
- GIVEN el fichero de reservas contiene `{no es json`
- WHEN se ejecuta `salas cancelar Norte lun`
- THEN se imprime `reservas ilegibles: <ruta del fichero>`, el código de salida es 1 y el contenido del fichero sigue siendo `{no es json`

**ADDED — La ruta del fichero se puede fijar**
- GIVEN `SALAS_RESERVAS` vale `/tmp/mis-reservas.json`
- WHEN se ejecuta `salas cancelar Norte lun`
- THEN el cambio queda en `/tmp/mis-reservas.json` y no se crea `salas-reservas.json` en la carpeta personal

**Reglas de la capacidad**
- **Dónde viven los datos**: un fichero JSON `salas-reservas.json` en la carpeta personal del usuario, o el que diga `SALAS_RESERVAS`.
- **Idioma de los nombres** / **Límites** / **Avisos** / **Regla ante conflicto**: no aplica.

## Enmiendas

_Ninguna._

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
