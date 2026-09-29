---
id: 20260929-165746-patch-0110-native-scripts-windows
task: 0110
title: Patch — el paso 6 lanza los scripts de executing-plans con la herramienta Bash y con salida
type: patch
status: done
created: 2026-09-29
branch: feature/0110-native-scripts-windows
commit: e6119d3e
---

# Patch 0110 — el paso 6 lanza los scripts de executing-plans con la herramienta Bash y con salida

## Capacidades

- Modificadas: `feature-flow` — los scripts de Native se lanzan con la herramienta Bash, con la ruta del workspace comprobada, y el comando de `task-done` imprime algo

## 1. Síntoma

Dos filas de deuda del paso 6 de `sdd-start-feature` en Native:

- «`bash <ruta>` desde PowerShell abre WSL y el ledger de Native acaba en la raíz de la unidad» ([ticket de la feature 0030 de document-manager](../../field-reports/20260929-145217-feature-0030-borrar-carpetas.md) §1): con PowerShell como shell, `bash` resolvió a WSL, no encontró el script, `sdd-workspace` devolvió una ruta vacía y el ledger se escribió en `D:\progress.md`.
- «`task-done` de `executing-plans` sale sin registrar la task si el comando de verificación no imprime nada» ([ticket de la feature 0096](../../field-reports/20260929-152455-feature-0096-closing-off-critical-path.md) §3).

Medido sobre la base actual: `D:\progress.md` del ticket sigue en la máquina (307 bytes, 2026-09-29 15:15; no se toca).

## 2. Causa raíz

- **WSL**: el párrafo Native del paso 6 decía que `task-start` y `task-done` «se lanzan con `bash <ruta>`», sin decir con qué herramienta. En esta máquina, `bash` desde PowerShell resuelve a `C:\WINDOWS\System32\bash.exe` (WSL) y sale con `execvpe(/bin/bash) failed: No such file or directory`. El paso tampoco pedía comprobar la ruta de `sdd-workspace` antes de escribir el ledger, así que una ruta vacía llevó el `Write` a la raíz de la unidad.
- **`task-done`**: el script de superpowers (6.3.0 a 6.4.2) corre con `set -euo pipefail` y, tras pasar el comando, hace `last=$(grep -v '^[[:space:]]*$' "$log" | tail -n 1)`. Con el log vacío, `grep` sale con 1, `pipefail` hace fallar la asignación y `set -e` aborta sin mensaje y sin la línea `complete`. Reproducido: `task-done … -- true` sale con 1 y no registra; `task-done … -- echo ok` registra. El paso 6 no lo avisaba.

## 3. Fix

- **Fichero(s)**: `skills/sdd-start-feature/SKILL.md` (paso 6, párrafo Native), `tests/NativeAdapt.Tests.ps1`, `tests/native-scripts-red.md`, `tests/native-scripts-green.md`
- **Cambio**: el párrafo dice que los scripts se lanzan con la herramienta Bash (Git Bash), nunca con `bash <ruta>` desde PowerShell, que la ruta de `sdd-workspace` se comprueba no vacía antes de escribir el ledger, y que el comando de `task-done` tiene que imprimir algo (`sh -c '<comando> && echo ok'` si la «Verificación» es silenciosa).
- **Issue para superpowers**: borrador en [`superpowers-issue.md`](superpowers-issue.md), sin publicar. El arreglo que propone (`|| true` y `(no output)`) está probado sobre una copia del script: registra la task con un comando silencioso y sigue sin registrar la que falla.

## 4. Verificación

RED y GREEN con sujetos headless Sonnet sobre el mismo molde Native: [RED](../../../../tests/native-scripts-red.md), [GREEN](../../../../tests/native-scripts-green.md). 4 sujetos, 2,06 $.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `task-done` registra a la primera la task con la «Verificación» silenciosa | RED 0/2 (rc=1 sin mensaje; 2-3 llamadas más y lectura del script) · GREEN ✅ 2/2 |
| 2 | Comprueba la ruta de `sdd-workspace` antes de escribir el ledger | GREEN ✅ 2/2 (`echo "WS=[$W]"`) |
| 3 | Lanza los scripts con la herramienta Bash | RED y GREEN 4/4 con Bash, 0 llamadas a PowerShell: **disparador ausente** en `claude -p`. El frente de WSL se apoya en el ticket y en la resolución de `bash` de la máquina |
| 4 | Ancla Pester «Patch 0110 — scripts de executing-plans en Windows» | ✅ 27/27 con el fix · ❌ 2 fallos sobre la copia del kit anterior |

Lo verificó el agente; el dev-lead lo validó sin detallar qué probó.

Validado: 2026-09-29 · «Validado: lo he probado y funciona» · no detalló qué probó

## 5. Tiempo (ligero)

- Real: 1,1 h

## 6. Delta de capacidad

### Capacidad: `feature-flow`

**ADDED — Los scripts de Native se lanzan con la herramienta Bash y con salida**
- GIVEN un plan con `Ejecución: native` en Windows, con PowerShell como shell principal, y una «Verificación» que no imprime nada si pasa
- WHEN el hilo abre y cierra cada task con `task-start` y `task-done`
- THEN los lanza con la herramienta Bash (Git Bash), nunca con `bash <ruta>` desde PowerShell, y comprueba que la ruta de `sdd-workspace` no está vacía antes de escribir en el ledger
- AND pasa a `task-done` un comando que imprime algo (`sh -c '<comando> && echo ok'`), y la línea `Task <N>: complete` queda en el ledger a la primera
