---
kit_version: 2.3.4
superpowers_version: 7.1.0
lane: feature
id: 20261013-122905-feature-0012-export
task: 0012
mode: full
date: 2026-10-13
---

# Ticket para el kit — feature 0012: plan rehecho por una task sin fichero y brief pedido dos veces

## Contexto

- Carril y modo: feature full
- Skills del kit usadas: sdd-start-feature, sdd-implement (según las notas del dev-lead; no recorrí la sesión en directo)
- Proyecto: servicio Node pequeño, sin dependencias externas, git-flow
- Modelo del hilo: no medido
- Modelos de los subagentes: no medido
- Coste en reloj: unos 40 min por encima de la estimación (cifra del dev-lead, sin respaldo)
- Coste en tokens: no medido

Discrepancia de versión: `.docs/sdd/sdd-kit.json` dice `2.3.4` y las notas del dev-lead dicen que trabajó con el kit `2.4.0`. La cabecera usa el valor del fichero; conviene comprobar cuál se ejecutó.

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Una task del plan no decía qué fichero tocar y el plan se rehízo

- **Qué pasó**: la spec se aprobó a la primera; la task 2 del plan no indicaba el fichero a crear o modificar, y el plan se rehízo una vez.
- **Dónde en el kit**: `skills/sdd-templates/templates/plan-template.md` (campo `**Ficheros**` de cada task, y «Step 1: Implementación» que pide el fichero por pieza); el gate que debería haberlo parado antes de aprobar el plan no se localiza.
- **Por qué el kit no lo evitó**: la plantilla pide el fichero, pero nada comprueba al cerrar el plan que cada task lo lleve. Si la plantilla se calcó y el campo se dejó vacío o genérico, es una regla que no aguantó.
- **Coste**: el grueso de los ~40 min de exceso, según el dev-lead — sin respaldo (no hay spec, walkthrough ni commit que lo mida; la feature 0012 no tiene carpeta en `specs/` en este repo).
- **Propuesta**: antes de dar el plan por listo, un paso de autorrevisión (o del revisor del plan) que falle si alguna task no tiene `**Ficheros**` con al menos una ruta.
- **Verificada**: sin verificar — no he reproducido el plan original.
- **Criterio de aceptación**: GIVEN un plan con una task cuyo campo `**Ficheros**` está vacío WHEN se revisa el plan antes de la aprobación THEN el kit lo marca como bloqueante y no pasa al implementador.

### 2. El implementador de la task 3 pidió dos veces el mismo contexto

- **Qué pasó**: el implementador de la task 3 pidió dos veces el mismo contexto; el dev-lead lo atribuye a que «la skill no dice cuándo adjuntar el brief».
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md` paso 1 «Take the task» (línea 48) y la sección de despacho (líneas 81-82), que sí describen el brief y el contenido del dispatch.
- **Por qué el kit no lo evitó**: no está claro. La regla existe; o no se aplicó (dispatch sin el brief o sin «interfaces y decisiones de tasks anteriores») o el dispatch no cubre un caso concreto que no identifiqué. El comentario del dev-lead no coincide con el texto actual de la skill, lo cual apunta a que la versión ejecutada difiere (ver discrepancia de versión).
- **Coste**: dos peticiones repetidas; tiempo no medido — sin respaldo.
- **Propuesta**: si se confirma que faltaba el brief, que el dispatch lo incluya por defecto y que el implementador, al devolver `NEEDS_CONTEXT`, nombre qué sección del brief habría respondido la duda.
- **Verificada**: sin verificar — contrastado solo con la lectura de `skills/sdd-implement/SKILL.md:48,81-82`.
- **Criterio de aceptación**: GIVEN una task cuyo brief contiene el contexto que el implementador necesita WHEN se despacha THEN el implementador no devuelve `NEEDS_CONTEXT` por información que ya está en el brief.

## Lo que hice por iniciativa propia

- Nada que reportar.

## Funcionó, no tocar

- La spec se aprobó a la primera.
- El merge a `develop` fue sin conflictos.

## Menores

- El pre-commit saltó por un fichero sin final de línea; se arregló en ~1 min — no localizado (el gate es del proyecto, no del kit).
