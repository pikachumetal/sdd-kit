# RED/GREEN — el comando de `task-done` sale con distinto de 0 si algo falla (patch 0138)

**Qué se prueba.** Una sola llamada `claude -p --model opus --setting-sources "" --tools "" --append-system-prompt-file <texto>` por muestra, en una carpeta vacía. El texto es el `SKILL.md` de `sdd-start-feature` (mensajes `td` y `td2`) o `plan-template.md` (mensaje `plan`): el de `main` 2.3.0 (control) o el del patch. Fecha: 2026-10-03. Coste: 36 llamadas de Opus, del orden de 0,1 $ cada una.

**Las salidas** están en `.docs/sdd/specs/20261003-144033-patch-0138-task-done-exit-code/micro/out/` (`<mensaje>-<ctrl|new>-<n>.txt`). Se cuenta si el comando lleva `-CI` y si sale con distinto de 0 con un test en rojo por cualquier vía (`-CI`, `Run.Exit = $true`, `-PassThru` con `exit`).

**Origen.** Ticket de la feature 0128 §4 (`field-reports/20261003-120530-feature-0128-sdd-grilling.md`, en `develop`): `task-done … -- pwsh -NoProfile -Command "Invoke-Pester … -Output Minimal"` dio `Tests Passed: 33, Failed: 1` y `ledger: Task 1: complete`, porque `Invoke-Pester` sin `-CI` termina con 0.

| Mensaje | n | Control (2.3.0) | Patch |
| --- | --- | --- | --- |
| `plan` · escribe la línea «Verificación» de una task con Pester | 6 + 6 | `-CI` en 0 de 6; sale distinto de 0 en **0 de 6** (`Invoke-Pester -Path … -Output Detailed`) | `-CI` en 6 de 6; sale distinto de 0 en **6 de 6** |
| `td2` · cierra la task cuya «Verificación» es `pwsh -NoProfile -Command "Invoke-Pester … -Output Minimal"` | 6 + 6 | `-CI` en 0 de 6; sale distinto de 0 en **4 de 6**: 2 copian el comando del plan tal cual (td2-ctrl-2, td2-ctrl-4) | `-CI` en 6 de 6; sale distinto de 0 en **6 de 6** |
| `td` · da la orden de `task-done` para una «Verificación» `Invoke-Pester tests/Billing.Tests.ps1` | 6 + 6 | `-CI` en 0 de 6; sale distinto de 0 en 6 de 6 (`Run.Exit = $true` en 5, `-PassThru` con `exit 1` en 1) | `-CI` en 6 de 6; 6 de 6 |

**Lectura.**
- El fallo nace en el plan: con la plantilla vigente, ninguna «Verificación» de Pester sale con distinto de 0 si falla. Con la frase, todas llevan `-CI`.
- En el paso 6, el agente que reescribe el comando suele protegerlo solo (`td`), pero el que lo recibe completo del plan lo copia tal cual en 2 de 6 (`td2`), que es lo que pasó en el ticket. Con la frase, 0 de 6.
- **Fila de control**: la regla de al lado, «el comando tiene que imprimir algo» (`sh -c '<comando> && echo ok'`), la aplicaban 4 de 6 en `td2` del control y 1 de 6 con el patch. No es una regresión: con `-CI`, Pester imprime su resumen y el comando no es silencioso; los 6 comandos del patch imprimen.
