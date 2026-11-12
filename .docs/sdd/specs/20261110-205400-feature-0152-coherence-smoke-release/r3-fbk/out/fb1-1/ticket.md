---
kit_version: 3.0.0
lane: feature
id: 20261111-230807-feature-0012-exportar-datos
task: 0012
mode: full
date: 2026-11-12
---

# Ticket para el kit — feature 0012: plan rehecho por una task sin fichero y brief pedido dos veces

## Contexto

- Carril y modo: feature full (hubo plan; el modo se deduce de ello, no está en las notas)
- Skills del kit usadas: sdd-propose, sdd-implement (el resto no consta en las notas)
- Proyecto: aplicación con una función de exportación a hoja de cálculo; stack y tamaño no consta
- Modelo del hilo: no consta
- Modelos de los subagentes: no consta
- Coste en reloj: unos 40 min por encima de la estimación (cifra de las notas del dev-lead, sin medir en la sesión)
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Plan rehecho porque una task no nombraba el fichero a tocar

- **Qué pasó**: la spec se aprobó a la primera, pero el plan se rehízo una vez porque la task 2 no decía qué fichero tocar. El dev-lead atribuye a ese rehecho la mayor parte de los ~40 min de desvío.
- **Fuente**: notas de sesión del dev-lead (fichero del proyecto, sin más medición); `.docs/sdd/sdd-kit.json:1` → `"version": "3.0.0"`. Las notas citan el kit 2.4.0; prevalece el fichero.
- **Dónde en el kit**: `skills/sdd-templates/templates/plan-template.md:163` (línea `**Ficheros**` de la task); el control que debería rechazar una task sin ella no se ha localizado.
- **Por qué el kit no lo evitó**: la plantilla ya pide `**Ficheros**` en cada task, así que o no se rellenó o ningún paso de revisión del plan comprueba que esté. Sin verificar cuál de las dos.
- **Coste**: ~40 min sobre la estimación en total; la causa «plan rehecho» va **sin respaldo** (no hay spec, walkthrough ni commit que la sostengan, solo la frase del dev-lead).
- **Propuesta**: que la revisión del plan rechace una task sin `**Ficheros**` con al menos una ruta.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un plan cuya task 2 deja `**Ficheros**` vacío, WHEN se ejecuta la revisión del plan, THEN el plan se devuelve con esa task señalada antes de pasar a implementación.

### 2. El implementador pidió dos veces el mismo contexto: no hay regla de cuándo adjuntar el brief

- **Qué pasó**: el implementador de la task 3 pidió dos veces el mismo contexto; el dev-lead lo atribuye a que la skill no dice cuándo adjuntar el brief.
- **Fuente**: notas de sesión del dev-lead; `skills/sdd-implement/SKILL.md` → `grep -n -i "adjunt\|attach\|task brief"` sin coincidencias (bash).
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, paso de despacho del implementador; la plantilla del plan menciona `sdd task brief` (`plan-template.md:161`) pero no la skill.
- **Por qué el kit no lo evitó**: la skill no fija si el despacho lleva el brief completo de la task desde el primer mensaje.
- **Coste**: no medido; se repitió dos veces en la sesión, por eso no es un menor. Causa sin respaldo.
- **Propuesta**: que el despacho de cada implementador incluya siempre el texto de su task (`sdd task brief`) y las restricciones globales.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un plan con la task 3, WHEN `sdd-implement` despacha a su implementador, THEN el primer mensaje contiene el brief de la task y el implementador no pide contexto adicional ya contenido en él.

## Lo que hice por iniciativa propia

- Nada que reportar.

## Funcionó, no tocar

- La spec se aprobó a la primera.
- El merge a la rama de integración se hizo sin conflictos.

## Menores

- El pre-commit falló por un fichero sin final de línea; se arregló en ~1 min — no localizado.
