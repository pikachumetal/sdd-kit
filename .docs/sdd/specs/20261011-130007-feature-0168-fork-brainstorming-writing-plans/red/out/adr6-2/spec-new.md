---
id: 20261011-134434-feature-0012-persistir-reservas
feature: 0012
title: Las reservas sobreviven a cerrar la terminal
mode: full
profile: delegate
status: draft
created: 2026-10-11
author: <git-user>
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Las reservas sobreviven a cerrar la terminal

🦆 Hoy, si cancelas la reserva de `Norte` el lunes y vuelves a ejecutar `salas`, la reserva vuelve a estar activa: cada arranque empieza de cero. Con este cambio, `node src/app.js cancelar Norte lun` deja la cancelación guardada en un fichero y la siguiente ejecución (`libres 10:00-12:00`) ya no ve `Norte` ocupada por esa reserva. El estado se lee al arrancar y se escribe solo cuando una orden lo cambia. Esto deshace la decisión 0004 («el estado vive en memoria»), así que el cambio incluye una ADR nueva que la sustituye.

> **Estado**: draft
> **Siguiente paso**: aprobación de la spec → `plan.md` con `superpowers:writing-plans`.

## Capacidades

- Nuevas: `bookings` — qué estado de reservas conserva `salas` entre ejecuciones.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: dato persistente nuevo, formato de fichero nuevo (solo lo lee `salas`) · tamaño: ~60 líneas en 4 ficheros
- Mínimo razonable: ninguna — deja sin mirar si el fichero corrupto o a medio escribir se comporta como dice el escenario «fichero ilegible», que nadie más relee; lo cubre el test de ese escenario.

1. **Qué persiste es el estado de las reservas, no «reservas nuevas».** Hoy `reservar` no guarda nada (`--cada-semana` solo devuelve «reserva semanal creada») y la única reserva que existe es una semilla fija (`Norte`, `lun`, `10:00-12:00`). Lo que sobrevive entre ejecuciones son los cambios que ya existen: `cancelar` y `anular`. Crear reservas de verdad **no entra**: es otra feature (te propongo apuntarla en el roadmap). ⚠️ Si lo que querías era que `reservar` guarde, dímelo: cambia el alcance.
2. **«Cerrar y abrir la terminal» = una ejecución del programa distinta de la anterior.** `salas` no es interactiva: cada orden es un proceso. Por eso la persistencia vale también entre dos órdenes seguidas en la misma terminal, no solo tras cerrarla.
3. **Un fichero JSON**, ruta `~/.salas/reservas.json` (directorio personal de quien ejecuta), reemplazable con la variable de entorno `SALAS_DATOS` (ruta completa del fichero). Es lo mínimo que no depende de la carpeta desde la que se lance; la variable la necesitan los tests y un despliegue con otra ruta. Sin fichero → arranca con la semilla de hoy, y no crea el fichero hasta que una orden cambie algo.
4. **Se escribe solo al cambiar** (`cancelar`, `anular` con éxito). `libres` y `sin reserva …` no escriben. Escritura atómica (fichero temporal + renombrado) para que cerrar la terminal en mitad de una orden no deje el fichero a medias.
5. **Fichero ilegible → se para, no se pisa.** Si el JSON no se puede leer, `salas` imprime `reservas ilegibles: <ruta>` y sale con código 1, sin tocar el fichero. Arrancar de cero en silencio perdería las reservas guardadas.
6. **Dos terminales a la vez: sin protección.** Gana la última escritura. Es lo que la ADR 0004 dejó como razón para no persistir; lo asumo porque la usa una sola persona (misión) y lo dejo escrito en la ADR nueva. Un bloqueo de fichero **no entra**.
7. **ADR nueva que sustituye a la 0004.** Candidata: `0007-persist-bookings-in-json-file` (el número siguiente al mayor de la carpeta, 0006). La escribe el cierre: la 0004 pasa a `superseded by 0007` y su «Confirmación» (`src/` no importa `node:fs`) deja de valer; la 0007 la sustituye por un test que fija la ruta y la variable.
8. **Capacidad nueva `bookings`**, con un solo grupo de requisitos, el de persistencia. El proyecto no tiene ninguna capacidad todavía; el nombre (`bookings`, en inglés kebab-case) lo apruebas tú.
9. **Textos nuevos, en castellano** (constitución, art. 4): `reservas ilegibles: <ruta>`; los de `cancelar`/`anular` no cambian.
10. **Documentos que el cierre pone al día**: `operations.md` («Motor de producción: … las reservas viven en memoria» ya no es cierto) y `tech-stack.md` (añadir el fichero y la variable).

### Decisiones tomadas con el dev-lead

