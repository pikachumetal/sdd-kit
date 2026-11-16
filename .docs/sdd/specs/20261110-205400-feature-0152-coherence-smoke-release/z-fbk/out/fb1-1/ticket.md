---
kit_version: 3.0.0
lane: feature
id: 20261112-164109-feature-0012-export-datos
task: 0012
mode: full
date: 2026-11-12
---

# Ticket para el kit — feature 0012: exportar datos a hoja de cálculo; plan rehecho y contexto del implementador pedido dos veces

## Contexto

- Carril y modo: feature full (hay plan)
- Skills del kit usadas: no consta en las notas; sdd-propose, sdd-implement y sdd-archive por el flujo normal, sin verificar
- Proyecto: aplicación Node pequeña, una feature de exportación de datos a hoja de cálculo
- Modelo del hilo: no consta
- Modelos de los subagentes: no consta
- Coste en reloj: unos 40 min más de lo estimado (cifra de las notas del dev-lead, sin medir)
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Una task del plan salió sin decir qué fichero tocar y el plan se rehízo

- **Qué pasó**: la spec se aprobó a la primera, pero la task 2 del plan no indicaba el fichero a modificar y el plan se rehízo una vez.
- **Fuente**: notas de la sesión del dev-lead (`notas-sesion.md`), sin contrastar con el plan ni con un commit. La versión del kit que allí figura (2.4.0) no coincide con `.docs/sdd/sdd-kit.json:1` → `"version": "3.0.0"`, y no se usa.
- **Dónde en el kit**: `skills/sdd-templates/templates/plan-template.md:163` (línea `**Ficheros**: crear/modificar ...` de cada task); la comprobación de que no quede vacía no se localiza en ninguna skill.
- **Por qué el kit no lo evitó**: la plantilla pide `**Ficheros**`, pero nada revisa que cada task lo rellene antes de aprobar el plan. Si la regla se aplicó y la task salió igualmente sin fichero, no consta.
- **Coste**: ~40 min sobre la estimación, atribuidos «sobre todo» al plan rehecho; causa **sin respaldo** (frase del dev-lead; no hay spec, walkthrough ni commit que la apoye).
- **Propuesta**: que la revisión del plan antes de aprobarlo rechace una task sin `**Ficheros**` con al menos una ruta.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un plan cuya task 2 no tiene ruta en `**Ficheros**` WHEN se pasa la revisión del plan THEN se señala la task 2 y el plan no se presenta como aprobable.

### 2. El implementador pidió dos veces el mismo contexto

- **Qué pasó**: el implementador de la task 3 pidió dos veces el mismo contexto; el dev-lead lo atribuye a que la skill no dice cuándo adjuntar el brief.
- **Fuente**: notas de la sesión del dev-lead; contraste con `skills/sdd-implement-subagent/SKILL.md:177-188` (sección «Task brief»), que sí manda ejecutar `task brief` antes del despacho e introducir la ruta del brief en el prompt.
- **Dónde en el kit**: `skills/sdd-implement-subagent/SKILL.md:177` («Task brief»); `skills/sdd-implement-subagent/implementer-prompt.md`, sin revisar.
- **Por qué el kit no lo evitó**: el kit sí dice cuándo generar el brief (antes de despachar). Lo que no se sabe es si en esa sesión se aplicó o si la ambigüedad está en otro punto (por ejemplo, el contexto de tasks anteriores, punto 3 de esa sección). La afirmación del dev-lead no coincide con lo que el kit dice, y queda sin contrastar.
- **Coste**: no medido; repetido dos veces en la sesión, por eso no es un menor.
- **Propuesta**: antes de cambiar nada, comprobar qué contexto pidió el implementador; si era el de tasks anteriores, hacerlo explícito en el prompt de despacho.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una task que depende de una interfaz creada en otra anterior WHEN se despacha al implementador siguiendo la skill THEN el prompt incluye la ruta del brief y la interfaz previa, y el implementador no pide contexto de nuevo.

## Lo que hice por iniciativa propia

- Nada consta en las notas.

## Funcionó, no tocar

- La spec se aprobó a la primera.
- El merge en la rama de integración fue sin conflictos.

## Menores

- Falló el pre-commit por un fichero sin final de línea; se arregló en ~1 min — no localizado
