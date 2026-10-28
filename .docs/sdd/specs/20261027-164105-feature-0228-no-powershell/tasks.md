# Tasks — 0228 Sin PowerShell en el repo y un turno del cerrojo por gate

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Un turno del cerrojo por gate, con cola | hecha | `1b932e22` |
| 2 — Arranque de sesión y hook en Node | hecha | `e6224f5a` |
| 3 — moon, pre-commit y `stopPort` sin PowerShell | hecha | `3001ab1e` |
| 4 — Documentación | hecha | `196af4e5` |

Revisión final: Spec opus+high, With fixes · Código sonnet+high, With fixes · Arquitectura no (plan), sobre `196af4e5`
Pasada de fix: `0813a2b8`, 17 hallazgos (3 RED→GREEN: «desde» del dueño, worktree desanclado, aviso sin `claude`; el resto con test de cobertura o de texto)
Re-revisión: 196af4e5..0813a2b8, sdd-kit:effort-high + opus, limpia (4 Minor adjudicados)

## Rulings

- Task 4: `git grep` sin hits sale con 1 y `sdd task done` lo daría por rojo — la Verificación de `sdd task done` es solo el vitest; el `git grep` se corre aparte y se lee — coste si mal: ninguno.
- Task 1: el regex del test de la cola exigía «\);» tras el dueño, y el texto lleva « desde <hora>» entre los dos — corregido a «\) desde .+;» antes del código, sin cambiar el texto de la spec — coste si mal: ninguno.
- Task 1: la medida con moon real (Step 4) espera a que el baseline suelte el cerrojo; se hizo antes de la Task 3 — coste si mal: rehacer la Task 3 si moon no hereda la variable (la hereda: medido).
- Task 2: Ctrl+C quedó «no probado» en Orca y se borró el `.ps1` igual — después lo probó el dev-lead en Windows Terminal: «si todo ok» — coste si mal: ninguno ya.
- Task 3: moon envuelve cada tarea en `pwsh` (y si no, `powershell.exe`) en Windows: sin ellos, «program not found» en todas — `taskOptions.shell: false` en `moon.yml` y `cli/moon.yml` (moon 2.4+), aunque `cli/moon.yml` no estaba en el plan — coste si mal: una tarea que necesite shell (ninguna hoy).
- Task 3: la Task 3 se cierra con el rojo intermitente de headless sin arreglar — es la deuda «Tres tests del lanzador en Vitest pasan de su tope con la máquina cargada» (0227) — coste si mal: un rojo real escondido entre intermitentes.
- Final: aviso cuando el cerrojo está libre con alguien delante — no se añade: sería un texto nuevo fuera de la spec; el caso es raro — coste si mal: una espera muda hasta 180 min en un caso raro.
- Final: `stopPort` usa `netstat -ano` y no `-ano -p TCP` — `-p TCP` no lista IPv6 y la decisión 10 cuenta con `[::]:0` — coste si mal: ninguno.
- Final: el aviso «no encuentro claude en el PATH» no está en la spec — devuelve el aviso que daba PowerShell con el `.ps1` — coste si mal: un texto que reescribir.
- Final: hueco de un sondeo entre coger el cerrojo y borrar la entrada — se corrige solo en el sondeo siguiente — coste si mal: un aviso de más.
- Final: `fake-claude-*` en `tmpdir()` — es `.temp/` del worktree y muere con él — coste si mal: ninguno.
- Final: «Declined to judge» de los dos ejes (varios hosts con el mismo common dir, reloj que retrocede, `claude.cmd` de npm, `stopPort` fuera de Windows, huérfanas posteriores a la propia) — fuera del uso real del repo — coste si mal: rehacer la cola si cambia el uso.
- Final: README y tech-stack no nombran `merge/verify.ts` ni su test entre lo que usa PowerShell — es la conducta de `--verify` en los proyectos (decisión 11), no una herramienta del repo — coste si mal: una frase que ampliar.
- Final: `holdUntil` sin tope si el test de orden falla antes de soltar — solo en un test ya rojo, en un repo temporal — coste si mal: un `node` colgado tras un rojo.
- Final: «records when…» y «names a detached worktree…» dependen de `holdFor` — el del desanclado falla en rojo si el segundo llega tarde; el del «desde» pasaría sin probar nada, pero el smoke real y el test de orden lo cubren — coste si mal: un intermitente con carga.
- Final: un `.json.tmp` de un proceso muerto entre escribir y renombrar se queda en la cola — se filtra y no bloquea — coste si mal: un fichero suelto.
