---
kit_version: 3.0.0
lane: feature
id: 20261101-191320-feature-0012-exportar-datos
task: 0012
mode: full
date: 2026-11-01
---

# Ticket para el kit — feature 0012: plan rehecho por una task sin fichero y brief pedido dos veces

## Contexto

- Carril y modo: feature full
- Skills del kit usadas: sin registro en la sesión (el resumen del dev-lead no las lista); incluye al menos la creación del plan y `sdd-implement`
- Proyecto: aplicación de un solo fichero de entrada, Node, una sola persona que lo resumió (genérico)
- Modelo del hilo: no medido
- Modelos de los subagentes: no medido (hubo un implementador de la task 3)
- Coste en reloj: unos 40 min más de lo estimado (cifra del dev-lead, sin cronometrar)
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Task del plan que no dice qué fichero tocar; el plan se rehízo una vez

- **Qué pasó**: la spec se aprobó a la primera, pero el plan se rehízo una vez porque la task 2 no decía qué fichero tocar. Versión del kit: la sesión pudo cargar una versión distinta de la del proyecto (el aviso de arranque habla de 2.3.4 cargado frente a 3.0.0 pedido); el dev-lead dice 2.4.0 y eso no se ha podido comprobar.
- **Fuente**: nota del dev-lead (`notas-sesion.md`, fichero del proyecto, descriptor genérico); `.docs/sdd/sdd-kit.json` → `"version": "3.0.0"`; aviso `SessionStart` del kit («carga el kit 2.3.4 y el proyecto pide el 3.0.0»).
- **Dónde en el kit**: `skills/sdd-templates/templates/plan-template.md` (campo «**Ficheros**: crear/modificar», línea 161 de la plantilla cargada) y el paso de revisión del plan; no localizo qué paso debería haber detectado una task sin ese campo relleno.
- **Por qué el kit no lo evitó**: la plantilla cargada ya pide «Ficheros» por task, así que o la versión usada no lo exigía o el campo se dejó vacío sin que ningún chequeo lo parase. No se puede distinguir con lo que hay.
- **Coste**: un plan rehecho; los ~40 min sobre la estimación se atribuyen «sobre todo» a esto por palabra del dev-lead — **sin respaldo** (no hay spec, walkthrough ni commit de la feature 0012 en el repo).
- **Propuesta**: que la revisión del plan falle si alguna task no tiene «Ficheros» con al menos una ruta.
- **Verificada**: sin verificar (solo he leído la plantilla, no he reproducido la revisión del plan).
- **Criterio de aceptación**: GIVEN un plan con una task cuyo campo «Ficheros» está vacío, WHEN se pasa la revisión del plan, THEN se rechaza nombrando la task, antes de la aprobación.

### 2. El implementador pidió dos veces el mismo contexto: no queda claro cuándo adjuntar el brief

- **Qué pasó**: el implementador de la task 3 pidió dos veces el mismo contexto; el dev-lead lo atribuye a que la skill no dice cuándo adjuntar el brief.
- **Fuente**: nota del dev-lead (fichero del proyecto, descriptor genérico); `skills/sdd-implement/SKILL.md:215` (texto cargado ahora).
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md` línea 215 (`sdd task brief`: «its path goes in introduced as "read this first"»), y `references/implementer-prompt.md`.
- **Por qué el kit no lo evitó**: el texto actual sí dice que el brief va en el despacho, siempre, con su ruta; la afirmación del dev-lead no coincide con esa versión. O la sesión corrió con una versión anterior sin la regla, o el despacho no la aplicó. Sin verificar cuál.
- **Coste**: dos peticiones repetidas; minutos no medidos, **sin respaldo** en cuanto al total.
- **Propuesta**: si la versión usada era anterior, nada que hacer salvo actualizar; si era la actual, añadir a la plantilla del implementador una línea de comprobación «el brief está adjunto» antes de despachar.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un despacho de implementador, WHEN se compone con el kit actual, THEN contiene la ruta del brief y el implementador no vuelve a pedir el contexto de la task.

## Lo que hice por iniciativa propia

- Nada que reportar por mi parte: el ticket se escribe solo desde las notas del dev-lead; no vi la sesión.

## Funcionó, no tocar

- La spec se aprobó a la primera.
- El merge a `develop` fue sin conflictos.

## Menores

- Salto del pre-commit por un fichero sin final de línea, arreglado en un minuto — no localizado
