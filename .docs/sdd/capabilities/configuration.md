# Capacidad — configuration

## Propósito

La configuración del kit en un proyecto: qué va en `sdd-kit.json` (del equipo, en git) y qué en `sdd-kit.local.json` (de cada persona), y cómo `sdd-config` la enseña, la pregunta y la escribe.

## Requisitos

### Las preferencias personales viven en `sdd-kit.local.json`, fuera de git
- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` y una persona que quiere otro `control.profile`, otro `execution` o `validation.startEnvironment` solo para sí
- WHEN invoca `sdd-config`, o pide configurar el kit solo para sí (la petición que dispara `sdd-config`), y responde que es solo para ella
- THEN el valor se escribe en `.docs/sdd/sdd-kit.local.json` y `sdd-kit.json` no cambia
- AND `.gitignore` tiene la línea `.docs/sdd/sdd-kit.local.json` antes de que el fichero exista; si falta, se añade sin duplicar
- AND el fichero local no se commitea y no lleva el nombre de la persona

### Una clave no admitida en el fichero local se ignora con aviso
- GIVEN un `.docs/sdd/sdd-kit.local.json` con una clave fuera de `control.profile`, `execution` y `validation.startEnvironment` (p. ej. `merge.noFf` o `ids.mode`), o una admitida con un valor fuera de su tipo
- WHEN el agente resuelve la configuración vigente
- THEN esa clave no se aplica: rige la del siguiente nivel de la precedencia
- AND el agente muestra un aviso por clave, con su nombre, con la forma de «Avisos» de esta capacidad

### `sdd-config` enseña la configuración antes de preguntar
- GIVEN un proyecto con `sdd-kit.json`, con `sdd-kit.local.json` o sin él
- WHEN el usuario invoca `sdd-config`
- THEN antes de la primera pregunta el agente muestra cada clave con su valor y su fichero, y las que faltan con el default que rige
- AND muestra los avisos de las claves ignoradas del fichero local

### `sdd-config` pregunta una clave por turno, con la recomendada primero
- GIVEN claves que faltan en `sdd-kit.json` (p. ej. `execution` y `merge.push` en un proyecto de antes de la 0055) o una clave que el usuario quiere cambiar
- WHEN `sdd-config` pregunta
- THEN hace una sola pregunta cerrada por turno, con la opción recomendada primero y su motivo, sacados de su catálogo
- AND no vuelve a preguntar una clave que ya tiene valor, salvo que el usuario pida cambiarla

### `sdd-config` escribe solo lo respondido, en el fichero que toca
- GIVEN una respuesta del usuario a una pregunta de `sdd-config`
- WHEN la escribe
- THEN una clave de política (`ids`, `merge`, frenos de `control`) va a `sdd-kit.json`; `validation.startEnvironment` va a `sdd-kit.local.json`; `control.profile` y `execution` van donde el usuario diga (invocada por una init o por la migración, siempre a `sdd-kit.json`)
- AND «no sé» no escribe la clave y rige su default; lo que no se preguntó no se escribe
- AND invocada por una init o por una migración no escribe: devuelve las respuestas y quien la invocó las escribe en `sdd-kit.json`, en su paso de estructura o de marcador (enmienda del 2026-09-25)
- AND sin usuario no escribe nada: las preguntas quedan como pendientes explícitas en el informe de quien la invocó

## Reglas de la capacidad

- **Dónde viven los datos**: `.docs/sdd/sdd-kit.json` (proyecto, en git) y `.docs/sdd/sdd-kit.local.json` (persona, fuera de git); el catálogo de preguntas, en `skills/sdd-config/SKILL.md`.
- **Idioma de los nombres**: claves JSON en inglés camelCase, como en `control-profiles`: `validation.startEnvironment`.
- **Límites**: el fichero local admite solo `control.profile`, `execution` y `validation.startEnvironment`.
- **Avisos**: `Aviso: se ignora <clave> de sdd-kit.local.json: solo admite control.profile, execution y validation.startEnvironment; lo demás es del proyecto y va en sdd-kit.json.` · `Aviso: se ignora <clave> de sdd-kit.local.json: <valor> no es un valor admitido.`
- **Regla ante conflicto**: la precedencia de `control-profiles`; una clave ignorada no cuenta como nivel.
