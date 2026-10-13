---
kit_version: 2.3.4
superpowers_version: sin determinar
lane: feature
id: 20261013-132920-feature-0012-export-excel
task: 0012
mode: full
date: 2026-10-13
---

# Ticket para el kit — feature 0012: plan rehecho por una task sin fichero y brief pedido dos veces

> Lo lee un agente que mantiene el kit. Los datos de la sesión salen de las notas de cierre del
> dev-lead (`notas-sesion.md`), no de la spec, el plan ni el walkthrough de la feature: en el
> repositorio no hay carpeta de spec de esta feature, así que ninguna causa ni cifra de abajo
> tiene respaldo en un artefacto.

## Contexto

- Carril y modo: feature full (el plan existía y se rehízo una vez; las notas no nombran el modo)
- Skills del kit usadas: no constan en las notas; por lo descrito, el plan y la implementación por task con subagente (`sdd-implement`)
- Proyecto: aplicación pequeña de Node sin dependencias externas; una feature de exportación de datos; número de personas no consta
- Modelo del hilo: no consta
- Modelos de los subagentes: no constan
- Coste en reloj: «unos 40 min más de lo estimado» (nota del dev-lead; la estimación y el tiempo real no constan)
- Coste en tokens: no medido

Versiones: el kit del proyecto es 2.3.4 (`.docs/sdd/sdd-kit.json:1` → `"version": "2.3.4"`). Las notas
dicen «kit 2.4.0 y superpowers 7.1.0»; ninguna coincide con lo instalado: `installed_plugins.json`
solo lista `superpowers@6.4.2` (scope de otro proyecto) y el caché tiene `6.4.2` y `7.0.0`, ningún
`7.1.0`. La versión de superpowers de la sesión queda sin determinar.

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Una task del plan sin el fichero que toca obligó a rehacer el plan

- **Qué pasó**: la spec se aprobó a la primera, pero el plan se rehízo una vez porque la task 2 no decía qué fichero tocar. El dev-lead atribuye a este rehecho la mayor parte de los ~40 min por encima de la estimación.
- **Fuente**: `notas-sesion.md` líneas 6 y 9 (notas del dev-lead, fichero del proyecto); la plantilla: `skills/sdd-templates/templates/plan-template.md:159` → `**Ficheros**: crear/modificar \`path/...\``.
- **Dónde en el kit**: `skills/sdd-templates/templates/plan-template.md` línea 159 (campo `**Ficheros**` de cada task) y el paso de revisión del plan de `skills/sdd-start-feature/` (no localizado el paso exacto que comprueba que el campo está relleno).
- **Por qué el kit no lo evitó**: la plantilla ya exige `**Ficheros**` por task, así que la regla existía; o el campo se dejó vacío o genérico y nada lo detectó antes de despachar, o se rellenó con algo que no nombraba un fichero. Con las notas no se distingue cuál; sin verificar que exista una comprobación mecánica del campo.
- **Coste**: un rehecho del plan, duración no medida; la parte de los ~40 min que se debe a él, «sin respaldo» (frase del dev-lead).
- **Propuesta**: que la revisión del plan compruebe, task por task, que `**Ficheros**` nombra al menos una ruta concreta (con crear/modificar), y que una task sin ella devuelva el plan antes de aprobar y despachar. Localizar primero dónde se revisa hoy el plan.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un plan con una task cuyo campo `**Ficheros**` no contiene ninguna ruta, WHEN el plan pasa la revisión previa a la implementación, THEN la revisión lo señala como bloqueante nombrando la task y el plan no se da por aprobado hasta que la task nombre sus ficheros.

### 2. El implementador pidió dos veces el mismo contexto

- **Qué pasó**: el implementador de la task 3 pidió dos veces el mismo contexto. El dev-lead lo resume como «la skill no dice cuándo adjuntar el brief».
- **Fuente**: `notas-sesion.md` línea 7 (fichero del proyecto); `skills/sdd-implement/SKILL.md:209-210` (el despacho lleva la ruta del brief como fuente única de requisitos, más los valores del brief que el hilo resuelve).
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md` líneas 209-210 (composición del despacho) y `skills/sdd-implement/references/implementer-prompt.md`.
- **Por qué el kit no lo evitó**: el kit sí dice que el brief va en el despacho de cada task (líneas 209-210), así que la afirmación de las notas no coincide con el texto; o la regla no se aplicó en esa task, o el implementador pidió contexto que el brief no lleva (interfaces de tasks anteriores, línea 210) y el hilo no lo añadió la primera vez. No se puede distinguir con las notas.
- **Coste**: dos peticiones del mismo contexto; tiempo no medido, causa «sin respaldo».
- **Propuesta**: que el implementador, ante un `NEEDS_CONTEXT`, devuelva qué falta y que el hilo lo añada al brief o al despacho de esa task antes de relanzar, de modo que la segunda petición no repita la primera. Antes, reproducir el caso para ver cuál de las dos causas es.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un implementador que devuelve `NEEDS_CONTEXT` con una carencia concreta, WHEN el hilo relanza la task, THEN el nuevo despacho incluye esa carencia resuelta y el implementador no la vuelve a pedir.

## Lo que hice por iniciativa propia

- Nada que reportar: las notas no recogen nada hecho fuera de lo que piden las skills.

## Funcionó, no tocar

- La spec se aprobó a la primera.
- La integración en `develop` se hizo sin conflictos.

## Menores

- El pre-commit saltó por un fichero sin final de línea; se arregló en un minuto — no localizado.
