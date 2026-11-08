---
kit_version: 3.0.0
lane: feature
id: 20261108-161425-feature-0012-exportar-excel
task: 0012
mode:
date: 2026-11-08
---

# Ticket para el kit — feature 0012: exportar a Excel, plan rehecho y brief del implementador sin regla de adjuntado

## Contexto

- Carril y modo: feature (modo no medido; `ids.mode` = `sequence`)
- Skills del kit usadas: no medido (las notas no las listan)
- Proyecto: aplicación de gestión con exportación a hoja de cálculo — genérico
- Modelo del hilo: no medido
- Modelos de los subagentes: no medido
- Coste en reloj: unos 40 min por encima de lo estimado, según las notas del dev-lead (sin respaldo)
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El plan se rehízo porque una task no decía qué fichero tocar

- **Qué pasó**: la spec se aprobó a la primera, pero el plan se rehízo una vez porque la task 2 no nombraba el fichero a modificar. Las notas lo atribuyen al desvío de unos 40 min sobre la estimación.
- **Fuente**: notas del dev-lead de la sesión (líneas 6 y 9), no verificadas contra el plan; `skills/sdd-templates/templates/plan-template.md:163` → `**Ficheros**: crear/modificar \`path/...\``
- **Dónde en el kit**: `skills/sdd-templates/templates/plan-template.md:163` (campo `Ficheros` de la task) y la revisión del plan antes de aprobarlo; no localizo en esta sesión el paso que comprueba que cada task rellena `Ficheros`.
- **Por qué el kit no lo evitó**: la plantilla ya tiene el campo `Ficheros`, así que la regla existía; no consta qué paso exige que no quede vacío o genérico.
- **Coste**: ~40 min sobre la estimación, causa atribuida al plan rehecho — sin respaldo (frase del dev-lead; no tengo spec, walkthrough ni commit que la confirme).
- **Propuesta**: que la revisión del plan falle una task sin `Ficheros` o con una ruta no concreta.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un plan cuya task 2 no rellena `Ficheros`, WHEN se revisa antes de aprobarlo, THEN la revisión lo marca y el plan no se aprueba hasta que nombre el fichero.

### 2. El implementador pidió dos veces el mismo contexto: la skill no dice cuándo adjuntar el brief

- **Qué pasó**: el implementador de la task 3 pidió dos veces el mismo contexto. Las notas lo atribuyen a que la skill no dice cuándo adjuntar el brief.
- **Fuente**: notas del dev-lead (línea 7), no verificadas; búsqueda de `task brief|adjunt|attach` en `skills/sdd-implement/SKILL.md` → sin coincidencias.
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, paso de despacho del implementador; la plantilla (`plan-template.md:161`) menciona `sdd task brief` pero no cuándo adjuntarlo.
- **Por qué el kit no lo evitó**: la búsqueda no encuentra en la skill una regla de cuándo adjuntar el brief.
- **Coste**: dos peticiones repetidas; tiempo no medido — sin respaldo.
- **Propuesta**: añadir al paso de despacho que el brief de la task se adjunta siempre al despachar.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un plan aprobado, WHEN se despacha el implementador de una task, THEN el despacho incluye el brief de esa task y el implementador no vuelve a pedir el contexto.

## Lo que hice por iniciativa propia

- Nada que reportar.

## Funcionó, no tocar

- La spec se aprobó a la primera.
- El merge a `develop` fue sin conflictos.

## Menores

- Saltó el pre-commit por un fichero sin final de línea; se arregló en un minuto — no localizado.
- Las notas dicen kit 2.4.0, pero `.docs/sdd/sdd-kit.json:1` → `"version": "3.0.0"`; la versión de la cabecera sale de ese fichero — no localizado.
