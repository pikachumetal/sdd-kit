---
id: 20261011-134413-feature-0012-persist-bookings
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

🦆 Hoy, si cancelas la reserva de Norte el lunes y vuelves a abrir la terminal, la reserva vuelve a estar activa: cada arranque empieza de cero. Con este cambio, esa cancelación se queda guardada: al volver a abrir, `libres 10:00-12:00` responde «Norte, Sur» y cancelar otra vez dice «sin reserva Norte lun». Las reservas se guardan en un fichero del usuario que se lee al arrancar y se reescribe cuando una cancelación o una anulación las cambia. Esto sustituye la decisión 0004, que dejaba el estado solo en memoria.

> **Estado**: draft. **Siguiente paso**: plan con `superpowers:writing-plans`, tras la aprobación.

## Capacidades

- Nuevas: `bookings` — qué reservas hay y que su estado (activa, cancelada, anulada) sobrevive entre arranques.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: capacidad nueva, dato persistente nuevo (2 de 8) · tamaño: ~40 líneas en 1 fichero de código, 2 de documentos
- Mínimo razonable: ninguna — deja sin cubrir nada que la rúbrica pida mirar con tan pocas señales
```

1. **Esto sustituye la decisión 0004** («el estado vive en un solo proceso»): su consecuencia «cerrar la terminal pierde las reservas» es justo lo que pides, y su confirmación («`src/` no importa `node:fs`») dejará de cumplirse. Entra en el alcance una ADR nueva 0007 que la sustituye y marcar 0004 como `superseded by 0007`. Es la decisión que más conviene que valides.
2. **Qué sobrevive hoy es poco**: `reservar` no crea reservas reales (solo devuelve el texto «reserva semanal creada»), así que lo único que existe es la reserva de inicio de Norte el lunes y sus cambios de estado por `cancelar` y `anular`. Esta feature guarda esos cambios. Que `reservar` cree reservas de verdad **no entra**: es otra feature.
3. **Dónde se guarda**: `reservas.json` dentro de la carpeta `.salas` del directorio personal del usuario, y la variable de entorno `SALAS_FICHERO` lo cambia de sitio. Elegí el directorio personal y no la carpeta actual para que abrir la terminal en otra carpeta no «pierda» las reservas.
4. **Qué se guarda**: la lista completa de reservas con su estado (activa, cancelada, anulada), no solo las activas.
5. **Primer arranque sin fichero**: parte de la reserva de inicio de siempre (Norte, lun, 10:00-12:00, activa), y el fichero no se crea hasta que un comando cambia algo. `libres` y los comandos que solo leen no escriben nada.
6. **Fichero ilegible**: el programa no lo pisa ni arranca de cero; responde `fichero de reservas dañado: <ruta>` y sale con error. Prefiero parar a perder reservas sin avisar.
7. **Dos terminales a la vez**: sin bloqueo; gana la última escritura. La misión dice que lo usa una sola persona, y 0004 ya nombraba este coste.
8. **Capacidad nueva `bookings`** (nombre en inglés kebab-case por ser nombre de fichero): no hay capacidades todavía y el comportamiento de las reservas necesita un sitio donde vivir.
9. **Documentos que quedan desactualizados** y se corrigen dentro de esta feature: `operations.md` (línea «las reservas viven en memoria»).

### Decisiones tomadas con el dev-lead

- Perfil `delegate` del proyecto — «Perfil delegate» (petición inicial).

## Intent

Hoy cada arranque de `salas` empieza con el estado de fábrica: una cancelación o una anulación hecha en una sesión se pierde al cerrarla, y la reserva vuelve a figurar activa. Para una herramienta que se usa para reservar salas de verdad, eso hace que las sesiones no se sumen. Se quiere que el estado de las reservas persista entre arranques.

## Scope

- Entra: guardar y leer el estado de las reservas en un fichero; que `cancelar` y `anular` lo reescriban; el mensaje del fichero dañado; la ADR 0007 que sustituye a 0004; corregir `operations.md`.
- No entra: que `reservar` cree reservas reales; bloqueo entre dos terminales; migraciones de formato; más de un fichero; comandos para ver o limpiar el fichero.

## Approach

Al arrancar un comando se lee el fichero de reservas (o se parte de la reserva de inicio si no existe) y, si el comando cambió algún estado, se reescribe entero. La lectura ocurre al ejecutar el comando, no al importar el módulo, para que los tests de `run` no toquen el fichero del usuario real.

## Dónde se prueba

- Las reservas sobreviven entre arranques: arrancando `node src/app.js` dos veces con `SALAS_FICHERO` en una carpeta temporal, como se usa de verdad; un test por `run` no vale, porque no reabre el proceso.
- Primer arranque y fichero dañado: igual, con arranques reales.
- Los tests actuales de `run` (libres, reservar, cancelar) siguen como están.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: **0007 — las reservas se guardan en un fichero JSON del usuario; sustituye a 0004** — alternativa descartada: mantenerlas en memoria

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — El estado de las reservas sobrevive entre arranques**
- GIVEN no hay fichero de reservas y la reserva Norte lun 10:00-12:00 está activa
- WHEN se ejecuta `cancelar Norte lun` y, en un arranque nuevo, `libres 10:00-12:00`
- THEN el segundo arranque responde `Norte, Sur`
- AND `cancelar Norte lun` en un tercer arranque responde `sin reserva Norte lun`

**ADDED — Una anulación también sobrevive**
- GIVEN la reserva Norte lun 10:00-12:00 activa
- WHEN se ejecuta `anular Norte lun` y, en un arranque nuevo, `cancelar Norte lun`
- THEN el segundo arranque responde `sin reserva Norte lun`

**ADDED — Primer arranque sin fichero**
- GIVEN no existe el fichero de reservas
- WHEN se ejecuta `libres 10:00-12:00`
- THEN responde `Sur`
- AND el fichero sigue sin existir

**ADDED — Un fichero ilegible no se pisa**
- GIVEN el fichero de reservas contiene `{no es json`
- WHEN se ejecuta `cancelar Norte lun`
- THEN responde `fichero de reservas dañado: <ruta del fichero>` y el proceso sale con error
- AND el contenido del fichero sigue siendo `{no es json`

**Reglas de la capacidad**
- **Dónde viven los datos**: `reservas.json` en la carpeta `.salas` del directorio personal; `SALAS_FICHERO` indica otra ruta.
- **Idioma de los nombres** / **Límites** / **Avisos** / **Regla ante conflicto**: no aplica (el aviso del fichero dañado va en el escenario de arriba; sin bloqueo entre terminales, gana la última escritura).

## Enmiendas

_Ninguna._

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
