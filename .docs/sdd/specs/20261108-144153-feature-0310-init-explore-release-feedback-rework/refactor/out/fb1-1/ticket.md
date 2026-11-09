---
kit_version: 3.0.0
lane: feature
id: 20261108-161314-feature-0012-export-hoja-calculo
task: 0012
mode: full
date: 2026-11-08
---

# Ticket para el kit — feature 0012: plan rehecho por una task sin fichero y brief pedido dos veces

## Contexto

- Carril y modo: feature full (modo deducido de que hubo `plan.md`; las notas no lo dicen)
- Skills del kit usadas: no consta la lista completa; por las notas, la elaboración de la spec y del plan y la implementación por tasks con un implementador
- Proyecto: aplicación Node sin dependencias externas, un solo fichero de entrada, git-flow; nº de personas no consta
- Modelo del hilo: no consta
- Modelos de los subagentes: no consta
- Coste en reloj: unos 40 min por encima de la estimación (cifra de las notas del dev-lead; sin respaldo en spec, walkthrough ni commit)
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Una task del plan no nombraba el fichero a tocar y el plan se rehízo

- **Qué pasó**: la spec se aprobó a la primera, pero el plan se rehízo una vez porque la task 2 no decía qué fichero tocar. Es la causa a la que el dev-lead atribuye la mayor parte de los ~40 min de exceso.
- **Fuente**: notas de la sesión escritas por el dev-lead (fichero del proyecto; sin comando ni metadato del kit que lo respalde). `skills/sdd-templates/templates/plan-template.md:163` → `**Ficheros**: crear/modificar \`path/...\``
- **Dónde en el kit**: `skills/sdd-templates/templates/plan-template.md` (campo «Ficheros» de cada task, línea 163), y el paso de `skills/sdd-implement/SKILL.md` que comprueba el plan antes de implementar, si existe (no localizado).
- **Por qué el kit no lo evitó**: la plantilla ya exige el campo «Ficheros» por task, así que la regla existía y no se aplicó al redactar el plan. Nada la comprueba antes de aprobar el plan o de arrancar la task: el hueco se descubrió al implementar.
- **Coste**: parte de los ~40 min de exceso; la cifra y la causa van **sin respaldo** (solo la frase del dev-lead).
- **Propuesta**: antes de dar el plan por bueno, una comprobación mecánica de que cada task tiene «Ficheros» no vacío (por ejemplo en `sdd task brief`, que ya extrae el texto de la task).
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un `plan.md` cuya task 2 no tiene el campo «Ficheros» relleno WHEN se ejecuta `sdd task brief <plan> 2 <out>` (o el paso de revisión del plan) THEN falla con un error que nombra la task y el campo que falta, antes de despachar al implementador.

### 2. El implementador pidió dos veces el mismo contexto: no está claro cuándo se adjunta el brief

- **Qué pasó**: el implementador de la task 3 pidió dos veces el mismo contexto. El dev-lead lo atribuye a que la skill no dice cuándo adjuntar el brief.
- **Fuente**: notas de la sesión escritas por el dev-lead (fichero del proyecto). Contraste con el kit: `skills/sdd-implement-subagent/implementer-prompt.md:55` → `Read your task brief first: [BRIEF_FILE]`
- **Dónde en el kit**: `skills/sdd-implement-subagent/implementer-prompt.md` (placeholder `[BRIEF_FILE]`, línea 55) y `skills/sdd-implement/SKILL.md` en el paso de despacho; la regla de cuándo se pasa el brief no está localizada y puede ser justo el hueco.
- **Por qué el kit no lo evitó**: el prompt del implementador sí incluye `[BRIEF_FILE]`, así que o no se rellenó al despachar o el despacho no obliga a rellenarlo. Las notas no permiten distinguirlo; el reparto de responsabilidad queda sin establecer.
- **Coste**: no medido; dos peticiones repetidas en la task 3 (se repitió, así que no es un menor). Causa **sin respaldo**.
- **Propuesta**: que el paso de despacho de `sdd-implement` diga que el brief se genera con `sdd task brief` y se pasa en `[BRIEF_FILE]` en cada despacho, y que el despacho falle si el placeholder queda sin rellenar.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una task lista para despachar WHEN `sdd-implement` compone el prompt del implementador THEN `[BRIEF_FILE]` contiene la ruta de un brief existente y el implementador no vuelve a pedir el contexto de la task.

## Lo que hice por iniciativa propia

- Nada reportado en las notas de la sesión.

## Funcionó, no tocar

- La spec se aprobó a la primera.
- El merge en `develop` fue sin conflictos.

## Menores

- El pre-commit saltó por un fichero sin final de línea; se arregló en un minuto — no localizado
