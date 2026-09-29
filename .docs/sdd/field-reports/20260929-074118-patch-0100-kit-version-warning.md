---
kit_version: 2.0.0
superpowers_version: 6.4.2
lane: patch
id: 20260929-074118-patch-0100-kit-version-warning
task: 0100
mode:
date: 2026-09-29
---

# Ticket para el kit — patch 0100: aviso cuando la sesión carga un kit menor que el del proyecto

## Contexto

- Carril y modo: patch
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch`, `sdd-feedback` (las tres del working tree, sesión arrancada con `Start-KitSession.ps1`)
- Proyecto: el propio repo del kit (plugin de Claude Code, PowerShell + bash, Pester), una persona
- Modelo del hilo: claude-opus-5-5
- Modelos de los subagentes: no aplica; un sujeto headless Haiku para el smoke del hook
- Coste en reloj: ~0,6 h hasta el merge
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La lista ordenada de «Versión siguiente» no tiene formato de cierre

- **Qué pasó**: el patch saldaba la fila de deuda y también el ítem 1 de la lista numerada «Criterio de orden» de «Versión siguiente». El paso 4 de `sdd-end-patch` y el formato de cierre de `roadmap-template.md` cubren la tabla de deuda, el Backlog y la tabla de patches, pero no esa lista. Improvisé un «Hecho: [patch 0100](…), 🧪 validación diferida.» al final del ítem.
- **Dónde en el kit**: `skills/sdd-end-patch/SKILL.md` paso 4 y `skills/sdd-templates/templates/roadmap-template.md`, bloque «Formato de cierre». `sdd-end-feature` tiene el mismo hueco.
- **Por qué el kit no lo evitó**: la lista de orden la escribe `sdd-roadmap` como prosa numerada, y ningún cierre la lee.
- **Coste**: bajo, un minuto. Pero sin la frase, el ítem 1 seguiría diciendo que el patch está por hacer, y la próxima sesión podría arrancarlo otra vez.
- **Propuesta**: el formato de cierre vale también para un ítem de una lista de orden que nombra la fila saldada: el mismo prefijo `**[Patch <id>, <fecha>: saldada — <enlace>]**` al principio del ítem, con el texto intacto.
- **Criterio de aceptación**: GIVEN un roadmap cuya lista de orden de la versión siguiente nombra la fila de deuda que salda el patch, WHEN `sdd-end-patch` hace el paso 4, THEN ese ítem empieza por el prefijo de cierre y conserva su texto.

### 2. Un `sed` sobre un fichero que puede faltar tumba un hook con `pipefail`

- **Qué pasó**: la primera versión del hook leía `.docs/sdd/sdd-kit.json` con `sed … | head`. Sin el fichero, `sed` sale con 2, `set -euo pipefail` aborta el hook y el proyecto pierde la inyección de `using-sdd`. Lo cazó el test de «sin `sdd-kit.json`» que escribí en el RED. Sin ese caso, el fallo habría llegado a todos los proyectos anteriores a la v0.2.0.
- **Dónde en el kit**: `hooks/session-start`. En `tech-stack.md` no hay ninguna regla sobre la robustez de los hooks del plugin.
- **Por qué el kit no lo evitó**: la cabecera `set -euo pipefail` es correcta para un script, pero en un hook de sesión cualquier fallo de lectura se convierte en perder las puertas.
- **Coste**: bajo en esta sesión, porque lo cazó el test. En campo sería alto: el hook falla sin avisar en proyectos sin `sdd-kit.json`.
- **Propuesta**: una línea en `tech-stack.md` («Distribución», hook de sesión): toda lectura opcional del hook se protege con `[ -f ]`, y cada rama nueva del hook lleva su test de «falta el fichero» en `Hook.Tests.ps1`.
- **Criterio de aceptación**: GIVEN un proyecto con `.docs/sdd/` y sin `sdd-kit.json`, WHEN corre `hooks/session-start`, THEN sale con 0 e inyecta `using-sdd`. Ya lo cubre `Hook.Tests.ps1`, y hoy pasa.

## Lo que hice por iniciativa propia

- **Leer la versión cargada del `plugin.json` y no del nombre de la carpeta del «Base directory»**, como proponía la fila. Con `--plugin-dir` la ruta no lleva la versión, y la caché trae el `plugin.json` (comprobado en `1.1.0/` y `2.0.0/`). Funcionó, y quedó en `patch.md` §2 y en el mensaje final como decisión sin el dev-lead.
- **Smoke del hook en una sesión headless real** con una copia del plugin rebajada a 1.0.0 en el scratchpad, cargada por `--plugin-dir` junto a superpowers y con `--setting-sources ""`. Sale en el `hook_response` del stream JSON, y el agente cita el aviso. Coste: unos 0,03 $. Es el molde mínimo para probar cualquier cambio de `session-start` más allá de Pester. Candidato a nota en `tech-stack.md`.
- **Aviso por los dos canales**: `systemMessage` para el usuario, que es quien tiene que actualizar y reiniciar, y el aviso al principio de `additionalContext` para el agente. La fila decía solo «avisa».

## Funcionó, no tocar

- `sdd-start-patch` paso 1 sobre una fila de deuda que no es un bug sino una comprobación que falta: el «fallo reproducido» fue el test Pester en rojo, y valió como causa raíz con evidencia.
- `sdd-end-patch` paso 0 con la opción de diferir ya rellenada: el dev-lead la eligió sin escribir nada y no hubo un turno de más.
- `Invoke-SddMerge.ps1` con `-Push`: fusionó y publicó a la primera.

## Errores míos, no huecos del kit

- Intenté editar `.docs/sdd/tech-stack.md` con un reemplazo de Python sin tener en cuenta los CRLF del fichero. El `assert` lo paró antes de escribir, y lo rehice con la herramienta de edición.
- Marqué ✅ la fila de la suite rápida en `patch.md` antes de que corriera el pre-commit. Pasó, pero el orden fue el inverso al correcto.
