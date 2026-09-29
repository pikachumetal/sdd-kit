# RED — scripts de `executing-plans` en Windows y `task-done` con un comando silencioso (patch 0110)

Mide dos filas de deuda del paso 6 de `sdd-start-feature` en Native: el paso decía que `task-start` y `task-done` «se lanzan con `bash <ruta>`» (ticket de la feature 0030 de document-manager §1), y no avisaba de que `task-done` aborta si el comando de verificación no imprime nada (ticket de la feature 0096 §3).

- Sujetos headless (`claude -p --model sonnet`) con `tests/headless/run.sh`, `SUPERPOWERS_DIR` en superpowers 6.4.2 (sin la configuración del usuario) y una copia del kit en `09bb565`, antes del fix.
- Molde: el repo `salas` de la 0044 con un plan `Ejecución: native` de dos tasks, como en la 0057. Añade un `CLAUDE.md` con el entorno del dev-lead («Shell principal: herramienta `PowerShell` (pwsh 7+). Bash (Git Bash) solo para scripts POSIX puntuales»). La «Verificación» de la Task 2 es `node tests/free-format.check.mjs`, un script de asserts sin salida si pasa, como `tsc --noEmit`.
- Petición: ejecutar las Tasks 1 y 2 en Native y parar cuando la Task 2 quede registrada en el ledger.
- Lanzador y salidas: `.docs/sdd/specs/20260929-165746-patch-0110-native-scripts-windows/{red/subject.sh,red/out/}`.
- Coste: 0,99 $ (w-1 0,48 $; w-2 0,51 $).

Disparadores comprobados fuera de los sujetos, en esta máquina: `bash` desde PowerShell resuelve a `C:\WINDOWS\System32\bash.exe` (WSL) y sale con `execvpe(/bin/bash) failed: No such file or directory`; `task-done … -- true` sale con 1, sin salida y sin línea en el ledger, y `task-done … -- echo ok` registra la task.

## Resultado

| Qué se mide | w-1 | w-2 | Veredicto |
| --- | --- | --- | --- |
| Disparador WSL: ¿lanza algún script con `bash` desde PowerShell? | no, 0 llamadas a PowerShell (15 a Bash) | no, 0 llamadas a PowerShell (15 a Bash) | disparador ausente 2/2 |
| ¿Ledger fuera del workspace (raíz de `C:` o `D:`)? | no | no | — |
| Disparador `task-done`: ¿la verificación de la Task 2 no imprime nada? | sí | sí | presente 2/2 |
| ¿`task-done` registra la Task 2 a la primera? | no: rc=1 sin mensaje; lee el script, ruling y relanza con `bash -c '… && echo "ok…"'` | no: la primera llamada va con `\| tail -3`, que tapa el rc; ve el ledger sin la línea, relanza con `echo rc=$?`, lee el script, ruling y relanza con `sh -c '… && echo …'` | **0/2** |

El fallo de `task-done` se reproduce: los dos sujetos pierden entre dos y tres llamadas y leen el script de superpowers para entenderlo. w-2 muestra el riesgo del ticket: con la salida en un pipe, el rc=1 no se ve y solo lo delató mirar el ledger.

El frente de WSL no se reproduce con sujetos: en `claude -p` los dos eligen la herramienta Bash aunque el `CLAUDE.md` del molde diga PowerShell. La evidencia de ese frente es el ticket de campo y la resolución de `bash` en la máquina, y el fix es textual: el paso nombraba `bash <ruta>` sin herramienta.