- Perfil `delegate` del proyecto, sin cambios — ninguna frase del dev-lead todavía.

## Intent

Hoy cada arranque de `salas` empieza con la reserva semilla activa: una reserva cancelada reaparece en la siguiente orden, y `libres` da una respuesta que ya no es verdad. Importa porque la herramienta es para reservar de verdad en el coworking, y una cancelación que se pierde deja una sala marcada como ocupada (o libre) por error. Se quiere que lo que cambia una orden siga cambiado en la siguiente.

## Scope

- Entra: leer el estado de las reservas al arrancar y escribirlo al cambiarlo (`cancelar`, `anular`); ruta por defecto y `SALAS_DATOS`; error claro con fichero ilegible; ADR 0007 que sustituye a la 0004; actualizar `operations.md` y `tech-stack.md`.
- No entra: crear reservas (`reservar` sigue siendo el que es hoy); bloqueo ante dos terminales a la vez; migración o versionado del formato; copias de seguridad; histórico de cambios; cualquier base de datos o dependencia externa.

## Approach

El estado de las reservas se carga una vez al arrancar desde un fichero JSON y se guarda entero tras cada orden que lo cambia. Sin fichero, el estado inicial es el de hoy. Un fichero que no se puede leer detiene la orden con un mensaje, sin sobrescribirlo. El formato del fichero es interno de `salas` y no se promete a nadie más.

## Dónde se prueba

- Persistencia entre ejecuciones (`cancelar` y luego `libres`): ejecutando `node src/app.js` dos veces como procesos distintos con `SALAS_DATOS` apuntando a un directorio temporal; es la única costura que reproduce «cerrar y abrir», porque los tests actuales (`test/cancel.test.js`) llaman a `run()` dentro de un mismo proceso.
- Fichero ilegible: mismo patrón, con un fichero con basura en `SALAS_DATOS`.
- Sin fichero: el patrón de `test/cancel.test.js` (llamada a `run()`), con `SALAS_DATOS` a una ruta inexistente.

## Términos y ADR

- Términos resueltos: **ejecución** — una vez que se lanza `node src/app.js <orden>`; es lo que «abrir la terminal de nuevo» significa en esta spec. **Estado de las reservas** — la lista de reservas con su estado (`active`, `cancelled`, `voided`).
- ADR candidatas: **guardar el estado de reservas en un fichero JSON en vez de en memoria** — alternativa descartada: SQLite o una base de datos (dependencia y migraciones para una persona y dos salas); sustituye a la 0004.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — El estado de las reservas sobrevive entre ejecuciones**
- GIVEN no existe el fichero de reservas y la reserva `Norte` `lun` `10:00-12:00` está activa
- WHEN se ejecuta `cancelar Norte lun` y, en otra ejecución, `libres 10:00-12:00`
- THEN la primera responde `cancelada Norte lun` y la segunda responde `Norte, Sur`
- AND con `cancelar Norte lun` otra vez en una tercera ejecución responde `sin reserva Norte lun`

**ADDED — Solo se escribe cuando una orden cambia el estado**
- GIVEN no existe el fichero de reservas
- WHEN se ejecuta `libres 10:00-12:00`, o `cancelar Sur mar` (que responde `sin reserva Sur mar`)
- THEN el fichero sigue sin existir

**ADDED — Un fichero de reservas ilegible no se sobrescribe**
- GIVEN el fichero de reservas contiene `esto no es json`
- WHEN se ejecuta `libres 10:00-12:00`
- THEN la salida es `reservas ilegibles: <ruta del fichero>`, el código de salida es 1 y el fichero sigue conteniendo `esto no es json`

**ADDED — La ruta del fichero se puede fijar**
- GIVEN `SALAS_DATOS=/tmp/prueba/reservas.json` y que no existe `~/.salas/reservas.json`
- WHEN se ejecuta `cancelar Norte lun`
- THEN se crea `/tmp/prueba/reservas.json` y no se crea `~/.salas/reservas.json`
- AND sin `SALAS_DATOS`, la ruta es `~/.salas/reservas.json`

**Reglas de la capacidad**
- **Dónde viven los datos**: un fichero JSON; `~/.salas/reservas.json` por defecto, `SALAS_DATOS` lo reemplaza.
- **Idioma de los nombres**: castellano para los textos al usuario (`reservas ilegibles: <ruta>`); claves del fichero internas.
- **Límites**: no aplica.
- **Avisos**: `reservas ilegibles: <ruta>` con fichero ilegible, código de salida 1.
- **Regla ante conflicto**: dos ejecuciones a la vez — gana la última escritura; no hay bloqueo.

## Enmiendas

_Sin enmiendas._

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
