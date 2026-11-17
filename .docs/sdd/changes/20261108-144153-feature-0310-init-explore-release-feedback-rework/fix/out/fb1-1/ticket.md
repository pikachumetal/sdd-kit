---
kit_version: 3.0.0
lane: feature
id: 20261108-162046-feature-0012-exportar-datos
task: 0012
mode: full
date: 2026-11-08
---

# Ticket para el kit — feature 0012: plan rehecho por una task sin fichero y brief del implementador pedido dos veces

## Contexto

- Carril y modo: feature full (hubo spec y plan)
- Skills del kit usadas: plan e implementación de tasks; la lista exacta no consta en las notas
- Proyecto: aplicación Node sin dependencias, un fichero de entrada, flujo git-flow
- Modelo del hilo: no consta
- Modelos de los subagentes: no consta (hubo al menos un implementador de task)
- Coste en reloj: unos 40 min por encima de lo estimado en toda la sesión; la estimación base no consta
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Una task del plan no nombraba el fichero a tocar y obligó a rehacer el plan

- **Qué pasó**: la spec se aprobó a la primera, pero la task 2 del plan no indicaba qué fichero modificar y el plan se rehízo una vez.
- **Fuente**: notas de cierre del dev-lead (fichero del proyecto, resumen escrito al acabar la feature); `.docs/sdd/sdd-kit.json:1` → `"version": "3.0.0"`.
- **Dónde en el kit**: no localizado con certeza; candidato `skills/sdd-templates/templates/plan-template.md` (estructura de cada task) y el paso de la skill que redacta el plan.
- **Por qué el kit no lo evitó**: ninguna comprobación exige que cada task nombre los ficheros que toca antes de dar el plan por bueno; no se ha verificado si la plantilla ya lo pide.
- **Coste**: la mayor parte de los ~40 min sobre la estimación; la causa es la que dio el dev-lead, sin respaldo en spec, walkthrough ni commit: sin respaldo.
- **Propuesta**: que la plantilla del plan declare un campo «Ficheros» obligatorio por task y que el paso de revisión del plan rechace una task sin él.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un plan con una task sin campo «Ficheros» WHEN se revisa antes de aprobarlo THEN la revisión lo señala y el plan no pasa a implementación.

### 2. La skill de implementación no dice cuándo adjuntar el brief y el implementador pidió el mismo contexto dos veces

- **Qué pasó**: el implementador de la task 3 pidió dos veces el mismo contexto; según el dev-lead, la skill no indica cuándo adjuntar el brief.
- **Fuente**: notas de cierre del dev-lead (fichero del proyecto).
- **Dónde en el kit**: no localizado; candidato `skills/sdd-implement/SKILL.md` en el paso que despacha al implementador.
- **Por qué el kit no lo evitó**: no se ha comprobado si el paso existe y es ambiguo o si falta; el dev-lead dice que la skill no lo indica.
- **Coste**: no medido; dos preguntas repetidas, causa sin respaldo.
- **Propuesta**: que el paso de despacho exija adjuntar el brief de la task en el primer mensaje al implementador.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una task con brief WHEN se despacha al implementador THEN el primer mensaje incluye el brief y el implementador no pide el contexto de nuevo.

## Lo que hice por iniciativa propia

- Nada registrado en las notas de la sesión.

## Funcionó, no tocar

- La spec se aprobó a la primera.
- El merge en `develop` se hizo sin conflictos.

## Menores

- Las notas del dev-lead dan el kit 2.4.0, pero `.docs/sdd/sdd-kit.json` pide 3.0.0 y el aviso de inicio de sesión decía que se cargaba el 2.3.4: la versión realmente usada no es fiable, por eso el ticket usa la del fichero — no localizado.
