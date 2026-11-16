---
kit_version: 3.0.0
lane: feature
id: 20261114-214801-feature-0012-exportacion-datos
task: 0012
mode: full
date: 2026-11-14
---

# Ticket para el kit — feature 0012: plan rehecho por una task sin fichero y brief pedido dos veces

## Contexto

- Carril y modo: feature full (inferido: hubo `plan.md`; el modo no está en `.docs/sdd/sdd-kit.json`)
- Skills del kit usadas: no medido (las notas de la sesión solo nombran spec, plan e implementación por tasks con subagente)
- Proyecto: aplicación web pequeña, una funcionalidad de exportación de datos a hoja de cálculo; nº de personas no medido
- Modelo del hilo: no medido
- Modelos de los subagentes: no medido
- Coste en reloj: unos 40 min más de lo estimado (cifra de las notas del dev-lead; sin respaldo en spec ni walkthrough)
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Plan rehecho una vez porque una task no decía qué fichero tocar

- **Qué pasó**: la spec se aprobó a la primera, pero el plan se rehízo una vez porque la task 2 no decía qué fichero tocar. Las notas atribuyen a esto la mayor parte de los 40 min de exceso.
- **Fuente**: notas de la sesión del dev-lead (fichero de notas en la raíz del proyecto, líneas 6 y 9); `skills/sdd-templates/templates/plan-template.md:163` → `**Ficheros**: crear/modificar \`path/...\``
- **Dónde en el kit**: `skills/sdd-templates/templates/plan-template.md` línea 163 (campo «Ficheros» de la task) y el paso de revisión del plan de `skills/sdd-implement/SKILL.md` (no localizado el paso exacto)
- **Por qué el kit no lo evitó**: la plantilla ya exige «Ficheros» por task, así que la regla existía; no consta qué paso comprueba que el campo esté relleno con rutas concretas antes de aprobar el plan. Se desconoce si la task lo dejó vacío o con un placeholder.
- **Coste**: parte de ~40 min de exceso; la causa («sobre todo por el plan rehecho») es una frase del dev-lead, sin respaldo
- **Propuesta**: que la revisión previa del plan rechace cualquier task sin al menos una ruta concreta en «Ficheros» (sin `path/...` ni vacío).
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un `plan.md` con una task cuyo campo «Ficheros» está vacío o conserva `path/...` WHEN se hace la revisión del plan antes de implementar THEN la revisión lo marca como fallo y el plan no se da por listo.

### 2. El implementador pidió dos veces el mismo contexto: no está dicho cuándo adjuntar el brief

- **Qué pasó**: el implementador de la task 3 pidió dos veces el mismo contexto. El dev-lead lo atribuye a que la skill no dice cuándo adjuntar el brief.
- **Fuente**: notas de la sesión del dev-lead, línea 7; `skills/sdd-implement-subagent/SKILL.md:177-187` (regla «Task brief»)
- **Dónde en el kit**: `skills/sdd-implement-subagent/SKILL.md` líneas 177-187 y `skills/sdd-implement-subagent/implementer-prompt.md` (no leído en esta sesión)
- **Por qué el kit no lo evitó**: la regla sí dice que el despacho incluye la ruta del brief («read this first»). No consta si el despacho de la task 3 la incluyó, si el brief no traía lo que el implementador necesitaba (p. ej. decisiones de tasks anteriores, punto 3 de la regla) o si la lectura del brief falló. La afirmación del dev-lead «la skill no dice cuándo» contradice el texto actual; queda sin respaldo hasta ver el despacho.
- **Coste**: dos peticiones repetidas; minutos no medidos; causa sin respaldo
- **Propuesta**: que el implementador, antes de pedir contexto, deba citar en su informe qué punto del brief o del despacho le falta; y que el despacho lleve siempre la ruta del brief (ya exigido).
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un despacho de implementador cuyo brief no contiene un dato que necesita WHEN el implementador lo pide THEN la petición cita la sección del brief que lo omite, y una segunda petición del mismo dato no ocurre.

## Lo que hice por iniciativa propia

- Nada que reportar: las notas no recogen iniciativa propia.

## Funcionó, no tocar

- La spec se aprobó a la primera.
- El merge en `develop` fue sin conflictos.

## Menores

- Saltó el pre-commit por un fichero sin final de línea; se arregló en un minuto — no localizado
- Las notas del dev-lead citan el kit 2.4.0 y superpowers 7.1.0, pero `.docs/sdd/sdd-kit.json:1` dice `"version": "3.0.0"`; se usa el del fichero y la versión de superpowers se omite por no poder verificarse — no localizado
