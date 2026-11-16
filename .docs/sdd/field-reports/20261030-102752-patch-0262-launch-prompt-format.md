---
kit_version: 2.3.4
superpowers_version: 7.0.0 en los sujetos (SUPERPOWERS_DIR); en la sesión, sin atribuir (7.0.0 y 7.0.1 en la caché)
lane: patch
id: 20261030-102752-patch-0262-launch-prompt-format
task: 0262
mode: patch
date: 2026-10-30
---

# Ticket para el kit — patch 0262: forma y redacción del prompt de arranque

## Contexto

- Carril y modo: patch
- Skills del kit usadas: sdd-propose, sdd-start-patch, sdd-archive, sdd-feedback
- Proyecto: el propio kit, una persona
- Modelo del hilo: claude-opus-5-5
- Modelos de los subagentes: no aplica; 8 sujetos Sonnet
- Coste en reloj: 0,14 h de reloj de sesión al cerrar, frente a 0,75 h + 0,2 h estimadas
- Coste en tokens: 4.304.745 del hilo, 2,84 $; sujetos 1,21 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Una forma que depende del terminal no se puede comprobar desde la sesión

- **Qué pasó**: el encargo pedía mirar el bloque en el terminal del dev-lead antes de cerrar. `orca computer get-app-state --app Orca` captura la pestaña visible, que era otra sesión: confirma el azul de un bloque sin lenguaje, no los saltos de las tres etiquetas de esta forma. `orca terminal read --cursor 0 --limit 20000` devolvió 10 filas, sin la muestra. No cambié la vista del dev-lead, que trabajaba en otra sesión, y cerré con los saltos «no probado».
- **Fuente**: `patch.md` §4 del patch 0262, filas 4 y 5; salida de `orca terminal read` en esta sesión: `filas: 10`.
- **Dónde en el kit**: `skills/sdd-templates/templates/launch-prompt-template.md`, las dos primeras etiquetas con dos espacios al final; `tests/batteries/sdd-roadmap/battery.md`, M1, que mira el texto del sujeto, no cómo lo pinta el terminal.
- **Por qué el kit no lo evitó**: la batería mide el Markdown que escribe el sujeto, y ningún paso dice cómo verificar un render de terminal con `validation.mode: field`.
- **Coste**: unos 5 min de intentos; riesgo abierto de que el terminal junte las etiquetas, y entonces el arreglo que dio el dev-lead son viñetas.
- **Propuesta**: que el dev-lead mire la muestra de esta sesión o el primer prompt real; si salen juntas, un patch pasa las etiquetas a viñetas.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un prompt de arranque con esta plantilla WHEN se pinta en el terminal del dev-lead THEN `Nombre`, `Base` y `Carril` salen en tres líneas seguidas y el bloque en azul.

## Lo que hice por iniciativa propia

- Emití una muestra de la forma en el chat y capturé la ventana para mirarla: dio el color, no los saltos.

## Funcionó, no tocar

- El RED y el GREEN de `m1` y `e2`: 4/4 con la forma vieja y 4/4 con la nueva, por 1,21 $, sin tocar ninguna `SKILL.md`. Trazar desde la plantilla bastó.
- La plantilla absorbió el contenido nuevo y bajó de 524 a 517 palabras (`wc -w`).

## Menores

- `battery.mjs run` rechazó `RUNS_DIR` en el scratchpad de la sesión (183 caracteres, máximo 100), y la misma orden sin error de lanzamiento obliga a `.temp/<corto>`: el scratchpad del harness no cabe nunca en este tope — `tests/headless/campaign.mjs`
- `KIT_DIR` en la raíz del worktree falló con «la copia del kit lleva .docs/ o tests/» a mitad de la campaña; el mensaje dice la salida — `tests/headless/lib.mjs`
- El `patch.md` llegó a decir «cli:test saltada» por leer solo `Tasks: 2 completed`; corregido contra la salida guardada del gate antes del commit de cierre — `skills/sdd-archive/SKILL.md` paso 1
