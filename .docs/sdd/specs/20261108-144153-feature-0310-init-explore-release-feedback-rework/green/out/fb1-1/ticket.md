---
kit_version: 3.0.0
lane: feature
id: 20261108-161212-feature-0012-exportar-listado
task: 0012
mode: no consta
date: 2026-11-08
---

# Ticket para el kit — feature 0012: exportar un listado a hoja de cálculo

## Contexto

- Carril y modo: feature; el modo (full o lite) no consta: la carpeta de la feature no está en el repo y las notas solo hablan de «spec» y «plan»
- Skills del kit usadas: no constan; por las notas, la fase de plan y la de implementación por tasks con un implementador por task
- Proyecto: aplicación Node sin dependencias externas, un solo fichero de entrada, git-flow
- Modelo del hilo: no consta
- Modelos de los subagentes: no consta
- Coste en reloj: «unos 40 min más de lo estimado», cifra del dev-lead, sin respaldo (ver hallazgo 1)
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado. La evidencia es de segunda mano: sale de un resumen del dev-lead, no de haber visto la sesión.

## Hallazgos

### 1. Un plan rehecho porque una task no decía qué fichero tocar

- **Qué pasó**: la spec se aprobó a la primera; el plan se rehízo una vez porque la task 2 no nombraba el fichero a tocar. El dev-lead atribuye a este rehecho la mayor parte de los ~40 min por encima de la estimación.
- **Fuente**: resumen del dev-lead (`notas-sesion.md`, sin respaldo en spec, walkthrough ni commit: la carpeta de la feature no está en el repo). La plantilla sí pide el dato: `skills/sdd-templates/templates/plan-template.md:163` → `**Ficheros**: crear/modificar \`path/...\``.
- **Dónde en el kit**: `skills/sdd-templates/templates/plan-template.md:163` (campo «Ficheros» de la task) y la revisión previa del plan en `skills/sdd-implement-subagent/SKILL.md` (setup: «pre-flight review»).
- **Por qué el kit no lo evitó**: la regla existía (el campo «Ficheros» está en la plantilla). Se ignora si el plan se redactó con el campo vacío o genérico, o si el pre-flight no lo comprueba. No hay forma de saber cuál de las dos desde las notas.
- **Coste**: ~40 min sobre la estimación (total de la sesión; causa «sin respaldo»).
- **Propuesta**: que el pre-flight del plan falle si una task no lista al menos un `path` concreto en «Ficheros», o lo marque como pregunta antes de empezar a implementar.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un plan cuya task 2 tiene «Ficheros» vacío o sin ruta WHEN se ejecuta el pre-flight del plan THEN se rechaza el plan nombrando la task 2 antes de despachar ningún implementador.

### 2. El implementador pidió dos veces el mismo contexto

- **Qué pasó**: el implementador de la task 3 pidió dos veces el mismo contexto. El dev-lead lo atribuye a que la skill no dice cuándo adjuntar el brief.
- **Fuente**: resumen del dev-lead (`notas-sesion.md`). Contraste con el kit: `skills/sdd-implement-subagent/SKILL.md:177` → «Task brief: before dispatching an implementer, run `… task brief <plan> <n>`».
- **Dónde en el kit**: `skills/sdd-implement-subagent/SKILL.md:177`. Si la sesión usó `sdd-implement-native`, no lo he contrastado.
- **Por qué el kit no lo evitó**: la skill de subagentes sí dice que el brief se extrae antes de despachar. Queda por saber si el brief iba adjunto en el despacho y el implementador lo pidió igualmente (falla el prompt del implementador) o si no se adjuntó (no se aplicó la regla). Las notas no lo distinguen, y la afirmación «la skill no dice cuándo adjuntar» no se sostiene tal cual para el modo subagente.
- **Coste**: no medido; dos peticiones repetidas.
- **Propuesta**: aclarar en `skills/sdd-implement-subagent/SKILL.md:177` que el brief extraído se adjunta al despacho y se cita por ruta en el prompt del implementador.
- **Verificada**: sí — contrastado con `skills/sdd-implement-subagent/SKILL.md:177` (solo la existencia de la regla, no el fallo)
- **Criterio de aceptación**: GIVEN una task con su brief extraído WHEN se despacha el implementador THEN el despacho contiene la ruta del brief y el implementador no pide contexto que ya esté en él.

### 3. Tres versiones distintas del kit en la misma sesión

- **Qué pasó**: las notas dicen kit 2.4.0. El proyecto declara 3.0.0 y el plugin cargado al escribir este ticket declara 2.3.4. El aviso de inicio de sesión ya advertía del desfase.
- **Fuente**: `.docs/sdd/sdd-kit.json` → `"version": "3.0.0"`; `.claude-plugin/plugin.json:4` del kit cargado → `"version": "2.3.4"`; `notas-sesion.md` → «kit 2.4.0» (sin comprobar, no hay 2.4.0 en ningún fichero consultado).
- **Dónde en el kit**: aviso del hook de inicio de sesión (`sdd hook session-start`, `hooks/hooks.json`).
- **Por qué el kit no lo evitó**: el aviso existe pero no bloquea; se puede trabajar una feature entera con skills de otra versión que la del proyecto, y el ticket no sabe qué versión corrió.
- **Coste**: no medido.
- **Propuesta**: que el aviso no deje continuar a una skill de cambio (`sdd-propose`, `sdd-implement`) sin que el usuario confirme el desfase, y que el ticket registre la versión del plugin cargado además de la del proyecto.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN `sdd-kit.json` pide 3.0.0 y el plugin cargado es 2.3.4 WHEN el usuario pide un cambio THEN la skill de entrada lo avisa y espera confirmación antes de crear artefactos.

## Lo que hice por iniciativa propia

- Nada: este ticket lo redacta otra sesión a partir de un resumen; no se ejecutó trabajo de la feature.

## Funcionó, no tocar

- La spec se aprobó a la primera.
- El merge a la rama de integración fue sin conflictos.

## Menores

- Saltó el pre-commit por un fichero sin final de línea; se arregló en un minuto — no localizado
