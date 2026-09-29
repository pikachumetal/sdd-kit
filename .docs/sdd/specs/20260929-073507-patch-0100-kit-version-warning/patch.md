---
id: 20260929-073507-patch-0100-kit-version-warning
task: 0100
title: Patch — aviso cuando la sesión carga un kit menor que el del proyecto
type: patch
status: done
created: 2026-09-29
branch: patch/0100-kit-version-warning
commit: <hash>
---

# Patch 0100 — aviso cuando la sesión carga un kit menor que el del proyecto

## Capacidades

- Modificadas: `migration` — añade «La sesión avisa cuando carga un kit menor que el del proyecto»

## 1. Síntoma

Fila de deuda del roadmap «Nada avisa cuando la sesión carga una versión del kit menor que la del proyecto» ([ticket de la feature 0021 del template](../../field-reports/20260928-145021-feature-0021-init-template-bridge.md) §4, 2026-09-28): una instalación de ámbito proyecto o de usuario que se queda atrás gana a la otra. Tras reanudar, la lista de skills era la de la 1.1.0 (`sdd-start-task`, sin agentes `effort-*`), y en la feature 0026 el agente no encontró `sdd-end-feature`. Nadie lo avisa.

Medido: con `.docs/sdd/sdd-kit.json` a `10.0.0` y el plugin a `2.1.0`, `hooks/session-start` devuelve solo el contexto de `using-sdd`, sin `systemMessage` ni mención a la versión (test nuevo de `tests/Hook.Tests.ps1` en rojo: `Expected regular expression '10\.0\.0' to match $null`).

## 2. Causa raíz

`hooks/session-start` es el único código del kit que corre al arrancar la sesión, y solo mira si existe `.docs/sdd/`: no lee ni la `version` de `.claude-plugin/plugin.json` de la raíz que lo ejecuta ni la de `.docs/sdd/sdd-kit.json`, que el proyecto escribe al inicializarse o migrarse (capacidad `migration`, «El proyecto declara la versión del kit que tiene»). Sin esa comparación, una caché vieja pasa en silencio.

La fila proponía sacar la versión cargada de la carpeta del «Base directory» (`~/.claude/plugins/cache/sdd-kit/sdd-kit/<versión>/`). Se lee el `plugin.json` de esa misma raíz: la caché lo trae con la versión (comprobado en `1.1.0/` y `2.0.0/`), y con `--plugin-dir` (el `Start-KitSession.ps1` de este repo) la ruta no lleva versión.

## 3. Fix

- **Fichero(s)**: `hooks/session-start`, `tests/Hook.Tests.ps1`, `.docs/sdd/tech-stack.md`, `.docs/sdd/capabilities/migration.md` (al cerrar).
- **Cambio**: el hook lee las dos `version` con `sed` (sin `jq`, que no se puede dar por instalado) y las compara por números X.Y.Z. Si la cargada es menor, emite `systemMessage` para el usuario y antepone el mismo aviso al contexto del agente: las dos versiones, `claude plugin update sdd-kit@sdd-kit --scope project`, reiniciar y que `/reload-plugins` no basta. Sin `sdd-kit.json` o sin versión, no avisa y el hook sigue igual.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Pester `Hook.Tests.ps1`: proyecto a `10.0.0` (una comparación de texto lo daría menor que `2.1.0`) avisa con las dos versiones y los comandos, en `systemMessage` y en el contexto | ✅ RED 1 fallo antes de editar → verde |
| 2 | Pester `Hook.Tests.ps1`: proyecto a la versión cargada, a `1.9.9` y sin `sdd-kit.json`, sin aviso y con `using-sdd` inyectada | ✅ 12/12. La primera versión del fix salía con código 2 sin `sdd-kit.json` (`sed` sobre un fichero inexistente con `pipefail`); este caso lo cazó |
| 3 | Sesión headless real (`claude -p`, Haiku) con una copia del plugin a `1.0.0` por `--plugin-dir` en este repo (`sdd-kit.json` a `2.0.0`) | ✅ el `hook_response` trae el `systemMessage` y el agente cita el aviso literal |
| 4 | Suite rápida del kit (pre-commit) | ✅ |

## 5. Tiempo (ligero)

- Estimación: 0.5h
- Real: 0.6h

## 6. Delta de capacidad

### Capacidad: `migration`

**ADDED — La sesión avisa cuando carga un kit menor que el del proyecto**
- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `2.0.0` y una sesión de Claude Code que carga el plugin `sdd-kit` `1.1.0`
- WHEN arranca la sesión
- THEN el usuario ve un aviso con las dos versiones, `claude plugin update sdd-kit@sdd-kit --scope project` y que hay que reiniciar Claude Code, porque `/reload-plugins` no aplica una actualización de ámbito proyecto
- AND el agente recibe el mismo aviso al principio de su contexto
- AND con la versión cargada igual o mayor, o sin `sdd-kit.json`, no hay aviso
