# GREEN — scripts de `executing-plans` con la herramienta Bash y `task-done` con salida (patch 0110)

Repite el RED ([native-scripts-red.md](native-scripts-red.md)) con el mismo molde, la misma petición y el kit con el fix. El fix está en el párrafo Native del paso 6 de `sdd-start-feature`: los scripts se lanzan con la herramienta Bash (Git Bash), nunca con `bash <ruta>` desde PowerShell; la ruta de `sdd-workspace` se comprueba no vacía antes de escribir el ledger; y el comando de `task-done` tiene que imprimir algo, con `sh -c '<comando> && echo ok'` si la «Verificación» es silenciosa.

- Salidas: `.docs/sdd/specs/20260929-165746-patch-0110-native-scripts-windows/green/out/`.
- Coste: 1,07 $ (w-1 0,57 $; w-2 0,49 $). Campaña total: 4 sujetos, 2,06 $.

## Resultado

| Qué se mide | w-1 | w-2 | Veredicto |
| --- | --- | --- | --- |
| ¿Lanza los scripts con la herramienta Bash? | sí, 0 llamadas a PowerShell (16 a Bash) | sí, 0 llamadas a PowerShell (11 a Bash) | 2/2 |
| ¿Comprueba la ruta de `sdd-workspace` antes del ledger? | sí, `echo "WS=[$W]"` antes de escribirlo | sí, `echo "WS=[$W]"` antes de escribirlo | 2/2 |
| ¿`task-done` registra la Task 2 a la primera? | sí, `sh -c 'node tests/free-format.check.mjs && echo ok' → ok` | sí, el mismo comando | **2/2** |
| ¿Ledger fuera del workspace? | no | no | — |

w-1 envuelve también la Task 1 (`sh -c 'node --test … \| grep -E "^ℹ (pass\|fail)"'`), que ya imprimía: no hace daño y deja un resumen más legible en el ledger. w-2 no actualiza `tasks.md`; no es lo que se mide y el párrafo no lo cambia.

Ancla Pester: `tests/NativeAdapt.Tests.ps1`, «Patch 0110 — scripts de executing-plans en Windows». Sus dos casos fallan sobre la copia del kit anterior (`failed=2`) y pasan con el fix (27/27).
